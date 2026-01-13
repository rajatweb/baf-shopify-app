export type TAssetType = "IMAGE" | "AUDIO";
export type TDeleteShopAssetRequest = {
  fileUrl: string;
};
export type TShopAsset = {
  id: string;
  url: string;
  type: TAssetType;
  mimeType: string;
  shop: string;
  createdAt: string;
  updatedAt: string;
};
export type TUploadShopAssetResponse = {
  status: number;
  data: TShopAsset;
  message?: string;
};

export type TDeleteShopAssetResponse = {
  status: number;
  data: string;
  message?: string;
};

export type TVerifyUploadedAssetResponse = {
  status: number;
  data: {
    url: string;
    shopifyFileId: string;
    type: TAssetType;
    mimeType: string;
    shop: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
};
