import clientProvider from "./clientProvider";
import shopify from "./shopify";
import { Request, Response } from "express";
import { Session } from "@shopify/shopify-api";

/**
 * Saves app metafiles to Shopify.
 * Can be called with either req/res (for request-based contexts) or a Session object (for background tasks).
 * 
 * @param reqOrSession - Either Express Request object or Shopify Session object
 * @param resOrMetafieldKey - Either Express Response object or metafield key (when using Session)
 * @param metafieldKeyOrData - Metafield key (when using req/res) or data string (when using Session)
 * @param data - Data string (only required when using req/res)
 */
export const saveAppMetafiles = async (
  reqOrSession: Request | Session,
  resOrMetafieldKey?: Response | string,
  metafieldKeyOrData?: string,
  data?: string
) => {
  let client: any;
  let metafieldKey: string;
  let metafieldData: string;

  // Check if first parameter is a Session object (has 'shop' and 'accessToken' properties, but not 'method' which Request has)
  const isSession = 
    'shop' in reqOrSession && 
    'accessToken' in reqOrSession && 
    !('method' in reqOrSession);

  if (isSession) {
    // Using Session object directly
    const session = reqOrSession as Session;
    if (!session?.accessToken || !session.shop) {
      throw new Error("Invalid session object passed to saveAppMetafiles");
    }
    client = new shopify.clients.Graphql({ session });
    metafieldKey = resOrMetafieldKey as string;
    metafieldData = metafieldKeyOrData as string;
  } else {
    // Using req/res (original behavior)
    const req = reqOrSession as Request;
    const res = resOrMetafieldKey as Response;
    if (!res) {
      throw new Error("Response object is required when using Request");
    }
    const { client: graphqlClient } = await clientProvider.online.graphqlClient({
      req,
      res,
    });
    client = graphqlClient;
    metafieldKey = metafieldKeyOrData as string;
    metafieldData = data as string;
  }

  if (!metafieldKey || !metafieldData) {
    throw new Error("Metafield key and data are required");
  }

  const appinstallation = await client.request(`
        {
          currentAppInstallation {
            id
          }
        }
      `);

  const metafieldInput = {
    namespace: process.env.APP_THEME_EXTENSION_ID,
    key: metafieldKey,
    type: "json",
    ownerId: appinstallation.data.currentAppInstallation.id,
    value: metafieldData,
  };

  const metafieldResponse = await client.request(
    `mutation ($metafieldsSetInput: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafieldsSetInput) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }`,
    { variables: { metafieldsSetInput: [metafieldInput] } }
  );

  // Check for metafield errors
  if (metafieldResponse.data?.metafieldsSet?.userErrors?.length > 0) {
    throw new Error(metafieldResponse.data.metafieldsSet.userErrors[0].message);
  }

  return metafieldResponse.data?.metafieldsSet?.metafields;
};
