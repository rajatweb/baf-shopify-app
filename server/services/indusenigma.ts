import "dotenv/config";
import crypto from "crypto";

export interface UpdateAppDashboardData {
  install: boolean;
  email: string;
  storeName?: string;
  storeUrl: string;
  shop: string;
  action: string;
  // User information for analytics and marketing
  firstName?: string;
  lastName?: string;
  locale?: string;
  accountOwner?: boolean;
  emailVerified?: boolean;
  collaborator?: boolean;
  userId?: number;
  // Shop information for analytics
  planName?: string;
  planDisplayName?: string;
  currency?: string;
  country?: string;
  countryCode?: string;
  countryName?: string;
  timezone?: string;
  ianaTimezone?: string;
  shopOwner?: string;
  customerEmail?: string;
  myshopifyDomain?: string;
  shopifyPlus?: boolean;
  // Additional metadata
  timestamp?: string;
  [key: string]: any; // Allow additional fields for flexibility
}

export const updateAppDashboard = async (data: UpdateAppDashboardData) => {
  if (!process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET) {
    throw new Error("INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET is not set");
  }

  const { action, ...rest } = data;

  // Add timestamp if not provided
  if (!rest.timestamp) {
    rest.timestamp = new Date().toISOString();
  }

  const signature = crypto
    .createHmac("sha256", process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET)
    .update(action)
    .digest("hex");

  const response = await fetch(
    `${process.env.INDUS_ENIGMA_DASHBOARD_URL}/apps/store/${process.env.APP_HANDLE}`,
    {
      method: "POST",
      body: JSON.stringify(rest),
      headers: {
        "x-signature": signature,
        action,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update app dashboard: ${response.status} - ${errorText}`
    );
  }

  return response.json();
};