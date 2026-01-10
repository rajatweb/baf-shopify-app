import { useGetSettingsQuery, useUpdateSettingsMutation } from "../../store/api/settings";

import { AppSkeleton } from "../../components/commons";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { AppearanceSettings, GeneralSettings, BrandingSettings, CanvasSettings, AdditionalSettings, CustomCssSettings } from "../../components/settings";
import { TAdditionalSettings, TAppearanceSettings, TBrandingSettings, TCanvasSettings, TCustomCssSettings, TGeneralSettings, TStoreSettings } from "../../store/api/settings/type";
import _ from "lodash";


const tabs = [
    {
        key: "general",
        label: "General",
        description: "General settings",
    },
    {
        key: "appearance",
        label: "Appearance",
        description: "Appearance settings",
    },
    {
        key: "branding",
        label: "Branding",
        description: "Branding settings",
    },
    {
        key: "canvas",
        label: "Canvas",
        description: "Canvas display options",
    },
    {
        key: "additional",
        label: "Additional",
        description: "Additional settings",
    },
    {
        key: "custom-css",
        label: "Custom CSS",
        description: "Custom CSS settings",
    }
] as const;


const Settings = () => {

    const navigate = useNavigate();

    const [settings, setSettings] = useState<TStoreSettings | null>(null);
    const [activeTab, setActiveTab] = useState("general");

    const [updateStoreSettings, { isLoading }] = useUpdateSettingsMutation();
    const { data: { data: storeSettings } = {}, isFetching } = useGetSettingsQuery();

    useEffect(() => {
        if (storeSettings) {
            setSettings(storeSettings);
        }
    }, [storeSettings]);

    const updateAppearanceSettings = useCallback(
        (appearanceSettings: TAppearanceSettings) => {
            setSettings((prev) => (prev ? { ...prev, appearanceSettings } : null));
        },
        [settings]
    );
    const updateGeneralSettings = useCallback(
        (generalSettings: TGeneralSettings) => {
            setSettings((prev) => (prev ? { ...prev, generalSettings } : null));
        },
        [settings]
    );

    const updateBrandingSettings = useCallback(
        (brandingSettings: TBrandingSettings) => {
            setSettings((prev) => (prev ? { ...prev, brandingSettings } : null));
        },
        [settings]
    );

    const updateCanvasSettings = useCallback(
        (canvasSettings: TCanvasSettings) => {
            setSettings((prev) => (prev ? { ...prev, canvasSettings } : null));
        },
        [settings]
    );

    const updateAdditionalSettings = useCallback(
        (additionalSettings: TAdditionalSettings) => {
            setSettings((prev) => (prev ? { ...prev, additionalSettings } : null));
        },
        [settings]
    );

    const updateCustomCssSettings = useCallback(
        (customCssSettings: TCustomCssSettings) => {
            setSettings((prev) => (prev ? { ...prev, customCssSettings } : null));
        },
        [settings]
    );

    const onHandleSubmit = useCallback(async () => {
        if (settings) {
            try {
                await updateStoreSettings({ settings }).unwrap();
                shopify.toast.show("Store settings successfully updated");
                shopify.saveBar.hide("settings-save-bar");
            } catch (error) {
                if (error instanceof Error) {
                    shopify.toast.show(error.message, {
                        isError: true,
                    });
                } else {
                    shopify.toast.show("Failed to update store settings", {
                        isError: true,
                    });
                }
                shopify.saveBar.hide("settings-save-bar");
            }
        }
    }, [settings, updateStoreSettings]);

    const onDiscardChanges = useCallback(() => {
        if (storeSettings) {
            setSettings({ ...storeSettings });
            shopify.saveBar.hide("settings-save-bar");
        }
    }, [storeSettings]);

    useEffect(() => {
        if (storeSettings && settings) {
            const isEqual = _.isEqual(storeSettings, settings);
            if (!isEqual) {
                shopify.saveBar.show("settings-save-bar");
            } else shopify.saveBar.hide("settings-save-bar");
        }
    }, [settings, storeSettings]);

    if (isFetching) {
        return <AppSkeleton />;
    }

    return (
        <s-page>
            <ui-save-bar id="settings-save-bar">
                <>
                    <button
                        variant="primary"
                        onClick={onHandleSubmit}
                        disabled={isLoading}
                        loading={isLoading}
                    >
                        Save
                    </button>
                    <button onClick={onDiscardChanges} disabled={isLoading}>
                        Discard
                    </button>
                </>
            </ui-save-bar>
            <s-stack
                direction="inline"
                justifyContent="space-between"
                alignItems="center"
                paddingBlock="large"
            >
                <s-stack direction="block" gap="small">
                    <s-heading>Settings</s-heading>
                    <s-text color="subdued">
                        Customize your BAF appearance, behavior,
                    </s-text>
                </s-stack>
                <s-button
                    variant="tertiary"
                    icon="arrow-left"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </s-button>
            </s-stack>
            {!isFetching ? (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                        width: "100%",
                        alignItems: "flex-start",
                    }}
                >
                    {settings ? (
                        <>
                            <div
                                style={{
                                    flex: "0 0 240px",
                                    maxWidth: "280px",
                                    width: "100%",
                                }}
                            >
                                <s-box
                                    background="base"
                                    border="base"
                                    borderRadius="base"
                                    padding="small-300"
                                >
                                    <s-stack direction="block" gap="small-300">
                                        {tabs.map((tab) => {
                                            const isActive = activeTab === tab.key;
                                            return (
                                                <s-clickable
                                                    key={tab.key}
                                                    background={isActive ? "subdued" : "transparent"}
                                                    padding="small-200"
                                                    borderRadius="base"
                                                    border={isActive ? "base" : "none"}
                                                    onClick={() => setActiveTab(tab.key)}
                                                >
                                                    <s-stack direction="block">
                                                        <s-text
                                                            tone={isActive ? "success" : "auto"}
                                                            type="strong"
                                                        >
                                                            {tab.label}
                                                        </s-text>
                                                        {tab.description && (
                                                            <s-text color="subdued">
                                                                {tab.description}
                                                            </s-text>
                                                        )}
                                                    </s-stack>
                                                </s-clickable>
                                            );
                                        })}
                                    </s-stack>
                                </s-box>
                            </div>
                            <div style={{ flex: "1 1 400px", minWidth: "320px" }}>
                                {activeTab === "appearance" && (
                                    <AppearanceSettings appearanceSettings={settings.appearanceSettings} updateSettings={updateAppearanceSettings} />
                                )}
                                {activeTab === "general" && (
                                    <GeneralSettings generalSettings={settings.generalSettings} updateSettings={updateGeneralSettings} />
                                )}
                                {activeTab === "branding" && (
                                    <BrandingSettings brandingSettings={settings.brandingSettings} updateSettings={updateBrandingSettings} />
                                )}
                                {activeTab === "canvas" && (
                                    <CanvasSettings canvasSettings={settings.canvasSettings} updateSettings={updateCanvasSettings} />
                                )}
                                {activeTab === "additional" && (
                                    <AdditionalSettings additionalSettings={settings.additionalSettings} updateSettings={updateAdditionalSettings} />
                                )}
                                {activeTab === "custom-css" && (
                                    <CustomCssSettings customCssSettings={settings.customCssSettings} updateSettings={updateCustomCssSettings} />
                                )}
                            </div>
                        </>) : (
                        <s-stack padding="base">
                            <s-badge tone="critical">Error Fetching Store Settings</s-badge>
                        </s-stack>
                    )}
                </div>
            ) : (
                <s-stack padding="base" alignItems="center">
                    <s-spinner accessibilityLabel="Loading Settings" size="large-100" />
                </s-stack>
            )}
        </s-page>
    );
};

export default Settings;