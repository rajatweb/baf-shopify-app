import { useEffect, useState } from "react";
import { TGeneralSettings } from "../../store/api/settings/type";
import _ from "lodash";
import { KnobComponent } from "../web-components";

type TProps = {
    generalSettings: TGeneralSettings;
    updateSettings: (settings: TGeneralSettings) => void;
};
export const GeneralSettings = ({ generalSettings, updateSettings }: TProps) => {
    const [settings, setSettings] =
        useState<TGeneralSettings>(generalSettings);
    const [propSnapshot, setPropSnapshot] =
        useState<TGeneralSettings>(generalSettings);

    useEffect(() => {
        if (!_.isEqual(propSnapshot, generalSettings)) {
            setPropSnapshot(generalSettings);
            setSettings(generalSettings);
        }
    }, [generalSettings]);

    // handle change
    const handleChange = (
        key: keyof TGeneralSettings,
        value: string | boolean | number
    ) => {
        setSettings((prev) => ({
            ...prev,
            [key]: value as TGeneralSettings[keyof TGeneralSettings],
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
                    <s-text type="strong">General</s-text>
                    <s-divider />
                    <s-stack direction="block" gap="small">
                        <KnobComponent
                            label="Show Filters"
                            name="showFilters"
                            selected={settings.showFilters}
                            onValueChange={({ name, value }) => handleChange(name as keyof TGeneralSettings, value)}
                            description="Display filter pills to filter products by type (e.g. Hats, Jackets, Pants)"
                        />
                        <KnobComponent
                            label="Hide Sold Out"
                            name="hideSoldOut"
                            selected={settings.hideSoldOut}
                            onValueChange={({ name, value }) => handleChange(name as keyof TGeneralSettings, value)}
                            description="Hides products from the list when all variants are sold out"
                        />
                    </s-stack>
                </s-stack>
            </s-box>
        </s-stack>
    );
};