import { RangeSlider } from "@shopify/polaris";
import { TRangeSliderProps } from "./types";

export const RangeSliderComponent = ({
  value,
  min,
  max,
  step,
  name,
  label,
  onValueChange,
  prefix,
  suffix,
  isTextField,
  details,
  disabled = false,
}: TRangeSliderProps) => {
  return (
    <s-stack direction="block" gap="small">
      <s-stack
        direction="inline"
        inlineSize="100%"
        gap="small"
        justifyContent="center"
        alignContent="center"
      >
        <s-box inlineSize="70%">
          <RangeSlider
            label={label}
            value={value}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={(value: number) => {
              if (!disabled) {
                onValueChange({ name, value });
              }
            }}
          />
        </s-box>
        <s-box inlineSize="28%" paddingBlock="base">
          {isTextField && (
            <s-text-field
              label="rangeSlider"
              labelAccessibilityVisibility="exclusive"
              value={String(value)}
              prefix={prefix}
              suffix={suffix}
              disabled={disabled}
            />
          )}
        </s-box>
      </s-stack>
      {details && (
        <s-text tone="info">
          {details}
        </s-text>
      )}
    </s-stack>
  );
};
