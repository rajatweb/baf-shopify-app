import { useCallback, useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../store/api/settings";
import { AppSkeleton } from "../../components/commons";
import {
  SelectComponent,
  TextFieldComponent,
  KnobComponent,
} from "../../components/web-components";
import {
  TAdditionalSettings,
  TBrandingSettings,
  TGeneralSettings,
  TCanvasSettings,
  TStoreSettings,
  TUrlSettings,
} from "../../store/api/settings/type";
import _ from "lodash";
import {
  AdditionalSettings,
  BrandingSettings,
  CanvasSettings,
  GeneralSettings,
} from "../../components/settings";
import RestrictedWrapper from "../../components/guard/RestrictedHandler";

function Settings() {
  const { data: { data: settings } = {}, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [localSettings, setLocalSettings] = useState<TStoreSettings | null>(
    null
  );
  const shopify = useAppBridge();
  const navigate = useNavigate();

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

  const handleBrandingSetttings = useCallback(
    (brandingSettings: TBrandingSettings) => {
      if (localSettings) {
        setLocalSettings({
          ...localSettings,
          brandingSettings: brandingSettings,
        });
      }
    },
    [localSettings]
  );

  const handleAdditionalAndUrlSettings = useCallback(
    ({
      additionalSettings,
      urlSettings,
    }: {
      additionalSettings: TAdditionalSettings;
      urlSettings: TUrlSettings;
    }) => {
      if (localSettings) {
        setLocalSettings({
          ...localSettings,
          additionalSettings: additionalSettings,
          urlSettings: urlSettings,
        });
      }
    },
    [localSettings]
  );

  const handleCanvasSettings = useCallback(
    (canvasSettings: TCanvasSettings) => {
      if (localSettings) {
        setLocalSettings({
          ...localSettings,
          canvasSettings: canvasSettings,
        });
      }
    }, [localSettings]
  );

  const handleGeneralSettings = useCallback(
    (generalSettings: TGeneralSettings) => {
      if (localSettings) {
        setLocalSettings({
          ...localSettings,
          generalSettings: generalSettings,
        });
      }
    },
    [localSettings]
  );

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
    <div
      style={{
        marginTop: "var(--p-space-800)",
        paddingBottom: "var(--p-space-1600)",
      }}
    >
      <s-page heading="Settings">
        <s-link slot="breadcrumb-actions" href="/">
          Home
        </s-link>
        <s-button
          slot="secondary-actions"
          variant="secondary"
          icon="arrow-left"
          onClick={() => navigate("/")}
        >
          Back to Home
        </s-button>
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

        <s-stack direction="block" gap="base">
          {/* Widget Section */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="small">
              <s-text type="strong">Widget</s-text>
              <s-divider />
              <s-stack direction="block" gap="small">
                <s-stack direction="inline" gap="base" alignItems="start">
                  <div style={{ flex: 1 }}>
                    <s-box paddingBlockStart="small">
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
                    </s-box>
                  </div>
                  <div style={{ flex: 1 }}>
                    <SelectComponent
                      label="Position"
                      name="position"
                      value={
                        localSettings.appearanceSettings?.position ||
                        "bottom-right"
                      }
                      options={[
                        { label: "Bottom Right", value: "bottom-right" },
                        { label: "Bottom Left", value: "bottom-left" },
                      ]}
                      onValueChange={({ name, value }) =>
                        handleChange("appearanceSettings", name, value)
                      }
                    />
                  </div>
                </s-stack>
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
          <GeneralSettings
            generalSettings={localSettings.generalSettings}
            updateSettings={(settings) => handleGeneralSettings(settings)}
          />

          <CanvasSettings
            canvasSettings={localSettings.canvasSettings}
            updateSettings={(settings) => handleCanvasSettings(settings)}
          />

          {/* Additional Section */}
          <RestrictedWrapper sectionId="homepage-only" mode="disabled">
            <AdditionalSettings
              additionalSettings={{
                additionalSettings: localSettings.additionalSettings,
                urlSettings: localSettings.urlSettings,
              }}
              updateSettings={(settings) =>
                handleAdditionalAndUrlSettings(settings)
              }
            />
          </RestrictedWrapper>

          {/* Branding Section */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="small">
              <s-stack direction="block" gap="small-300">
                <s-text type="strong">Branding</s-text>
                <s-text color="subdued">
                  Your logo + store URL appears on all exported fits
                </s-text>
              </s-stack>
              <s-divider />
              <RestrictedWrapper sectionId="custom-branding" mode="disabled">
                <BrandingSettings
                  brandingSettings={localSettings.brandingSettings}
                  updateSettings={(settings) => handleBrandingSetttings(settings)}
                />
              </RestrictedWrapper>
            </s-stack>
          </s-box>
        </s-stack>
      </s-page>
    </div>
  );
}

export default Settings;
