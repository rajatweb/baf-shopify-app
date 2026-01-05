import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  TextField,
  Modal,
  InlineStack,
  Text,
  BlockStack,
  Badge,
  ButtonGroup,
  Thumbnail,
  Banner,
  EmptyState,
} from "@shopify/polaris";
import {
  PlusIcon,
  EditIcon,
  DeleteIcon,
  PlayIcon,
} from "@shopify/polaris-icons";

import type { Playlist, Track } from "../../store/api/music-player/types";
import {
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useSelectPlaylistMutation,
  useCreateTrackMutation,
  useUpdateTrackMutation,
  useAddTrackToPlaylistMutation,
  useRemoveTrackFromPlaylistMutation,
} from "../../store/api/music-player";
import { useGetActiveSubscriptionsQuery } from "../../store/api/subscriptions";
import {
  getCurrentPlan,
  isTotalTrackLimitReached,
  getPlanDataFromBackend,
} from "../../utils/planUtils";

interface PlaylistManagerProps {
  shop: string;
  playlists: Playlist[];
  tracks: Track[];
  onPlaylistSelect: (playlist: Playlist) => void;
  onDataChange?: () => void;
  onPlaylistDeleted?: (deletedPlaylistId: string) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  shop,
  playlists,
  tracks,
  onPlaylistSelect,
  onDataChange,
  onPlaylistDeleted,
}) => {
  
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [showEditPlaylistModal, setShowEditPlaylistModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [selectedPlaylistForTracks, setSelectedPlaylistForTracks] =
    useState<Playlist | null>(null);

  // Form states
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");

  // Edit track modal state
  const [showEditTrackModal, setShowEditTrackModal] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<{
    id: string;
    title: string;
    artist: string;
    playlistId: string;
  } | null>(null);

  // File upload states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [albumArtFile, setAlbumArtFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [albumArtUrl, setAlbumArtUrl] = useState("");
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [originalAlbumArtUrl, setOriginalAlbumArtUrl] = useState<string | null>(null);
  const [showAudioUploadOptions, setShowAudioUploadOptions] = useState(false);
  const [showAlbumArtUploadOptions, setShowAlbumArtUploadOptions] =
    useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Get subscription data for plan enforcement
  const { data: subscriptions } = useGetActiveSubscriptionsQuery();
  const currentPlan = getCurrentPlan(subscriptions);

  // Single source of truth for plan data
  const [planData, setPlanData] = useState<{
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
  } | null>(null);

  // Fetch plan data from backend on component mount
  useEffect(() => {
    const fetchPlanData = async () => {
      if (shop) {
        const data = await getPlanDataFromBackend(shop);
        setPlanData(data);
      }
    };
    fetchPlanData();
  }, [shop]);

  // Use single source of truth if available, fallback to RTK Query data
  const finalPlanData = planData || {
    isProPlan: currentPlan === 'pro',
    planName: subscriptions?.data?.[0]?.name || 'Free Plan',
    status: subscriptions?.data?.[0]?.status || 'INACTIVE',
    planLimits: {}
  };

  // Helper function to check if create playlist button should be disabled
  const isCreatePlaylistDisabled = () => {

    
    if (finalPlanData.isProPlan) {
      return false; // Pro plan: unlimited playlists
    }
    return playlists.length >= 1; // Free plan: only 1 playlist allowed
  };

  // Helper function to get create playlist button text
  const getCreatePlaylistButtonText = () => {
    if (finalPlanData.isProPlan) {
      return 'Create Playlist';
    }
    return playlists.length === 0 ? 'Create Playlist' : 'Upgrade to Pro for More';
  };

  

  // API mutations
  const [createPlaylist] = useCreatePlaylistMutation();
  const [updatePlaylist] = useUpdatePlaylistMutation();
  const [deletePlaylist] = useDeletePlaylistMutation();
  const [selectPlaylist] = useSelectPlaylistMutation();
  const [createTrack] = useCreateTrackMutation();
  const [updateTrack] = useUpdateTrackMutation();
  const [addTrackToPlaylist] = useAddTrackToPlaylistMutation();
  const [removeTrackFromPlaylist] = useRemoveTrackFromPlaylistMutation();

  const handleCreatePlaylist = async () => {
    try {
      await createPlaylist({
        shop,
        name: playlistName,
        description: playlistDescription,
      }).unwrap();

      setShowCreatePlaylistModal(false);
      setPlaylistName("");
      setPlaylistDescription("");
      onDataChange?.();
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const handleUpdatePlaylist = async () => {
    if (!editingPlaylist) return;

    try {
      await updatePlaylist({
        id: editingPlaylist.id,
        data: {
          name: playlistName,
          description: playlistDescription,
        },
      }).unwrap();

      setShowEditPlaylistModal(false);
      setEditingPlaylist(null);
      setPlaylistName("");
      setPlaylistDescription("");
      onDataChange?.();
    } catch (error) {
      console.error("Failed to update playlist:", error);
    }
  };

  const handleDeletePlaylist = (playlist: Playlist) => {
    setPlaylistToDelete(playlist);
    setShowDeleteConfirmationModal(true);
  };

  const confirmDeletePlaylist = async () => {
    if (!playlistToDelete) return;
    
    try {
      await deletePlaylist(playlistToDelete.id).unwrap();
      onPlaylistDeleted?.(playlistToDelete.id);
      onDataChange?.();
      setShowDeleteConfirmationModal(false);
      setPlaylistToDelete(null);
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  const cancelDeletePlaylist = () => {
    setShowDeleteConfirmationModal(false);
    setPlaylistToDelete(null);
  };

  const handleCreateTrack = async () => {
    if ((!audioFile && !audioUrl) || !selectedPlaylistForTracks) {
      setUploadError("Audio file/URL and playlist selection are required");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("shop", shop);
      formData.append("title", trackTitle);
      formData.append("artist", trackArtist);
  
      // Handle audio: either file upload or URL
      if (audioFile) {
        formData.append("audioFile", audioFile);
      } else if (audioUrl) {
        formData.append("audioUrl", audioUrl);
      }

      // Handle album art: either file upload or URL
      if (albumArtFile) {
        formData.append("albumArtFile", albumArtFile);
      } else if (albumArtUrl) {
        formData.append("albumArtUrl", albumArtUrl);
      }

      const trackResponse = await createTrack(formData).unwrap();

      // Automatically add the track to the selected playlist
      await addTrackToPlaylist({
        playlistId: selectedPlaylistForTracks.id,
        data: { trackId: trackResponse.data.id },
      }).unwrap();

      setShowAddTrackModal(false);
      setTrackTitle("");
      setTrackArtist("");
      setAudioFile(null);
      setAlbumArtFile(null);
      setAudioUrl("");
      setAlbumArtUrl("");
      setSelectedPlaylistForTracks(null);
      onDataChange?.();
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Failed to create track:", error);
      setUploadError(error.data?.error || "Failed to create track");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveTrackFromPlaylist = async (
    playlistId: string,
    trackId: string
  ) => {
    try {
      await removeTrackFromPlaylist({ playlistId, trackId }).unwrap();
      onDataChange?.();
    } catch (error) {
      console.error("Failed to remove track from playlist:", error);
    }
  };

  const handleEditTrack = (track: Track, playlistId: string) => {
    setTrackToEdit({
      id: track.id,
      title: track.title,
      artist: track.artist,
      playlistId,
    });
    setTrackTitle(track.title);
    setTrackArtist(track.artist);
    // Store original values for display
    setOriginalAudioUrl(track.audioUrl || null);
    setOriginalAlbumArtUrl(track.albumArt || null);
    // Clear any previously selected files/URLs
    setAudioFile(null);
    setAlbumArtFile(null);
    setAudioUrl("");
    setAlbumArtUrl("");
    setShowAudioUploadOptions(false);
    setShowAlbumArtUploadOptions(false);
    setShowEditTrackModal(true);
  };

  const handleCloseEditTrackModal = () => {
    setShowEditTrackModal(false);
    setTrackToEdit(null);
    setTrackTitle("");
    setTrackArtist("");
    setAudioFile(null);
    setAlbumArtFile(null);
    setAudioUrl("");
    setAlbumArtUrl("");
    setOriginalAudioUrl(null);
    setOriginalAlbumArtUrl(null);
    setShowAudioUploadOptions(false);
    setShowAlbumArtUploadOptions(false);
  };

  const handleUpdateTrack = async () => {
    if (!trackToEdit) return;

    try {
      const formData = new FormData();
      formData.append("title", trackTitle);
      formData.append("artist", trackArtist);
      
      // Add files or URLs if they were changed
      if (audioFile) {
        formData.append("audioFile", audioFile);
      } else if (audioUrl) {
        formData.append("audioUrl", audioUrl);
      }
      if (albumArtFile) {
        formData.append("albumArtFile", albumArtFile);
      } else if (albumArtUrl) {
        formData.append("albumArtUrl", albumArtUrl);
      }

      await updateTrack({
        id: trackToEdit.id,
        data: formData,
      }).unwrap();

      setShowEditTrackModal(false);
      setTrackToEdit(null);
      setTrackTitle("");
      setTrackArtist("");
      setAudioFile(null);
      setAlbumArtFile(null);
      setAudioUrl("");
      setAlbumArtUrl("");
      setOriginalAudioUrl(null);
      setOriginalAlbumArtUrl(null);
      onDataChange?.();
    } catch (error) {
      console.error("Failed to update track:", error);
    }
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setPlaylistName(playlist.name);
    setPlaylistDescription(playlist.description || "");
    setShowEditPlaylistModal(true);
  };

  const handleAddTrackToPlaylist = (playlist: Playlist) => {
    setSelectedPlaylistForTracks(playlist);
    setShowAddTrackModal(true);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getPlanLimitInfo = () => {
    if (finalPlanData.isProPlan) {
      return null; // No limits for pro plan
    }

    const totalTracks = tracks.length;
    const totalPlaylists = playlists.length;
    const isTrackLimitReached = isTotalTrackLimitReached(
      totalTracks,
      currentPlan
    );
    const isPlaylistLimitReached = totalPlaylists >= 1; // Free plan: max 1 playlist

    return (
      <Banner tone="warning">
        <BlockStack gap="200">
          <Text as="p" variant="bodySm">
            <strong>Free Plan Limits:</strong>
          </Text>
          <Text as="p" variant="bodySm">
            • Maximum 1 playlist ({totalPlaylists}/1 used)
          </Text>
          <Text as="p" variant="bodySm">
            • Maximum 2 tracks per playlist
          </Text>
          <Text as="p" variant="bodySm">
            • Full-length tracks (no time limit)
          </Text>
          {isPlaylistLimitReached && (
            <Text as="p" variant="bodySm" tone="critical">
              You've reached the playlist limit. Upgrade to Pro for unlimited playlists.
            </Text>
          )}
          {isTrackLimitReached && (
            <Text as="p" variant="bodySm" tone="critical">
              You've reached the track limit. Upgrade to Pro for unlimited tracks.
            </Text>
          )}
        </BlockStack>
      </Banner>
    );
  };

  return (
    <BlockStack gap="500">
      {getPlanLimitInfo()}

      {/* Playlists Section */}
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Your Playlists
              </Text>
              {/* Debug: Show current plan status */}
              <Text variant="bodySm" tone="subdued" as="p">
                Current Plan: {finalPlanData.planName} 
                {finalPlanData.status && ` (${finalPlanData.status})`}
              </Text>
            </BlockStack>
            <InlineStack gap="200">
              <Button
                icon={PlusIcon}
                onClick={() => setShowCreatePlaylistModal(true)}
                variant="primary"
                disabled={isCreatePlaylistDisabled()}
              >
                {getCreatePlaylistButtonText()}
              </Button>
            </InlineStack>
          </InlineStack>

          {playlists.length === 0 ? (
            <EmptyState heading="No playlists yet" image="">
              <Text as="p">
                Create your first playlist to start organizing your music.
              </Text>
              <Button
                icon={PlusIcon}
                onClick={() => setShowCreatePlaylistModal(true)}
                variant="primary"
                disabled={isCreatePlaylistDisabled()}
              >
                {getCreatePlaylistButtonText()}
              </Button>
            </EmptyState>
          ) : (
            <BlockStack gap="300">
              {playlists.map((playlist) => (
                <Card key={playlist.id} padding="400">
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="200">
                        <InlineStack
                          gap="200"
                          align="start"
                          blockAlign="center"
                        >
                          <Text variant="bodyMd" fontWeight="semibold" as="p">
                            {playlist.name}
                          </Text>
                        </InlineStack>
                        {playlist.description && (
                          <Text as="p" variant="bodySm" tone="subdued">
                            {playlist.description}
                          </Text>
                        )}
                        <Text as="p" variant="bodySm" tone="subdued">
                          {playlist.tracks.length} tracks
                        </Text>
                      </BlockStack>
                      <ButtonGroup>
                        {/* Show Active button for selected playlist, or Select button for others */}
                        {(finalPlanData.isProPlan || playlists.length > 1) && (
                          playlist.isSelected ? (
                            <Badge tone="success">Active</Badge>
                          ) : (
                            <Button
                              icon={PlayIcon}
                              onClick={async () => {
                                try {
                                  // Update the database to mark this playlist as selected
                                  await selectPlaylist({
                                    playlistId: playlist.id,
                                    shop: shop,
                                  }).unwrap();

                                  // Call the parent callback
                                  onPlaylistSelect(playlist);
                                } catch (error) {
                                  console.error(
                                    "Failed to select playlist:",
                                    error
                                  );
                                }
                              }}
                              variant="secondary"
                              size="slim"
                            >
                              Publish
                            </Button>
                          )
                        )}
                        
                        {/* Only show Add Track button for Pro plan or if track limit not reached */}
                        {(finalPlanData.isProPlan || !isTotalTrackLimitReached(tracks.length, currentPlan)) && (
                          <Button
                            icon={PlusIcon}
                            onClick={() => handleAddTrackToPlaylist(playlist)}
                            variant="secondary"
                            size="slim"
                            disabled={
                              isTotalTrackLimitReached(tracks.length, currentPlan) ||
                              (currentPlan !== 'pro' && playlist.tracks.length >= 2)
                            }
                          >
                            Add Track
                          </Button>
                        )}
                        <Button
                          icon={EditIcon}
                          onClick={() => handleEditPlaylist(playlist)}
                          variant="secondary"
                          size="slim"
                        >
                          Edit
                        </Button>
                        <Button
                          icon={DeleteIcon}
                          onClick={() => handleDeletePlaylist(playlist)}
                          variant="secondary"
                          size="slim"
                          tone="critical"
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </InlineStack>

                    {/* Show tracks in this playlist */}
                    {playlist.tracks.length > 0 && (
                      <BlockStack gap="300">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text as="p" variant="bodyMd" fontWeight="semibold">
                            Tracks in this playlist ({playlist.tracks.length})
                          </Text>
                          <Badge tone="info">
                            {`${playlist.tracks.length} track${
                              playlist.tracks.length !== 1 ? "s" : ""
                            }`}
                          </Badge>
                        </InlineStack>

                        <Card padding="300">
                          <BlockStack gap="200">
                            {playlist.tracks.map((playlistTrack) => (
                              <div
                                key={playlistTrack.id}
                                className="track-item"
                              >
                                <InlineStack gap="300" blockAlign="center">
                                  <InlineStack gap="200" blockAlign="center">
                                    <Thumbnail
                                      source={
                                        playlistTrack.track.albumArt ||
                                        "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"
                                      }
                                      alt={playlistTrack.track.title}
                                      size="small"
                                    />
                                    <BlockStack gap="100">
                                      <InlineStack
                                        gap="200"
                                        blockAlign="center"
                                      >
                                        <Text
                                          as="p"
                                          variant="bodyMd"
                                          fontWeight="medium"
                                        >
                                          {playlistTrack.track.title}
                                        </Text>
                                      </InlineStack>
                                      <Text
                                        as="p"
                                        variant="bodySm"
                                        tone="subdued"
                                      >
                                        {playlistTrack.track.artist}
                                      </Text>
                                      {playlistTrack.track.duration && (
                                        <InlineStack
                                          gap="200"
                                          blockAlign="center"
                                        >
                                          <Text
                                            as="p"
                                            variant="bodySm"
                                            tone="subdued"
                                          >
                                            ⏱️{" "}
                                            {formatDuration(
                                              playlistTrack.track.duration
                                            )}
                                          </Text>
                                          {playlistTrack.track.fileSize && (
                                            <Text
                                              as="p"
                                              variant="bodySm"
                                              tone="subdued"
                                            >
                                              📁{" "}
                                              {(
                                                playlistTrack.track.fileSize /
                                                (1024 * 1024)
                                              ).toFixed(1) + " MB"}
                                            </Text>
                                          )}
                                        </InlineStack>
                                      )}
                                    </BlockStack>
                                  </InlineStack>

                                  <InlineStack gap="200" blockAlign="center">
                                    <Button
                                      onClick={() =>
                                        handleEditTrack(
                                          playlistTrack.track,
                                          playlist.id
                                        )
                                      }
                                      variant="tertiary"
                                      size="slim"
                                      icon={EditIcon}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleRemoveTrackFromPlaylist(
                                          playlist.id,
                                          playlistTrack.track.id
                                        )
                                      }
                                      variant="tertiary"
                                      size="slim"
                                      tone="critical"
                                      icon={DeleteIcon}
                                    >
                                      Remove
                                    </Button>
                                  </InlineStack>
                                </InlineStack>
                              </div>
                            ))}
                          </BlockStack>
                        </Card>
                      </BlockStack>
                    )}
                  </BlockStack>
                </Card>
              ))}
            </BlockStack>
          )}
        </BlockStack>
      </Card>

      {/* Create Playlist Modal */}
      <Modal
        open={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        title="Create Playlist"
        primaryAction={{
          content: "Create",
          onAction: handleCreatePlaylist,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowCreatePlaylistModal(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Playlist Name"
              value={playlistName}
              onChange={setPlaylistName}
              autoComplete="off"
            />
            <TextField
              label="Description (optional)"
              value={playlistDescription}
              onChange={setPlaylistDescription}
              autoComplete="off"
              multiline={3}
            />
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Edit Playlist Modal */}
      <Modal
        open={showEditPlaylistModal}
        onClose={() => setShowEditPlaylistModal(false)}
        title="Edit Playlist"
        primaryAction={{
          content: "Save",
          onAction: handleUpdatePlaylist,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowEditPlaylistModal(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Playlist Name"
              value={playlistName}
              onChange={setPlaylistName}
              autoComplete="off"
            />
            <TextField
              label="Description (optional)"
              value={playlistDescription}
              onChange={setPlaylistDescription}
              autoComplete="off"
              multiline={3}
            />
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Add Track to Playlist Modal */}
      <Modal
        open={showAddTrackModal}
        onClose={() => setShowAddTrackModal(false)}
        title={`Add Track to ${selectedPlaylistForTracks?.name || "Playlist"}`}
        primaryAction={{
          content: isUploading ? "Uploading..." : "Add Track",
          onAction: handleCreateTrack,
          loading: isUploading,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowAddTrackModal(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            {uploadError && (
              <Banner tone="critical">
                <Text as="p">{uploadError}</Text>
              </Banner>
            )}

            <TextField
              label="Track Title"
              value={trackTitle}
              onChange={setTrackTitle}
              autoComplete="off"
            />

            <TextField
              label="Artist"
              value={trackArtist}
              onChange={setTrackArtist}
              autoComplete="off"
            />



            <BlockStack gap="200">
              <Text as="p" variant="bodySm" fontWeight="semibold">
                Audio File
              </Text>
              
              {/* File Upload Option */}
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Option 1: Upload from device
                </Text>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioFile(file);
                      setAudioUrl(""); // Clear URL when file is selected
                    }
                  }}
                  style={{ display: "none" }}
                  id="audio-file-input"
                />
                <Button
                  onClick={() =>
                    document.getElementById("audio-file-input")?.click()
                  }
                  variant="secondary"
                  size="slim"
                >
                  Choose Audio File
                </Button>
                {audioFile && (
                  <Text as="p" variant="bodySm" tone="subdued">
                    Selected: {audioFile.name}
                  </Text>
                )}
              </BlockStack>
              
              {/* URL Input Option */}
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Option 2: Paste URL from Content &gt; Files
                </Text>
                <TextField
                  label="Audio File URL"
                  value={audioUrl}
                  onChange={setAudioUrl}
                  placeholder="https://cdn.shopify.com/s/files/1/..."
                  autoComplete="off"
                  onFocus={() => setAudioFile(null)} // Clear file when URL is focused
                />
              </BlockStack>
              
              <Text as="p" variant="bodySm" tone="subdued">
                Upload MP3, WAV, OGG, AAC, or M4A file (Max: 50MB) or paste URL from Shopify Content &gt; Files
              </Text>
            </BlockStack>

            <BlockStack gap="200">
              <Text as="p" variant="bodySm" fontWeight="semibold">
                Album Art (optional)
              </Text>
              
              {/* File Upload Option */}
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Option 1: Upload from device
                </Text>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAlbumArtFile(file);
                      setAlbumArtUrl(""); // Clear URL when file is selected
                    }
                  }}
                  style={{ display: "none" }}
                  id="album-art-input"
                />
                <Button
                  onClick={() =>
                    document.getElementById("album-art-input")?.click()
                  }
                  variant="secondary"
                  size="slim"
                >
                  Choose Album Art
                </Button>
                {albumArtFile && (
                  <Text as="p" variant="bodySm" tone="subdued">
                    Selected: {albumArtFile.name}
                  </Text>
                )}
              </BlockStack>
              
              {/* URL Input Option */}
              <BlockStack gap="200">
                <Text as="p" variant="bodySm" tone="subdued">
                  Option 2: Paste URL from Content &gt; Files
                </Text>
                <TextField
                  label="Album Art URL"
                  value={albumArtUrl}
                  onChange={setAlbumArtUrl}
                  placeholder="https://cdn.shopify.com/s/files/1/..."
                  autoComplete="off"
                  onFocus={() => setAlbumArtFile(null)} // Clear file when URL is focused
                />
              </BlockStack>
              
              <Text as="p" variant="bodySm" tone="subdued">
                Upload JPEG, PNG, GIF, or WebP image (Max: 10MB) or paste URL from Shopify Content &gt; Files
              </Text>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Edit Track Modal */}
      <Modal
        open={showEditTrackModal}
        onClose={handleCloseEditTrackModal}
        title="Edit Track"
        primaryAction={{
          content: "Update Track",
          onAction: handleUpdateTrack,
          loading: isUploading,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleCloseEditTrackModal,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <TextField
              label="Track Title"
              value={trackTitle}
              onChange={setTrackTitle}
              autoComplete="off"
            />

            <TextField
              label="Artist Name"
              value={trackArtist}
              onChange={setTrackArtist}
              autoComplete="off"
            />

            <BlockStack gap="200">
              <Text as="p" variant="bodySm" fontWeight="semibold">
                Audio File (optional - only upload if changing)
              </Text>
              
              {/* Show existing audio file if available */}
              {originalAudioUrl && !showAudioUploadOptions && !audioFile && !audioUrl ? (
                <BlockStack gap="200">
                  <Text as="p" variant="bodySm" tone="subdued">
                    Current Audio File:
                  </Text>
                  <audio
                    controls
                    src={originalAudioUrl}
                    style={{ width: "100%", maxWidth: "400px" }}
                  />
                  <Button
                    onClick={() => setShowAudioUploadOptions(true)}
                    variant="secondary"
                    size="slim"
                  >
                    Replace Audio File
                  </Button>
                </BlockStack>
              ) : (
                <>
                  {/* File Upload Option */}
                  <BlockStack gap="200">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Option 1: Upload new file from device
                    </Text>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAudioFile(file);
                          setAudioUrl(""); // Clear URL when file is selected
                        }
                      }}
                      style={{ display: "none" }}
                      id="edit-audio-file-input"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("edit-audio-file-input")?.click()
                      }
                      variant="secondary"
                      size="slim"
                    >
                      Choose New Audio File
                    </Button>
                    {audioFile && (
                      <Text as="p" variant="bodySm" tone="subdued">
                        Selected: {audioFile.name}
                      </Text>
                    )}
                  </BlockStack>
                  
                  {/* URL Input Option */}
                  <BlockStack gap="200">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Option 2: Paste new URL from Content &gt; Files
                    </Text>
                    <TextField
                      label="New Audio File URL"
                      value={audioUrl}
                      onChange={setAudioUrl}
                      placeholder="https://cdn.shopify.com/s/files/1/..."
                      autoComplete="off"
                      onFocus={() => setAudioFile(null)} // Clear file when URL is focused
                    />
                  </BlockStack>
                  
                  <InlineStack gap="200" blockAlign="center">
                    {originalAudioUrl && (
                      <Button
                        onClick={() => {
                          setShowAudioUploadOptions(false);
                          setAudioFile(null);
                          setAudioUrl("");
                        }}
                        variant="primary"
                        size="slim"
                      >
                        Cancel - Keep Current File
                      </Button>
                    )}
                    <Text as="p" variant="bodySm" tone="subdued">
                      Leave unchanged to keep current audio file
                    </Text>
                  </InlineStack>
                </>
              )}
            </BlockStack>

            <BlockStack gap="200">
              <Text as="p" variant="bodySm" fontWeight="semibold">
                Album Art (optional - only upload if changing)
              </Text>
              
              {/* Show existing album art if available */}
              {originalAlbumArtUrl && !showAlbumArtUploadOptions && !albumArtFile && !albumArtUrl ? (
                <BlockStack gap="200">
                  <Text as="p" variant="bodySm" tone="subdued">
                    Current Album Art:
                  </Text>
                  <Thumbnail
                    source={originalAlbumArtUrl}
                    alt="Current album art"
                    size="medium"
                  />
                  <Button
                    onClick={() => setShowAlbumArtUploadOptions(true)}
                    variant="secondary"
                    size="slim"
                  >
                    Replace Album Art
                  </Button>
                </BlockStack>
              ) : (
                <>
                  {/* File Upload Option */}
                  <BlockStack gap="200">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Option 1: Upload new image from device
                    </Text>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAlbumArtFile(file);
                          setAlbumArtUrl(""); // Clear URL when file is selected
                        }
                      }}
                      style={{ display: "none" }}
                      id="edit-album-art-input"
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("edit-album-art-input")?.click()
                      }
                      variant="secondary"
                      size="slim"
                    >
                      Choose New Album Art
                    </Button>
                    {albumArtFile && (
                      <Text as="p" variant="bodySm" tone="subdued">
                        Selected: {albumArtFile.name}
                      </Text>
                    )}
                  </BlockStack>
                  
                  {/* URL Input Option */}
                  <BlockStack gap="200">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Option 2: Paste new URL from Content &gt; Files
                    </Text>
                    <TextField
                      label="New Album Art URL"
                      value={albumArtUrl}
                      onChange={setAlbumArtUrl}
                      placeholder="https://cdn.shopify.com/s/files/1/..."
                      autoComplete="off"
                      onFocus={() => setAlbumArtFile(null)} // Clear file when URL is focused
                    />
                  </BlockStack>
                  
                  <InlineStack gap="200" blockAlign="center">
                    {originalAlbumArtUrl && (
                      <Button
                        onClick={() => {
                          setShowAlbumArtUploadOptions(false);
                          setAlbumArtFile(null);
                          setAlbumArtUrl("");
                        }}
                        variant="primary"
                        size="slim"
                      >
                        Cancel - Keep Current Album Art
                      </Button>
                    )}
                    <Text as="p" variant="bodySm" tone="subdued">
                      Leave unchanged to keep current album art
                    </Text>
                  </InlineStack>
                </>
              )}
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>

      {/* Delete Playlist Confirmation Modal */}
      <Modal
        open={showDeleteConfirmationModal}
        onClose={cancelDeletePlaylist}
        title="Delete Playlist"
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: confirmDeletePlaylist,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: cancelDeletePlaylist,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text as="p">
              Are you sure you want to delete the playlist "{playlistToDelete?.name}"?
            </Text>
            <Text as="p" tone="subdued">
              This action cannot be undone. All tracks in this playlist will also be permanently deleted from your store.
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
};

export default PlaylistManager;
