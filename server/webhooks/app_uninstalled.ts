import { decryptData } from "../utils/encryption";
import prisma from "../utils/prisma";

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
  } catch (error) {
    console.error("Error handling app uninstall:", error);
    throw new Error(`Failed to process app uninstall for shop: ${shop}`);
  }
};

export default appUninstallHandler;
