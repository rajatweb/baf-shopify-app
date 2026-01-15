import { useGetThemeStatusQuery } from "../../store/api/store";
import { AlertTriangle } from "lucide-react";

export const ThemeIntegrationWidgetCard = () => {
  const { data: themeStatus, isLoading: isThemeStatusLoading } =
    useGetThemeStatusQuery();

  // @ts-expect-error - process.env is defined in vite.config.ts
  const apiKey: string = process.env.SHOPIFY_API_KEY || "";

  return (
    <div style={{ marginBottom: "18px" }}>
      {isThemeStatusLoading ? (
        <s-box
          background="base"
          border="base"
          borderRadius="base"
          padding="base"
        >
          <s-text color="subdued">Loading theme status...</s-text>
        </s-box>
      ) : themeStatus?.isThemeExtensionDisabled && (
        <s-box
          background="base"
          border="base"
          borderRadius="base"
          padding="base"
        >
          <s-stack direction="inline" gap="small" alignItems="center">
            <AlertTriangle size={18} color="#f59e0b" />
            <div style={{ flex: 1 }}>
              <s-stack direction="block" gap="small-300">
                <div>
                  <s-text type="strong">Theme Integration Required</s-text>
                </div>
                <div style={{ fontSize: "13px" }}>
                  <s-text color="subdued">
                    Enable the app embed in your theme settings, then save your
                    theme for the player to appear on your store.
                  </s-text>
                </div>
              </s-stack>
            </div>
            <s-button
              variant="primary"
              onClick={() =>
                window.open(
                  `shopify://admin/themes/current/editor?context=apps&template=product&activateAppId=${apiKey}/baf-app-widget`,
                  "_blank"
                )
              }
            >
              Enable App Embed
            </s-button>
          </s-stack>
        </s-box>
      )}
    </div>
  );
};
