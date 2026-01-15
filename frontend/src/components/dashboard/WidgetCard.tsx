interface TopProduct {
  rank: number;
  name: string;
  fitsCount: number;
  clicksCount: number;
}

interface WidgetCardProps {
  isLive: boolean;
  widgetName: string;
  widgetMeta: string;
  topProducts?: TopProduct[];
  onEditSettings?: () => void;
  onChangeCollection?: () => void;
}

export const WidgetCard = ({
  isLive,
  widgetName,
  widgetMeta,
  topProducts,
  onEditSettings,
  onChangeCollection,
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
            <span style={{ fontSize: "20px", fontWeight: 600 }}>
              {widgetName}
            </span>
            <span style={{ fontSize: "14px", color: "#6d7175" }}>
              {widgetMeta}
            </span>
          </s-stack>
          {(onEditSettings || onChangeCollection) && (
            <s-stack direction="inline" gap="base">
              {onEditSettings && (
                <s-button variant="primary" onClick={onEditSettings}>
                  Edit Settings
                </s-button>
              )}
              {onChangeCollection && (
                <s-button variant="secondary" onClick={onChangeCollection}>
                  Change Collection
                </s-button>
              )}
            </s-stack>
          )}
          {topProducts && topProducts.length > 0 && (
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
                {topProducts.map((product, index) => (
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
                      {product.rank}
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
                          {product.name}
                        </span>
                        <span style={{ fontSize: "12px", color: "#6d7175" }}>
                          {product.fitsCount} fits • {product.clicksCount} clicks
                        </span>
                      </s-stack>
                    </div>
                  </div>
                ))}
              </s-stack>
            </div>
          )}
        </s-stack>
      </s-box>
    </div>
  );
};