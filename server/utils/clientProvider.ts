import { Request, Response } from "express";
import sessionHandler from "./sessionHandler";
import shopify from "./shopify";

const fetchOfflineSession = async (shop: string) => {
  const sessionID = shopify.session.getOfflineId(shop);
  const session = await sessionHandler.loadSession(sessionID);
  return session;
};

const offline = {
  graphqlClient: async ({ shop }: { shop: string }) => {
    const session = await fetchOfflineSession(shop);
    const client = new shopify.clients.Graphql({ session: session as any });
    return { client, shop, session };
  },
};

const fetchOnlineSession = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => {
  const sessionID = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });
  const session = await sessionHandler.loadSession(sessionID as string);
  return session;
};

/**
 * Provides methods to create clients for online access.
 * @namespace online
 */
const online = {
  graphqlClient: async ({ req, res }: { req: Request; res: Response }) => {
    const session = await fetchOnlineSession({ req, res });
    const client = new shopify.clients.Graphql({ session: session as any });
    const { shop } = session as any;
    return { client, shop, session };
  },
};

const clientProvider = {
  offline,
  online,
};

export default clientProvider;
