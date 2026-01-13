import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  TDeleteShopAssetRequest,
  TDeleteShopAssetResponse,
  TUploadShopAssetResponse,
  TVerifyUploadedAssetResponse,
} from "./types";

export const shopAssetsApi = createApi({
  reducerPath: "shopAssetsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/shop-assets",
    credentials: "include",
  }),
  tagTypes: ["ShopAssets"],
  endpoints: (builder) => ({
    uploadShopAsset: builder.mutation<TUploadShopAssetResponse, FormData>({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),
    deleteShopAsset: builder.mutation<
      TDeleteShopAssetResponse,
      TDeleteShopAssetRequest
    >({
      query: (data) => ({
        url: "/",
        method: "DELETE",
        body: data,
      }),
    }),
    getAssetDetail: builder.query<TVerifyUploadedAssetResponse, string>({
      query: (data) => ({
        url: "/get-asset-detail",
        method: "GET",
        params: { fileUrl: data },
      }),
    }),
  }),
});

export const {
  useUploadShopAssetMutation,
  useDeleteShopAssetMutation,
  useGetAssetDetailQuery,
  useLazyGetAssetDetailQuery,
} = shopAssetsApi;
