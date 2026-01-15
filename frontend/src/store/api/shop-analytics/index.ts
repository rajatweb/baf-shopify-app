import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { TShopAnalytics } from "./types";

export const shopAnalyticsApi = createApi({
  reducerPath: "shopAnalyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/shop-analytics",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getShopAnalytics: builder.query<TShopAnalytics, Omit<FetchArgs, "url">>({
      query: (args) => ({
        url: "/",
        ...args,
      }),
    }),
  }),
});

export const { useGetShopAnalyticsQuery, useLazyGetShopAnalyticsQuery } =
  shopAnalyticsApi;
