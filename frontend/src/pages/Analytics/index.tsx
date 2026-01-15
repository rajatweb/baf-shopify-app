import { useState } from "react";
import AppHeader from "../../components/commons/Header";
import { StatsGrid } from "../../components/dashboard";

interface TopProduct {
  rank: number;
  name: string;
  fitsCount: number;
  clicksCount: number;
  revenue: number;
}

// Dummy data for analytics
const dummyAnalyticsStats = [
  {
    label: "Revenue from Fits",
    value: "$847",
    change: { value: "23% vs last period", positive: true },
  },
  {
    label: "Fits Shared",
    value: 156,
    change: { value: "12% vs last period", positive: true },
  },
  {
    label: "Product Clicks",
    value: 1247,
    change: { value: "8% vs last period", positive: true },
  },
  {
    label: "Add to Carts",
    value: 89,
    change: { value: "31% vs last period", positive: true },
  },
];

const dummyTopProducts: TopProduct[] = [
  {
    rank: 1,
    name: "Classic White Tee",
    fitsCount: 67,
    clicksCount: 23,
    revenue: 127,
  },
  {
    rank: 2,
    name: "Vintage Denim Jacket",
    fitsCount: 54,
    clicksCount: 19,
    revenue: 285,
  },
  {
    rank: 3,
    name: "High-Rise Straight Jeans",
    fitsCount: 48,
    clicksCount: 31,
    revenue: 186,
  },
];

const timePeriodOptions = [
  { label: "Last 30 days", value: "30" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 90 days", value: "90" },
];

function Analytics() {
  const [timePeriod, setTimePeriod] = useState("30");

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <s-page>
        <AppHeader
          title="Analytics"
          subtitle="Track engagement and revenue from Build A Fit"
          showBackButton={true}
          backButtonPath="/"
          backButtonLabel="Back"
        />

        <s-stack direction="block" gap="base">
          {/* Time Period Selector */}
          <div style={{ marginBottom: "24px", maxWidth: "200px" }}>
            <s-select
              name="timePeriod"
              value={timePeriod}
              onChange={(event) => {
                const { value } = event.target as HTMLSelectElement;
                setTimePeriod(value);
              }}
            >
              {timePeriodOptions.map((option) => (
                <s-option key={option.value} value={option.value}>
                  {option.label}
                </s-option>
              ))}
            </s-select>
          </div>

          {/* Stats Grid */}
          <StatsGrid stats={dummyAnalyticsStats} />

          {/* Top Products Card */}
          <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
          >
            <s-stack direction="block" gap="base">
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  marginBottom: "16px",
                }}
              >
                Top Products in Fits
              </span>
              {dummyTopProducts.map((product, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderBottom:
                      index < dummyTopProducts.length - 1
                        ? "1px solid #f1f2f3"
                        : "none",
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
                        Used in {product.fitsCount} fits • {product.clicksCount}{" "}
                        clicks • ${product.revenue} revenue
                      </span>
                    </s-stack>
                  </div>
                </div>
              ))}
            </s-stack>
          </s-box>
        </s-stack>
      </s-page>
    </div>
  );
}

export default Analytics;
