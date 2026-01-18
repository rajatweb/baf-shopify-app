import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TShopResponse } from "./types";

export type TShopPlan = {
  name: string;
  plan: {
    shopifyPlus: boolean;
    partnerDevelopment: boolean;
    displayName: string;
  };
  currencyCode: string;
};

export type ShopPlanResponse = {
  data: {
    shop: TShopPlan;
  };
};

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/shop",
    credentials: "include",
  }),
  tagTypes: ["Shop", "ShopPlan"],
  endpoints: (builder) => ({
    getShop: builder.query<TShopResponse, void>({
      query: () => "/",
      providesTags: ["Shop"],
    }),
    getShopPlan: builder.query<ShopPlanResponse, void>({
      query: () => "/plan",
      providesTags: ["ShopPlan"],
    }),
  }),
});

export const { useGetShopQuery } = shopApi;
