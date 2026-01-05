import React from "react";
import { Spinner as PolarisSpinner } from "@shopify/polaris";

interface AppSpinnerProps {
  size?: "small" | "large";
  accessibilityLabel?: string;
}

export const AppSpinner: React.FC<AppSpinnerProps> = ({
  size = "large",
  accessibilityLabel = "Loading",
}) => {
  return <PolarisSpinner size={size} accessibilityLabel={accessibilityLabel} />;
};
