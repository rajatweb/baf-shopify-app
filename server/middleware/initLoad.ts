import { RequestedTokenType, Session } from "@shopify/shopify-api";
import { Request, Response, NextFunction } from "express";

import sessionHandler from "../utils/sessionHandler";
import shopify from "../utils/shopify";
import freshInstall from "../utils/freshinstall";
import prisma from "../utils/prisma";
import { OnlineAccessUser } from "@shopify/shopify-api/dist/ts/lib/auth/oauth/types";
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
    handleTokenExchange(shop, idToken).finally(() => {
      // Remove shop from processing set when done
      processingShops.delete(shop);
    });
  }

  // Continue immediately without waiting for token exchange
  next();
};

// Separate function for token exchange
const handleTokenExchange = async (shop: string, idToken: string) => {
  const { offlineSession, onlineSession } = await exchangeTokens(shop, idToken);

  sessionHandler.storeSession(offlineSession);
  sessionHandler.storeSession(onlineSession);
  shopify.webhooks.register({ session: offlineSession });

  // Call handleFreshInstall with onlineSession after token exchange
  handleFreshInstall(onlineSession);
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

const handleFreshInstall = async (session: Session) => {
  const existingStore = await prisma.store.findUnique({
    where: { shop: session.shop },
  });
  if (existingStore?.isActive) return;

  await freshInstall({
    shop: session.shop,
    accessToken: session.accessToken as string,
    userData: session.onlineAccessInfo?.associated_user as OnlineAccessUser,
  });
};

export default initLoad;
