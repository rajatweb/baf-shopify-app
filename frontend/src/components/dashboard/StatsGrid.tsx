import { TStoreAnalytics } from "../../store/api/shop-analytics/types";

export const StatsGrid = ({ analytics, currentCurrencySymbol, }: { analytics: TStoreAnalytics, currentCurrencySymbol: string, timePeriod?: string }) => {
  const formatChange = (change: { positive: boolean, value: string } | undefined) => {
    if (!change) return { text: "—", class: "neutral" };
    const isPositive = change.positive !== false;
    const prefix = isPositive ? "↑" : "↓";
    return {
      text: `${prefix} ${change.value}`,
      class: isPositive ? "positive" : change.value === "0" || change.value === "—" ? "neutral" : "negative",
    };
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Hero Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "12px",
        }}
      >
        {/* Revenue from Fits */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e3e3e3",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#616161",
              marginBottom: "4px",
            }}
          >
            Revenue from Fits
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            {currentCurrencySymbol}{analytics.totalRevenue.toLocaleString()}
          </div>
          <span
            className={`hero-change ${formatChange(analytics.totalRevenueChange).class}`}
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 500,
              marginTop: "6px",
              color:
                formatChange(analytics.totalRevenueChange).class === "positive"
                  ? "#16a34a"
                  : formatChange(analytics.totalRevenueChange).class === "negative"
                    ? "#dc2626"
                    : "#9ca3af",
            }}
          >
            {formatChange(analytics.totalRevenueChange).text}
          </span>
        </div>

        {/* Fits Shared */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e3e3e3",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#616161",
              marginBottom: "4px",
            }}
          >
            Fits Shared
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            {analytics.totalFitShared.toLocaleString()}
          </div>
          <span
            className={`hero-change ${formatChange(analytics.totalFitSharedChange).class}`}
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 500,
              marginTop: "6px",
              color:
                formatChange(analytics.totalFitSharedChange).class === "positive"
                  ? "#16a34a"
                  : formatChange(analytics.totalFitSharedChange).class === "negative"
                    ? "#dc2626"
                    : "#9ca3af",
            }}
          >
            {formatChange(analytics.totalFitSharedChange).text}
          </span>
        </div>
      </div>

      {/* Secondary Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        {/* Product Clicks */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e3e3e3",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#616161",
              marginBottom: "4px",
            }}
          >
            Product Clicks
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            {analytics.totalClicks.toLocaleString()}
          </div>
          <div
            className={`stat-change ${formatChange(analytics.totalClicksChange).class}`}
            style={{
              fontSize: "11px",
              color:
                formatChange(analytics.totalClicksChange).class === "positive"
                  ? "#16a34a"
                  : "#9ca3af",
              marginTop: "2px",
            }}
          >
            {formatChange(analytics.totalClicksChange).text}
          </div>
        </div>

        {/* Add to Cart */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e3e3e3",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#616161",
              marginBottom: "4px",
            }}
          >
            Add to Cart
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            {analytics.totalAddToCartCount.toLocaleString()}
          </div>
          <div
            className={`stat-change ${formatChange(analytics.totalAddToCartCountChange).class}`}
            style={{
              fontSize: "11px",
              color:
                formatChange(analytics.totalAddToCartCountChange).class === "positive"
                  ? "#16a34a"
                  : "#9ca3af",
              marginTop: "2px",
            }}
          >
            {formatChange(analytics.totalAddToCartCountChange).text}
          </div>
        </div>

        {/* Purchases */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e3e3e3",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#616161",
              marginBottom: "4px",
            }}
          >
            Purchases
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            {analytics.totalPurchaseCount.toLocaleString()}
          </div>
          <div
            className={`stat-change ${formatChange(analytics.totalPurchaseCountChange).class}`}
            style={{
              fontSize: "11px",
              color:
                formatChange(analytics.totalPurchaseCountChange).class === "positive"
                  ? "#16a34a"
                  : "#9ca3af",
              marginTop: "2px",
            }}
          >
            {formatChange(analytics.totalPurchaseCountChange).text}
          </div>
        </div>

        {/* Conversion */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e3e3e3",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#616161",
              marginBottom: "4px",
            }}
          >
            Conversion
          </div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            {analytics.conversionRate.toFixed(1)}%
          </div>
          <div
            className={`stat-change ${formatChange(analytics.conversionRateChange).class}`}
            style={{
              fontSize: "11px",
              color:
                formatChange(analytics.conversionRateChange).class === "positive"
                  ? "#16a34a"
                  : "#9ca3af",
              marginTop: "2px",
            }}
          >
            {formatChange(analytics.conversionRateChange).text}
          </div>
        </div>
      </div>
    </div>
  );
};