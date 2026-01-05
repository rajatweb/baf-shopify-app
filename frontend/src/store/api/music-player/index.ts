import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  Track,
  Playlist,
  StoreMusicPlayerSettings,
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  SelectPlaylistRequest,
  AddTrackToPlaylistRequest,
  UpdateTrackOrderRequest,
  UpdateSettingsRequest,
} from './types';

export const musicPlayerApi = createApi({
  reducerPath: 'musicPlayerApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/music-player' }),
  tagTypes: ['Playlist', 'Track', 'Settings'],
  endpoints: (builder) => ({
    // ============================================================================
    // PLAYLIST ENDPOINTS
    // ============================================================================
    
    getPlaylists: builder.query<{ data: Playlist[] }, string>({
      query: (shop) => `playlists?shop=${shop}`,
      providesTags: ['Playlist'],
    }),
    
    createPlaylist: builder.mutation<{ data: Playlist }, CreatePlaylistRequest>({
      query: (playlist) => ({
        url: 'playlists',
        method: 'POST',
        body: playlist,
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    updatePlaylist: builder.mutation<{ data: Playlist }, { id: string; data: UpdatePlaylistRequest }>({
      query: ({ id, data }) => ({
        url: `playlists/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    deletePlaylist: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `playlists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Playlist'],
    }),

    selectPlaylist: builder.mutation<{ data: Playlist }, SelectPlaylistRequest>({
      query: (request) => ({
        url: 'playlists/select',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    // ============================================================================
    // TRACK ENDPOINTS
    // ============================================================================
    
    getTracks: builder.query<{ data: Track[] }, string>({
      query: (shop) => `tracks?shop=${shop}`,
      providesTags: ['Track'],
    }),
    
    createTrack: builder.mutation<{ data: Track }, FormData>({
      query: (formData) => ({
        url: 'tracks',
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Track'],
    }),
    
    updateTrack: builder.mutation<{ data: Track }, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `tracks/${id}`,
        method: 'PUT',
        body: data,
        // Don't set Content-Type header for FormData
        prepareHeaders: (headers: Headers) => {
          headers.delete('Content-Type');
          return headers;
        },
      }),
      invalidatesTags: ['Track'],
    }),
    
    deleteTrack: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Track'],
    }),
    
    // ============================================================================
    // PLAYLIST TRACK MANAGEMENT
    // ============================================================================
    
    addTrackToPlaylist: builder.mutation<
      { data: any }, //eslint-disable-line
      { playlistId: string; data: AddTrackToPlaylistRequest }
    >({
      query: ({ playlistId, data }) => ({
        url: `playlists/${playlistId}/tracks`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    removeTrackFromPlaylist: builder.mutation<
      { message: string },
      { playlistId: string; trackId: string }
    >({
      query: ({ playlistId, trackId }) => ({
        url: `playlists/${playlistId}/tracks/${trackId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    updateTrackOrder: builder.mutation<
      { message: string },
      { playlistId: string; data: UpdateTrackOrderRequest }
    >({
      query: ({ playlistId, data }) => ({
        url: `playlists/${playlistId}/tracks/order`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Playlist'],
    }),
    
    // ============================================================================
    // SETTINGS ENDPOINTS
    // ============================================================================
    
    getSettings: builder.query<{ data: StoreMusicPlayerSettings }, string>({
      query: (shop) => `settings?shop=${shop}`,
      providesTags: ['Settings'],
    }),
    
    updateSettings: builder.mutation<
      { data: StoreMusicPlayerSettings },
      { shop: string; data: UpdateSettingsRequest }
    >({
      query: ({ shop, data }) => ({
        url: 'settings',
        method: 'PUT',
        body: { shop, ...data },
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  // Playlist queries and mutations
  useGetPlaylistsQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useSelectPlaylistMutation,
  
  // Track queries and mutations
  useGetTracksQuery,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useDeleteTrackMutation,
  
  // Playlist track management
  useAddTrackToPlaylistMutation,
  useRemoveTrackFromPlaylistMutation,
  useUpdateTrackOrderMutation,
  
  // Settings queries and mutations
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = musicPlayerApi;
