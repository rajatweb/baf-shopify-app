import "dotenv/config";
import crypto from "crypto";

export const updateAppDashboard = async (data: {
  install: boolean;
  email: string;
  storeName: string;
  storeUrl: string;
  shop: string;
  action: string;
}) => {
  if (!process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET) {
    throw new Error("INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET is not set");
  }
  const { action, ...rest } = data;

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
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update app dashboard");
  }

  return response.json();
};

export interface UpdateAppDashboardPlanChangeData {
  planChange: boolean;
  email: string;
  storeName?: string;
  storeUrl: string;
  shop: string;
  action: string;
  // Subscription/Plan information
  subscriptionId?: string;
  subscriptionName?: string;
  subscriptionStatus?: string;
  planName?: string;
  planPrice?: number;
  planCurrency?: string;
  planInterval?: string;
  trialDays?: number;
  isTest?: boolean;
  // Previous plan information (for tracking upgrades/downgrades)
  previousPlanName?: string;
  previousPlanPrice?: number;
  previousPlanStatus?: string;
  // Change metadata
  changeType?: "upgrade" | "downgrade" | "cancel" | "renew" | "trial_start" | "trial_end";
  changeReason?: string;
  // User information
  firstName?: string;
  lastName?: string;
  userId?: number;
  accountOwner?: boolean;
  // Timestamp
  timestamp?: string;
  [key: string]: any; // Allow additional fields for flexibility
}

export const updateAppDashboardPlanChange = async (
  data: UpdateAppDashboardPlanChangeData
) => {
  if (!process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET) {
    throw new Error("INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET is not set");
  }
  const { planChange, action, ...rest } = data;

  // Add timestamp if not provided
  if (!rest.timestamp) {
    rest.timestamp = new Date().toISOString();
  }

  const signature = crypto
    .createHmac("sha256", process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET)
    .update(JSON.stringify(rest))
    .digest("hex");

  const response = await fetch(
    `${process.env.INDUS_ENIGMA_DASHBOARD_URL}/apps/store/${process.env.APP_HANDLE}`,
    {
      method: "PUT",
      body: JSON.stringify(rest),
      headers: {
        "x-signature": signature,
        action: action || "planChange",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to update app dashboard plan change: ${response.status} - ${errorText}`
    );
  }

  return response.json();
};