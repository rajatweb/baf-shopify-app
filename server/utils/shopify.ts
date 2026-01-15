import "dotenv/config";
import "@shopify/shopify-api/adapters/node";

import {
  LogSeverity,
  shopifyApi,
  LATEST_API_VERSION,
} from "@shopify/shopify-api";

// Setup Shopify configuration
let shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY || "",
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  scopes: process.env.SHOPIFY_API_SCOPES?.split(",") || ["write_products"],
  hostName: process.env.SHOPIFY_APP_URL?.replace(/https?:\/\//, "") || "",
  hostScheme: "https",
  isEmbeddedApp: true,
  apiVersion: LATEST_API_VERSION,
  future: {
    lineItemBilling: true,
    customerAddressDefaultFix: true,
    unstable_managedPricingSupport: true,
  },
  logger: {
    level:
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "stage"
        ? LogSeverity.Debug
        : LogSeverity.Error,
  },
});

const webhooksTopic = [
  {
    topics: ["app/uninstalled"],
    url: "/api/webhooks/app_uninstalled",
  },
  {
    topics: ["app_subscriptions/update"],
    url: "/api/webhooks/app_subscription",
  },
  { topics: ["orders/create"], url: "/api/webhooks/app_orders" },
];

export default shopify;
export { webhooksTopic };
