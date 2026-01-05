
import { emailService } from "../services/emailService";
import { decryptData } from "../utils/encryption";
import prisma from "../utils/prisma";
import clientProvider from "../utils/clientProvider";

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
    const userEmail = sessionContent?.onlineAccessInfo?.associated_user?.email;

    console.log("================>>>>", "isStore", isStore);

    if (isStore) {
      // Send deactivation email if store is active
      if (userEmail && isStore.isActive) {
        // await emailService.sendAccountDeactivatedEmail(userEmail, shop);
      }

      // Delete subscription entry
      const deletedSubscription = await prisma.subscription.deleteMany({
        where: {
          shopId: shop,
        },
      });

      console.log(`Successfully cleaned up all data for shop: ${shop}`);
      console.log(`- Deleted subscription entries: ${deletedSubscription.count}`);
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
