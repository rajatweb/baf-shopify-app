import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  userEmail: string;
  userName?: string;
  shopDomain: string;
  upvotes: number;
  comments: Array<{
    id: string;
    comment: string;
    userEmail: string;
    userName: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureRequestRequest {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  userEmail: string;
  userName?: string;
  shopDomain: string;
}

export interface UpdateFeatureRequestRequest {
  id: string;
  status?: "pending" | "in_progress" | "completed" | "rejected";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
}

export interface AddCommentRequest {
  id: string;
  comment: string;
  userEmail: string;
  userName?: string;
}

export const featureRequestsApi = createApi({
  reducerPath: "featureRequestsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/feature-requests",
    credentials: "include",
  }),
  tagTypes: ["FeatureRequest"],
  endpoints: (builder) => ({
    // Get all feature requests
    getFeatureRequests: builder.query<
      { success: boolean; data: FeatureRequest[] },
      {
        status?: string;
        priority?: string;
        category?: string;
        shopDomain?: string;
      }
    >({
      query: (params) => ({
        url: "/",
        params,
      }),
      providesTags: ["FeatureRequest"],
    }),

    // Get a specific feature request
    getFeatureRequest: builder.query<
      { success: boolean; data: FeatureRequest },
      string
    >({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "FeatureRequest", id }],
    }),

    // Create a new feature request
    createFeatureRequest: builder.mutation<
      { success: boolean; data: FeatureRequest },
      CreateFeatureRequestRequest
    >({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FeatureRequest"],
    }),

    // Update a feature request (admin only)
    updateFeatureRequest: builder.mutation<
      { success: boolean; data: FeatureRequest },
      UpdateFeatureRequestRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "FeatureRequest",
        { type: "FeatureRequest", id },
      ],
    }),

    // Upvote a feature request
    upvoteFeatureRequest: builder.mutation<
      { success: boolean; data: FeatureRequest },
      string
    >({
      query: (id) => ({
        url: `/${id}/upvote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        "FeatureRequest",
        { type: "FeatureRequest", id },
      ],
    }),

    // Add a comment to a feature request
    addComment: builder.mutation<
      { success: boolean; data: FeatureRequest },
      AddCommentRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/${id}/comment`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        "FeatureRequest",
        { type: "FeatureRequest", id },
      ],
    }),

    // Delete a feature request (admin only)
    deleteFeatureRequest: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FeatureRequest"],
    }),
  }),
});

export const {
  useGetFeatureRequestsQuery,
  useGetFeatureRequestQuery,
  useCreateFeatureRequestMutation,
  useUpdateFeatureRequestMutation,
  useUpvoteFeatureRequestMutation,
  useAddCommentMutation,
  useDeleteFeatureRequestMutation,
} = featureRequestsApi; 