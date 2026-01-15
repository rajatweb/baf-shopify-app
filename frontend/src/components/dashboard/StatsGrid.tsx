import { TStoreAnalytics } from "../../store/api/shop-analytics/types";

export const StatsGrid = ({ analytics }: { analytics: TStoreAnalytics }) => {
  const stats = [
    {
      label: "Revenue",
      value: analytics.totalRevenue,
      change: analytics.totalRevenueChange,
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      label: "Fits Shared",
      value: analytics.totalFitsShared,
      change: analytics.totalFitsSharedChange,
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      label: "Product Clicks",
      value: analytics.totalClicks,
      change: analytics.totalClicksChange,
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      label: "Add to Cart",
      value: analytics.totalAddToCartCount,
      change: analytics.totalAddToCartCountChange,
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      label: "Purchases",
      value: analytics.totalPurchaseCount,
      change: analytics.totalPurchaseCountChange,
      formatter: (val: number) => val.toLocaleString(),
    },
    {
      label: "Conversion",
      value: analytics.conversionRate,
      change: analytics.conversionRateChange,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {stats.map((stat, index) => (
        <s-box
          key={index}
          background="base"
          border="base"
          borderRadius="base"
          padding="base"
        >
          <s-stack direction="block" gap="small-300">
            <span style={{ fontSize: "13px", color: "#6d7175" }}>
              {stat.label}
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700 }}>
              {stat.formatter(stat.value)}
            </span>
            {stat.change && (
              <span
                style={{
                  fontSize: "12px",
                  color: stat.change.positive !== false ? "#16a34a" : "#dc2626",
                }}
              >
                {stat.change.positive !== false ? "↑" : "↓"} {stat.change.value}
              </span>
            )}
          </s-stack>
        </s-box>
      ))}
    </div>
  );
};