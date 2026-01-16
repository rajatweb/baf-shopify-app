import { useState, useEffect } from "react";
import { Pagination, Spinner } from "@shopify/polaris";
import AppHeader from "../../components/commons/Header";
import { StatsGrid } from "../../components/dashboard";
import { useLazyGetShopAnalyticsQuery } from "../../store/api/shop-analytics";
import { TProductAnalytics } from "../../store/api/shop-analytics/types";

const timePeriodOptions = [
  { label: "Last 30 days", value: "30" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 90 days", value: "90" },
];

function Analytics() {
  const [timePeriod, setTimePeriod] = useState("30");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [getShopAnalytics, { data: shopAnalytics, isFetching: isLoading }] = useLazyGetShopAnalyticsQuery();

  // Fetch analytics when timePeriod or pagination changes
  useEffect(() => {
    getShopAnalytics({ params: { days: timePeriod, page: pagination.page, limit: pagination.limit } });
  }, [timePeriod, pagination.page, pagination.limit, getShopAnalytics]);

  // Update pagination state when API response changes
  useEffect(() => {
    if (shopAnalytics?.data?.pagination) {
      setPagination(shopAnalytics.data.pagination);
    }
  }, [shopAnalytics]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    // Reset to page 1 when time period changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const analytics = shopAnalytics?.data?.analytics;
  const products = shopAnalytics?.data?.products || [];

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
                handleTimePeriodChange(value);
              }}
            >
              {timePeriodOptions.map((option) => (
                <s-option key={option.value} value={option.value}>
                  {option.label}
                </s-option>
              ))}
            </s-select>
          </div>

          {!analytics && isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Spinner accessibilityLabel="Loading analytics" size="large" />
            </div>
          ) : analytics ? (
            <>
              {/* Stats Grid */}
              <StatsGrid analytics={analytics} />

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
                  {isLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                      <Spinner accessibilityLabel="Loading products" size="large" />
                    </div>
                  ) : products.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "#6d7175" }}>
                      <p>No products found for this time period.</p>
                    </div>
                  ) : (
                    <>
                      {products.map((product: TProductAnalytics, index: number) => {
                        const rank = (pagination.page - 1) * pagination.limit + index + 1;
                        return (
                          <div
                            key={product.productId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 0",
                              borderBottom:
                                index < products.length - 1
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
                              {rank}
                            </div>
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                background: "#e1e3e5",
                                borderRadius: "6px",
                                backgroundImage: product.productImageUrl
                                  ? `url(${product.productImageUrl})`
                                  : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <s-stack direction="block" gap="small-300">
                                <span style={{ fontSize: "13px", fontWeight: 600 }}>
                                  {product.productTitle}
                                </span>
                                <span style={{ fontSize: "12px", color: "#6d7175" }}>
                                  {product.shared} shares • {product.totalProductClicks}{" "}
                                  clicks • ${product.revenue.toFixed(2)} revenue
                                  {product.addToCartCount > 0 && (
                                    <> • {product.addToCartCount} add to carts</>
                                  )}
                                  {product.purchaseCount > 0 && (
                                    <> • {product.purchaseCount} purchases</>
                                  )}
                                </span>
                              </s-stack>
                            </div>
                          </div>
                        );
                      })}

                      {/* Pagination Controls */}
                      {pagination.totalPages > 1 && (
                        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f2f3" }}>
                          <Pagination
                            hasPrevious={pagination.hasPreviousPage}
                            onPrevious={() => handlePageChange(pagination.page - 1)}
                            hasNext={pagination.hasNextPage}
                            onNext={() => handlePageChange(pagination.page + 1)}
                            label={`Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total products)`}
                          />
                        </div>
                      )}
                    </>
                  )}
                </s-stack>
              </s-box>
            </>
          ) : null}
        </s-stack>
      </s-page>
    </div>
  );
}

export default Analytics;
