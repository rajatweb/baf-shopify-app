import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  StoreSettings,
  ThemeStatusResponse,
  UpdateStoreSettingsRequest,
  AppIdResponse,
} from "./types";

export const storeSettingsApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/store",
    credentials: "include",
  }),
  tagTypes: ["StoreSettings"],
  endpoints: (builder) => ({
    getStoreSettings: builder.query<StoreSettings["content"], void>({
      query: () => "/settings",
      providesTags: ["StoreSettings"],
    }),
    updateStoreSettings: builder.mutation<
      StoreSettings["content"],
      UpdateStoreSettingsRequest
    >({
      query: (data) => ({
        url: "/settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StoreSettings"],
    }),
    getThemeStatus: builder.query<ThemeStatusResponse, void>({
      query: () => "/theme/status",
    }),
    getAppId: builder.query<AppIdResponse, void>({
      query: () => "/appId",
    }),
    enableAppEmbed: builder.mutation<void, void>({
      query: () => ({
        url: "/theme/enable-app",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
  useGetThemeStatusQuery,
  useGetAppIdQuery,
  useEnableAppEmbedMutation,
} = storeSettingsApi;
