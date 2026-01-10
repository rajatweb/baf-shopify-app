// import { emailService } from "../services/emailService";
import prisma from "../utils/prisma";
import { decryptData } from "../utils/encryption";
import { updateAppDashboard } from "../services/indusenigma";

// Add request tracking
const processedRequestIds = new Set<string>();

const appUninstallHandler = async (
  topic: string,
  shop: string,
  webhookRequestBody: any,
  webhookId: string,
  apiVersion: string
) => {
  console.log("webhookId", webhookId);
  console.log("================>>>>", "topic", topic);
  console.log("================>>>>", "webhookRequestBody", webhookRequestBody);
  console.log("================>>>>", "shop", shop);
  console.log("================>>>>", "webhookId", webhookId);
  console.log("================>>>>", "apiVersion", apiVersion);

  // Check if this request was already processed
  if (processedRequestIds.has(webhookId)) {
    console.log(
      `Webhook ${webhookId} for shop ${shop} already processed, skipping`
    );
    return;
  }

  // Mark this request as processed
  processedRequestIds.add(webhookId);

  try {
    const webhookBody = JSON.parse(webhookRequestBody);
    const isStore = await prisma.store.findUnique({
      where: {
        shop: shop,
      },
    });

    const session = await prisma.session.findFirst({
      where: {
        shop: shop,
        isOnline: true,
      },
    });

    const sessionContent = decryptData(session?.content || "");
    const user = sessionContent?.onlineAccessInfo?.associated_user;
    const userEmail = user?.email;

    console.log("================>>>>", "isStore", isStore);

    if (isStore) {
      // Send deactivation email if store is active
      if (userEmail && isStore.isActive) {
        // await emailService.sendAccountDeactivatedEmail(userEmail, shop);
      }

      // Delete subscription entry
      const deletedSubscription = await prisma.store.deleteMany({
        where: {
          shop: shop,
        },
      });

      await updateAppDashboard({
        install: false,
        email: userEmail || webhookBody.customer_email || webhookBody.email || "",
        storeName: webhookBody.name || "",
        storeUrl: shop,
        shop: shop,
        action: "uninstall",
        // User information for analytics and marketing
        firstName: user?.first_name,
        lastName: user?.last_name,
        locale: user?.locale,
        accountOwner: user?.account_owner,
        emailVerified: user?.email_verified,
        collaborator: user?.collaborator,
        userId: user?.id,
        // Shop information from webhook for analytics
        planName: webhookBody.plan_name,
        planDisplayName: webhookBody.plan_display_name,
        currency: webhookBody.currency,
        country: webhookBody.country,
        countryCode: webhookBody.country_code,
        countryName: webhookBody.country_name,
        timezone: webhookBody.timezone,
        ianaTimezone: webhookBody.iana_timezone,
        shopOwner: webhookBody.shop_owner,
        customerEmail: webhookBody.customer_email,
        myshopifyDomain: webhookBody.myshopify_domain,
        shopifyPlus: webhookBody.plan_name?.toLowerCase().includes("plus"),
        // Additional shop metadata
        hasStorefront: webhookBody.has_storefront,
        eligibleForPayments: webhookBody.eligible_for_payments,
        passwordEnabled: webhookBody.password_enabled,
        multiLocationEnabled: webhookBody.multi_location_enabled,
        createdAt: webhookBody.created_at,
        updatedAt: webhookBody.updated_at,
      });

      console.log(`Successfully cleaned up all data for shop: ${shop}`);
      console.log(
        `- Deleted subscription entries: ${deletedSubscription.count}`
      );
      console.log(`- Deleted all conditions, logs, and sessions`);
    } else {
      console.log(`Store not found for shop: ${shop}`);
    }
  } catch (error) {
    console.error("Error handling app uninstall:", error);
    throw new Error(`Failed to process app uninstall for shop: ${shop}`);
  }
};

export default appUninstallHandler;
