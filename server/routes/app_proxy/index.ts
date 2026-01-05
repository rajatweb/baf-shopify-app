import express from "express";
import prisma from "../../utils/prisma";
import clientProvider from "../../utils/clientProvider";
import {
  getSubscriptionData,
  getPlanLimits,
} from "../../utils/planEnforcement";

const router = express.Router();

router.get("/", async (req, res) => {
  const { client } = await clientProvider.offline.graphqlClient({
    shop: res.locals.user_shop,
  });
  res.status(200).send({ content: "Proxy Be Working" });
});

// GET /api/app-proxy/music-player/settings
router.get("/music-player/settings", async (req, res) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== "string") {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    // Get store settings
    const store = await prisma.store.findUnique({
      where: { shop: shop as string },
      select: {
        musicPlayerSettings: true,
      },
    });

    if (!store) {
      res.status(404).json({ error: "Store not found" });
      return;
    }

    // Get subscription data
    const subscriptionData = await getSubscriptionData(shop as string);
    const planLimits = getPlanLimits(subscriptionData || undefined);

    // Return settings with subscription data and plan limits
    const appProxyUrl = `${req.protocol}://${req.get("host")}/api/app-proxy`;

    res.json({
      success: true,
      data: {
        ...(store?.musicPlayerSettings as Record<string, any>),
        appProxyUrl,
        // Subscription information
        subscriptionStatus: subscriptionData?.status || "INACTIVE",
        subscriptionName: subscriptionData?.name || "Free Plan",
        // Plan limits
        planLimits: {
          maxPlaylists: planLimits.maxPlaylists,
          maxTracksPerPlaylist: planLimits.maxTracksPerPlaylist,
          maxTotalTracks: planLimits.maxTotalTracks,
          fullCustomization: planLimits.fullCustomization,
          homepageOnly: planLimits.homepageOnly,
        },
        // Current usage (for display purposes)
        currentUsage: {
          playlists: await prisma.playlist.count({
            where: { storeId: shop as string, isActive: true },
          }),
          totalTracks: await prisma.track.count({
            where: { storeId: shop as string, isActive: true },
          }),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching music player settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/app-proxy/music-player/playlists
router.get("/music-player/playlists", async (req, res) => {
  try {
    const { shop } = req.query;

    if (!shop || typeof shop !== "string") {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    // Get subscription data for plan enforcement
    const subscriptionData = await getSubscriptionData(shop as string);
    const planLimits = getPlanLimits(subscriptionData || undefined);

    // Get store with playlists and tracks
    const store = await prisma.store.findUnique({
      where: { shop: shop as string },
      include: {
        playlists: {
          where: { isActive: true },
          include: {
            tracks: {
              where: { track: { isActive: true } },
              include: {
                track: {
                  select: {
                    id: true,
                    title: true,
                    artist: true,
                    duration: true,
                    albumArt: true,
                    audioUrl: true,
                  },
                },
              },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!store) {
      res.status(404).json({ error: "Store not found" });
      return;
    }

    // Filter out playlists with no tracks
    const playlistsWithTracks = store?.playlists?.filter(
      (playlist: any) => playlist?.tracks?.length > 0
    );

    // Get the selected playlist (only one should be selected per store)
    const selectedPlaylist = store?.playlists?.find(
      (playlist: any) => playlist.isSelected === true
    );

    // Apply plan limits for free plan
    let finalPlaylists = playlistsWithTracks;
    if (planLimits.maxPlaylists === 1 && playlistsWithTracks.length > 1) {
      // Free plan: only show the first playlist
      finalPlaylists = [playlistsWithTracks[0]];
    }

    // Apply track limits for free plan
    if (planLimits.maxTracksPerPlaylist === 2) {
      finalPlaylists = finalPlaylists.map((playlist: any) => ({
        ...playlist,
        tracks: playlist.tracks.slice(0, 2), // Only first 2 tracks
      }));
    }

    res.json({
      success: true,
      data: {
        playlists: finalPlaylists,
        selectedPlaylist: selectedPlaylist || null,
        planLimits: {
          maxPlaylists: planLimits.maxPlaylists,
          maxTracksPerPlaylist: planLimits.maxTracksPerPlaylist,
          homepageOnly: planLimits.homepageOnly,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

export default router;
