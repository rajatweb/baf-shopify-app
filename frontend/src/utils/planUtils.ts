import type { Track } from "../store/api/music-player/types";

/**
 * Filter out demo conditions (if any)
 * @param items - Array of conditions or tracks
 * @returns Filtered array without demo items
 */
export const filterDemoItems = <T extends { id?: string }>(items: T[] = []) => {
  return items.filter(item => !item.id?.includes('demo'));
};

/**
 * Get real item count (excluding demo items)
 * @param items - Array of items
 * @returns Count of real items
 */
export const getRealItemCount = <T extends { id?: string }>(items: T[] = []) => {
  return filterDemoItems(items).length;
};

// Plan type definitions
export type PlanType = 'free' | 'pro' | 'studio';

// Plan name mappings (as they appear in Shopify subscriptions)
const PLAN_NAME_MAP: Record<string, PlanType> = {
  'Free': 'free',
  'Free Plan': 'free',
  'Free Plan (Demo Mode)': 'free',
  'Pro': 'pro',
  'Pro Plan': 'pro',
  'Pro Plan (Full Experience)': 'pro',
  'Studio': 'studio',
  'Studio Plan': 'studio',
};

/**
 * Get plan limits based on plan type for music player
 * @param plan - Plan type ('free', 'pro', or 'studio')
 * @returns Maximum number of tracks allowed per playlist
 */
export const getTrackLimitPerPlaylist = (plan: PlanType): number => {
  return plan === 'free' ? 2 : -1; // -1 means unlimited for pro and studio
};

/**
 * Get track length limit based on plan type
 * @param _plan - Plan type ('free', 'pro', or 'studio')
 * @returns Maximum track length in seconds (-1 means unlimited)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTrackLengthLimit = (_plan: PlanType): number => {
  return -1; // No track length restrictions for any plan
};

/**
 * Get total track limit for the store
 * @param plan - Plan type ('free', 'pro', or 'studio')
 * @returns Maximum number of total tracks allowed
 */
export const getTotalTrackLimit = (plan: PlanType): number => {
  return plan === 'free' ? 2 : -1; // -1 means unlimited for pro and studio
};

/**
 * Get maximum playlists allowed
 * @param plan - Plan type ('free', 'pro', or 'studio')
 * @returns Maximum number of playlists allowed
 */
export const getMaxPlaylists = (plan: PlanType): number => {
  return plan === 'free' ? 1 : -1; // -1 means unlimited for pro and studio
};

/**
 * Get maximum videos allowed per playlist
 * @param plan - Plan type ('free', 'pro', or 'studio')
 * @returns Maximum number of videos allowed per playlist
 */
export const getMaxVideosPerPlaylist = (plan: PlanType): number => {
  return plan === 'free' ? 1 : -1; // -1 means unlimited for pro and studio
};

/**
 * Check if track limit is reached for a playlist
 * @param playlistTracks - Array of tracks in playlist
 * @param plan - Plan type
 * @returns True if limit is reached
 */
export const isTrackLimitReached = (playlistTracks: Track[] = [], plan: PlanType): boolean => {
  const limit = getTrackLimitPerPlaylist(plan);
  return limit !== -1 && playlistTracks.length >= limit;
};

/**
 * Check if total track limit is reached
 * @param totalTracks - Total number of tracks in store
 * @param plan - Plan type
 * @returns True if limit is reached
 */
export const isTotalTrackLimitReached = (totalTracks: number, plan: PlanType): boolean => {
  const limit = getTotalTrackLimit(plan);
  return limit !== -1 && totalTracks >= limit;
};

/**
 * Check if video limit is reached for a playlist
 * @param playlistVideosCount - Number of videos in playlist
 * @param plan - Plan type
 * @returns True if limit is reached
 */
export const isVideoLimitReached = (playlistVideosCount: number, plan: PlanType): boolean => {
  const limit = getMaxVideosPerPlaylist(plan);
  return limit !== -1 && playlistVideosCount >= limit;
};

/**
 * Check if track length exceeds plan limit
 * @param duration - Track duration in seconds
 * @param plan - Plan type
 * @returns True if track length exceeds limit
 */
export const isTrackLengthExceeded = (duration: number, plan: PlanType): boolean => {
  const limit = getTrackLengthLimit(plan);
  return limit !== -1 && duration > limit;
};

/**
 * Calculate usage percentage for tracks
 * @param currentTracks - Current number of tracks
 * @param plan - Plan type
 * @returns Usage percentage (0-100)
 */
export const getTrackUsagePercentage = (currentTracks: number, plan: PlanType): number => {
  const limit = getTrackLimitPerPlaylist(plan);
  if (limit === -1) return 0;
  return Math.min((currentTracks / limit) * 100, 100);
};

/**
 * Check if user is on pro plan based on subscription data
 * @param subscriptions - Subscription data from RTK Query (Shopify format)
 * @returns True if user has active pro subscription
 */
export const isProPlan = (subscriptions: unknown): boolean => {
  return getCurrentPlan(subscriptions) === 'pro';
};

/**
 * Check if user is on studio plan based on subscription data
 * @param subscriptions - Subscription data from RTK Query (Shopify format)
 * @returns True if user has active studio subscription
 */
export const isStudioPlan = (subscriptions: unknown): boolean => {
  return getCurrentPlan(subscriptions) === 'studio';
};

/**
 * Check if user has a paid plan (pro or studio)
 * @param subscriptions - Subscription data from RTK Query (Shopify format)
 * @returns True if user has active pro or studio subscription
 */
export const isPaidPlan = (subscriptions: unknown): boolean => {
  return isProPlan(subscriptions) || isStudioPlan(subscriptions);
};

/**
 * Get current plan type based on subscription data
 * @param subscriptions - Subscription data from RTK Query (Shopify format)
 *   Can be either: Subscription[] array or { data: Subscription[] } object
 * @returns 'free', 'pro', or 'studio'
 */
export const getCurrentPlan = (subscriptions: unknown): PlanType => {
  // Handle both array format and object format
  let subscriptionArray: Array<{ status?: string; name?: string }> | undefined;
  
  if (Array.isArray(subscriptions)) {
    // Direct array format: Subscription[]
    subscriptionArray = subscriptions;
  } else {
    // Object format: { data: Subscription[] }
    const subscriptionData = subscriptions as { data?: Array<{ status?: string; name?: string }> };
    subscriptionArray = subscriptionData?.data;
  }
  
  const currentSubscription = subscriptionArray?.[0];
  
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('[Plan Detection] currentSubscription:', currentSubscription);
  // }
  
  if (!currentSubscription || currentSubscription?.status !== "ACTIVE") {
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('[Plan Detection] No active subscription, returning free');
    // }
    return 'free';
  }
  
  const planName = currentSubscription?.name || '';
  
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('[Plan Detection] planName:', planName);
  //   console.log('[Plan Detection] PLAN_NAME_MAP lookup:', PLAN_NAME_MAP[planName]);
  // }
  
  const planType = PLAN_NAME_MAP[planName] || 'free';
  
  // if (process.env.NODE_ENV === 'development') {
  //   console.log('[Plan Detection] Final plan type:', planType);
  // }
  
  return planType;
};

/**
 * Check if persistent playback is allowed based on plan
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if persistent playback is allowed (pro or studio plan)
 */
export const isPersistentPlaybackAllowed = (subscriptions: unknown): boolean => {
  return isPaidPlan(subscriptions);
};

/**
 * Check if full customization is allowed based on plan
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if full customization is allowed (pro or studio plan)
 */
export const isFullCustomizationAllowed = (subscriptions: unknown): boolean => {
  return isPaidPlan(subscriptions);
};

/**
 * Check if studio features are available (platform links, music videos, etc.)
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if studio features are available
 */
export const isStudioFeaturesAllowed = (subscriptions: unknown): boolean => {
  return isStudioPlan(subscriptions);
};

/**
 * Check if autoplay is allowed based on plan
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if autoplay is allowed (pro or studio plan)
 */
export const isAutoplayAllowed = (subscriptions: unknown): boolean => {
  return isPaidPlan(subscriptions);
};

/**
 * Check if cross-page playback is allowed
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if cross-page playback is allowed (pro or studio plan)
 */
export const isCrossPagePlaybackAllowed = (subscriptions: unknown): boolean => {
  return isPaidPlan(subscriptions);
};

/**
 * Get plan features based on plan type
 * @param plan - Plan type ('free', 'pro', or 'studio')
 * @returns Object with plan features
 */
export const getPlanFeatures = (plan: PlanType) => {
  if (plan === 'studio') {
    return {
      maxPlaylists: -1, // unlimited
      maxTracksPerPlaylist: -1, // unlimited
      maxTrackLength: -1, // unlimited
      maxTotalTracks: -1, // unlimited
      maxVideosPerPlaylist: -1, // unlimited
      persistentPlayback: true, // continuous playback across pages
      fullCustomization: true, // all customization options
      analytics: true,
      prioritySupport: true,
      homepageOnly: false, // shows across full website
      autoplay: true,
      platformLinks: true, // Spotify, Apple Music, etc.
      musicVideos: true,
      ctaBadges: true,
      lyrics: true,
      customColors: true,
      crossfadeTransitions: true,
      albumArtBackdrop: true,
    };
  }
  
  if (plan === 'pro') {
    return {
      maxPlaylists: -1, // unlimited
      maxTracksPerPlaylist: -1, // unlimited
      maxTrackLength: -1, // unlimited
      maxTotalTracks: -1, // unlimited
      maxVideosPerPlaylist: -1, // unlimited
      persistentPlayback: true, // continuous playback across pages
      fullCustomization: true, // all customization options
      analytics: true,
      prioritySupport: true,
      homepageOnly: false, // shows across full website
      autoplay: true,
      platformLinks: false,
      musicVideos: false,
      ctaBadges: false,
      lyrics: false,
      customColors: false,
      crossfadeTransitions: false,
      albumArtBackdrop: false,
    };
  }
  
  // Free plan
  return {
    maxPlaylists: 1, // Free plan: 1 playlist maximum
    maxTracksPerPlaylist: 2, // Free plan: up to 2 tracks per playlist
    maxTrackLength: -1, // Free plan: no track length limit (full tracks)
    maxTotalTracks: 2, // Free plan: max 2 total tracks
    maxVideosPerPlaylist: 1, // Free plan: 1 video per playlist
    persistentPlayback: false, // no continuous playback across pages
    fullCustomization: false, // limited customization options
    analytics: false,
    prioritySupport: false,
    homepageOnly: true, // only shows on homepage
    autoplay: false,
    platformLinks: false,
    musicVideos: false,
    ctaBadges: false,
    lyrics: false,
    customColors: false,
    crossfadeTransitions: false,
    albumArtBackdrop: false,
  };
}; 

/**
 * Single source of truth for plan detection - fetches data directly from backend
 * @param shop - Shop domain
 * @returns Promise with plan data
 */
export const getPlanDataFromBackend = async (shop: string): Promise<{
  planType: PlanType;
  planName: string;
  status: string;
  isProPlan: boolean;
  isStudioPlan: boolean;
  isPaidPlan: boolean;
  planLimits: {
    maxPlaylists: number;
    maxTracksPerPlaylist: number;
    maxTotalTracks: number;
    maxVideosPerPlaylist: number;
    persistentPlayback: boolean;
    fullCustomization: boolean;
    homepageOnly: boolean;
    autoplay: boolean;
    platformLinks: boolean;
    musicVideos: boolean;
    ctaBadges: boolean;
    lyrics: boolean;
    customColors: boolean;
    crossfadeTransitions: boolean;
    albumArtBackdrop: boolean;
  };
}> => {
  try {
    const response = await fetch(`/api/music-player/settings?shop=${shop}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      const subscriptionName = data.data.subscriptionName || 'Free Plan';
      const subscriptionStatus = data.data.subscriptionStatus || 'INACTIVE';
      const planType = subscriptionStatus === 'ACTIVE' 
        ? (PLAN_NAME_MAP[subscriptionName] || 'free')
        : 'free';
      
      const planFeatures = getPlanFeatures(planType);
      
      return {
        planType,
        planName: subscriptionName,
        status: subscriptionStatus,
        isProPlan: planType === 'pro',
        isStudioPlan: planType === 'studio',
        isPaidPlan: planType === 'pro' || planType === 'studio',
        planLimits: {
          maxPlaylists: planFeatures.maxPlaylists,
          maxTracksPerPlaylist: planFeatures.maxTracksPerPlaylist,
          maxTotalTracks: planFeatures.maxTotalTracks,
          maxVideosPerPlaylist: planFeatures.maxVideosPerPlaylist,
          persistentPlayback: planFeatures.persistentPlayback,
          fullCustomization: planFeatures.fullCustomization,
          homepageOnly: planFeatures.homepageOnly,
          autoplay: planFeatures.autoplay,
          platformLinks: planFeatures.platformLinks,
          musicVideos: planFeatures.musicVideos,
          ctaBadges: planFeatures.ctaBadges,
          lyrics: planFeatures.lyrics,
          customColors: planFeatures.customColors,
          crossfadeTransitions: planFeatures.crossfadeTransitions,
          albumArtBackdrop: planFeatures.albumArtBackdrop,
        }
      };
    }
    
    // Fallback to free plan if API fails
    const freePlanFeatures = getPlanFeatures('free');
    return {
      planType: 'free',
      planName: 'Free Plan',
      status: 'INACTIVE',
      isProPlan: false,
      isStudioPlan: false,
      isPaidPlan: false,
      planLimits: {
        maxPlaylists: freePlanFeatures.maxPlaylists,
        maxTracksPerPlaylist: freePlanFeatures.maxTracksPerPlaylist,
        maxTotalTracks: freePlanFeatures.maxTotalTracks,
        maxVideosPerPlaylist: freePlanFeatures.maxVideosPerPlaylist,
        persistentPlayback: freePlanFeatures.persistentPlayback,
        fullCustomization: freePlanFeatures.fullCustomization,
        homepageOnly: freePlanFeatures.homepageOnly,
        autoplay: freePlanFeatures.autoplay,
        platformLinks: freePlanFeatures.platformLinks,
        musicVideos: freePlanFeatures.musicVideos,
        ctaBadges: freePlanFeatures.ctaBadges,
        lyrics: freePlanFeatures.lyrics,
        customColors: freePlanFeatures.customColors,
        crossfadeTransitions: freePlanFeatures.crossfadeTransitions,
        albumArtBackdrop: freePlanFeatures.albumArtBackdrop,
      }
    };
  } catch {
    // Fallback to free plan on error
    const freePlanFeatures = getPlanFeatures('free');
    return {
      planType: 'free',
      planName: 'Free Plan',
      status: 'INACTIVE',
      isProPlan: false,
      isStudioPlan: false,
      isPaidPlan: false,
      planLimits: {
        maxPlaylists: freePlanFeatures.maxPlaylists,
        maxTracksPerPlaylist: freePlanFeatures.maxTracksPerPlaylist,
        maxTotalTracks: freePlanFeatures.maxTotalTracks,
        maxVideosPerPlaylist: freePlanFeatures.maxVideosPerPlaylist,
        persistentPlayback: freePlanFeatures.persistentPlayback,
        fullCustomization: freePlanFeatures.fullCustomization,
        homepageOnly: freePlanFeatures.homepageOnly,
        autoplay: freePlanFeatures.autoplay,
        platformLinks: freePlanFeatures.platformLinks,
        musicVideos: freePlanFeatures.musicVideos,
        ctaBadges: freePlanFeatures.ctaBadges,
        lyrics: freePlanFeatures.lyrics,
        customColors: freePlanFeatures.customColors,
        crossfadeTransitions: freePlanFeatures.crossfadeTransitions,
        albumArtBackdrop: freePlanFeatures.albumArtBackdrop,
      }
    };
  }
}; 