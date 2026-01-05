import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Tabs,
  List,
  Box,
  Badge,
  Banner,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function Documentation() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: "overview",
      content: "Overview",
      accessibilityLabel: "Overview",
      panelID: "overview-panel",
    },
    {
      id: "features",
      content: "Features & Controls",
      accessibilityLabel: "Features & Controls",
      panelID: "features-panel",
    },
    {
      id: "playlists",
      content: "Playlist Management",
      accessibilityLabel: "Playlist Management",
      panelID: "playlists-panel",
    },
    {
      id: "customization",
      content: "Customization",
      accessibilityLabel: "Customization",
      panelID: "customization-panel",
    },
    {
      id: "plans",
      content: "Plans & Limits",
      accessibilityLabel: "Plans & Limits",
      panelID: "plans-panel",
    },
  ];

  const renderOverview = () => (
    <Box paddingBlockStart="400">
      <BlockStack gap="500">
        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Music Player - Complete Documentation
              </Text>
              <Text as="p" tone="subdued">
                A comprehensive guide to understanding how the Music Player app works, from playlist management to customization features.
              </Text>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                What is the Music Player App?
              </Text>
              <Text as="p">
                The Music Player app is a premium Shopify app that allows merchants to create and manage music playlists with multiple tracks, featuring a beautiful and modern UI/UX. It provides a complete music streaming experience for your store visitors.
              </Text>

              <BlockStack gap="300">
                <Text variant="headingSm" as="h4" fontWeight="semibold">
                  Key Features:
                </Text>
                <List type="bullet">
                  <List.Item>
                    Multi-track playlist support with unlimited tracks (Pro plan)
                  </List.Item>
                  <List.Item>
                    Advanced audio controls (play, pause, skip, volume)
                  </List.Item>
                  <List.Item>
                    Beautiful, modern player interface
                  </List.Item>
                  <List.Item>
                    Customizable player appearance and branding
                  </List.Item>
                  <List.Item>
                    Persistent playback across page navigation
                  </List.Item>
                  <List.Item>
                    Track metadata management (title, artist, album art)
                  </List.Item>
                  <List.Item>
                    Plan-based feature restrictions
                  </List.Item>
                </List>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                How It Works
              </Text>
              <Text as="p">
                The Music Player app integrates seamlessly with your Shopify store, providing a professional music streaming experience for your customers.
              </Text>

              <Box
                background="bg-surface-secondary"
                padding="400"
                borderRadius="200"
              >
                <BlockStack gap="300">
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Process Flow:
                  </Text>
                  <List type="number">
                    <List.Item>Create playlists and upload tracks</List.Item>
                    <List.Item>Configure player settings and appearance</List.Item>
                    <List.Item>Player appears on your store pages</List.Item>
                    <List.Item>Customers can enjoy music while browsing</List.Item>
                    <List.Item>Persistent playback across page navigation</List.Item>
                    <List.Item>Analytics track listening behavior</List.Item>
                  </List>
                </BlockStack>
              </Box>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Box>
  );

  const renderFeatures = () => (
    <Box paddingBlockStart="400">
      <BlockStack gap="500">
        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Music Player Features & Controls
              </Text>
              <Text as="p" tone="subdued">
                Understanding the music player interface and available controls.
              </Text>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Player Interface Components
              </Text>

              <BlockStack gap="400">
                <Box
                  background="bg-surface-secondary"
                  padding="400"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <InlineStack gap="200" align="start">
                      <Badge tone="success">1</Badge>
                      <Text variant="headingSm" as="h4" fontWeight="semibold">
                        Main Player Controls
                      </Text>
                    </InlineStack>
                    <Text as="p">
                      Play/pause, skip forward/backward, volume control, and progress bar for track navigation.
                    </Text>
                  </BlockStack>
                </Box>

                <Box
                  background="bg-surface-secondary"
                  padding="400"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <InlineStack gap="200" align="start">
                      <Badge tone="info">2</Badge>
                      <Text variant="headingSm" as="h4" fontWeight="semibold">
                        Playlist Display
                      </Text>
                    </InlineStack>
                    <Text as="p">
                      Shows all tracks in the current playlist with album art, track title, artist name, and duration.
                    </Text>
                  </BlockStack>
                </Box>

                <Box
                  background="bg-surface-secondary"
                  padding="400"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <InlineStack gap="200" align="start">
                      <Badge tone="warning">3</Badge>
                      <Text variant="headingSm" as="h4" fontWeight="semibold">
                        Mini Player Bar
                      </Text>
                    </InlineStack>
                    <Text as="p">
                      Compact player bar that shows current track info and basic controls for continuous playback.
                    </Text>
                  </BlockStack>
                </Box>

                <Box
                  background="bg-surface-secondary"
                  padding="400"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <InlineStack gap="200" align="start">
                      <Badge tone="info">4</Badge>
                      <Text variant="headingSm" as="h4" fontWeight="semibold">
                        Track Information
                      </Text>
                    </InlineStack>
                    <Text as="p">
                      Displays current track details including title, artist, album art, and playback time.
                    </Text>
                  </BlockStack>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Audio Controls & Features
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playback Controls
                  </Text>
                  <Text as="p">
                    Full audio control functionality for a professional music experience.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Play/Pause:</strong> Start and stop track playback
                    </List.Item>
                    <List.Item>
                      <strong>Skip Forward/Backward:</strong> Navigate between tracks
                    </List.Item>
                    <List.Item>
                      <strong>Volume Control:</strong> Adjust audio volume with slider
                    </List.Item>
                    <List.Item>
                      <strong>Progress Bar:</strong> Click to jump to specific time in track
                    </List.Item>
                    <List.Item>
                      <strong>Loop:</strong> Repeat current track or entire playlist
                    </List.Item>
                    <List.Item>
                      <strong>Shuffle:</strong> Random track selection
                    </List.Item>
                  </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track Selection
                  </Text>
                  <Text as="p">
                    Click on any track in the playlist to start playing it immediately.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Active Track:</strong> Currently playing track is highlighted in the playlist
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Persistent Playback (Pro Plan Only)
                  </Text>
                  <Text as="p">
                    Music continues playing when customers navigate between pages on your store.
                  </Text>
                  <Banner tone="info">
                    <Text as="p">
                      Persistent playback creates a seamless music experience and keeps customers engaged longer on your site.
                    </Text>
                  </Banner>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Box>
  );

  const renderPlaylists = () => (
    <Box paddingBlockStart="400">
      <BlockStack gap="500">
        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Playlist Management
              </Text>
              <Text as="p" tone="subdued">
                Understanding how to create, manage, and organize your music playlists.
              </Text>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Creating Playlists
              </Text>
              <Text as="p">
                Playlists are collections of tracks that can be played together. You can create multiple playlists for different moods or occasions.
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playlist Information
                  </Text>
                                  <List type="bullet">
                  <List.Item>Playlist name and description</List.Item>
                  <List.Item>Selected/active status (only one playlist can be active per store)</List.Item>
                  <List.Item>Creation and modification dates</List.Item>
                  <List.Item>Track count and total duration</List.Item>
                  <List.Item>Confirmation modal when deleting playlists</List.Item>
                </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track Management
                  </Text>
                  <Text as="p">
                    Add, remove, and reorder tracks within your playlists.
                  </Text>
                  <List type="bullet">
                    <List.Item>Add tracks from your track library</List.Item>
                    <List.Item>Remove tracks from playlists</List.Item>
                    <List.Item>Track order affects playback sequence</List.Item>
                    <List.Item>Smart deletion: tracks are completely removed if not used in other playlists</List.Item>
                  </List>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Track Management
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track Information
                  </Text>
                  <Text as="p">
                    Each track contains metadata that enhances the listening experience.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Title:</strong> Track name
                    </List.Item>
                    <List.Item>
                      <strong>Artist:</strong> Performer or band name
                    </List.Item>
                    <List.Item>
                      <strong>Album Art:</strong> Cover image for the track
                    </List.Item>
                    <List.Item>
                      <strong>Audio URL:</strong> Link to the audio file
                    </List.Item>
                    <List.Item>
                      <strong>Duration:</strong> Track length in seconds
                    </List.Item>
                    <List.Item>
                      <strong>Status:</strong> Active or inactive track
                    </List.Item>
                  </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Supported Audio Formats
                  </Text>
                  <Text as="p">
                    The app supports standard web audio formats for maximum compatibility.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Supported Formats:</strong> MP3, WAV, OGG, AAC, M4A
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playlist Deletion & Cleanup
                  </Text>
                  <Text as="p">
                    When you delete a playlist, the system performs a complete cleanup to maintain data integrity.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Confirmation Modal:</strong> A safety dialog appears before deletion to prevent accidents
                    </List.Item>
                    <List.Item>
                      <strong>Complete Track Removal:</strong> All tracks in the playlist are permanently deleted from the database
                    </List.Item>
                    <List.Item>
                      <strong>File Cleanup:</strong> Audio files and album art are removed from Shopify CDN
                    </List.Item>
                    <List.Item>
                      <strong>Auto-Selection:</strong> If the deleted playlist was active, another playlist is automatically selected
                    </List.Item>
                    <List.Item>
                      <strong>Data Integrity:</strong> No orphaned records or unused files remain in the system
                    </List.Item>
                  </List>
                  <Banner tone="warning">
                    <Text as="p">
                      <strong>Warning:</strong> Playlist deletion is permanent and cannot be undone. All tracks in the playlist will be permanently deleted.
                    </Text>
                  </Banner>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Box>
  );

  const renderCustomization = () => (
    <Box paddingBlockStart="400">
      <BlockStack gap="500">
        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Player Customization
              </Text>
              <Text as="p" tone="subdued">
                Understanding the customization options and settings available for the music player.
              </Text>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Player Settings
              </Text>
              <Text as="p">
                Customize the music player behavior and appearance to match your store's branding.
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Basic Settings
                  </Text>
                  <List type="bullet">
                    <List.Item>Default volume level</List.Item>
                    <List.Item>Autoplay on page load</List.Item>
                    <List.Item>Loop playlist when finished</List.Item>
                    <List.Item>Shuffle tracks</List.Item>
                    <List.Item>Show/hide mini player bar</List.Item>
                  </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Appearance Settings (Pro Plan Only)
                  </Text>
                  <Text as="p">
                    Pro plan users can fully customize the player appearance.
                  </Text>
                  <List type="bullet">
                    <List.Item>Player theme (light/dark)</List.Item>
                    <List.Item>Player position on page</List.Item>
                    <List.Item>Show/hide track information</List.Item>
                    <List.Item>Custom player size</List.Item>
                  </List>
                  <Banner tone="info">
                    <Text as="p">
                      Customization options allow you to create a unique music experience that matches your brand identity.
                    </Text>
                  </Banner>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Branding Options
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Free Plan Branding
                  </Text>
                  <Text as="p">
                    Free plan users will always see "Powered by WEBEXP" branding on the music player.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Branding Location:</strong> Visible on the player interface and playlist modal
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Pro Plan Branding Removal
                  </Text>
                  <Text as="p">
                    Pro plan users can remove all "Powered by WEBEXP" branding for a clean, professional appearance.
                  </Text>
                  <List type="bullet">
                    <List.Item>No branding on player interface</List.Item>
                    <List.Item>No branding on playlist modal</List.Item>
                    <List.Item>Clean, professional appearance</List.Item>
                    <List.Item>Full brand control</List.Item>
                  </List>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Player Positioning
              </Text>
              <Text as="p">
                Choose where the music player appears on your store pages.
              </Text>

              <BlockStack gap="300">
                <Text variant="headingSm" as="h4" fontWeight="semibold">
                  Position Options:
                </Text>
                <List type="bullet">
                  <List.Item>Bottom of page (default)</List.Item>
                  <List.Item>Top of page</List.Item>
                  <List.Item>Sidebar position</List.Item>
                  <List.Item>Floating player</List.Item>
                </List>
              </BlockStack>

              <Banner tone="warning">
                <Text as="p">
                  Player positioning is a Pro plan feature. Free plan users will see the player in the default bottom position.
                </Text>
              </Banner>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Box>
  );

  const renderPlans = () => (
    <Box paddingBlockStart="400">
      <BlockStack gap="500">
        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2" fontWeight="bold">
                Plans & Feature Limits
              </Text>
              <Text as="p" tone="subdued">
                Understanding the different plans and their feature limitations.
              </Text>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Plan Comparison
              </Text>

              <BlockStack gap="400">
                <Box
                  background="bg-surface-secondary"
                  padding="400"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <Text variant="headingSm" as="h4" fontWeight="semibold">
                      Free Plan
                    </Text>
                    <List type="bullet">
                      <List.Item>Maximum 1 playlist</List.Item>
                      <List.Item>Maximum 2 tracks per playlist</List.Item>
                      <List.Item>Maximum 2 total tracks</List.Item>
                      <List.Item>Full-length tracks (no time limit)</List.Item>
                      <List.Item>Basic music player functionality</List.Item>
                      <List.Item>"Powered by WEBEXP" branding (always visible)</List.Item>
                      <List.Item>Limited customization options</List.Item>
                      <List.Item>No continuous playback across pages</List.Item>
                      <List.Item>Homepage only (demo mode)</List.Item>
                      <List.Item>Email support</List.Item>
                    </List>
                  </BlockStack>
                </Box>

                <Box
                  background="bg-surface-secondary"
                  padding="400"
                  borderRadius="200"
                >
                  <BlockStack gap="300">
                    <Text variant="headingSm" as="h4" fontWeight="semibold">
                      Pro Plan ($7/month)
                    </Text>
                    <List type="bullet">
                      <List.Item>Unlimited tracks per playlist</List.Item>
                      <List.Item>Unlimited playlists</List.Item>
                      <List.Item>Full track length support</List.Item>
                      <List.Item>No branding - remove "Powered by WEBEXP"</List.Item>
                      <List.Item>Full customization options (mini-bar/floating button, light/dark themes)</List.Item>
                      <List.Item>Persistent playback across all pages</List.Item>
                      <List.Item>Autoplay functionality</List.Item>
                      <List.Item>Advanced playlist management</List.Item>
                      <List.Item>Priority email support</List.Item>
                      <List.Item>Analytics and reporting</List.Item>
                    </List>
                  </BlockStack>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Plan Limit Enforcement
              </Text>
              <Text as="p">
                The app enforces plan limits to ensure fair usage and encourage upgrades to the Pro plan.
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track & Playlist Limits
                  </Text>
                  <Text as="p">
                    Free plan users are limited to 2 tracks per playlist, maximum 1 playlist, and maximum 2 total tracks. When these limits are reached, new tracks or playlists cannot be added.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Example:</strong> Free plan can have 2 tracks per playlist (max 1 playlist, 2 total tracks), Pro plan can have unlimited tracks and playlists
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playlist Selection
                  </Text>
                  <Text as="p">
                    Only one playlist can be active at a time per store. The active playlist is the one that will play on your store's music player.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Active Playlist:</strong> Only one playlist can be selected as active per store
                    </List.Item>
                    <List.Item>
                      <strong>Selection Button:</strong> Click "Select" to make a playlist active
                    </List.Item>
                    <List.Item>
                      <strong>Active Badge:</strong> The currently active playlist shows an "Active" badge
                    </List.Item>
                    <List.Item>
                      <strong>Auto-Selection:</strong> The first playlist created is automatically selected
                    </List.Item>
                    <List.Item>
                      <strong>Store Player:</strong> Only the active playlist appears on your store's music player
                    </List.Item>
                  </List>
                  <Banner tone="info">
                    <Text as="p">
                      The active playlist is the one that customers will hear when they visit your store. Make sure to select the playlist you want to showcase.
                    </Text>
                  </Banner>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track Length Limits
                  </Text>
                  <Text as="p">
                    Free plan users can upload full-length tracks (no time restrictions). Pro plan users can upload tracks of any length with additional features like autoplay.
                  </Text>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Feature Restrictions
                  </Text>
                  <List type="bullet">
                    <List.Item>Customization options (Pro only)</List.Item>
                    <List.Item>Persistent playback (Pro only)</List.Item>
                    <List.Item>Branding removal (Pro only)</List.Item>
                    <List.Item>Advanced analytics (Pro only)</List.Item>
                  </List>
                </Box>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>

        <Card padding="0">
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3" fontWeight="semibold">
                Plan Changes & Downgrades
              </Text>
              <Text as="p">
                Understanding what happens when you change or downgrade your plan.
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Upgrading to Pro
                  </Text>
                  <List type="bullet">
                    <List.Item>All existing tracks remain active</List.Item>
                    <List.Item>
                      Access to all Pro features immediately
                    </List.Item>
                    <List.Item>No data loss or interruption</List.Item>
                    <List.Item>Branding can be removed</List.Item>
                  </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Downgrading to Free
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      Only first track per playlist remains active
                    </List.Item>
                    <List.Item>
                      Only first playlist remains active (others become inactive)
                    </List.Item>
                    <List.Item>
                      Only first 2 tracks remain active (others become inactive)
                    </List.Item>
                    <List.Item>
                      All tracks remain active (no length restrictions)
                    </List.Item>
                    <List.Item>
                      Other tracks become inactive (preserved but not playable)
                    </List.Item>
                    <List.Item>Customization options are disabled</List.Item>
                    <List.Item>
                      Persistent playback becomes unavailable
                    </List.Item>
                    <List.Item>"Powered by WEBEXP" branding becomes visible</List.Item>
                  </List>
                </Box>

                <Banner tone="info">
                  <Text as="p">
                    When downgrading, your data is preserved. You can upgrade back to Pro anytime to restore all your features and tracks.
                  </Text>
                </Banner>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
    </Box>
  );

  const navigate = useNavigate();

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return renderOverview();
      case 1:
        return renderFeatures();
      case 2:
        return renderPlaylists();
      case 3:
        return renderCustomization();
      case 4:
        return renderPlans();
      default:
        return renderOverview();
    }
  };

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <Page
        title="Documentation"
        subtitle="Complete guide to Music Player"
        backAction={{ content: "Back", onAction: () => navigate(-1) }}
      >
        <Layout>
          <Layout.Section>
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={setSelectedTab}
            />
            <BlockStack gap="500">{renderContent()}</BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </div>
  );
}

