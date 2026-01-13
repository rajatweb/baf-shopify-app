import { RequestedTokenType, Session } from "@shopify/shopify-api";
import { Request, Response, NextFunction } from "express";

import sessionHandler from "../utils/sessionHandler";
import shopify from "../utils/shopify";
import freshInstall from "../utils/freshinstall";
import prisma from "../utils/prisma";
import { saveAppMetafiles } from "../utils/appMetafilesProvider";
import { dashboardApi } from "../services/dashboard-api.service";
// Add at the top of the file
const processingShops = new Set<string>();

const initLoad = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const shop = req.query.shop as string;
  const idToken = req.query.id_token as string;

  // If we have both shop and idToken, handle token exchange asynchronously
  if (shop && idToken) {
    // Check if this shop is already being processed
    if (processingShops.has(shop)) {
      console.log(
        `Shop ${shop} is already being processed, skipping duplicate initLoad`
      );
      next();
      return;
    }

    // Mark this shop as being processed
    processingShops.add(shop);

    // Don't await the token exchange, let it happen in the background
    handleTokenExchange(shop, idToken, req, res)
      .catch((error) => {
        // console.error("Error in token exchange:", error);
      })
      .finally(() => {
        // Remove shop from processing set when done
        processingShops.delete(shop);
      });
  }

  // Continue immediately without waiting for token exchange
  next();
};

// Separate function for token exchange
const handleTokenExchange = async (
  shop: string,
  idToken: string,
  req: Request,
  res: Response
) => {
  const { offlineSession, onlineSession } = await exchangeTokens(shop, idToken);

  sessionHandler.storeSession(offlineSession);
  sessionHandler.storeSession(onlineSession);
  shopify.webhooks.register({ session: offlineSession });

  // Call handleFreshInstall with onlineSession after token exchange
  handleFreshInstall(onlineSession, req, res).catch((error) => {
    console.error("Error in fresh install:", error);
    // Don't block the response if fresh install fails
  });
};

const exchangeTokens = async (shop: string, idToken: string) => {
  const offlineSession = (
    await shopify.auth.tokenExchange({
      sessionToken: idToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    })
  ).session;

  const onlineSession = (
    await shopify.auth.tokenExchange({
      sessionToken: idToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    })
  ).session;

  return { offlineSession, onlineSession };
};

const handleFreshInstall = async (
  session: Session,
  req: Request,
  res: Response
) => {
  const existingStore = await prisma.store.findUnique({
    where: { shop: session.shop },
  });
  if (existingStore?.isActive) return;

  // Send installation event to dashboard
  const result = await dashboardApi.install({
    appId: process.env.APP_HANDLE || "build-a-fit",
    name: process.env.APP_NAME || "Build a Fit",
    shop: session.shop,
    storeName: session.shop.split(".")[0],
    storeUrl: session.shop,
    email: session.onlineAccessInfo?.associated_user?.email || "",
    metadata: {
      currency: session.onlineAccessInfo?.associated_user?.locale || "",
      timezone: session.onlineAccessInfo?.associated_user?.locale || "",
      shopOwner:
        session.onlineAccessInfo?.associated_user?.first_name ||
        "" + " " + session.onlineAccessInfo?.associated_user?.last_name ||
        "",
      myshopifyDomain: session.shop,
    },
  });

  if (!result.success) {
    console.error('Failed to send fresh install event:', result.error);
  }

  const freshInstallSubscription = await dashboardApi.subscription({
    appId: process.env.APP_HANDLE || "build-a-fit",
    shop: session.shop,
    subscription: {
      id: "",
      name: "Free Plan",
      status: "ACTIVE",
      cappedAmount: 0,
      isTestSubscription: process.env.SUBSCRIPTION_TEST_MODE?.toString().toLowerCase() === "true" || false,
      trialDays: 0,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date().toISOString(),
      activatedAt: new Date().toISOString(),
      cancelledAt: undefined,
      planInterval: undefined,
      
      planName: "Free Plan",
      planDisplayName: "Free Plan",
      planPrice: 0,
      planCurrency: "USD",
    },
  });

  if (!freshInstallSubscription.success) {
    console.error('Failed to send fresh install subscription event:', freshInstallSubscription.error);
  }

  await freshInstall({
    shop: session.shop,
  });

  await saveAppMetafiles(
    session,
    "url-settings",
    JSON.stringify({
      urlSettings: {
        isHomePageOnly: true,
        excludeUrls: [],
      },
    })
  );

  // await emailService.sendWelcomeEmail(session.onlineAccessInfo?.associated_user?.email || "", session.shop);
};

export default initLoad;
