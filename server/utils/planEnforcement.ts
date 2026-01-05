import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface PlanLimits {
  maxPlaylists: number;
  maxTracksPerPlaylist: number;
  maxTrackLength: number; // in seconds
  maxTotalTracks: number;
  fullCustomization: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  homepageOnly: boolean; // restrict to homepage only for free plan
}

export interface SubscriptionData {
  status: string;
  name: string;
  subscriptionId?: string;
}

/**
 * Get plan limits based on subscription data
 */
export const getPlanLimits = (subscriptionData?: SubscriptionData): PlanLimits => {
  // Check if it's an active Pro plan (handle different possible names)
  const isProPlan = subscriptionData?.status === "ACTIVE" && 
    (subscriptionData?.name === "Pro Plan (Full Experience)" || 
     subscriptionData?.name === "Pro Plan" ||
     subscriptionData?.name?.includes("Pro"));
  
  if (isProPlan) {
    return {
      maxPlaylists: -1, // unlimited
      maxTracksPerPlaylist: -1, // unlimited
      maxTrackLength: -1, // unlimited
      maxTotalTracks: -1, // unlimited
      fullCustomization: true, // all customization options
      analytics: true,
      prioritySupport: true,
      homepageOnly: false, // shows across full website
    };
  }
  
  // Default to Free Plan limits for any non-active or non-pro plan
  return {
    maxPlaylists: 1, // Free plan: max 1 playlist only
    maxTracksPerPlaylist: 2, // Free plan: up to 2 tracks per playlist
    maxTrackLength: -1, // Free plan: no track length limit (full tracks)
    maxTotalTracks: 2, // Free plan: max 2 total tracks
    fullCustomization: false, // limited customization options
    analytics: false,
    prioritySupport: false,
    homepageOnly: true, // only shows on homepage
  };
};

/**
 * Get subscription data for a shop from database
 */
export const getSubscriptionData = async (shop: string): Promise<SubscriptionData | null> => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { shopId: shop },
    });

    if (!subscription) {
      return null;
    }

    return {
      status: subscription.status,
      name: subscription.planName,
      subscriptionId: subscription.subscriptionId || undefined,
    };
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    return null;
  }
};

/**
 * Update subscription data for a shop
 * Only updates plan limits, preserves all user settings
 */
export const updateSubscriptionData = async (
  shop: string,
  subscriptionData: SubscriptionData
): Promise<void> => {
  try {
    const limits = getPlanLimits(subscriptionData);
    
    // Only update the subscription table with plan limits
    // Do NOT touch user settings in Store.musicPlayerSettings
    await prisma.subscription.upsert({
      where: { shopId: shop },
      update: {
        subscriptionId: subscriptionData.subscriptionId,
        planName: subscriptionData.name,
        status: subscriptionData.status,
        maxPlaylists: limits.maxPlaylists,
        maxTracksPerPlaylist: limits.maxTracksPerPlaylist,
        maxTotalTracks: limits.maxTotalTracks,
        fullCustomization: limits.fullCustomization,
        homepageOnly: limits.homepageOnly,
        updatedAt: new Date(),
      },
      create: {
        shopId: shop,
        subscriptionId: subscriptionData.subscriptionId,
        planName: subscriptionData.name,
        status: subscriptionData.status,
        maxPlaylists: limits.maxPlaylists,
        maxTracksPerPlaylist: limits.maxTracksPerPlaylist,
        maxTotalTracks: limits.maxTotalTracks,
        fullCustomization: limits.fullCustomization,
        homepageOnly: limits.homepageOnly,
      },
    });
    
    console.log(`✅ Updated subscription plan limits for ${shop} - user settings preserved`);
  } catch (error) {
    console.error("Error updating subscription data:", error);
    throw error;
  }
};

/**
 * Check if track limit is reached for a playlist
 */
export const isTrackLimitReached = async (
  shop: string,
  playlistId: string,
  subscriptionData?: SubscriptionData
): Promise<boolean> => {
  const limits = getPlanLimits(subscriptionData);
  
  if (limits.maxTracksPerPlaylist === -1) return false; // unlimited
  
  const trackCount = await prisma.playlistTrack.count({
    where: {
      playlistId,
      playlist: {
        storeId: shop,
      },
    },
  });
  
  return trackCount >= limits.maxTracksPerPlaylist;
};

/**
 * Check if playlist limit is reached for the store
 */
export const isPlaylistLimitReached = async (
  shop: string,
  subscriptionData?: SubscriptionData
): Promise<boolean> => {
  const limits = getPlanLimits(subscriptionData);
  
  if (limits.maxPlaylists === -1) return false; // unlimited
  
  const playlistCount = await prisma.playlist.count({
    where: {
      storeId: shop,
      isActive: true,
    },
  });
  
  return playlistCount >= limits.maxPlaylists;
};

/**
 * Check if total track limit is reached for the store
 */
export const isTotalTrackLimitReached = async (
  shop: string,
  subscriptionData?: SubscriptionData
): Promise<boolean> => {
  const limits = getPlanLimits(subscriptionData);
  
  if (limits.maxTotalTracks === -1) return false; // unlimited
  
  const trackCount = await prisma.track.count({
    where: {
      storeId: shop,
      isActive: true,
    },
  });
  
  return trackCount >= limits.maxTotalTracks;
};

/**
 * Validate track creation based on plan limits
 */
export const validateTrackCreation = async (
  shop: string,
  subscriptionData?: SubscriptionData
): Promise<{ valid: boolean; message?: string }> => {
  if (await isTotalTrackLimitReached(shop, subscriptionData)) {
    return {
      valid: false,
      message: "Track limit reached for your current plan. Upgrade to Pro Plan for unlimited tracks.",
    };
  }
  
  return { valid: true };
};

/**
 * Validate adding track to playlist based on plan limits
 */
export const validateAddTrackToPlaylist = async (
  shop: string,
  playlistId: string,
  subscriptionData?: SubscriptionData
): Promise<{ valid: boolean; message?: string }> => {
  if (await isTrackLimitReached(shop, playlistId, subscriptionData)) {
    return {
      valid: false,
      message: "Playlist track limit reached for your current plan. Upgrade to Pro Plan for unlimited tracks per playlist.",
    };
  }
  
  return { valid: true };
};

/**
 * Enforce plan limits when user downgrades
 */
export const enforcePlanLimitsOnDowngrade = async (
  shop: string,
  subscriptionData: SubscriptionData
): Promise<void> => {
  const limits = getPlanLimits(subscriptionData);
  
  // If downgrading to free plan, enforce limits
  if (limits.maxPlaylists === 1) {
    // Keep only the first playlist, delete others
    const playlists = await prisma.playlist.findMany({
      where: { storeId: shop, isActive: true },
      orderBy: { createdAt: "asc" },
    });
    
    if (playlists.length > 1) {
      // Delete all playlists except the first one
      const playlistsToDelete = playlists.slice(1);
      for (const playlist of playlistsToDelete) {
        await prisma.playlist.update({
          where: { id: playlist.id },
          data: { isActive: false },
        });
      }
    }
  }
  
  if (limits.maxTracksPerPlaylist === 2) {
    // For each playlist, keep only the first 2 tracks
    const playlists = await prisma.playlist.findMany({
      where: { storeId: shop, isActive: true },
      include: {
        tracks: {
          orderBy: { order: "asc" },
        },
      },
    });
    
    for (const playlist of playlists) {
      if (playlist.tracks.length > 2) {
        // Remove tracks beyond the first 2
        const tracksToRemove = playlist.tracks.slice(2);
        for (const playlistTrack of tracksToRemove) {
          await prisma.playlistTrack.delete({
            where: { id: playlistTrack.id },
          });
        }
      }
    }
  }
  
  if (limits.maxTotalTracks === 2) {
    // Keep only the first 2 tracks total
    const tracks = await prisma.track.findMany({
      where: { storeId: shop, isActive: true },
      orderBy: { createdAt: "asc" },
    });
    
    if (tracks.length > 2) {
      // Deactivate tracks beyond the first 2
      const tracksToDeactivate = tracks.slice(2);
      for (const track of tracksToDeactivate) {
        await prisma.track.update({
          where: { id: track.id },
          data: { isActive: false },
        });
      }
    }
  }
};
