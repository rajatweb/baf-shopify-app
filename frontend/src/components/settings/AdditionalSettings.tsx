import { useCallback, useEffect, useState } from "react";
import { TAdditionalSettings, TUrlSettings } from "../../store/api/settings/type";
import _ from "lodash";
import { KnobComponent } from "../web-components";

type TAdditionalSettingsWithUrlSettings = { additionalSettings: TAdditionalSettings; urlSettings: TUrlSettings };
type TProps = {
    additionalSettings: TAdditionalSettingsWithUrlSettings;
    updateSettings: (settings: TAdditionalSettingsWithUrlSettings) => void;
    disabled?: boolean;
};
export const AdditionalSettings = ({ additionalSettings, updateSettings, disabled }: TProps) => {
    const [settings, setSettings] =
        useState<TAdditionalSettingsWithUrlSettings>(additionalSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TAdditionalSettingsWithUrlSettings>(additionalSettings);

    useEffect(() => {
        if (!_.isEqual(propSnapshot, additionalSettings)) {
            setPropSnapshot(additionalSettings);
            setSettings(additionalSettings);
        }
    }, [additionalSettings]);

    // handle change
    const handleChange = (
        key: keyof TAdditionalSettings,
        value: string | boolean | number
    ) => {
        setSettings((prev) => ({
            ...prev,
            additionalSettings: {
                ...prev.additionalSettings,
                [key]: value as TAdditionalSettings[keyof TAdditionalSettings],
            },
        }));
    };

    const handleUrlSettingsChange = (key: keyof TUrlSettings, value: string | boolean | number) => {
        setSettings((prev) => ({
            ...prev,
            urlSettings: {
                ...prev.urlSettings,
                [key]: value as TUrlSettings[keyof TUrlSettings],
            },
        }));
    };

    const handleAddExcludeUrl = useCallback(() => {
        setSettings((prev) => ({
            ...prev,
            urlSettings: {
                ...prev.urlSettings,
                excludeUrls: [...prev.urlSettings.excludeUrls, ""],
            },
        }));
    }, []);

    const handleRemoveExcludeUrl = useCallback((excludeUrls: string[], index: number) => {
        const filteredUrls = excludeUrls.filter((_item, key) => key !== index);
        setSettings((prev) => ({
            ...prev,
            urlSettings: { ...prev.urlSettings, excludeUrls: filteredUrls },
        }));
    }, []);

    const handleExclusiveUrlChange = useCallback(
        (excludeUrls: string[], index: number, value: string) => {
            const filteredUrls = excludeUrls.map((item, key) => {
                if (key !== index) {
                    return item;
                } else return value;
            });
            setSettings((prev) => ({
                ...prev,
                urlSettings: { ...prev.urlSettings, excludeUrls: filteredUrls },
            }));
        },
        []
    );


    useEffect(() => {
        const isEqual = _.isEqual(settings, propSnapshot);
        if (!isEqual) {
            updateSettings(settings);
        }
    }, [settings, propSnapshot]);

    return (<s-stack direction="block" gap="base">
        <s-box background="base" border="base" borderRadius="base" padding="base">
            <s-stack direction="block" gap="small">
                <s-text type="strong">Additional</s-text>
                <s-divider />
                <s-stack direction="block" gap="small">
                    <KnobComponent
                        label="Enable Add to Cart"
                        name="enableAddToCart"
                        selected={settings.additionalSettings.enableAddToCart}
                        onValueChange={({ name, value }: { name: string, value: boolean }) => handleChange(name as keyof TAdditionalSettings, value)}
                    />
                </s-stack>
            </s-stack>
        </s-box>
        <s-box background={disabled ? "subdued" : "base"} border="base" borderRadius="base" padding="base">
            <s-stack direction="block" gap="small">
                <s-text type="strong">URL Visibility Settings</s-text>
                <s-divider />
                <s-stack direction="block" gap="small">
                    <KnobComponent
                        label="HomePage Only"
                        name="isHomePageOnly"
                        selected={settings.urlSettings.isHomePageOnly}
                        onValueChange={({ name, value }) => {
                            handleUrlSettingsChange(name as keyof TUrlSettings, value);
                        }}
                        disabled={disabled}
                        description="Widget visibility on homepage only"
                    />
                    <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}>
                        {!settings.urlSettings.isHomePageOnly && (
                            <s-stack direction="block" gap="small">
                                <s-divider />
                                <s-stack direction="block" gap="small">
                                    <s-text color="subdued">
                                        Excluded URLs will hide the music player widget on specific pages
                                    </s-text>
                                    <s-stack direction="block" gap="small">
                                        {settings.urlSettings.excludeUrls.map((item, key) => (
                                            <s-stack key={key} direction="inline" gap="small" alignItems="end">
                                                <s-url-field
                                                    name={item}
                                                    value={item}
                                                    placeholder="/password"
                                                    label="URL"
                                                    labelAccessibilityVisibility="exclusive"
                                                    onChange={(event) => {
                                                        const target = event.target as HTMLInputElement;
                                                        handleExclusiveUrlChange(settings.urlSettings.excludeUrls, key, target.value);
                                                    }}
                                                />
                                                <s-button
                                                    icon="delete"
                                                    onClick={() => handleRemoveExcludeUrl(settings.urlSettings.excludeUrls, key)}
                                                >
                                                    Remove
                                                </s-button>
                                            </s-stack>
                                        ))}
                                    </s-stack>
                                    <s-button icon="note-add" onClick={handleAddExcludeUrl}>
                                        Add URL to exclude music player widget
                                    </s-button>
                                </s-stack>
                            </s-stack>
                        )}
                    </div>

                </s-stack>
            </s-stack>
        </s-box>

    </s-stack>

    );
};