import FormData from "form-data";
import { GraphqlClient } from "@shopify/shopify-api";
import fetch from "node-fetch";

interface UploadFileOptions {
  client: GraphqlClient;
  fileData: Express.Multer.File;
  retryDelay?: number; // milliseconds to wait between retries
  maxRetries?: number;
}

/**
 * Uploads a file to Shopify (image or audio) and waits until it's processed.
 */
export async function uploadFileToShopifyAssets({
  client,
  fileData,
  retryDelay = 2000,
  maxRetries = 20,
}: UploadFileOptions) {
  if (!fileData) throw new Error("No file provided");

  const mimeType = fileData.mimetype;
  const isImage = mimeType.startsWith("image/");
  const isAudio = mimeType.startsWith("audio/");

  if (!isImage && !isAudio) {
    throw new Error("Only image or audio files are allowed");
  }

  /* =======================
       1️⃣ STAGED UPLOAD
       ======================= */
  const stagedUpload = await client.request(
    `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
        stagedUploadsCreate(input: $input) {
          stagedTargets {
            resourceUrl
            url
            parameters { name value }
          }
          userErrors { message }
        }
      }`,
    {
      variables: {
        input: [
          {
            filename: fileData.originalname,
            mimeType,
            httpMethod: "POST",
            resource: isImage ? "IMAGE" : "FILE",
          },
        ],
      },
    }
  );

  const stagedErrors = stagedUpload.data.stagedUploadsCreate.userErrors;
  if (stagedErrors.length) {
    throw new Error(stagedErrors[0].message);
  }

  const { url, parameters, resourceUrl } =
    stagedUpload.data.stagedUploadsCreate.stagedTargets[0];
  /* =======================
       2️⃣ UPLOAD TO S3
       ======================= */

  const formData = new FormData();
  parameters.forEach(({ name, value }: { name: string; value: string }) =>
    formData.append(name, value)
  );
  formData.append("file", fileData.buffer, {
    filename: fileData.originalname,
    contentType: fileData.mimetype,
  });

  const uploadResponse = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      ...formData.getHeaders(),
      "Content-Length": fileData.buffer.length.toString(),
    },
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  /* =======================
       3️⃣ CREATE SHOPIFY FILE
       ======================= */
  const createFile = await client.request(
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
            contentType: isImage ? "IMAGE" : "FILE",
            originalSource: resourceUrl,
            alt: fileData.originalname,
          },
        ],
      },
    }
  );

  const createErrors = createFile.data.fileCreate.userErrors;
  if (createErrors.length) {
    throw new Error(createErrors[0].message);
  }

  const fileId = createFile.data.fileCreate.files[0].id;

  /* =======================
       4️⃣ POLL UNTIL READY
       ======================= */
  let processedFile: { url: string; duration?: number } | null = null;

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
      processedFile = {
        url: node.url,
      };
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
    shopifyFileId: fileId,
    url: processedFile.url,
    duration: isAudio ? processedFile.duration : null,
    mimeType,
    type: isImage ? "IMAGE" : "AUDIO",
    shop: client.session.shop,
  };
}

export const deleteFileFromShopifyAssets = async (
  client: GraphqlClient,
  shopifyFileId: string
) => {
  const deleteFileResponse = await client.request(
    `mutation deleteFile($fileIds: [ID!]!) {
      fileDelete(fileIds: $fileIds) {
        deletedFileIds
      }
    }`,
    {
      variables: {
        fileIds: [shopifyFileId],
      },
    }
  );

  if (
    !deleteFileResponse.data.fileDelete.deletedFileIds.includes(shopifyFileId)
  ) {
    throw new Error("Failed to delete file");
  }

  return true;
};
