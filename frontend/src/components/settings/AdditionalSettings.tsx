import { useEffect, useState } from "react";
import { TAdditionalSettings } from "../../store/api/settings/type";
import _ from "lodash";
import { KnobComponent } from "../web-components";
type TProps = {
    additionalSettings: TAdditionalSettings;
    updateSettings: (settings: TAdditionalSettings) => void;
};
export const AdditionalSettings = ({ additionalSettings, updateSettings }: TProps) => {
    const [settings, setSettings] =
        useState<TAdditionalSettings>(additionalSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TAdditionalSettings>(additionalSettings);

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
            [key]: value as TAdditionalSettings[keyof TAdditionalSettings],
        }));
    };

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
                        selected={settings.enableAddToCart}
                        onValueChange={({ name, value }: { name: string, value: boolean }) => handleChange(name as keyof TAdditionalSettings, value)}
                    />
                </s-stack>
            </s-stack>
        </s-box>
    </s-stack>

    );
};