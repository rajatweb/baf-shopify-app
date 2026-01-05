import express from "express";
import { PrismaClient } from "@prisma/client";
import verifyRequest from "../middleware/verifyRequest";
import multer from "multer";
import {
  getPlanLimits,
  validateTrackCreation,
  validateAddTrackToPlaylist,
  enforcePlanLimitsOnDowngrade,
} from "../utils/planEnforcement";
import {
  uploadFileToShopify,
  validateFileUpload,
  deleteFileFromShopify,
} from "../services/shopifyFileService";
import clientProvider from "../utils/clientProvider";

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Helper function to get subscription data
const getSubscriptionData = async (req: express.Request, res: express.Response) => {
  try {
    const { client } = await clientProvider.online.graphqlClient({ req, res });
    
    const GET_ACTIVE_SUBSCRIPTIONS = `
      query GetActiveSubscriptions {
        appInstallation {
          activeSubscriptions {
            id
            name
            status
          }
        }
      }
    `;
    
    const response = await client.request(GET_ACTIVE_SUBSCRIPTIONS);
    const subscriptions = response.data.appInstallation.activeSubscriptions;
    
    return subscriptions[0] || null;
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    return null;
  }
};

// ============================================================================
// PLAYLIST ENDPOINTS
// ============================================================================

// Get all playlists for a shop
router.get("/playlists", verifyRequest, async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;

    if (!shop) {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    const playlists = await prisma.playlist.findMany({
      where: {
        storeId: shop,
        isActive: true,
      },
      include: {
        tracks: {
          include: {
            track: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ data: playlists });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Select a playlist (only one can be selected per store)
router.post("/playlists/select", verifyRequest, async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;
    const { playlistId } = req.body;

    if (!shop) {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    if (!playlistId) {
      res.status(400).json({ error: "Playlist ID is required" });
      return;
    }

    // Validate that the playlist exists and belongs to this store
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        storeId: shop,
      },
    });

    if (!existingPlaylist) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    // Handle selection with fallback approach to avoid constraint issues
    // This approach is needed because the database might still have the old unique constraint
    // even after removing it from the schema, until a migration is run
    let selectedPlaylist;
    
    try {
      // Try transaction approach first (most efficient)
      selectedPlaylist = await prisma.$transaction(async (tx) => {
        console.log(`Attempting to select playlist ${playlistId} for shop ${shop}`);
        
        // First, unselect all playlists for this store
        await tx.playlist.updateMany({
          where: { storeId: shop },
          data: { isSelected: false }
        });

        // Then, select the specified playlist
        return await tx.playlist.update({
          where: {
            id: playlistId,
            storeId: shop,
          },
          data: {
            isSelected: true,
          },
          include: {
            tracks: {
              include: {
                track: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        });
      });
      
      console.log(`Successfully selected playlist ${playlistId} using transaction approach`);
    } catch (transactionError) {
      console.log("Transaction failed, trying fallback approach:", transactionError);
      
      // Fallback: handle selection manually (individual updates to avoid constraint issues)
      try {
        console.log(`Using fallback approach for playlist selection`);
        
        // Get all playlists for this store
        const allPlaylists = await prisma.playlist.findMany({
          where: { storeId: shop },
          select: { id: true }
        });

        console.log(`Found ${allPlaylists.length} playlists to unselect`);

        // Update each playlist individually to avoid constraint issues
        for (const playlist of allPlaylists) {
          await prisma.playlist.update({
            where: { id: playlist.id },
            data: { isSelected: false }
          });
        }

        // Then select the specified playlist
        selectedPlaylist = await prisma.playlist.update({
          where: {
            id: playlistId,
            storeId: shop,
          },
          data: {
            isSelected: true,
          },
          include: {
            tracks: {
              include: {
                track: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        });
        
        console.log(`Successfully selected playlist ${playlistId} using fallback approach`);
      } catch (fallbackError) {
        console.error("Both approaches failed:", fallbackError);
        res.status(500).json({ error: "Failed to select playlist after multiple attempts" });
        return;
      }
    }

    res.json({ data: selectedPlaylist });
  } catch (error) {
    console.error("Error selecting playlist:", error);
    res.status(500).json({ error: "Failed to select playlist" });
  }
});

// Create a new playlist
router.post("/playlists", verifyRequest, async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: "Shop and name are required" });
      return;
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { shop },
    });

    if (!store) {
      res.status(404).json({ error: "Store not found. Please ensure the app is properly installed." });
      return;
    }

    // Check if this is the first playlist for this store
    const existingPlaylists = await prisma.playlist.count({
      where: {
        storeId: shop,
      },
    });

    // Check playlist limits for free plan (max 1 playlist for free plan)
    const subscriptionData = await getSubscriptionData(req, res);
    const isProPlan = subscriptionData?.status === "ACTIVE" && subscriptionData?.name === "Pro Plan (Full Experience)";
    
    if (!isProPlan && existingPlaylists >= 2) {
      res.status(403).json({ 
        error: "Playlist limit reached. Upgrade to Pro for unlimited playlists." 
      });
      return;
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        storeId: shop,
        isSelected: existingPlaylists === 0, // Auto-select if it's the first playlist
      },
    });

    res.json({ data: playlist });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

// Update a playlist
router.put("/playlists/:id", verifyRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    res.json({ data: playlist });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({ error: "Failed to update playlist" });
  }
});

// Delete a playlist
router.delete("/playlists/:id", verifyRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const shop = res.locals.user_session.shop;

    // Get playlist details before deleting
    const playlistToDelete = await prisma.playlist.findUnique({
      where: { id },
      select: { 
        isSelected: true,
        name: true 
      },
    });

    if (!playlistToDelete) {
      res.status(404).json({ error: "Playlist not found" });
      return;
    }

    // Get all tracks in this playlist before deleting
    const playlistTracks = await prisma.playlistTrack.findMany({
      where: { playlistId: id },
      include: { track: true },
    });

    // Delete the playlist (this will cascade delete playlistTrack relationships)
    await prisma.playlist.delete({
      where: { id },
    });

    // Delete the actual track files from Shopify CDN and mark tracks as inactive
    for (const playlistTrack of playlistTracks) {
      const track = playlistTrack.track;
      
      // Delete audio file from Shopify CDN if it exists
      if (track.audioFileId) {
        try {
          await deleteFileFromShopify(req, res, track.audioFileId);
        } catch (error) {
          console.error(`Failed to delete audio file for track ${track.id}:`, error);
        }
      }

      // Delete album art from Shopify CDN if it exists
      if (track.albumArtFileId) {
        try {
          await deleteFileFromShopify(req, res, track.albumArtFileId);
        } catch (error) {
          console.error(`Failed to delete album art for track ${track.id}:`, error);
        }
      }

      // Delete the track completely from database
      await prisma.track.delete({
        where: { id: track.id },
      });
    }

    // If the deleted playlist was selected, select another playlist
    if (playlistToDelete.isSelected) {
      const remainingPlaylists = await prisma.playlist.findFirst({
        where: {
          storeId: shop,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (remainingPlaylists) {
        await prisma.playlist.update({
          where: { id: remainingPlaylists.id },
          data: { isSelected: true },
        });
      }
    }

    res.json({ 
      message: `Playlist "${playlistToDelete.name}" and all its tracks have been permanently deleted.`,
      deletedPlaylistId: id,
      deletedTracksCount: playlistTracks.length
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
});

// ============================================================================
// TRACK ENDPOINTS
// ============================================================================

// Get all tracks for a shop
router.get("/tracks", verifyRequest, async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;

    if (!shop) {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    const tracks = await prisma.track.findMany({
      where: {
        storeId: shop,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ data: tracks });
  } catch (error) {
    console.error("Error fetching tracks:", error);
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

// Create a new track with file upload
router.post("/tracks", verifyRequest, upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'albumArtFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;
    const { title, artist } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Note: Duration will be automatically extracted from MP3 metadata
    // No manual duration input is required
    // TODO: Implement MP3 metadata extraction to get actual duration

    if (!title || !artist) {
      res.status(400).json({ error: "Title and artist are required" });
      return;
    }

    // Get subscription data for plan enforcement
    const subscriptionData = await getSubscriptionData(req, res);
    const shopDomain = res.locals.user_session.shop;

    // Validate track creation
    const validation = await validateTrackCreation(
      shop,
      subscriptionData || undefined
    );
    
    if (!validation.valid) {
      res.status(403).json({ error: validation.message });
      return;
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { shop },
    });

    if (!store) {
      res.status(404).json({ error: "Store not found. Please ensure the app is properly installed." });
      return;
    }

    let audioUrl = '';
    let albumArtUrl = '';
    let audioFileId = '';
    let albumArtFileId = '';

    // Handle audio: either file upload or URL
    if (files.audioFile && files.audioFile[0]) {
      // File upload path
      const audioFile = files.audioFile[0];
      
      // Validate audio file
      const audioValidation = validateFileUpload(audioFile);
      if (!audioValidation.valid) {
        res.status(400).json({ error: audioValidation.error });
        return;
      }

      const audioResult = await uploadFileToShopify(
        req,
        res,
        audioFile.buffer,
        audioFile.originalname,
        audioFile.mimetype
      );

      audioUrl = audioResult.url;
      audioFileId = audioResult.fileId;
    } else if (req.body.audioUrl) {
      // URL path - use the provided URL directly
      audioUrl = req.body.audioUrl;
      // No fileId since it's an external URL
    } else {
      res.status(400).json({ error: "Either audio file or audio URL is required" });
      return;
    }

    // Handle album art: either file upload or URL
    if (files.albumArtFile && files.albumArtFile[0]) {
      // File upload path
      const albumArtFile = files.albumArtFile[0];
      
      // Validate album art file
      const albumArtValidation = validateFileUpload(albumArtFile);
      if (!albumArtValidation.valid) {
        res.status(400).json({ error: albumArtValidation.error });
        return;
      }

      const albumArtResult = await uploadFileToShopify(
        req,
        res,
        albumArtFile.buffer,
        albumArtFile.originalname,
        albumArtFile.mimetype
      );

      albumArtUrl = albumArtResult.url;
      albumArtFileId = albumArtResult.fileId;
    } else if (req.body.albumArtUrl) {
      // URL path - use the provided URL directly
      albumArtUrl = req.body.albumArtUrl;
      // No fileId since it's an external URL
    }
    // Note: album art is optional, so no error if neither is provided

    const track = await prisma.track.create({
      data: {
        title,
        artist,
        albumArt: albumArtUrl || null,
        audioUrl,
        duration: null, // Will be extracted from MP3 metadata
        fileSize: files.audioFile ? files.audioFile[0].size : null,
        albumArtFileId: albumArtFileId || null,
        audioFileId: audioFileId || null,
        storeId: shop,
      },
    });

    res.json({ data: track });
  } catch (error) {
    console.error("Error creating track:", error);
    res.status(500).json({ error: "Failed to create track" });
  }
});

// Update a track
router.put("/tracks/:id", verifyRequest, upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'albumArtFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Note: Duration is automatically extracted from MP3 metadata
    // Cannot be manually updated

    // Get existing track to check for file deletion
    const existingTrack = await prisma.track.findUnique({
      where: { id },
    });

    if (!existingTrack) {
      res.status(404).json({ error: "Track not found" });
      return;
    }

    let audioUrl = existingTrack.audioUrl;
    let albumArtUrl = existingTrack.albumArt;
    let audioFileId = existingTrack.audioFileId;
    let albumArtFileId = existingTrack.albumArtFileId;

    // Handle audio file update: either file upload or URL
    if (files.audioFile && files.audioFile[0]) {
      // File upload path
      const audioFile = files.audioFile[0];
      
      // Validate audio file
      const audioValidation = validateFileUpload(audioFile);
      if (!audioValidation.valid) {
        res.status(400).json({ error: audioValidation.error });
        return;
      }

      // Delete old audio file if it exists
      if (existingTrack.audioFileId) {
        await deleteFileFromShopify(req, res, existingTrack.audioFileId);
      }

      const audioResult = await uploadFileToShopify(
        req,
        res,
        audioFile.buffer,
        audioFile.originalname,
        audioFile.mimetype
      );

      audioUrl = audioResult.url;
      audioFileId = audioResult.fileId;
    } else if (req.body.audioUrl) {
      // URL path - use the provided URL directly
      audioUrl = req.body.audioUrl;
      // Clear fileId since it's now an external URL
      audioFileId = null;
    }

    // Handle album art update: either file upload or URL
    if (files.albumArtFile && files.albumArtFile[0]) {
      // File upload path
      const albumArtFile = files.albumArtFile[0];
      
      // Validate album art file
      const albumArtValidation = validateFileUpload(albumArtFile);
      if (!albumArtValidation.valid) {
        res.status(400).json({ error: albumArtValidation.error });
        return;
      }

      // Delete old album art file if it exists
      if (existingTrack.albumArtFileId) {
        await deleteFileFromShopify(req, res, existingTrack.albumArtFileId);
      }

      const albumArtResult = await uploadFileToShopify(
        req,
        res,
        albumArtFile.buffer,
        albumArtFile.originalname,
        albumArtFile.mimetype
      );

      albumArtUrl = albumArtResult.url;
      albumArtFileId = albumArtResult.fileId;
    } else if (req.body.albumArtUrl) {
      // URL path - use the provided URL directly
      albumArtUrl = req.body.albumArtUrl;
      // Clear fileId since it's now an external URL
      albumArtFileId = null;
    }

    const track = await prisma.track.update({
      where: { id },
      data: {
        title,
        artist,
        albumArt: albumArtUrl,
        audioUrl,
        duration: null, // Duration is extracted from MP3 metadata and cannot be manually updated
        fileSize: files.audioFile ? files.audioFile[0].size : existingTrack.fileSize,
        albumArtFileId,
        audioFileId,
      },
    });

    res.json({ data: track });
  } catch (error) {
    console.error("Error updating track:", error);
    res.status(500).json({ error: "Failed to update track" });
  }
});

// Delete a track
router.delete("/tracks/:id", verifyRequest, async (req, res) => {
  try {
    const { id } = req.params;

    // Get track to delete associated files
    const track = await prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      res.status(404).json({ error: "Track not found" });
      return;
    }

    // Delete files from Shopify
    if (track.audioFileId) {
      await deleteFileFromShopify(req, res, track.audioFileId);
    }
    if (track.albumArtFileId) {
      await deleteFileFromShopify(req, res, track.albumArtFileId);
    }

    await prisma.track.delete({
      where: { id },
    });

    res.json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error("Error deleting track:", error);
    res.status(500).json({ error: "Failed to delete track" });
  }
});

// ============================================================================
// PLAYLIST TRACK MANAGEMENT
// ============================================================================

// Add track to playlist
router.post("/playlists/:playlistId/tracks", verifyRequest, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { trackId, order } = req.body;

    if (!trackId) {
      res.status(400).json({ error: "Track ID is required" });
      return;
    }

    // Get subscription data for plan enforcement
    const subscriptionData = await getSubscriptionData(req, res);
    const shopDomain = res.locals.user_session.shop;

    // Validate adding track to playlist
    const validation = await validateAddTrackToPlaylist(
      shopDomain,
      playlistId,
      subscriptionData || undefined
    );
    
    if (!validation.valid) {
      res.status(403).json({ error: validation.message });
      return;
    }

    const playlistTrack = await prisma.playlistTrack.create({
      data: {
        playlistId,
        trackId,
        order: order || 0,
      },
      include: {
        track: true,
      },
    });

    res.json({ data: playlistTrack });
  } catch (error) {
    console.error("Error adding track to playlist:", error);
    res.status(500).json({ error: "Failed to add track to playlist" });
  }
});

// Remove track from playlist
router.delete("/playlists/:playlistId/tracks/:trackId", verifyRequest, async (req, res) => {
  try {
    const { playlistId, trackId } = req.params;

    // Remove track from this playlist
    await prisma.playlistTrack.delete({
      where: {
        playlistId_trackId: {
          playlistId,
          trackId,
        },
      },
    });

    // Check if this track is used in any other playlists
    const trackUsage = await prisma.playlistTrack.count({
      where: { trackId },
    });

    // If track is not used in any other playlists, delete it completely
    if (trackUsage === 0) {
      const track = await prisma.track.findUnique({
        where: { id: trackId },
      });

      if (track) {
        // Delete files from Shopify CDN
        if (track.audioFileId) {
          await deleteFileFromShopify(req, res, track.audioFileId);
        }
        if (track.albumArtFileId) {
          await deleteFileFromShopify(req, res, track.albumArtFileId);
        }

        // Delete the track from database
        await prisma.track.delete({
          where: { id: trackId },
        });
      }
    }

    res.json({ message: "Track removed from playlist successfully" });
  } catch (error) {
    console.error("Error removing track from playlist:", error);
    res.status(500).json({ error: "Failed to remove track from playlist" });
  }
});

// Update track order in playlist
router.put("/playlists/:playlistId/tracks/order", verifyRequest, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { trackOrders } = req.body; // Array of { trackId, order }

    if (!Array.isArray(trackOrders)) {
      res.status(400).json({ error: "trackOrders must be an array" });
      return;
    }

    // Update each track's order
    for (const { trackId, order } of trackOrders) {
      await prisma.playlistTrack.update({
        where: {
          playlistId_trackId: {
            playlistId,
            trackId,
          },
        },
        data: { order },
      });
    }

    res.json({ message: "Track order updated successfully" });
  } catch (error) {
    console.error("Error updating track order:", error);
    res.status(500).json({ error: "Failed to update track order" });
  }
});

// ============================================================================
// SETTINGS ENDPOINTS
// ============================================================================

// Get music player settings
router.get("/settings", verifyRequest, async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;

    if (!shop) {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    // Get store settings
    const store = await prisma.store.findUnique({
      where: { shop },
      select: {
        musicPlayerSettings: true,
      },
    });

    // Get subscription data
    const subscriptionData = await getSubscriptionData(req, res);

    // Combine settings with subscription info
    const responseData = {
      ...(store?.musicPlayerSettings as Record<string, any> || {}),
      subscriptionStatus: subscriptionData?.status || null,
      subscriptionName: subscriptionData?.name || null,
    };

    res.json({ 
      success: true,
      data: responseData 
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Update music player settings
router.put("/settings", verifyRequest, async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;
    const { musicPlayerSettings } = req.body;

    if (!shop) {
      res.status(400).json({ error: "Shop is required" });
      return;
    }

    const store = await prisma.store.upsert({
      where: { shop },
      update: {
        musicPlayerSettings,
      },
      create: {
        shop,
        musicPlayerSettings,
      },
    });

    res.json({ data: store });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// ============================================================================
// PLAN ENFORCEMENT ENDPOINTS
// ============================================================================

// Enforce plan limits (called during subscription cancellation)
router.post("/enforce-plan-limits", verifyRequest, async (req, res) => {
  try {
    const shopDomain = res.locals.user_session.shop;
    
    // Enforce plan limits on downgrade
    await enforcePlanLimitsOnDowngrade(shopDomain, {
      status: "INACTIVE",
      name: "Free Plan"
    });
    
    res.json({ message: "Plan limits enforced successfully" });
  } catch (error) {
    console.error("Error enforcing plan limits:", error);
    res.status(500).json({ error: "Failed to enforce plan limits" });
  }
});

export default router;
