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

/**
 * Get plan limits based on plan type for music player
 * @param plan - Plan type ('free' or 'pro')
 * @returns Maximum number of tracks allowed per playlist
 */
export const getTrackLimitPerPlaylist = (plan: 'free' | 'pro') => {
  return plan === 'free' ? 2 : -1; // -1 means unlimited
};

/**
 * Get track length limit based on plan type
 * @param plan - Plan type ('free' or 'pro')
 * @returns Maximum track length in seconds
 */
export const getTrackLengthLimit = (plan: 'free' | 'pro') => {
  return plan === 'free' ? -1 : -1; // -1 means unlimited (no length restrictions for free plan)
};

/**
 * Get total track limit for the store
 * @param plan - Plan type ('free' or 'pro')
 * @returns Maximum number of total tracks allowed
 */
export const getTotalTrackLimit = (plan: 'free' | 'pro') => {
  return plan === 'free' ? 2 : -1; // -1 means unlimited
};

/**
 * Check if track limit is reached for a playlist
 * @param playlistTracks - Array of tracks in playlist
 * @param plan - Plan type
 * @returns True if limit is reached
 */
export const isTrackLimitReached = (playlistTracks: Track[] = [], plan: 'free' | 'pro') => {
  const limit = getTrackLimitPerPlaylist(plan);
  return limit !== -1 && playlistTracks.length >= limit;
};

/**
 * Check if total track limit is reached
 * @param totalTracks - Total number of tracks in store
 * @param plan - Plan type
 * @returns True if limit is reached
 */
export const isTotalTrackLimitReached = (totalTracks: number, plan: 'free' | 'pro') => {
  const limit = getTotalTrackLimit(plan);
  return limit !== -1 && totalTracks >= limit;
};

/**
 * Check if track length exceeds plan limit
 * @param duration - Track duration in seconds
 * @param plan - Plan type
 * @returns True if track length exceeds limit
 */
export const isTrackLengthExceeded = (duration: number, plan: 'free' | 'pro') => {
  const limit = getTrackLengthLimit(plan);
  return limit !== -1 && duration > limit;
};

/**
 * Calculate usage percentage for tracks
 * @param currentTracks - Current number of tracks
 * @param plan - Plan type
 * @returns Usage percentage (0-100)
 */
export const getTrackUsagePercentage = (currentTracks: number, plan: 'free' | 'pro') => {
  const limit = getTrackLimitPerPlaylist(plan);
  if (limit === -1) return 0;
  return Math.min((currentTracks / limit) * 100, 100);
};

/**
 * Check if user is on pro plan based on subscription data
 * @param subscriptions - Subscription data from RTK Query (Shopify format)
 * @returns True if user has active pro subscription
 */
export const isProPlan = (subscriptions: unknown) => {
  const subscriptionData = subscriptions as { data?: Array<{ status?: string; name?: string }> };
  const currentSubscription = subscriptionData?.data?.[0];
  

  
  // Check for Pro Plan with both possible names
  return currentSubscription?.status === "ACTIVE" && 
         (currentSubscription?.name === "Pro Plan (Full Experience)" || currentSubscription?.name === "Pro Plan");
};

/**
 * Get current plan type based on subscription data
 * @param subscriptions - Subscription data from RTK Query (Shopify format)
 * @returns 'free' or 'pro'
 */
export const getCurrentPlan = (subscriptions: unknown): 'free' | 'pro' => {
  const result = isProPlan(subscriptions) ? 'pro' : 'free';
  

  
  return result;
};


/**
 * Check if persistent playback is allowed based on plan
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if persistent playback is allowed (pro plan)
 */
export const isPersistentPlaybackAllowed = (subscriptions: unknown) => {
  return isProPlan(subscriptions);
};

/**
 * Check if full customization is allowed based on plan
 * @param subscriptions - Subscription data from RTK Query
 * @returns True if full customization is allowed (pro plan)
 */
export const isFullCustomizationAllowed = (subscriptions: unknown) => {
  return isProPlan(subscriptions);
};

/**
 * Get plan features based on plan type
 * @param plan - Plan type ('free' or 'pro')
 * @returns Object with plan features
 */
export const getPlanFeatures = (plan: 'free' | 'pro') => {
  if (plan === 'pro') {
    return {
      maxTracksPerPlaylist: -1, // unlimited
      maxTrackLength: -1, // unlimited
      maxTotalTracks: -1, // unlimited
      persistentPlayback: true, // continuous playback across pages
      fullCustomization: true, // all customization options
      analytics: true,
      prioritySupport: true,
      homepageOnly: false, // shows across full website
    };
  }
  
  return {
    maxTracksPerPlaylist: 2, // Free plan: up to 2 tracks per playlist
    maxTrackLength: -1, // Free plan: no track length limit (full tracks)
    maxTotalTracks: 2, // Free plan: max 2 total tracks
    persistentPlayback: false, // no continuous playback across pages
    fullCustomization: false, // limited customization options
    analytics: false,
    prioritySupport: false,
    homepageOnly: true, // only shows on homepage
  };
}; 

/**
 * Single source of truth for plan detection - fetches data directly from backend
 * @param shop - Shop domain
 * @returns Promise with plan data
 */
export const getPlanDataFromBackend = async (shop: string): Promise<{
  isProPlan: boolean;
  planName: string;
  status: string;
  planLimits: {
    maxPlaylists: number;
    maxTracksPerPlaylist: number;
    maxTotalTracks: number;
    persistentPlayback: boolean;
    fullCustomization: boolean;
    homepageOnly: boolean;
    autoplay: boolean;
  };
}> => {
  try {
    const response = await fetch(`/api/music-player/settings?shop=${shop}`);
    const data = await response.json();
    
    if (data.success && data.data) {
      // Check for Pro Plan with both possible names from Shopify
      const isProPlan = data.data.subscriptionStatus === 'ACTIVE' && 
                       (data.data.subscriptionName === 'Pro Plan (Full Experience)' || data.data.subscriptionName === 'Pro Plan');
      

      
      return {
        isProPlan,
        planName: data.data.subscriptionName || 'Free Plan',
        status: data.data.subscriptionStatus || 'INACTIVE',
        planLimits: data.data.planLimits || {
          maxPlaylists: 1,
          maxTracksPerPlaylist: 2,
          maxTotalTracks: 2,
          persistentPlayback: false,
          fullCustomization: false,
          homepageOnly: true,
          autoplay: false
        }
      };
    }
    
          // Fallback to free plan if API fails
    return {
      isProPlan: false,
      planName: 'Free Plan',
      status: 'INACTIVE',
      planLimits: {
        maxPlaylists: 1,
        maxTracksPerPlaylist: 2,
        maxTotalTracks: 2,
        persistentPlayback: false,
        fullCustomization: false,
        homepageOnly: true,
        autoplay: false
      }
    };
  } catch (error) {

    // Fallback to free plan on error
    return {
      isProPlan: false,
      planName: 'Free Plan',
      status: 'INACTIVE',
      planLimits: {
        maxPlaylists: 1,
        maxTracksPerPlaylist: 2,
        maxTotalTracks: 2,
        persistentPlayback: false,
        fullCustomization: false,
        homepageOnly: true,
        autoplay: false
      }
    };
  }
}; 