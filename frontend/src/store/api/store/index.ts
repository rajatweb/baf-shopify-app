import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ThemeStatusResponse, AppIdResponse } from "./types";

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/store",
    credentials: "include",
  }),
  tagTypes: ["StoreSettings"],
  endpoints: (builder) => ({
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
  useGetThemeStatusQuery,
  useGetAppIdQuery,
  useEnableAppEmbedMutation,
} = storeApi;
