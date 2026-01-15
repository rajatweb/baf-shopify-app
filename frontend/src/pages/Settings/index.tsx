import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../store/api/settings";
import { AppSkeleton } from "../../components/commons";
import AppHeader from "../../components/commons/Header";
import {
  SelectComponent,
  TextFieldComponent,
  KnobComponent,
} from "../../components/web-components";
import { TAdditionalSettings, TBrandingSettings, TGeneralSettings, TStoreSettings, TUrlSettings } from "../../store/api/settings/type";
import _ from "lodash";
import { AdditionalSettings, BrandingSettings, GeneralSettings } from "../../components/settings";

function Settings() {
  const { data: { data: settings } = {}, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [localSettings, setLocalSettings] = useState<TStoreSettings | null>(
    null
  );
  const shopify = useAppBridge()

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = useCallback(async () => {
    if (localSettings) {
      try {
        await updateSettings({ settings: localSettings }).unwrap();
        shopify.toast.show("Settings saved successfully");
        shopify.saveBar.hide("settings-save-bar");
      } catch (error) {
        if (error instanceof Error) {
          shopify.toast.show(error.message, { isError: true });
        } else {
          shopify.toast.show("Failed to save settings", { isError: true });
        }
        shopify.saveBar.hide("settings-save-bar");
      }
    }
  }, [localSettings, updateSettings, shopify]);

  const handleDiscard = useCallback(() => {
    if (settings) {
      setLocalSettings(settings);
      shopify.saveBar.hide("settings-save-bar");
    }
  }, [settings, shopify]);

  const handleChange = useCallback(
    (
      section: keyof TStoreSettings,
      key: string,
      value: string | boolean | number
    ) => {
      if (localSettings) {
        setLocalSettings({
          ...localSettings,
          [section]: {
            ...localSettings[section],
            [key]: value,
          },
        });
      }
    },
    [localSettings]
  );

  const handleBrandingSetttings = useCallback((brandingSettings: TBrandingSettings) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        brandingSettings: brandingSettings,
      });
    }
  }, [localSettings])

  const handleAdditionalAndUrlSettings = useCallback(({ additionalSettings, urlSettings }: { additionalSettings: TAdditionalSettings; urlSettings: TUrlSettings }) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        additionalSettings: additionalSettings,
        urlSettings: urlSettings,
      });
    }
  }, [localSettings]);

  const handleGeneralSettings = useCallback((generalSettings: TGeneralSettings) => {
    if (localSettings) {
      setLocalSettings({
        ...localSettings,
        generalSettings: generalSettings,
      });
    }
  }, [localSettings]);

  useEffect(() => {
    if (settings && localSettings) {
      const isEqual = _.isEqual(settings, localSettings);
      if (!isEqual) {
        shopify.saveBar.show("settings-save-bar");
      } else {
        shopify.saveBar.hide("settings-save-bar");
      }
    }
  }, [localSettings, settings, shopify]);

  if (isLoading || !localSettings) {
    return <AppSkeleton />;
  }

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <s-page>
        <ui-save-bar id="settings-save-bar">
          <>
            <button
              variant="primary"
              onClick={handleSave}
              disabled={isUpdating}
              loading={isUpdating}
            >
              Save
            </button>
            <button onClick={handleDiscard} disabled={isUpdating}>
              Discard
            </button>
          </>
        </ui-save-bar>
        <AppHeader
          title="Settings"
          subtitle="Customize your BAF appearance, behavior, and branding"
          showBackButton={true}
          backButtonPath="/"
          backButtonLabel="Back"
        />

        <s-stack direction="block" gap="base">

          {/* Widget Section */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="base">
              <span style={{ fontSize: "16px", fontWeight: 600 }}>Widget</span>
              <s-stack direction="block" gap="base">
                <TextFieldComponent
                  label="Button Text"
                  name="buttonText"
                  value={
                    localSettings.appearanceSettings?.buttonText ||
                    "Build A Fit"
                  }
                  onValueChange={({ name, value }) =>
                    handleChange("appearanceSettings", name, value)
                  }
                  maxLength={15}
                />
                <SelectComponent
                  label="Position"
                  name="position"
                  value={
                    localSettings.appearanceSettings?.position || "bottom-right"
                  }
                  options={[
                    { label: "Bottom Right", value: "bottom-right" },
                    { label: "Bottom Left", value: "bottom-left" },
                  ]}
                  onValueChange={({ name, value }) =>
                    handleChange("appearanceSettings", name, value)
                  }
                />
                <SelectComponent
                  label="Color Theme"
                  name="theme"
                  value={localSettings.appearanceSettings?.theme || "light"}
                  options={[
                    { label: "Light Mode", value: "light" },
                    { label: "Dark Mode", value: "dark" },
                  ]}
                  onValueChange={({ name, value }) =>
                    handleChange("appearanceSettings", name, value)
                  }
                />
                <s-divider />
                <KnobComponent
                  label="Show button text"
                  name="showButtonText"
                  selected={
                    localSettings.appearanceSettings?.showButtonText || false
                  }
                  onValueChange={({ name, value }) =>
                    handleChange("appearanceSettings", name, value)
                  }
                  description="Display text next to icon"
                />
              </s-stack>
            </s-stack>
          </s-box>

          {/* General Section */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="base">
              <GeneralSettings
                generalSettings={localSettings.generalSettings}
                updateSettings={(settings) => handleGeneralSettings(settings)}
              />
            </s-stack>
          </s-box>

          {/* Additional Section */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="base">
              <AdditionalSettings
                additionalSettings={{ additionalSettings: localSettings.additionalSettings, urlSettings: localSettings.urlSettings }}
                updateSettings={(settings) => handleAdditionalAndUrlSettings(settings)}
              />
            </s-stack>
          </s-box>

          {/* Branding Section */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="base">
              <s-stack direction="block" gap="small-300">
                <span style={{ fontSize: "16px", fontWeight: 600 }}>
                  Branding
                </span>
                <span style={{ fontSize: "13px", color: "#6d7175" }}>
                  Your logo + store URL appears on all exported fits
                </span>
              </s-stack>
              <s-divider />
              <BrandingSettings
                brandingSettings={localSettings.brandingSettings}
                updateSettings={(settings) => handleBrandingSetttings(settings)}
              />

            </s-stack>
          </s-box>
        </s-stack>
      </s-page>
    </div>
  );
}

export default Settings;
