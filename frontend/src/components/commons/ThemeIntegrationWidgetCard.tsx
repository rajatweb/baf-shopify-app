import { useGetThemeStatusQuery } from "../../store/api/store";
import { AlertTriangle, Check } from "lucide-react";

export const ThemeIntegrationWidgetCard = () => {
  const { data: themeStatus, isLoading: isThemeStatusLoading } =
    useGetThemeStatusQuery();

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
      ) : themeStatus?.isThemeExtensionDisabled ? (
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
                  `shopify://admin/themes/current/editor?context=apps&template=product&activateAppId=${process.env.SHOPIFY_API_KEY}/music_player`,
                  "_blank"
                )
              }
            >
              Enable App Embed
            </s-button>
          </s-stack>
        </s-box>
      ) : (
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              color: "#15803d",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Check size={16} color="#15803d" />
            <s-text type="strong">Theme integration active</s-text>
          </div>
        </div>
      )}
    </div>
  );
};
