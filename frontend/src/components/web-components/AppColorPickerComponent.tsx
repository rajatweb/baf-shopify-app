import { useState, useEffect } from "react";

interface AppColorPickerProps {
  defaultColor?: string;
  setDefaultColor: (name: string, color: string) => void;
  label: string;
  description?: string;
  name: string;
  disabled?: boolean;
}

const AppColorPicker = ({
  defaultColor = "#00ff00",
  setDefaultColor,
  label,
  description,
  name,
  disabled,
}: AppColorPickerProps) => {
  const [color, setColor] = useState<string>(defaultColor);
  const [inputColor, setInputColor] = useState<string>(
    defaultColor.replace("#", "")
  );

  useEffect(() => {
    if (defaultColor && defaultColor !== color) {
      setColor(defaultColor);
      setInputColor(defaultColor.replace("#", ""));
    }
  }, [defaultColor]);

  const handleColorChange = (name: string, newColor: string) => {
    if (disabled) return;
    setColor(newColor);
    setInputColor(newColor.replace("#", ""));
    setDefaultColor(name, newColor);
  };

  const handleInputChange = (name: string, value: string) => {
    if (disabled) return;
    // Only allow hex characters
    const hexValue = value.replace(/[^0-9A-Fa-f]/g, "").substring(0, 6);
    setInputColor(hexValue);

    // Update color when we have a valid 6-character hex code
    if (hexValue.length === 6) {
      const newColor = `#${hexValue}`;
      setColor(newColor);
      setDefaultColor(name, newColor);
    }
  };

  return (
    <s-box paddingBlockStart="small">
      <s-stack direction="block" gap="small">
        <s-text type="strong" opacity={disabled ? "subdued" : undefined}>{label}</s-text>
        <s-clickable
          disabled={disabled}
          commandFor={`color-picker-${name}`}
          padding="small"
          borderRadius="base"
          border="base"
          style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
        >
          <s-stack direction="inline" gap="small" alignItems="center">
            <div
              style={{
                background: color,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                borderRadius: "var(--p-border-radius-100)",
                width: "24px",
                height: "24px",
                opacity: disabled ? 0.5 : 1,
              }}
            />
            <s-text opacity={disabled ? "subdued" : undefined}>{color.toUpperCase()}</s-text>
          </s-stack>
        </s-clickable>
        {description && <s-text color="subdued">{description}</s-text>}
        <s-popover id={`color-picker-${name}`}>
          <s-box background="base" padding="base">
            <s-stack direction="block" gap="small">
              <s-color-picker
                name={name}
                value={color}
                disabled={disabled}
                onChange={(event) => {
                  const target = event.target as HTMLInputElement;
                  if (target && target.value && !disabled) {
                    handleColorChange(name, target.value);
                  }
                }}
              />
              <s-stack direction="block" gap="small">
                <s-stack direction="inline" gap="small" alignItems="center">
                  <div
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "var(--p-border-radius-200)",
                      backgroundColor: color,
                      boxShadow: "rgba(0, 0, 0, 0.19) 0px 0px 0px 1px inset",
                      opacity: disabled ? 0.5 : 1,
                    }}
                  />
                  <s-text-field
                    label="Color value"
                    name="color-input"
                    labelAccessibilityVisibility="exclusive"
                    value={inputColor}
                    disabled={disabled}
                    onChange={(event) => {
                      const target = event.target as HTMLInputElement;
                      if (!disabled) {
                        handleInputChange(name, target.value);
                      }
                    }}
                    prefix="#"
                  />
                </s-stack>
                <s-stack direction="block" gap="small">
                  <s-text color="subdued">Default color</s-text>
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      cursor: disabled ? "not-allowed" : "pointer",
                      borderRadius: "var(--p-border-radius-100)",
                      backgroundColor: defaultColor,
                      boxShadow: "rgba(0, 0, 0, 0.19) 0px 0px 0px 1px inset",
                      opacity: disabled ? 0.5 : 1,
                    }}
                    onClick={() => {
                      if (defaultColor && !disabled) {
                        handleColorChange(name, defaultColor);
                      }
                    }}
                  />
                </s-stack>
              </s-stack>
            </s-stack>
          </s-box>
        </s-popover>
      </s-stack>
    </s-box>
  );
};

export default AppColorPicker;
