import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ShopPlan = {
  name: string;
  plan: {
    shopifyPlus: boolean;
    partnerDevelopment: boolean;
    displayName: string;
  };
  currencyCode: string;
};

export type ShopResponse = {
  data: {
    shop: ShopPlan;
  };
};

export const shopApi = createApi({
  reducerPath: "shopApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/shop",
    credentials: "include",
  }),
  tagTypes: ["Shop"],
  endpoints: (builder) => ({
    getShop: builder.query<ShopResponse, void>({
      query: () => "/plan",
      providesTags: ["Shop"],
    }),
  }),
});

export const { useGetShopQuery } = shopApi;
