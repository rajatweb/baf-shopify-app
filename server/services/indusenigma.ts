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

  console.log("================>>>>", "Response", response);

  if (!response.ok) {
    throw new Error("Failed to update app dashboard");
  }

  return response.json();
};


export const updateAppDashboardPlanChange = async (data: {
  shop: string;
  name: string;
  status: string;
  admin_graphql_api_shop_id: string;
  created_at: string;
  updated_at: string;
  currency: string;
  capped_amount?: string;
  plan_price?: number;
  plan_interval?: string;
  test?: boolean; 
}) => {
  if (!process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET) {
    throw new Error("INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET is not set");
  }

  const signature = crypto
    .createHmac("sha256", process.env.INDUS_ENIGMA_DASHBOARD_WEBHOOK_SECRET)
    .update(JSON.stringify(data))
    .digest("hex");

  const response = await fetch(
    `${process.env.INDUS_ENIGMA_DASHBOARD_URL}/apps/store/${process.env.APP_HANDLE}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "x-signature": signature,
        action: "planChange",
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