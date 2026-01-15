export type TProductAnalytics = {
  productId: string;
  productTitle: string;
  productImageUrl: string;
  revenue: number;
  totalProductClicks: number;
  shared: number;
  addToCartCount: number;
  purchaseCount: number;
  conversionRate: number;
};

export type TPercentageChange = {
  value: string;
  positive: boolean;
};

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type TStoreAnalytics = {
  shop: string;
  totalRevenue: number;
  totalRevenueChange: TPercentageChange;
  totalFitsShared: number;
  totalFitsSharedChange: TPercentageChange;
  totalClicks: number;
  totalClicksChange: TPercentageChange;
  totalFitShared: number;
  totalFitSharedChange: TPercentageChange;
  totalAddToCartCount: number;
  totalAddToCartCountChange: TPercentageChange;
  totalPurchaseCount: number;
  totalPurchaseCountChange: TPercentageChange;
  conversionRate: number;
  conversionRateChange: TPercentageChange;
  createdAt: string;
  updatedAt: string;
};

export type TShopAnalytics = {
  status: number;
  message?: string;
  data?: {
    analytics: TStoreAnalytics;
    products: TProductAnalytics[];
    pagination: TPagination;
  };
};
