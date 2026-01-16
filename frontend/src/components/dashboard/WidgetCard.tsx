import { TProductAnalytics } from "../../store/api/shop-analytics/types";


interface WidgetCardProps {
  isLive: boolean;
  widgetName: string;
  widgetMeta: string;
  topProducts?: TProductAnalytics[];
  onEditSettings?: () => void;
  onChangeCollection?: () => void;
  isChangingCollection?: boolean;
}

export const WidgetCard = ({
  isLive,
  widgetName,
  widgetMeta,
  topProducts,
  onEditSettings,
  onChangeCollection,
  isChangingCollection = false,
}: WidgetCardProps) => {
  return (
    <div style={{ position: "relative" }}>
      <s-box
        background="base"
        border="base"
        borderRadius="base"
        padding="base"
      >
        {isLive && (
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "#dcfce7",
              color: "#15803d",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "#22c55e",
                borderRadius: "50%",
              }}
            />
            Live
          </div>
        )}
        <s-stack direction="block" gap="base">
          <s-stack direction="block" gap="small-300">
            <s-stack direction="block" gap="small-300">
              <s-badge tone="info">
                Collection
              </s-badge>
              <span style={{ fontSize: "20px", fontWeight: 600 }}>
                {widgetName}
              </span>
            </s-stack>
            <s-text color="subdued">
              {widgetMeta}
            </s-text>
          </s-stack>
          {(onEditSettings || onChangeCollection) && (
            <s-stack direction="inline" gap="base">
              {onEditSettings && (
                <s-button variant="primary" onClick={onEditSettings}>
                  Edit Settings
                </s-button>
              )}
              {onChangeCollection && (
                <s-button
                  variant="secondary"
                  onClick={onChangeCollection}
                  loading={isChangingCollection}
                  disabled={isChangingCollection}
                >
                  Change Collection
                </s-button>
              )}
            </s-stack>
          )}
          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #e1e3e5",
            }}
          >
            <s-stack direction="block" gap="base">
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#6d7175" }}>
                Top 3 Most Used in Fits
              </span>
              {topProducts && topProducts.length > 0 ? topProducts.map((product, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderBottom: index < topProducts.length - 1 ? "1px solid #f1f2f3" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      background: "#f6f6f7",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#6d7175",
                    }}
                  >
                    {index + 1}
                  </div>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "#e1e3e5",
                      borderRadius: "6px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <s-stack direction="block" gap="small-300">
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>
                        {product.productTitle}
                      </span>
                      <span style={{ fontSize: "12px", color: "#6d7175" }}>
                        {product.totalProductClicks} clicks • {product.shared} fits
                      </span>
                    </s-stack>
                  </div>
                </div>
              )) : (
                <s-text color="subdued">
                  No products used in fits yet. Analytics will appear here once customers start creating fits.
                </s-text>
              )}
            </s-stack>
          </div>
        </s-stack>
      </s-box>
    </div>
  );
};