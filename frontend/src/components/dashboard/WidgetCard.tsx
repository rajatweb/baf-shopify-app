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
    <div
      style={{
        background: "#fff",
        border: "1px solid #e3e3e3",
        borderRadius: "12px",
      }}
    >
      {/* Widget Header */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#616161",
              textTransform: "uppercase",
              letterSpacing: "0.3px",
              marginBottom: "4px",
            }}
          >
            Collection
          </div>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: "2px",
            }}
          >
            {widgetName || "Build A Fit"}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "#616161",
            }}
          >
            {widgetMeta}
          </div>
        </div>
        {isLive && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#dcfce7",
              color: "#16a34a",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "#22c55e",
                borderRadius: "50%",
              }}
            />
            Live
          </span>
        )}
      </div>

      {/* Widget Actions */}
      <div
        style={{
          padding: "0 20px 20px",
          display: "flex",
          gap: "8px",
        }}
      >
        {onEditSettings && (
          <button
            onClick={onEditSettings}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: "#1a1a1a",
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#333";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a1a1a";
            }}
          >
            Edit Settings
          </button>
        )}
        {onChangeCollection && (
          <button
            onClick={onChangeCollection}
            disabled={isChangingCollection}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isChangingCollection ? "not-allowed" : "pointer",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#1a1a1a",
              opacity: isChangingCollection ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isChangingCollection) {
                e.currentTarget.style.background = "#f9fafb";
              }
            }}
            onMouseLeave={(e) => {
              if (!isChangingCollection) {
                e.currentTarget.style.background = "#fff";
              }
            }}
          >
            {isChangingCollection ? "Changing..." : "Change Collection"}
          </button>
        )}
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "#e3e3e3",
        }}
      />

      {/* Top Products */}
      <div
        style={{
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#616161",
            marginBottom: "16px",
          }}
        >
          Top 3 Most Used in Fits
        </div>
        {topProducts && topProducts.length > 0 ? (
          topProducts.map((product, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 0",
                borderTop: index > 0 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#f3f4f6",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#6b7280",
                }}
              >
                {index + 1}
              </span>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#e5e7eb",
                  borderRadius: "8px",
                  backgroundImage: product.productImageUrl
                    ? `url(${product.productImageUrl})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#1a1a1a",
                  }}
                >
                  {product.productTitle}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  {product.shared || 0} fits • {product.totalProductClicks || 0} clicks
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            No products used in fits yet. Analytics will appear here once customers start creating fits.
          </div>
        )}
      </div>
    </div>
  );
};