import "dotenv/config";
import fs from "fs";
import toml from "@iarna/toml";
import webhookWriter from "./web-hook-write";
import path from "path";

// Read the existing TOML file
const shopifyFilePath = path.join(process.cwd(), "./", "shopify.app.toml");
const tomlFile = fs.readFileSync(shopifyFilePath, "utf-8");
const config = toml.parse(tomlFile);

let appUrl = process.env.SHOPIFY_APP_URL;
if (appUrl && appUrl.endsWith("/")) {
  appUrl = appUrl.slice(0, -1);
}

// Globals
config.name = process.env.APP_NAME || "";
config.handle = process.env.APP_HANDLE || "";
config.client_id = process.env.SHOPIFY_API_KEY || "";
config.application_url = appUrl || "";
config.embedded = process.env.EMBEDDED === "true" || false;

// Auth
config.auth = {};
config.auth.redirect_urls = [
  `${appUrl}/api/auth`,
  `${appUrl}/api/auth/callback`,
];

// Scopes
config.access_scopes = {};
config.access_scopes.scopes = process.env.SHOPIFY_API_SCOPES || "";

// Access
config.access = {};
config.access.admin = {};
config.access.admin.direct_api_mode = "offline";
config.access.admin.embedded_app_direct_api_access = false;

// Webhooks
config.webhooks = {};
config.webhooks.api_version = process.env.SHOPIFY_API_VERSION || "2024-10";
config.webhooks.subscriptions = [
  {
    topics: ["app/uninstalled"],
    compliance_topics: [
      "customers/redact",
      "customers/data_request",
      "shop/redact"
    ],
    uri: "/webhooks"
  }
];

// App Proxy
if (process.env.APP_PROXY_PREFIX && process.env.APP_PROXY_SUBPATH) {
  config.app_proxy = {};
  config.app_proxy.url = `${appUrl}/api/proxy`;
  config.app_proxy.prefix = process.env.APP_PROXY_PREFIX;
  config.app_proxy.subpath = process.env.APP_PROXY_SUBPATH;
}

// PoS
config.pos = {};
config.pos.embedded = process.env.POS_EMBEDDED === "true" || false;

// App Preferences
config.app_preferences = {};
config.app_preferences.url = `${appUrl}/preferences`;

// Build
config.build = {};
config.build.automatically_update_urls_on_dev = false;
config.build.include_config_on_deploy = true;

// Webhooks
webhookWriter(config);

// GDPR URLs
config.webhooks.privacy_compliance = {};
config.webhooks.privacy_compliance.customer_data_request_url = `${appUrl}/api/gdpr/customers_data_request`;
config.webhooks.privacy_compliance.customer_deletion_url = `${appUrl}/api/gdpr/customers_redact`;
config.webhooks.privacy_compliance.shop_deletion_url = `${appUrl}/api/gdpr/shop_redact`;

// Write the updated TOML file
fs.writeFileSync(shopifyFilePath, toml.stringify(config));
console.log("TOML file updated successfully");
