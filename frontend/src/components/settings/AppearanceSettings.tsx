import { useEffect, useState } from "react";
import { TAppearanceSettings } from "../../store/api/settings/type";
import _ from "lodash";
import { KnobComponent, SelectComponent, TextFieldComponent } from "../web-components";

type TProps = {
    appearanceSettings: TAppearanceSettings;
    updateSettings: (settings: TAppearanceSettings) => void;
};
export const AppearanceSettings = ({ appearanceSettings, updateSettings }: TProps) => {
    const [settings, setSettings] =
        useState<TAppearanceSettings>(appearanceSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TAppearanceSettings>(appearanceSettings);

    useEffect(() => {
        if (!_.isEqual(propSnapshot, appearanceSettings)) {
            setPropSnapshot(appearanceSettings);
            setSettings(appearanceSettings);
        }
    }, [appearanceSettings]);

    // handle change
    const handleChange = (
        key: keyof TAppearanceSettings,
        value: string | boolean | number
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value as TAppearanceSettings[keyof TAppearanceSettings],
        }));
    };

    useEffect(() => {
        const isEqual = _.isEqual(settings, propSnapshot);
        if (!isEqual) {
            updateSettings(settings);
        }
    }, [settings, propSnapshot]);


    const colorSchemeOptions = [
        { label: "Dark Mode", value: "dark" },
        { label: "Light Mode", value: "light" },
    ];

    const widgetPositionOptions = [
        { label: "Bottom Right", value: "bottom-right" },
        { label: "Bottom Left", value: "bottom-left" },
    ]

    return (
        <s-stack direction="block" gap="base">
            <s-box background="base" border="base" borderRadius="base" padding="base">
                <s-stack direction="block" gap="small">
                    <s-text type="strong">Display & Theme</s-text>
                    <s-divider />
                    <s-stack direction="block" gap="small">
                        <SelectComponent
                            label="Widget Position"
                            options={widgetPositionOptions}
                            value={settings.position}
                            name="position"
                            onValueChange={({ name, value }) =>
                                handleChange(name as keyof TAppearanceSettings, value)
                            }
                            details="Choose the position of the widget"
                        />
                        <SelectComponent
                            label="Color Theme"
                            options={colorSchemeOptions}
                            value={settings.theme}
                            name="theme"
                            onValueChange={({ name, value }) =>
                                handleChange(name as keyof TAppearanceSettings, value)
                            }
                            details="Light: white background with black accents. Dark: black background with white accents"
                        />
                    </s-stack>
                </s-stack>
            </s-box>
            <s-box background="base" border="base" borderRadius="base" padding="base">
                <s-stack direction="block" gap="small">
                    <s-text type="strong">Visual Effects</s-text>
                    <s-divider />
                    <s-stack direction="block" gap="small">
                        <KnobComponent
                            label="Show Button Text"
                            name="showButtonText"
                            selected={settings.showButtonText}
                            onValueChange={({ name, value }) => {
                                handleChange(name as keyof TAppearanceSettings, value);
                            }}
                            description="Display text next to the icon on the widget button"
                        />
                        {settings.showButtonText && (
                            <TextFieldComponent
                                label="Button Text"
                                name="buttonText"
                                value={settings.buttonText}
                                maxLength={15}
                                onValueChange={({ name, value }) => {
                                    handleChange(name as keyof TAppearanceSettings, value);
                                }}
                                details="Customize the widget button text (max 15 characters)"
                            />
                        )}
                    </s-stack>
                </s-stack>
            </s-box>
        </s-stack>
    );
};