import clientProvider from "../utils/clientProvider";
import { Request, Response } from "express";
import FormData from "form-data";
import fetch from "node-fetch";

export interface FileUploadResult {
  fileId: string;
  url: string;
  alt?: string;
}

export interface AudioFileMetadata {
  duration: number;
  fileSize: number;
}

/**
 * Upload a file to Shopify's CDN
 */
export const uploadFileToShopify = async (
  req: Request,
  res: Response,
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<FileUploadResult> => {
  try {
    const { client } = await clientProvider.online.graphqlClient({ req, res });
    
    // Shopify file upload mutation
    const UPLOAD_FILE = `
      mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            resourceUrl
            url
            parameters {
              name
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    // Determine resource type
    const isImage = contentType.startsWith('image/');
    const isAudio = contentType.startsWith('audio/');
    
    if (!isImage && !isAudio) {
      throw new Error("Only image or audio files are allowed");
    }
    
    const response = await client.request(UPLOAD_FILE, {
      variables: {
        input: [
          {
            filename,
            mimeType: contentType,
            httpMethod: "POST",
            resource: isImage ? "IMAGE" : "FILE",
          },
        ],
      },
    });
    
    const { stagedTargets, userErrors } = response.data.stagedUploadsCreate;
    
    if (userErrors.length > 0) {
      throw new Error(`File upload failed: ${userErrors[0].message}`);
    }
    
    const { url, parameters, resourceUrl } = stagedTargets[0];
    
    /* =======================
         2️⃣ UPLOAD TO S3
         ======================= */
    
    const formData = new FormData();
    parameters.forEach(({ name, value }: { name: string; value: string }) =>
      formData.append(name, value)
    );
    formData.append("file", fileBuffer, {
      filename,
      contentType,
    });

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        ...formData.getHeaders(),
        "Content-Length": fileBuffer.length.toString(),
      },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    /* =======================
         3️⃣ CREATE SHOPIFY FILE
         ======================= */
    
    const contentTypeEnum = isImage ? 'IMAGE' : 'FILE';
    
    const fileCreateResponse = await client.request(
      `mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files { id }
          userErrors { message }
        }
      }`,
      {
        variables: {
          files: [
            {
              contentType: contentTypeEnum,
              originalSource: resourceUrl,
              alt: filename,
            },
          ],
        },
      }
    );

    const createErrors = fileCreateResponse.data.fileCreate.userErrors;
    if (createErrors.length) {
      throw new Error(createErrors[0].message);
    }

    const fileId = fileCreateResponse.data.fileCreate.files[0].id;

    /* =======================
         4️⃣ POLL UNTIL READY
         ======================= */
    let processedFile: { url: string } | null = null;
    const maxRetries = 20;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await new Promise((r) => setTimeout(r, retryDelay));

      const fileQuery = await client.request(
        `query getFile($id: ID!) {
          node(id: $id) {
            id
            ... on MediaImage {
              image { url }
            }
            ... on GenericFile {
              url
            }
          }
        }`,
        { variables: { id: fileId } }
      );

      const node = fileQuery.data.node;

      if (isImage && node?.image?.url) {
        processedFile = { url: node.image.url };
        break;
      }

      if (isAudio && node?.url) {
        processedFile = { url: node.url };
        break;
      }
    }

    if (!processedFile) {
      throw new Error("File not processed by Shopify");
    }

    /* =======================
         5️⃣ RETURN RESULT
         ======================= */
    return {
      fileId,
      url: processedFile.url,
      alt: filename,
    };
  } catch (error) {
    console.error('Error uploading file to Shopify:', error);
    throw error;
  }
};

/**
 * Get audio file metadata (duration and file size)
 */
export const getAudioMetadata = async (fileBuffer: Buffer): Promise<AudioFileMetadata> => {
  // This is a simplified implementation
  // In a real implementation, you'd use a library like 'music-metadata' or 'ffprobe'
  // to extract actual duration from the audio file
  
  return {
    duration: 0, // Will be set by the frontend or a separate process
    fileSize: fileBuffer.length,
  };
};

/**
 * Delete a file from Shopify
 */
export const deleteFileFromShopify = async (
  req: Request,
  res: Response,
  fileId: string
): Promise<boolean> => {
  try {
    const { client } = await clientProvider.online.graphqlClient({ req, res });
    
    const DELETE_FILE = `
      mutation fileDelete($fileId: ID!) {
        fileDelete(input: { id: $fileId }) {
          deletedFileId
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const response = await client.request(DELETE_FILE, {
      variables: {
        fileId,
      },
    });
    
    const { userErrors } = response.data.fileDelete;
    
    if (userErrors.length > 0) {
      console.error('Error deleting file:', userErrors[0].message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file from Shopify:', error);
    return false;
  }
};

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: Express.Multer.File,
  maxSize: number = 50 * 1024 * 1024 // 50MB default
): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds limit. Maximum allowed: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }
  
  // Check file type
  const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'];
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedTypes = [...allowedAudioTypes, ...allowedImageTypes];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'Invalid file type. Allowed: MP3, WAV, OGG, AAC, M4A, JPEG, PNG, GIF, WebP',
    };
  }
  
  return { valid: true };
};

