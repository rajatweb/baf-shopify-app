import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CreateSubscriptionAPIResponse, SubscriptionResponse } from "./types";

export const subscriptionsApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/subscriptions",
    credentials: "include",
  }),
  tagTypes: ["Subscriptions"],
  endpoints: (builder) => ({
    getActiveSubscriptions: builder.query<SubscriptionResponse, void>({
      query: () => "/active-subscriptions",
      providesTags: ["Subscriptions"],
    }),
    createSubscription: builder.mutation<
      CreateSubscriptionAPIResponse,
      {
        planPrice: number;
        planName: string;
        planInterval: "EVERY_30_DAYS" | "ANNUAL";
        trialDays?: number;
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
        url: '/cancel-subscription',  
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetActiveSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
  useLazyGetActiveSubscriptionsQuery
} = subscriptionsApi;
