import { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Box,
  Divider,
  Select,
  Checkbox,
  RangeSlider,
  Banner,
  Spinner,
  Toast,
  Frame,
  Badge,
} from "@shopify/polaris";
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import { useGetShopQuery } from "../../store/api/shop";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../store/api/music-player";
import { useGetActiveSubscriptionsQuery } from "../../store/api/subscriptions";

// Interface matching the exact database structure
interface DatabaseSettings {
  musicPlayerEnabled: boolean;
  musicPlayerSettings: {
    loop: boolean;
    shuffle: boolean;
    autoplay: boolean;
    buttonSize: number;
    colorScheme: "light" | "dark";
    displayMode: "button" | "mini-bar";
    playerTheme: "light" | "dark";
    showAlbumArt: boolean;
    playerOpacity: number;
    showTrackInfo: boolean;
    buttonPosition: "bottom-right" | "bottom-left";
    playerPosition: "bottom" | "top" | "sidebar" | "floating";
    roundedCorners: boolean;
    showArtistName: boolean;
    showMiniPlayer: boolean;
    showTrackDuration: boolean;
    persistentPlayback: boolean;
  };
}

const DEFAULT_SETTINGS: DatabaseSettings["musicPlayerSettings"] = {
  loop: false,
  shuffle: false,
  autoplay: false,
  buttonSize: 60,
  colorScheme: "light",
  displayMode: "mini-bar",
  playerTheme: "light",
  showAlbumArt: true,
  playerOpacity: 100,
  showTrackInfo: true,
  buttonPosition: "bottom-right",
  playerPosition: "bottom",
  roundedCorners: true,
  showArtistName: true,
  showMiniPlayer: true,
  showTrackDuration: true,
  persistentPlayback: true,
};

export default function MusicPlayerSettings() {
  const navigate = useNavigate();
  const app = useAppBridge();

  // State
  const [settings, setSettings] =
    useState<DatabaseSettings["musicPlayerSettings"]>(DEFAULT_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  // Queries
  const { data: shop } = useGetShopQuery();
  const { data: settingsData, isLoading: isLoadingSettings } =
    useGetSettingsQuery(shop?.data?.shop?.name || "", {
      skip: !shop?.data?.shop?.name,
    });
  const { data: subscriptions } = useGetActiveSubscriptionsQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  // Check subscription status
  const currentSubscription = subscriptions?.data?.[0];
  const isSubscribed = currentSubscription?.status === "ACTIVE";

  // Initialize settings from API
  useEffect(() => {
    if (settingsData?.data) {
      // Extract only the music player settings from the API response
      // Filter out subscription fields, planLimits, currentUsage, etc.
      const musicPlayerSettings = Object.fromEntries(
        Object.entries(settingsData.data).filter(([key]) =>
          Object.keys(DEFAULT_SETTINGS).includes(key)
        )
      ) as DatabaseSettings["musicPlayerSettings"];

      console.log("🚀 Initializing settings from API:", {
        fullApiResponse: settingsData.data,
        extractedSettings: musicPlayerSettings,
        defaultSettings: DEFAULT_SETTINGS,
        mergedSettings: {
          ...DEFAULT_SETTINGS,
          ...musicPlayerSettings,
        },
      });

      setSettings({
        ...DEFAULT_SETTINGS,
        ...musicPlayerSettings,
      });
    }
  }, [settingsData]);

  // Track changes and control SaveBar
  useEffect(() => {
    if (settingsData?.data && settings) {
      // Extract only the music player settings from the API response
      const apiSettings = Object.fromEntries(
        Object.entries(settingsData.data).filter(([key]) =>
          Object.keys(DEFAULT_SETTINGS).includes(key)
        )
      ) as DatabaseSettings["musicPlayerSettings"];

      console.log("🔍 Data Comparison:", {
        apiSettings: apiSettings,
        localSettings: settings,
        apiKeys: Object.keys(apiSettings),
        localKeys: Object.keys(settings),
        apiString: JSON.stringify(apiSettings, Object.keys(apiSettings).sort()),
        localString: JSON.stringify(settings, Object.keys(settings).sort()),
      });

      const hasChanges =
        JSON.stringify(settings) !== JSON.stringify(apiSettings);
      setHasUnsavedChanges(hasChanges);

      // Control SaveBar based on changes
      if (hasChanges) {
        console.log("📱 Showing SaveBar - hasChanges:", hasChanges);
        app.saveBar.show("music-player-settings-save-bar");
      } else {
        console.log("📱 Hiding SaveBar - hasChanges:", hasChanges);
        app.saveBar.hide("music-player-settings-save-bar");
      }
    }
  }, [settings, settingsData, app.saveBar]);

  // Hide SaveBar on component mount
  useEffect(() => {
    app.saveBar.hide("music-player-settings-save-bar");
  }, [app.saveBar]);

  const showToast = (message: string, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    setToastActive(true);
  };

  const handleSave = async () => {
    console.log("💾 Save button clicked");
    try {
      await updateSettings({
        shop: shop?.data?.shop?.name || "",
        data: {
          musicPlayerSettings: settings,
        },
      }).unwrap();

      showToast("Settings saved successfully!");
      setHasUnsavedChanges(false);
      console.log("💾 Save completed, hiding SaveBar");
      app.saveBar.hide("music-player-settings-save-bar");
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Failed to save settings. Please try again.", true);
    }
  };

  const handleDiscard = () => {
    console.log("🗑️ Discard button clicked");
    if (settingsData?.data) {
      // Extract only the music player settings from the API response
      const apiSettings = Object.fromEntries(
        Object.entries(settingsData.data).filter(([key]) =>
          Object.keys(DEFAULT_SETTINGS).includes(key)
        )
      ) as DatabaseSettings["musicPlayerSettings"];

      setSettings({
        ...DEFAULT_SETTINGS,
        ...apiSettings,
      });
    }
    setHasUnsavedChanges(false);
    console.log("🗑️ Discard completed, hiding SaveBar");
    app.saveBar.hide("music-player-settings-save-bar");
  };

  const updateSetting = <
    K extends keyof DatabaseSettings["musicPlayerSettings"]
  >(
    key: K,
    value: DatabaseSettings["musicPlayerSettings"][K]
  ) => {
    console.log("🔄 Setting Update:", {
      key,
      value,
      previousValue: settings[key],
      currentSettings: settings,
      newSettings: { ...settings, [key]: value },
    });
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoadingSettings) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <BlockStack gap="400" align="center">
                <Spinner size="large" />
                <Text as="p" tone="subdued">
                  Loading settings...
                </Text>
              </BlockStack>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <Frame>
        <Page
          title="Music Player Settings"
          subtitle="Customize your music player appearance, behavior, and playlist display"
          backAction={{
            content: "Back",
            onAction: () => navigate(-1),
          }}
        >
          <Layout>
            <Layout.Section>
              <BlockStack gap="400">
                {/* Subscription Status */}
                {!isSubscribed && (
                  <Banner
                    title="Upgrade to Pro for Advanced Features"
                    tone="warning"
                    action={{
                      content: "View Plans",
                      onAction: () => navigate("/plans"),
                    }}
                  >
                    <Text as="p">
                      Some advanced customization options are only available
                      with a Pro subscription.
                    </Text>
                  </Banner>
                )}

                {/* General Settings */}
                <Card>
                  <Box padding="400">
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h3" fontWeight="semibold">
                          General Settings
                        </Text>
                        <Badge tone="info">Basic</Badge>
                      </InlineStack>

                      <Divider />

                      <Select
                        label="Display Mode"
                        options={[
                          { label: "Mini Music Bar", value: "mini-bar" },
                          { label: "Floating Button", value: "button" },
                        ]}
                        value={isSubscribed ? settings.displayMode : "mini-bar"}
                        onChange={(value) => {
                          // Free plan users are locked to mini-bar
                          if (!isSubscribed) {
                            updateSetting("displayMode", "mini-bar");
                          } else {
                            updateSetting(
                              "displayMode",
                              value as "button" | "mini-bar"
                            );
                          }
                        }}
                        helpText={
                          isSubscribed
                            ? "Choose between a floating button or a mini music bar at the bottom of screen"
                            : "Free plan: Locked to Mini Music Bar. Upgrade to Pro for floating button option."
                        }
                        disabled={!isSubscribed}
                      />

                      <Select
                        label="Color Scheme"
                        options={[
                          { label: "Light", value: "light" },
                          { label: "Dark", value: "dark" },
                        ]}
                        value={isSubscribed ? settings.colorScheme : "light"}
                        onChange={(value) => {
                          // Free plan users are locked to light theme
                          if (!isSubscribed) {
                            updateSetting("colorScheme", "light");
                          } else {
                            updateSetting(
                              "colorScheme",
                              value as "light" | "dark"
                            );
                          }
                        }}
                        helpText={
                          isSubscribed
                            ? "Choose between light and dark color scheme"
                            : "Free plan: Locked to Light theme. Upgrade to Pro for dark theme option."
                        }
                        disabled={!isSubscribed}
                      />

                      <Checkbox
                        label="Enable Rounded Corners"
                        checked={settings.roundedCorners}
                        onChange={(checked) =>
                          updateSetting("roundedCorners", checked)
                        }
                        helpText="Enable rounded corners for the mini bar and player modal"
                      />

                      {!isSubscribed && (
                        <Banner tone="info">
                          <Text as="p" variant="bodySm">
                            <strong>Free Plan:</strong> Display Mode locked to
                            Mini Music Bar, Color Scheme locked to Light theme.
                            Upgrade to Pro for floating button, dark theme, and
                            full customization options.
                          </Text>
                        </Banner>
                      )}
                    </BlockStack>
                  </Box>
                </Card>

                {/* Floating Button Settings */}
                {settings.displayMode === "button" && (
                  <Card>
                    <Box padding="400">
                      <BlockStack gap="400">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text
                            variant="headingMd"
                            as="h3"
                            fontWeight="semibold"
                          >
                            Floating Button Settings
                          </Text>
                          <Badge tone="info">Basic</Badge>
                        </InlineStack>

                        <Divider />

                        <RangeSlider
                          label="Button Size"
                          value={settings.buttonSize}
                          min={50}
                          max={70}
                          step={5}
                          output
                          suffix="px"
                          onChange={(value) =>
                            updateSetting("buttonSize", value as number)
                          }
                          helpText="Adjust the size of the floating button"
                        />

                        <Select
                          label="Button Position"
                          options={[
                            { label: "Bottom Right", value: "bottom-right" },
                            { label: "Bottom Left", value: "bottom-left" },
                          ]}
                          value={settings.buttonPosition}
                          onChange={(value) =>
                            updateSetting(
                              "buttonPosition",
                              value as "bottom-right" | "bottom-left"
                            )
                          }
                          helpText="Choose the position of the floating button"
                        />
                      </BlockStack>
                    </Box>
                  </Card>
                )}

                {/* Player Appearance Settings */}
                <Card>
                  <Box padding="400">
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h3" fontWeight="semibold">
                          Player Appearance
                        </Text>
                        <Badge tone="success">Pro</Badge>
                      </InlineStack>

                      <Divider />

                      <Checkbox
                        label="Show Album Art"
                        checked={settings.showAlbumArt}
                        onChange={(checked) =>
                          updateSetting("showAlbumArt", checked)
                        }
                        helpText="Display album art in the music player"
                        disabled={!isSubscribed}
                      />

                      <Checkbox
                        label="Show Track Info"
                        checked={settings.showTrackInfo}
                        onChange={(checked) =>
                          updateSetting("showTrackInfo", checked)
                        }
                        helpText="Display track title and artist in the music player"
                        disabled={!isSubscribed}
                      />

                      <RangeSlider
                        label="Player Opacity"
                        value={settings.playerOpacity}
                        min={1}
                        max={100}
                        step={1}
                        output
                        suffix="%"
                        onChange={(value) =>
                          updateSetting("playerOpacity", value as number)
                        }
                        helpText="Adjust the transparency of the player background"
                        disabled={!isSubscribed}
                      />
                    </BlockStack>
                  </Box>
                </Card>

                {/* Playlist Settings */}
                <Card>
                  <Box padding="400">
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h3" fontWeight="semibold">
                          Playlist Settings
                        </Text>
                        <Badge tone="success">Pro</Badge>
                      </InlineStack>

                      <Divider />

                      <Checkbox
                        label="Show Track Duration"
                        checked={settings.showTrackDuration}
                        onChange={(checked) =>
                          updateSetting("showTrackDuration", checked)
                        }
                        helpText="Display the duration of each track in the playlist"
                        disabled={!isSubscribed}
                      />

                      <Checkbox
                        label="Show Artist Name"
                        checked={settings.showArtistName}
                        onChange={(checked) =>
                          updateSetting("showArtistName", checked)
                        }
                        helpText="Display the artist name in the playlist"
                        disabled={!isSubscribed}
                      />
                    </BlockStack>
                  </Box>
                </Card>

                {/* Advanced Settings */}
                <Card>
                  <Box padding="400">
                    <BlockStack gap="400">
                      <InlineStack align="space-between" blockAlign="center">
                        <Text variant="headingMd" as="h3" fontWeight="semibold">
                          Advanced Settings
                        </Text>
                        <Badge tone="success">Pro</Badge>
                      </InlineStack>

                      <Divider />

                      <Checkbox
                        label="Autoplay"
                        checked={settings.autoplay}
                        onChange={(checked) =>
                          updateSetting("autoplay", checked)
                        }
                        helpText="Automatically start playing music when the page loads"
                        disabled={!isSubscribed}
                      />

                      <Checkbox
                        label="Loop Playlist"
                        checked={settings.loop}
                        onChange={(checked) => updateSetting("loop", checked)}
                        helpText="Automatically restart the track when it reaches the end"
                        disabled={!isSubscribed}
                      />

                      <Checkbox
                        label="Shuffle Playlist"
                        checked={settings.shuffle}
                        onChange={(checked) =>
                          updateSetting("shuffle", checked)
                        }
                        helpText="Play tracks in random order"
                        disabled={!isSubscribed}
                      />

                      <Checkbox
                        label="Show Mini Player"
                        checked={settings.showMiniPlayer}
                        onChange={(checked) =>
                          updateSetting("showMiniPlayer", checked)
                        }
                        helpText="Show a mini player bar when the main player is closed"
                        disabled={!isSubscribed}
                      />


                      <Checkbox
                        label="Persistent Playback"
                        checked={settings.persistentPlayback}
                        onChange={(checked) =>
                          updateSetting("persistentPlayback", checked)
                        }
                        helpText="Continue playing music when navigating between pages"
                        disabled={!isSubscribed}
                      />
                    </BlockStack>
                  </Box>
                </Card>
              </BlockStack>
            </Layout.Section>
          </Layout>

          {/* Toast */}
          {toastActive && (
            <Toast
              content={toastMessage}
              error={toastError}
              onDismiss={() => setToastActive(false)}
            />
          )}
        </Page>

        <SaveBar id="music-player-settings-save-bar">
          <button
            variant="primary"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            Save
          </button>
          <button onClick={handleDiscard}>Discard</button>
        </SaveBar>
      </Frame>
    </div>
  );
}
