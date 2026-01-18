import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TCreateSubscriptionAPIResponse, TSubscriptionResponse } from "./types";

export const subscriptionsApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/subscriptions",
    credentials: "include",
  }),
  tagTypes: ["Subscriptions"],
  endpoints: (builder) => ({
    getActiveSubscriptions: builder.query<TSubscriptionResponse, void>({
      query: () => "/active-subscriptions",
      providesTags: ["Subscriptions"],
    }),
    createSubscription: builder.mutation<
      TCreateSubscriptionAPIResponse,
      {
        planPrice: number;
        planName: string;
        planInterval: "EVERY_30_DAYS" | "ANNUAL";
      }
    >({
      query: (body) => ({
        url: "/create-subscription",
        method: "POST",
        body,
      }),
    }),
    cancelSubscription: builder.mutation<void, void>({
      query: () => ({
        url: "/cancel-subscription",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetActiveSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useLazyGetActiveSubscriptionsQuery,
} = subscriptionsApi;
