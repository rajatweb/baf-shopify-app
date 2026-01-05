"use client";

import {
  Box,
  ColorPicker,
  Popover,
  Text,
  TextField,
  InlineStack,
} from "@shopify/polaris";
import { useState, useEffect, useCallback } from "react";

// Function to convert HSL to HEX
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${rHex}${gHex}${bHex}`;
};

// Function to validate hex color
const isValidHex = (hex: string): boolean => {
  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  return hexRegex.test(hex);
};

interface AppColorPickerProps {
  defaultColor?: string;
  setDefaultColor: (color: string) => void;
  label: string;
  error?: string;
}

const AppColorPicker = ({
  defaultColor = "#000000",
  setDefaultColor,
  label,
  error,
}: AppColorPickerProps) => {
  const [color, setColor] = useState<string>(defaultColor);
  const [active, setActive] = useState(false);
  const [inputColor, setInputColor] = useState<string>(
    defaultColor.replace("#", "")
  );
  const [inputError, setInputError] = useState<string>("");

  useEffect(() => {
    if (defaultColor !== color) {
      setColor(defaultColor);
      setInputColor(defaultColor.replace("#", ""));
    }
  }, [defaultColor]);

  // Convert HEX to HSL for the ColorPicker component
  const hexToHsl = useCallback((hex: string) => {
    // Remove the hash at the start if it's there
    hex = hex.replace("#", "");

    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (diff !== 0) {
      s = diff / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
        default:
          break;
      }
      h *= 60;
    }

    return {
      hue: h,
      saturation: s,
      brightness: l,
    };
  }, []);

  const handleColorChange = useCallback((newColor: {
    hue: number;
    saturation: number;
    brightness: number;
  }) => {
    const { hue, saturation, brightness } = newColor;
    const newHex = hslToHex(hue, saturation * 100, brightness * 100);
    setColor(newHex);
    setInputColor(newHex.replace("#", ""));
    setDefaultColor(newHex);
    setInputError("");
  }, [setDefaultColor]);

  const handleInputChange = useCallback((value: string) => {
    setInputColor(value);
    setInputError("");

    if (value.length === 6) {
      const newColor = `#${value}`;
      if (isValidHex(newColor)) {
        setColor(newColor);
        setDefaultColor(newColor);
      } else {
        setInputError("Invalid color code");
      }
    }
  }, [setDefaultColor]);

  const handleDefaultColorClick = useCallback(() => {
    setColor(defaultColor);
    setInputColor(defaultColor.replace("#", ""));
    setDefaultColor(defaultColor);
    setInputError("");
  }, [defaultColor, setDefaultColor]);

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--p-space-300)",
        alignItems: "center",
      }}
    >
      {/* Color Swatch */}
      <Popover
        active={active}
        activator={
          <div
            style={{ 
              borderRadius: "100%",
              cursor: "pointer",
              padding: "2px",
              border: error ? "2px solid var(--p-color-bg-critical)" : "none"
            }}
            onClick={() => setActive((value) => !value)}
          >
            <div
              style={{
                borderRadius: "100%",
                background:
                  "repeating-conic-gradient(var(--p-color-bg-surface) 0 25%, var(--p-color-bg-surface-secondary) 0 50%) 50% / var(--p-space-200) var(--p-space-200)",
                boxShadow: "rgba(0, 0, 0, 0.19) 0px 0px 0px 0.0625rem inset",
                width: "2rem",
                height: "2rem",
              }}
            >
              <div
                style={{
                  background: color,
                  borderRadius: "inherit",
                  boxShadow: "inherit",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        }
        preferredPosition="below"
        preferredAlignment="left"
        autofocusTarget="first-node"
        onClose={() => setActive(false)}
      >
        <Box background="bg-surface" padding="200">
          <ColorPicker onChange={handleColorChange} color={hexToHsl(color)} />
          <div
            style={{
              marginTop: "var(--p-space-200)",
              width: "12rem",
            }}
          >
            <InlineStack gap="200" align="start">
              <div
                style={{
                  width: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "var(--p-border-radius-200)",
                  backgroundColor: color,
                  boxShadow: "rgba(0, 0, 0, 0.19) 0px 0px 0px 1px inset",
                }}
              />
              <TextField
                label="Color value"
                labelHidden
                type="text"
                value={inputColor}
                onChange={handleInputChange}
                prefix="#"
                autoComplete="off"
                error={inputError}
              />
            </InlineStack>
            <div style={{ marginTop: "var(--p-space-200)" }}>
              <Text variant="bodySm" as="p" tone="subdued">
                Default color
              </Text>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "var(--p-space-100)",
                  marginTop: "var(--p-space-200)",
                }}
              >
                <div
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    cursor: "pointer",
                    borderRadius: "var(--p-border-radius-100)",
                    backgroundColor: defaultColor,
                    boxShadow: "rgba(0, 0, 0, 0.19) 0px 0px 0px 1px inset",
                  }}
                  onClick={handleDefaultColorClick}
                />
              </div>
            </div>
          </div>
        </Box>
      </Popover>

      {/* Color Label and HEX */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Text variant="bodySm" as="p" fontWeight="bold">
          {label}
        </Text>
        <Text variant="bodySm" as="p" tone={error ? "critical" : "subdued"}>
          {color}
        </Text>
        {error && (
          <Text variant="bodySm" as="p" tone="critical">
            {error}
          </Text>
        )}
      </div>
    </div>
  );
};

export default AppColorPicker;
