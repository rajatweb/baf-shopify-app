import { TCanvasSettings } from "../../store/api/settings/type";
import { useEffect, useState } from "react";
import _ from "lodash";
import { KnobComponent } from "../web-components";

type TProps = {
    canvasSettings: TCanvasSettings;
    updateSettings: (settings: TCanvasSettings) => void;
};
export const CanvasSettings = ({ canvasSettings, updateSettings }: TProps) => {
    const [settings, setSettings] =
        useState<TCanvasSettings>(canvasSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TCanvasSettings>(canvasSettings);

    useEffect(() => {
        if (!_.isEqual(propSnapshot, canvasSettings)) {
            setPropSnapshot(canvasSettings);
            setSettings(canvasSettings);
        }
    }, [canvasSettings]);

    // handle change
    const handleChange = (
        key: keyof TCanvasSettings,
        value: string | boolean | number
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value as TCanvasSettings[keyof TCanvasSettings],
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
                    <s-text type="strong">Canvas</s-text>
                    <s-divider />
                    <s-stack direction="block" gap="small">
                        <KnobComponent
                            label="Show product name on canvas"
                            name="showProductLabels"
                            selected={settings.showProductLabels}
                            onValueChange={({ name, value }) => handleChange(name as keyof TCanvasSettings, value)}
                            description="Briefly displays the product name when items are selected or hovered on the canvas"
                        />
                    </s-stack>
                </s-stack>
            </s-box>
        </s-stack>
    );
};