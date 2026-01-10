import { useEffect, useState } from "react";
import { TextAreaComponent } from "../web-components";
import { TCustomCssSettings } from "../../store/api/settings/type";
import _ from "lodash";

type TProps = {
  customCssSettings: TCustomCssSettings;
  updateSettings: (settings: TCustomCssSettings) => void;
  disabled?: boolean;
};

const CustomCssSettings = ({ customCssSettings, updateSettings, disabled = false }: TProps) => {
  const [settings, setSettings] = useState<TCustomCssSettings>(customCssSettings);
  const [propSnapshot, setPropSnapshot] = useState<TCustomCssSettings>(customCssSettings);

  useEffect(() => {
    if (!_.isEqual(propSnapshot, customCssSettings)) {
      setPropSnapshot(customCssSettings);
      setSettings(customCssSettings);
    }
  }, [customCssSettings]);

  const handleChange = (key: keyof TCustomCssSettings, value: string | boolean | number) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value as TCustomCssSettings[keyof TCustomCssSettings],
    }));
  };

  useEffect(() => {
    const isEqual = _.isEqual(settings, propSnapshot);
    if (!isEqual) {
      updateSettings(settings);
    }
  }, [settings, propSnapshot, updateSettings]);

  return (
    <s-stack direction="block" gap="small" background={disabled ? "subdued" : "base"} padding="base" blockSize="100%" >
      <s-stack direction="inline" justifyContent="space-between" alignItems="center">
        <s-text type="strong">Custom CSS</s-text>
        {settings.customCss && settings.customCss.length > 0 && (
          <s-button variant="primary" disabled={disabled} onClick={() => handleChange("customCss", "")}>
            Reset CSS
          </s-button>
        )}
      </s-stack>
      <s-divider />

      <s-stack direction="block" gap="small">
        <TextAreaComponent
          rows={20}
          value={settings.customCss || ""}
          name="customCss"
          label="Custom CSS Rules"
          disabled={disabled}
          details="Advanced users only. Custom CSS modifications are not supported."
          onValueChange={({ name, value }) =>
            handleChange(name as keyof TCustomCssSettings, value)
          }
        />
      </s-stack>
    </s-stack>
  );
};

export default CustomCssSettings;