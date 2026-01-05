// Music Player API Types

// Core Models
export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt?: string; // Shopify CDN URL
  audioUrl: string; // Shopify CDN URL
  duration?: number; // Auto-extracted from MP3 metadata
  fileSize?: number; // File size in bytes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Shopify file references
  albumArtFileId?: string;
  audioFileId?: string;
}

export interface PlaylistTrack {
  id: string;
  order: number;
  track: Track;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isSelected: boolean; // Only one playlist can be selected per store
  createdAt: string;
  updatedAt: string;
  tracks: PlaylistTrack[];
}

export interface StoreMusicPlayerSettings {
  musicPlayerSettings?: {
    // General Settings
    displayMode?: 'button' | 'mini-bar';
    colorScheme?: 'light' | 'dark';
    roundedCorners?: boolean;
    
    // Floating Button Settings
    buttonSize?: number;
    buttonPosition?: 'bottom-right' | 'bottom-left';
    
    // Player Appearance
    showAlbumArt?: boolean;
    showTrackInfo?: boolean;
    playerOpacity?: number;
    
    // Audio Settings
    autoplay?: boolean;
    loop?: boolean;
    shuffle?: boolean;
    showMiniPlayer?: boolean;
    
    // Playlist Settings
    showTrackDuration?: boolean;
    showArtistName?: boolean;
    
    // Legacy settings for backward compatibility
    playerTheme?: 'light' | 'dark';
    playerPosition?: 'bottom' | 'top' | 'sidebar' | 'floating';
    persistentPlayback?: boolean;
  };
}

// Request Types
export interface CreatePlaylistRequest {
  shop: string;
  name: string;
  description?: string;
}

export interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
  isSelected?: boolean;
}

export interface SelectPlaylistRequest {
  playlistId: string;
  shop: string;
}

export interface AddTrackToPlaylistRequest {
  trackId: string;
  order?: number;
}

export interface UpdateTrackOrderRequest {
  trackOrders: Array<{
    trackId: string;
    order: number;
  }>;
}

export interface UpdateSettingsRequest {
  musicPlayerSettings?: StoreMusicPlayerSettings['musicPlayerSettings'];
}

// Response Types
export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  error?: string;
}

// Plan-related types
export interface PlanLimits {
  maxTracksPerPlaylist: number;
  maxTrackLength: number; // in seconds
  maxTotalTracks: number;
  persistentPlayback: boolean;
  fullCustomization: boolean;
  analytics: boolean;
  prioritySupport: boolean;
}

export interface PlanEnforcementError {
  valid: boolean;
  error?: string;
}
