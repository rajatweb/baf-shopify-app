import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  Box,
  Spinner,
  Banner,
  Tabs,
  InlineStack,
  Badge,
  Thumbnail,
  EmptyState,
  Grid,
  // List,
} from "@shopify/polaris";
import { SettingsIcon, PlusIcon } from "@shopify/polaris-icons";
import { MusicIcon, Volume2Icon } from "lucide-react";

import {
  useGetPlaylistsQuery,
  useGetTracksQuery,
} from "../../store/api/music-player";
import { useGetShopQuery } from "../../store/api/shop";
import { useGetActiveSubscriptionsQuery } from "../../store/api/subscriptions";
import { useGetThemeStatusQuery } from "../../store/api/store";
import { subscriptionsApi } from "../../store/api/subscriptions";

import PlaylistManager from "../../components/music-player/PlaylistManager";
import type { Playlist } from "../../store/api/music-player/types";
import React from "react";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // RTK Query hooks
  const { data: shop, isLoading: isLoadingShop } = useGetShopQuery();
  const { data: themeStatus, isLoading: isThemeStatusLoading } =
    useGetThemeStatusQuery();

  const {
    data: playlistsData,
    isLoading: isLoadingPlaylists,
    error: playlistsError,
    refetch: refetchPlaylists,
  } = useGetPlaylistsQuery(shop?.data?.shop?.name || "", {
    skip: !shop?.data?.shop?.name,
  });

  const {
    data: tracksData,
    isLoading: isLoadingTracks,
    error: tracksError,
    refetch: refetchTracks,
  } = useGetTracksQuery(shop?.data?.shop?.name || "", {
    skip: !shop?.data?.shop?.name,
  });

  const { data: subscriptions } = useGetActiveSubscriptionsQuery();

  // Force refresh subscription data to ensure latest plan status
  const forceRefreshSubscriptions = () => {
    // Invalidate RTK Query cache for subscriptions
    dispatch(subscriptionsApi.util.invalidateTags(['Subscriptions']));
  };

  // Force refresh on component mount to ensure latest data
  React.useEffect(() => {
    forceRefreshSubscriptions();
  }, [dispatch]);

  // Local state - no longer needed as selection is stored in database

  // State for plan banner visibility
  const [showPlanBanner, setShowPlanBanner] = useState(true);

  // Loading states
  const isLoading = isLoadingPlaylists || isLoadingTracks || isLoadingShop;
  const hasError = playlistsError || tracksError;

  // Get current subscription and plan info
  const currentSubscription = subscriptions?.data?.[0];
  const isSubscribed = currentSubscription?.status === "ACTIVE";

  // No need to auto-select as selection is now stored in database

  const handlePlaylistSelect = (playlist: Playlist) => {
    // Validate playlist object before proceeding
    if (!playlist || !playlist.id) {
      console.error("Invalid playlist object:", playlist);
      return;
    }

    // Selection is now handled in the database via PlaylistManager

  };

  // Handle data changes from PlaylistManager
  const handleDataChange = () => {
    refetchPlaylists();
    refetchTracks();
  };

  // Handle playlist deletion - refresh data
  const handlePlaylistDeleted = () => {
    refetchPlaylists();
  };

  // Calculate statistics
  const totalPlaylists = playlistsData?.data?.length || 0;
  const totalTracks = tracksData?.data?.length || 0;

  const tabs = [
    {
      id: "dashboard",
      content: "Dashboard",
      accessibilityLabel: "Dashboard",
      panelID: "dashboard-panel",
    },
    // Player tab hidden for now
    // {
    //   id: "player",
    //   content: "Player",
    //   accessibilityLabel: "Player",
    //   panelID: "player-panel",
    // },
    {
      id: "manage",
      content: "Manage",
      accessibilityLabel: "Manage",
      panelID: "manage-panel",
    },
  ];

  const [selected, setSelected] = useState(0);

  const tabPanels = {
    dashboard: (
      <Layout>
        {/* Welcome Section */}
        {/* <Layout.Section>
          <Card>
            <Box padding="600">
              <BlockStack gap="500" align="center">
                <Box padding="400">
                  <MusicIcon size={48} className="text-blue-600" />
                </Box>
                <BlockStack gap="300" align="center">
                  <Text variant="headingLg" as="h1" fontWeight="bold">
                    Welcome to WEBEXP Music Player
                  </Text>
                  <Text variant="bodyLg" as="p" tone="subdued">
                    Create beautiful playlists and enhance your store with
                    background music
                  </Text>
                </BlockStack>
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section> */}

        {/* Stats Row */}
        <Layout.Section>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Card>
                <Box padding="400">
                  <BlockStack gap="300" align="center">
                    <Box
                      padding="300"
                      background="bg-surface-brand"
                      borderRadius="200"
                    >
                      <MusicIcon size={24} className="text-white" />
                    </Box>
                    <BlockStack gap="100" align="center">
                      <Text variant="heading2xl" as="h2" fontWeight="bold">
                        {totalPlaylists}
                      </Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        Playlists
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Card>
                <Box padding="400">
                  <BlockStack gap="300" align="center">
                    <Box
                      padding="300"
                      background="bg-surface-info"
                      borderRadius="200"
                    >
                      <Volume2Icon size={24} className="text-white" />
                    </Box>
                    <BlockStack gap="100" align="center">
                      <Text variant="heading2xl" as="h2" fontWeight="bold">
                        {totalTracks}
                      </Text>
                      <Text variant="bodySm" as="p" tone="subdued">
                        Tracks
                      </Text>
                    </BlockStack>
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell>
          </Grid>
        </Layout.Section>

        {/* Main Content */}
        <Layout.Section>
          <Grid>
            {/* Left Column - Current Player */}
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              {/* Current Player */}
              {isLoadingPlaylists ? (
                <Card>
                  <Box padding="500">
                    <BlockStack gap="400" align="center">
                      <Text variant="bodyMd" as="p">
                        Loading playlists...
                      </Text>
                    </BlockStack>
                  </Box>
                </Card>
              ) : (
                (() => {
                  try {
                    const selectedPlaylist =
                      playlistsData?.data && Array.isArray(playlistsData.data)
                        ? playlistsData.data.find(
                            (p) =>
                              p && p.isSelected && p.id && typeof p === "object"
                          )
                        : null;
                    return selectedPlaylist && selectedPlaylist.id ? (
                      <Card>
                        <Box padding="500">
                          <BlockStack gap="400">
                            <InlineStack
                              align="space-between"
                              blockAlign="center"
                            >
                              <Text
                                variant="headingMd"
                                as="h3"
                                fontWeight="semibold"
                              >
                                Now Playing
                              </Text>
                              <Badge tone="success">Live</Badge>
                            </InlineStack>

                            <InlineStack gap="400" blockAlign="center">
                              <Thumbnail
                                source={
                                  selectedPlaylist.tracks?.[0]?.track
                                    ?.albumArt ||
                                  "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"
                                }
                                alt={selectedPlaylist.name || "Playlist"}
                                size="large"
                              />
                              <BlockStack gap="200">
                                <Text
                                  variant="headingMd"
                                  as="h4"
                                  fontWeight="semibold"
                                >
                                  {selectedPlaylist.name || "Untitled Playlist"}
                                </Text>
                                <Text variant="bodyMd" as="p" tone="subdued">
                                  {selectedPlaylist.tracks?.length || 0} tracks
                                </Text>
                                <Button
                                  onClick={() => setSelected(1)}
                                  variant="primary"
                                  size="slim"
                                >
                                  Manage Playlist
                                </Button>
                              </BlockStack>
                            </InlineStack>
                          </BlockStack>
                        </Box>
                      </Card>
                    ) : (
                      <Card>
                        <Box padding="500">
                          <EmptyState heading="No playlist selected" image="">
                            <Text as="p">
                              Select a playlist to start playing music.
                            </Text>
                            <Button
                              icon={PlusIcon}
                              onClick={() => setSelected(1)}
                              variant="primary"
                            >
                              Create Playlist
                            </Button>
                          </EmptyState>
                        </Box>
                      </Card>
                    );
                  } catch (error) {
                    console.error("Error rendering current player:", error);
                    return (
                      <Card>
                        <Box padding="500">
                          <BlockStack gap="400" align="center">
                            <Text variant="bodyMd" as="p" tone="critical">
                              Error loading player. Please refresh the page.
                            </Text>
                          </BlockStack>
                        </Box>
                      </Card>
                    );
                  }
                })()
              )}
            </Grid.Cell>

            {/* Right Column - Recent Playlists */}
            {/* <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
              <Card>
                <Box padding="500">
                  <BlockStack gap="400">
                    {isLoadingPlaylists ? (
                      <BlockStack gap="400" align="center">
                        <Text variant="bodyMd" as="p">
                          Loading playlists...
                        </Text>
                      </BlockStack>
                    ) : (
                      (() => {
                        try {
                          if (
                            playlistsData?.data &&
                            Array.isArray(playlistsData.data) &&
                            playlistsData.data.length > 0
                          ) {
                            const validPlaylists = playlistsData.data
                              .filter(
                                (playlist) =>
                                  playlist &&
                                  playlist.id &&
                                  typeof playlist === "object"
                              )
                              .slice(0, 5);

                            if (validPlaylists.length === 0) {
                              return (
                                <EmptyState
                                  heading="No valid playlists"
                                  image=""
                                >
                                  <Text as="p">
                                    All playlists appear to be invalid. Please
                                    refresh the page.
                                  </Text>
                                </EmptyState>
                              );
                            }

                            return (
                              <List>
                                {validPlaylists.map((playlist) => (
                                  <List.Item key={playlist.id}>
                                    <InlineStack
                                      align="space-between"
                                      blockAlign="center"
                                    >
                                      <InlineStack
                                        gap="300"
                                        blockAlign="center"
                                      >
                                        <Thumbnail
                                          source={
                                            playlist.tracks?.[0]?.track
                                              ?.albumArt ||
                                            "https://cdn.shopify.com/s/files/1/0707/3821/5234/files/mini_disc_webexp_bg.png?v=1746222262"
                                          }
                                          alt={playlist.name || "Playlist"}
                                          size="small"
                                        />
                                        <BlockStack gap="100">
                                          <Text
                                            variant="bodyMd"
                                            as="p"
                                            fontWeight="medium"
                                          >
                                            {playlist.name ||
                                              "Untitled Playlist"}
                                          </Text>
                                          <Text
                                            variant="bodySm"
                                            as="p"
                                            tone="subdued"
                                          >
                                            {playlist.tracks?.length || 0}{" "}
                                            tracks
                                          </Text>
                                        </BlockStack>
                                      </InlineStack>
                                      <Button
                                        onClick={() =>
                                          handlePlaylistSelect(playlist)
                                        }
                                        variant="primary"
                                        size="slim"
                                      >
                                        Play
                                      </Button>
                                    </InlineStack>
                                  </List.Item>
                                ))}
                              </List>
                            );
                          } else {
                            return (
                              <EmptyState heading="No playlists yet" image="">
                                <Text as="p">
                                  Create your first playlist to get started.
                                </Text>
                                <Button
                                  icon={PlusIcon}
                                  onClick={() => setSelected(1)}
                                  variant="primary"
                                >
                                  Create Playlist
                                </Button>
                              </EmptyState>
                            );
                          }
                        } catch (error) {
                          console.error("Error rendering playlists:", error);
                          return (
                            <EmptyState
                              heading="Error loading playlists"
                              image=""
                            >
                              <Text as="p" tone="critical">
                                Failed to load playlists. Please refresh the
                                page.
                              </Text>
                            </EmptyState>
                          );
                        }
                      })()
                    )}
                  </BlockStack>
                </Box>
              </Card>
            </Grid.Cell> */}
          </Grid>
        </Layout.Section>
      </Layout>
    ),

    // Player tab hidden for now
    // player: (
    //   <Card>
    //     <Box padding="500">
    //       <BlockStack gap="400">
    //         {selectedPlaylist ? (
    //           <>
    //             <InlineStack align="space-between" blockAlign="center">
    //               <BlockStack gap="200">
    //                 <Text variant="headingMd" as="h3" fontWeight="semibold">
    //                   Now Playing
    //                 </Text>
    //                 <Text variant="bodyMd" as="p" tone="subdued">
    //                   {selectedPlaylist.name} • {selectedPlaylist.tracks.length} tracks
    //                 </Text>
    //               </BlockStack>
    //               <Badge tone="success">Active</Badge>
    //             </InlineStack>

    //             <Divider />

    //             <MusicPlayer
    //               playlist={selectedPlaylist}
    //               onTrackChange={handleTrackChange}
    //             />
    //           </>
    //         ) : (
    //           <EmptyState
    //             heading="No playlist selected"
    //             image=""
    //           >
    //             <Text as="p">
    //               Select a playlist to start playing music.
    //             </Text>
    //             <Button
    //               icon={PlusIcon}
    //               onClick={() => setSelected(2)}
    //               variant="primary"
    //             >
    //               Create Playlist
    //             </Button>
    //           </EmptyState>
    //         )}
    //       </BlockStack>
    //     </Box>
    //   </Card>
    // ),

    manage: (
      <PlaylistManager
        shop={shop?.data?.shop?.name || ""}
        playlists={playlistsData?.data || []}
        tracks={tracksData?.data || []}
        onPlaylistSelect={handlePlaylistSelect}
        onDataChange={handleDataChange}
        onPlaylistDeleted={() => handlePlaylistDeleted()}
      />
    ),
  };

  if (isLoading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="500">
                <BlockStack gap="400" align="center">
                  <Spinner size="large" />
                  <Text variant="bodyMd" as="p" tone="subdued">
                    Loading your music player...
                  </Text>
                </BlockStack>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (hasError) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Card>
              <Box padding="500">
                <Banner tone="critical">
                  <p>
                    There was an error loading your music player. Please try
                    refreshing the page.
                  </p>
                </Banner>
              </Box>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page
      title="Music Player"
      subtitle="Manage your playlists and customize your player"
      primaryAction={{
        content: "Settings",
        icon: SettingsIcon,
        onAction: () => navigate("/music-player-settings"),
      }}
    >
      {showPlanBanner && !isSubscribed && (
        <Box paddingBlockEnd="500">
          <Banner
            tone="info"
            onDismiss={() => setShowPlanBanner(false)}
            action={{
              content: "View Plans",
              onAction: () => navigate("/plans"),
            }}
          >
            <Text as="p" fontWeight="semibold">
              Free Plan Limits: 1 playlist, 2 tracks per playlist, 2 total tracks, full-length tracks. Upgrade to Pro for unlimited features.
            </Text>
          </Banner>
        </Box>
      )}

      <Layout>
        {/* Theme Integration Section */}
        <Layout.Section>
          <Banner
            tone={
              isThemeStatusLoading
                ? "info"
                : themeStatus?.isThemeExtensionDisabled
                ? "warning"
                : "success"
            }
            title="Theme Integration"
            action={{
              content: isThemeStatusLoading
                ? "Loading..."
                : themeStatus?.isThemeExtensionDisabled
                ? "Enable App Embed"
                : "App Embed Active",
              loading: isThemeStatusLoading,
              disabled:
                isThemeStatusLoading || !themeStatus?.isThemeExtensionDisabled,
              onAction: () =>
                window.open(
                  `shopify://admin/themes/current/editor?context=apps&template=product&activateAppId=${process.env.SHOPIFY_API_KEY}/music_player`,
                  "_blank"
                ),
            }}
          >
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center" gap="400">
                <BlockStack gap="200">
                  <Text as="p">
                    Please save your theme settings after enabling the app
                    embed.
                  </Text>
                </BlockStack>
                <Badge
                  tone={
                    isThemeStatusLoading
                      ? "info"
                      : themeStatus?.isThemeExtensionDisabled
                      ? "attention"
                      : "success"
                  }
                >
                  {isThemeStatusLoading
                    ? "Loading..."
                    : themeStatus?.isThemeExtensionDisabled
                    ? "Not Active"
                    : "Active"}
                </Badge>
              </InlineStack>
            </BlockStack>
          </Banner>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={setSelected} fitted>
              {tabPanels[tabs[selected].id as keyof typeof tabPanels]}
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
