import { Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  useUploadShopAssetMutation,
  useDeleteShopAssetMutation,
} from "../../store/api/shop-assests";

type Props = {
  albumArtUrl: string;
  onAlbumArtChange: (url: string) => void;
  onLoadingCallback?: (loading: boolean) => void;
  disabled?: boolean;
};

export const AlbumArtUploadComponent: React.FC<Props> = ({
  albumArtUrl,
  onAlbumArtChange,
  onLoadingCallback,
  disabled,
}: Props) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(albumArtUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const [uploadShopAsset, { isLoading }] = useUploadShopAssetMutation();
  const [deleteShopAsset, { isLoading: isDeleting }] = useDeleteShopAssetMutation();

  const isUploadingRef = useRef<boolean>(false);
  const currentFileRef = useRef<File | null>(null);

  // --- File Validation ---
  const validateImageFile = (file: File): boolean => {
    const MAX_MB = 10;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP images allowed");
      return false;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_MB}MB`);
      return false;
    }
    return true;
  };

  // --- Upload Logic ---
  const uploadImage = useCallback(
    async (file: File) => {
      if (isUploadingRef.current || currentFileRef.current === file) return;
      isUploadingRef.current = true;
      currentFileRef.current = file;
      setError(null);

      try {
        onLoadingCallback?.(true);
        const formData = new FormData();
        formData.append("fileData", file);
        const res = await uploadShopAsset(formData).unwrap();
        if (res.status === 200 && res.data?.url) {
          setPreviewUrl(res.data.url);
          onAlbumArtChange(res.data.url);
        } else {
          setError("Image upload failed");
        }
      } catch {
        setError("Failed to upload image");
      } finally {
        setPendingFile(null);
        currentFileRef.current = null;
        isUploadingRef.current = false;
        onLoadingCallback?.(false);
      }
    },
    [uploadShopAsset, onAlbumArtChange]
  );

  // --- Handle File Selection ---
  const onFileChange = (file: File) => {
    setError(null);
    if (validateImageFile(file)) {
      setPendingFile(file);
    }
  };

  // --- Handle Removal ---
  const handleRemove = async () => {
    try {
      onLoadingCallback?.(true);
      if (previewUrl) {
        await deleteShopAsset({ fileUrl: previewUrl }).unwrap();
      }
      setPreviewUrl(null);
      onAlbumArtChange("");
    } catch {
      // Ignored: visual state resets regardless of API error
    } finally {
      onLoadingCallback?.(false);
    }
  };

  // --- Auto Upload on File Change ---
  useEffect(() => {
    if (pendingFile && !isUploadingRef.current) {
      uploadImage(pendingFile);
    }
  }, [pendingFile, uploadImage]);

  // --- Render ---
  return (
    <s-box background="subdued" border="base" borderRadius="base" padding="base">
      <s-stack direction="block" gap="small">
        <s-text type="strong">
          Logo <span style={{ color: "#6d7175" }}>(optional)</span>
        </s-text>

        {previewUrl ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img
              src={previewUrl}
              alt="Album Art"
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #e1e3e5",
              }}
            />
            <s-button
              icon="delete"
              tone="critical"
              loading={isDeleting}
              onClick={handleRemove}
              disabled={isDeleting || disabled}
            >
              Remove
            </s-button>
          </div>
        ) : (
          <>
            <s-button
              variant="secondary"
              disabled={isLoading || disabled}
              aria-label="Select album art image"
              onClick={() => document.getElementById("album-art-input")?.click()}
            >
              <s-stack
                direction="inline"
                gap="small"
                padding="base"
                justifyContent="center"
                alignItems="center"
              >
                <ImageIcon size={32} />
                <s-text type="strong">Drop image or click to browse</s-text>
                <s-text color="subdued">JPG, PNG, WEBP (max 10MB)</s-text>
              </s-stack>
            </s-button>
            <input
              id="album-art-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              disabled={isLoading || disabled}
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileChange(file);
                // Reset input so the same file can be reselected if needed
                e.currentTarget.value = "";
              }}
            />
          </>
        )}
        {error && (
          <s-text tone="critical" aria-live="polite">
            {error}
          </s-text>
        )}
        {isLoading && <s-text>Uploading image…</s-text>}
      </s-stack>
    </s-box>
  );
};
