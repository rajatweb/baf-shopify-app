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
                A comprehensive guide to understanding how the Music Player app
                works, from playlist management to customization features.
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
                The Music Player app is a premium Shopify app that allows
                merchants to create and manage music playlists with multiple
                tracks, featuring a beautiful and modern UI/UX. It provides a
                complete music streaming experience for your store visitors.
              </Text>

              <BlockStack gap="300">
                <Text variant="headingSm" as="h4" fontWeight="semibold">
                  Key Features:
                </Text>
                <List type="bullet">
                  <List.Item>
                    Multi-track playlist support (unlimited on Pro/Studio plans)
                  </List.Item>
                  <List.Item>
                    Advanced audio controls (play, pause, skip, volume)
                  </List.Item>
                  <List.Item>Beautiful, modern player interface</List.Item>
                  <List.Item>
                    Customizable player appearance and branding (Pro/Studio
                    plans)
                  </List.Item>
                  <List.Item>
                    Persistent playback across page navigation (Pro/Studio
                    plans)
                  </List.Item>
                  <List.Item>
                    Track metadata management (title, artist, album art)
                  </List.Item>
                  <List.Item>
                    Plan-based feature restrictions (Free, Pro, Studio)
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
                The Music Player app integrates seamlessly with your Shopify
                store, providing a professional music streaming experience for
                your customers.
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
                    <List.Item>
                      Configure player settings and appearance
                    </List.Item>
                    <List.Item>
                      Player appears on your store pages (homepage only on Free
                      plan, site-wide on Pro/Studio)
                    </List.Item>
                    <List.Item>
                      Customers can enjoy music while browsing
                    </List.Item>
                    <List.Item>
                      Persistent playback across page navigation (Pro & Studio
                      plans)
                    </List.Item>
                    <List.Item>
                      Track listening behavior and engagement
                    </List.Item>
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
                      Play/pause, skip forward/backward, volume control, and
                      progress bar for track navigation.
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
                      Shows all tracks in the current playlist with album art,
                      track title, artist name, and duration.
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
                      Compact player bar that shows current track info and basic
                      controls for continuous playback.
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
                      Displays current track details including title, artist,
                      album art, and playback time.
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
                    Full audio control functionality for a professional music
                    experience.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Play/Pause:</strong> Start and stop track playback
                    </List.Item>
                    <List.Item>
                      <strong>Skip Forward/Backward:</strong> Navigate between
                      tracks
                    </List.Item>
                    <List.Item>
                      <strong>Volume Control:</strong> Adjust audio volume with
                      slider
                    </List.Item>
                    <List.Item>
                      <strong>Progress Bar:</strong> Click to jump to specific
                      time in track
                    </List.Item>
                    <List.Item>
                      <strong>Loop:</strong> Repeat current track or entire
                      playlist
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
                    Click on any track in the playlist to start playing it
                    immediately.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Active Track:</strong> Currently playing track is
                      highlighted in the playlist
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Persistent Playback (Pro & Studio Plans)
                  </Text>
                  <Text as="p">
                    Music continues playing when customers navigate between
                    pages on your store.
                  </Text>
                  <Banner tone="info">
                    <Text as="p">
                      Persistent playback creates a seamless music experience
                      and keeps customers engaged longer on your site. Available
                      on Pro and Studio plans.
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
                Understanding how to create, manage, and organize your music
                playlists.
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
                Playlists are collections of tracks that can be played together.
                You can create multiple playlists for different moods or
                occasions (unlimited on Pro and Studio plans).
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playlist Information
                  </Text>
                  <List type="bullet">
                    <List.Item>Playlist name and description</List.Item>
                    <List.Item>
                      Selected/active status (only one playlist can be active
                      per store)
                    </List.Item>
                    <List.Item>Creation and modification dates</List.Item>
                    <List.Item>Track count and total duration</List.Item>
                    <List.Item>
                      Confirmation modal when deleting playlists
                    </List.Item>
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
                    <List.Item>
                      Smart deletion: tracks are completely removed if not used
                      in other playlists
                    </List.Item>
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
                    Each track contains metadata that enhances the listening
                    experience.
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
                    The app supports standard web audio formats for maximum
                    compatibility. Pro and Studio plans also support YouTube and
                    SoundCloud tracks.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Supported Formats:</strong> MP3, WAV, OGG, AAC,
                      M4A
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                      <strong>Pro & Studio Plans:</strong> YouTube and
                      SoundCloud track URLs
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Video Tracks (Studio Plan Only)
                  </Text>
                  <Text as="p">
                    Studio plan users can add music videos to playlists. Free
                    plan allows 1 video per playlist, while Studio plan has
                    unlimited videos.
                  </Text>
                  <Banner tone="info">
                    <Text as="p">
                      Music videos are a Studio plan exclusive feature, allowing
                      you to create rich multimedia playlists.
                    </Text>
                  </Banner>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playlist Deletion & Cleanup
                  </Text>
                  <Text as="p">
                    When you delete a playlist, the system performs a complete
                    cleanup to maintain data integrity.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Confirmation Modal:</strong> A safety dialog
                      appears before deletion to prevent accidents
                    </List.Item>
                    <List.Item>
                      <strong>Complete Track Removal:</strong> All tracks in the
                      playlist are permanently deleted from the database
                    </List.Item>
                    <List.Item>
                      <strong>File Cleanup:</strong> Audio files and album art
                      are removed from Shopify CDN
                    </List.Item>
                    <List.Item>
                      <strong>Auto-Selection:</strong> If the deleted playlist
                      was active, another playlist is automatically selected
                    </List.Item>
                    <List.Item>
                      <strong>Data Integrity:</strong> No orphaned records or
                      unused files remain in the system
                    </List.Item>
                  </List>
                  <Banner tone="warning">
                    <Text as="p">
                      <strong>Warning:</strong> Playlist deletion is permanent
                      and cannot be undone. All tracks in the playlist will be
                      permanently deleted.
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
                Understanding the customization options and settings available
                for the music player.
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
                Customize the music player behavior and appearance to match your
                store's branding.
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
                    Appearance Settings (Pro & Studio Plans)
                  </Text>
                  <Text as="p">
                    Pro and Studio plan users can fully customize the player
                    appearance.
                  </Text>
                  <List type="bullet">
                    <List.Item>Player theme (light/dark mode)</List.Item>
                    <List.Item>
                      Player style (mini-bar or floating button)
                    </List.Item>
                    <List.Item>Custom CSS for advanced styling</List.Item>
                    <List.Item>Show/hide track information</List.Item>
                  </List>
                  <Banner tone="info">
                    <Text as="p">
                      Customization options allow you to create a unique music
                      experience that matches your brand identity. Studio plan
                      includes additional customization like custom colors,
                      crossfade transitions, and album art backdrop.
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
                  <List.Item>Mini-bar player (bottom of page)</List.Item>
                  <List.Item>Floating button player</List.Item>
                </List>
              </BlockStack>

              <Banner tone="warning">
                <Text as="p">
                  Player positioning options (mini-bar or floating button) are
                  available on Pro and Studio plans. Free plan users will see
                  the mini-bar player only.
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
                      <List.Item>Homepage only</List.Item>
                      <List.Item>1 playlist, 2 tracks max</List.Item>
                      <List.Item>Maximum 2 total tracks</List.Item>
                      <List.Item>Full-length tracks (no time limit)</List.Item>
                      <List.Item>Mini-bar player only</List.Item>
                      <List.Item>Light mode only</List.Item>
                      <List.Item>
                        "Powered by WEBEXP" branding (always visible)
                      </List.Item>
                      <List.Item>Basic music player functionality</List.Item>
                      <List.Item>No continuous playback across pages</List.Item>
                      <List.Item>No autoplay</List.Item>
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
                      Pro Plan ($7/month or $70/year)
                    </Text>
                    <List type="bullet">
                      <List.Item>7-day free trial</List.Item>
                      <List.Item>Unlimited playlists & tracks</List.Item>
                      <List.Item>Full track length support</List.Item>
                      <List.Item>Mini-bar or floating button player</List.Item>
                      <List.Item>Light or dark mode</List.Item>
                      <List.Item>Custom CSS</List.Item>
                      <List.Item>
                        No branding - remove "Powered by WEBEXP"
                      </List.Item>
                      <List.Item>
                        Autoplay with seamless site-wide playback
                      </List.Item>
                      <List.Item>YouTube & SoundCloud tracks</List.Item>
                      <List.Item>
                        Persistent playback across all pages
                      </List.Item>
                      <List.Item>Priority email support</List.Item>
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
                      Studio Plan ($20/month or $200/year)
                    </Text>
                    <Text as="p" tone="subdued">
                      Everything in Pro, plus:
                    </Text>
                    <List type="bullet">
                      <List.Item>7-day free trial</List.Item>
                      <List.Item>
                        Platform links (Spotify, Apple Music, YouTube, etc.)
                      </List.Item>
                      <List.Item>Music Videos</List.Item>
                      <List.Item>CTA badges & Lyrics</List.Item>
                      <List.Item>Custom colors</List.Item>
                      <List.Item>Crossfade transitions</List.Item>
                      <List.Item>Album art backdrop</List.Item>
                      <List.Item>All Pro plan features included</List.Item>
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
                The app enforces plan limits to ensure fair usage and encourage
                upgrades to the Pro plan.
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track & Playlist Limits
                  </Text>
                  <Text as="p">
                    Free plan users are limited to 1 playlist with maximum 2
                    tracks total. When these limits are reached, new tracks or
                    playlists cannot be added. Pro and Studio plans have
                    unlimited playlists and tracks.
                  </Text>
                  <Box
                    background="bg-surface-secondary"
                    padding="300"
                    borderRadius="200"
                  >
                    <Text variant="bodySm" as="p">
                      <strong>Example:</strong> Free plan can have 1 playlist
                      with 2 tracks maximum. Pro and Studio plans can have
                      unlimited tracks and playlists.
                    </Text>
                  </Box>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Playlist Selection
                  </Text>
                  <Text as="p">
                    Only one playlist can be active at a time per store. The
                    active playlist is the one that will play on your store's
                    music player.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      <strong>Active Playlist:</strong> Only one playlist can be
                      selected as active per store
                    </List.Item>
                    <List.Item>
                      <strong>Selection Button:</strong> Click "Select" to make
                      a playlist active
                    </List.Item>
                    <List.Item>
                      <strong>Active Badge:</strong> The currently active
                      playlist shows an "Active" badge
                    </List.Item>
                    <List.Item>
                      <strong>Auto-Selection:</strong> The first playlist
                      created is automatically selected
                    </List.Item>
                    <List.Item>
                      <strong>Store Player:</strong> Only the active playlist
                      appears on your store's music player
                    </List.Item>
                  </List>
                  <Banner tone="info">
                    <Text as="p">
                      The active playlist is the one that customers will hear
                      when they visit your store. Make sure to select the
                      playlist you want to showcase.
                    </Text>
                  </Banner>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Track Length Limits
                  </Text>
                  <Text as="p">
                    All plans support full-length tracks with no time
                    restrictions. Pro and Studio plans include additional
                    features like autoplay and YouTube/SoundCloud track support.
                  </Text>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Feature Restrictions
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      Customization options (Pro & Studio plans)
                    </List.Item>
                    <List.Item>
                      Persistent playback (Pro & Studio plans)
                    </List.Item>
                    <List.Item>Branding removal (Pro & Studio plans)</List.Item>
                    <List.Item>
                      Autoplay functionality (Pro & Studio plans)
                    </List.Item>
                    <List.Item>
                      Site-wide playback (Pro & Studio plans)
                    </List.Item>
                    <List.Item>
                      Platform links, videos, custom colors, crossfade (Studio
                      plan only)
                    </List.Item>
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
                Understanding what happens when you change or downgrade your
                plan.
              </Text>

              <BlockStack gap="400">
                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Upgrading Plans
                  </Text>
                  <Text as="p">
                    When upgrading from Free to Pro, or Pro to Studio, all
                    existing tracks and playlists remain active.
                  </Text>
                  <List type="bullet">
                    <List.Item>All existing tracks remain active</List.Item>
                    <List.Item>
                      Access to all new plan features immediately
                    </List.Item>
                    <List.Item>No data loss or interruption</List.Item>
                    <List.Item>
                      7-day free trial available for Pro and Studio plans
                    </List.Item>
                  </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Downgrading Plans
                  </Text>
                  <Text as="p">
                    When downgrading to Free plan, your data is preserved but
                    limited to Free plan restrictions.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      Only first playlist remains active (others become
                      inactive)
                    </List.Item>
                    <List.Item>
                      Only first 2 tracks remain active (others become inactive
                      but preserved)
                    </List.Item>
                    <List.Item>
                      All tracks remain active (no length restrictions)
                    </List.Item>
                    <List.Item>Customization options are disabled</List.Item>
                    <List.Item>
                      Persistent playback becomes unavailable
                    </List.Item>
                    <List.Item>
                      "Powered by WEBEXP" branding becomes visible
                    </List.Item>
                    <List.Item>Player restricted to homepage only</List.Item>
                    <List.Item>
                      Mini-bar player only (floating button removed)
                    </List.Item>
                    <List.Item>Light mode only</List.Item>
                  </List>
                </Box>

                <Box>
                  <Text variant="headingSm" as="h4" fontWeight="semibold">
                    Downgrading from Studio to Pro
                  </Text>
                  <Text as="p">
                    When downgrading from Studio to Pro, Studio-specific
                    features are removed.
                  </Text>
                  <List type="bullet">
                    <List.Item>
                      Platform links, music videos, CTA badges, and lyrics are
                      removed
                    </List.Item>
                    <List.Item>
                      Custom colors, crossfade transitions, and album art
                      backdrop are removed
                    </List.Item>
                    <List.Item>All Pro plan features remain active</List.Item>
                    <List.Item>
                      All playlists and tracks remain active
                    </List.Item>
                  </List>
                </Box>

                <Banner tone="info">
                  <Text as="p">
                    When downgrading, your data is preserved. You can upgrade
                    back to Pro anytime to restore all your features and tracks.
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
