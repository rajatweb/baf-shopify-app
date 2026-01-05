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