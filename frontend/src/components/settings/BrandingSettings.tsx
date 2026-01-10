import { TBrandingSettings } from "../../store/api/settings/type";
import { useEffect, useState } from "react";
import _ from "lodash";
import { KnobComponent } from "../web-components";

type TProps = {
    brandingSettings: TBrandingSettings;
    updateSettings: (settings: TBrandingSettings) => void;
};
export const BrandingSettings = ({ brandingSettings, updateSettings }: TProps) => {
    const [settings, setSettings] =
        useState<TBrandingSettings>(brandingSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TBrandingSettings>(brandingSettings);

    useEffect(() => {
        if (!_.isEqual(propSnapshot, brandingSettings)) {
            setPropSnapshot(brandingSettings);
            setSettings(brandingSettings);
        }
    }, [brandingSettings]);

    // handle change
    const handleChange = (
        key: keyof TBrandingSettings,
        value: string | boolean | number
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value as TBrandingSettings[keyof TBrandingSettings],
        }));
    };

    useEffect(() => {
        const isEqual = _.isEqual(settings, propSnapshot);
        if (!isEqual) {
            updateSettings(settings);
        }
    }, [settings, propSnapshot]);

    return (
        <s-stack direction="block" gap="base">
            <s-box background="base" border="base" borderRadius="base" padding="base">
                <s-stack direction="block" gap="small">
                    <s-text type="strong">Branding</s-text>
                    <s-divider />
                    <s-stack direction="block" gap="small">
                        <KnobComponent
                            label="Show branding on shared images"
                            name="showWatermark"
                            selected={settings.showWatermark}
                            onValueChange={({ name, value }) => handleChange(name as keyof TBrandingSettings, value)}
                            description="Adds your logo and store URL to shared/downloaded images"
                        />
                    </s-stack>
                </s-stack>
            </s-box>
        </s-stack>
    );
};