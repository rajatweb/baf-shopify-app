import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  TGetStoreSettingsResponse,
  TUpdateStoreSettingsRequest,
  TUpdateStoreSettingsResponse,
} from "./type";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/store-settings",
    credentials: "include",
  }),
  tagTypes: ["Settings"],
  endpoints: (builder) => ({
    getSettings: builder.query<TGetStoreSettingsResponse, void>({
      query: () => "/",
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<
      TUpdateStoreSettingsResponse,
      TUpdateStoreSettingsRequest
    >({
      query: (settings) => ({
        url: "/",
        method: "POST",
        body: settings,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
