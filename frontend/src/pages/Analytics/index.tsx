import { useState, useEffect, useMemo } from "react";
import { Pagination, Spinner } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { StatsGrid } from "../../components/dashboard";
import { useLazyGetShopAnalyticsQuery } from "../../store/api/shop-analytics";
import { TProductAnalytics } from "../../store/api/shop-analytics/types";
import { useGetShopQuery } from "../../store/api/shop";

const timePeriodOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

type SortOption = "revenue" | "clicks" | "shares" | "atc" | "sold";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Revenue", value: "revenue" },
  { label: "Clicks", value: "clicks" },
  { label: "Shares", value: "shares" },
  { label: "ATC", value: "atc" },
  { label: "Sold", value: "sold" },
];

function Analytics() {
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("30");
  const [sortBy, setSortBy] = useState<SortOption>("revenue");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [getShopAnalytics, { data: shopAnalytics, isFetching: isLoading }] = useLazyGetShopAnalyticsQuery();
  const { data: { data: shopData } = {}, isLoading: isShopLoading } = useGetShopQuery();

  const storeCurrencySymbol = useMemo(() => shopData?.currencyFormats?.currencySymbol || "$", [shopData]);
  // Fetch analytics when timePeriod changes (fetch all products for client-side sorting)
  useEffect(() => {
    getShopAnalytics({ params: { days: timePeriod, page: 1, limit: 1000 } });
    // Reset to page 1 when time period changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [timePeriod, getShopAnalytics]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    // Reset to page 1 when time period changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    // Reset to page 1 when sort changes
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const analytics = shopAnalytics?.data?.analytics;
  const allProducts = shopAnalytics?.data?.products || [];

  // Sort products client-side
  const sortedProducts = useMemo(() => {
    const sorted = [...allProducts];
    sorted.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case "revenue":
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case "clicks":
          aValue = a.totalProductClicks;
          bValue = b.totalProductClicks;
          break;
        case "shares":
          aValue = a.shared;
          bValue = b.shared;
          break;
        case "atc":
          aValue = a.addToCartCount;
          bValue = b.addToCartCount;
          break;
        case "sold":
          aValue = a.purchaseCount;
          bValue = b.purchaseCount;
          break;
        default:
          return 0;
      }

      return bValue - aValue; // Descending order
    });
    return sorted;
  }, [allProducts, sortBy]);

  // Paginate sorted products
  const products = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return sortedProducts.slice(start, end);
  }, [sortedProducts, pagination.page, pagination.limit]);

  // Update pagination total based on sorted products
  const paginationWithSortedTotal = useMemo(() => {
    return {
      ...pagination,
      total: sortedProducts.length,
      totalPages: Math.ceil(sortedProducts.length / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(sortedProducts.length / pagination.limit),
      hasPreviousPage: pagination.page > 1,
    };
  }, [pagination, sortedProducts.length]);

  return (
    <div
      style={{
        marginTop: "var(--p-space-800)",
        paddingBottom: "var(--p-space-1600)",
      }}
    >
      <s-page>
        <s-link slot="breadcrumb-actions" href="/">
          Home
        </s-link>
        <s-button
          slot="secondary-actions"
          variant="secondary"
          icon="arrow-left"
          onClick={() => navigate("/")}
        >
          Back to Home
        </s-button>

        <s-stack direction="block" gap="base">
          {/* Header with Title and Time Period Selector */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: 0,
                color: "#1a1a1a",
              }}
            >
              Analytics
            </h1>
            <div style={{ width: "200px" }}>
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
          </div>

          {!analytics && (isLoading || isShopLoading) ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "40px 20px",
                width: "100%",
              }}
            >
              <Spinner accessibilityLabel="Loading analytics" size="large" />
            </div>
          ) : analytics ? (
            <>
              {/* Stats Grid */}
              <StatsGrid analytics={analytics} currentCurrencySymbol={storeCurrencySymbol} timePeriod={timePeriod} />

              {/* Top Products Card */}
              <s-box
                background="base"
                border="base"
                borderRadius="base"
                padding="base"
              >
                <s-stack direction="block" gap="base">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <s-text type="strong">Top Products in Fits</s-text>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6d7175",
                          marginTop: "4px",
                        }}
                      >
                        Based on selected time period.
                      </div>
                    </div>
                    <div style={{ width: "180px" }}>
                      <s-select
                        name="sortBy"
                        value={sortBy}
                        onChange={(event) => {
                          const { value } = event.target as HTMLSelectElement;
                          handleSortChange(value);
                        }}
                      >
                        {sortOptions.map((option) => (
                          <s-option key={option.value} value={option.value}>
                            Sort by {option.label}
                          </s-option>
                        ))}
                      </s-select>
                    </div>
                  </div>
                  {isLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "40px 20px",
                      }}
                    >
                      <Spinner accessibilityLabel="Loading products" size="large" />
                    </div>
                  ) : sortedProducts.length === 0 ? (
                    <div
                      style={{
                        padding: "40px 20px",
                        textAlign: "center",
                      }}
                    >
                      <s-text color="subdued">
                        No products found for this time period.
                      </s-text>
                    </div>
                  ) : (
                    <>
                      {/* Table */}
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "13px",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                borderBottom: "1px solid #e5e7eb",
                                textAlign: "left",
                              }}
                            >
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  width: "40px",
                                }}
                              >
                                #
                              </th>
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                PRODUCT
                              </th>
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  textAlign: "right",
                                }}
                              >
                                CLICKS
                              </th>
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  textAlign: "right",
                                }}
                              >
                                SHARES
                              </th>
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  textAlign: "right",
                                }}
                              >
                                ATC
                              </th>
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  textAlign: "right",
                                }}
                              >
                                SOLD
                              </th>
                              <th
                                style={{
                                  padding: "12px 16px",
                                  fontWeight: 600,
                                  color: "#6d7175",
                                  fontSize: "11px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                  textAlign: "right",
                                }}
                              >
                                REVENUE
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product: TProductAnalytics, index: number) => {
                              const rank = (pagination.page - 1) * pagination.limit + index + 1;
                              return (
                                <tr
                                  key={product.productId}
                                  style={{
                                    borderBottom:
                                      index < products.length - 1
                                        ? "1px solid #f3f4f6"
                                        : "none",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "16px",
                                      color: "#6d7175",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {rank}
                                  </td>
                                  <td style={{ padding: "16px" }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                      }}
                                    >
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
                                          flexShrink: 0,
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: 600,
                                          color: "#1a1a1a",
                                        }}
                                      >
                                        {product.productTitle}
                                      </span>
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      padding: "16px",
                                      textAlign: "right",
                                      color: "#374151",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.totalProductClicks.toLocaleString()}
                                  </td>
                                  <td
                                    style={{
                                      padding: "16px",
                                      textAlign: "right",
                                      color: "#374151",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.shared.toLocaleString()}
                                  </td>
                                  <td
                                    style={{
                                      padding: "16px",
                                      textAlign: "right",
                                      color: "#374151",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.addToCartCount.toLocaleString()}
                                  </td>
                                  <td
                                    style={{
                                      padding: "16px",
                                      textAlign: "right",
                                      color: "#374151",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {product.purchaseCount.toLocaleString()}
                                  </td>
                                  <td
                                    style={{
                                      padding: "16px",
                                      textAlign: "right",
                                      color: "#1a1a1a",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {storeCurrencySymbol}
                                    {product.revenue.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {paginationWithSortedTotal.totalPages > 1 && (
                        <div
                          style={{
                            marginTop: "24px",
                            paddingTop: "16px",
                            borderTop: "1px solid #f1f2f3",
                            overflowX: "auto",
                          }}
                        >
                          <Pagination
                            hasPrevious={paginationWithSortedTotal.hasPreviousPage}
                            onPrevious={() => handlePageChange(pagination.page - 1)}
                            hasNext={paginationWithSortedTotal.hasNextPage}
                            onNext={() => handlePageChange(pagination.page + 1)}
                            label={`Page ${pagination.page} of ${paginationWithSortedTotal.totalPages} (${paginationWithSortedTotal.total} total products)`}
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
