import { RequestedTokenType, Session } from "@shopify/shopify-api";
import { Request, Response, NextFunction } from "express";

import sessionHandler from "../utils/sessionHandler";
import shopify from "../utils/shopify";
import prisma from "../utils/prisma";
import freshInstall from "../utils/freshinstall";

const isInitialLoad = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const shop = req.query.shop as string;
    const idToken = req.query.id_token as string;

    if (shop && idToken) {
      const { offlineSession, onlineSession } = await exchangeTokens(
        shop,
        idToken
      );

      sessionHandler.storeSession(offlineSession);
      sessionHandler.storeSession(onlineSession);

      shopify.webhooks.register({ session: offlineSession });
      // await handleFreshInstall(onlineSession);
    }
    next();
  } catch (error) {
    console.error("Error in isInitialLoad:", error);
    next();
  }
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

  // const shopData = await fetchShopData(session);
  // const appInstallationId = await getAppInstallationId(session);

  // const storeTimezone =
  //   timezoneValues.find((item) => item.offset === shopData.timezoneOffset)
  //     ?.value || "";
  // const settingsContent = JSON.stringify({
  //   defaultCutoffTime: "15:00",
  //   storeHolidays: [],
  //   weeklyOffDays: [0],
  //   storeTimezone,
  //   cartDeliveryFields: {
  //     phoneNumber: false,
  //     cardMessage: false,
  //     cardMessageCharacterLimit: 250,
  //     phoneNumberRequired: "required",
  //     dateRequiredMessage: "Please select a delivery date",
  //     phoneRequiredMessage: "Please enter a contact number for delivery",
  //     deliveryDatePickerPlaceholder: "Select a delivery date",
  //   },
  //   dashboard: {
  //     orderType: "today",
  //     defaultSortBy: "desc",
  //     ordersPerPage: 10,
  //     orderTags: "",
  //     pushTagsToShopifyOrder: false,
  //     autoRefresh: true,
  //     newOrderAlerts: true,
  //     soundNotifications: true,
  //     defaultExportFormat: "csv",
  //   },
  // });

  // await storeMetafields(
  //   session,
  //   {
  //     "store-settings": settingsContent,
  //     "widget-settings": JSON.stringify(widgetDefaultData),
  //     "banner-settings": JSON.stringify(bannerDefaultData),
  //   },
  //   appInstallationId
  // );

  await freshInstall({
    shop: session.shop,
    accessToken: session.accessToken as string,
    userData: session.onlineAccessInfo?.associated_user,
  });

  // await prisma.store.update({
  //   where: { shop: session.shop },
  //   data: {
  //     user: JSON.stringify(session.onlineAccessInfo?.associated_user),
  //   },
  // });
};

const fetchShopData = async (session: Session) => {
  if (!session?.accessToken || !session.shop)
    throw new Error("Invalid session object passed to fetchShopData");

  const client = new shopify.clients.Graphql({ session });
  const response = await client.request(`{
    shop {
      id
      name
      myshopifyDomain
      currencyCode
      timezoneOffset
      timezoneAbbreviation
    }
  }`);
  return response.data?.shop || {};
};

const getAppInstallationId = async (session: Session) => {
  if (!session?.accessToken || !session.shop)
    throw new Error("Invalid session object passed to getAppInstallationId");

  const client = new shopify.clients.Graphql({ session });
  const response = await client.request(`{
    currentAppInstallation {
      id
    }
  }`);

  if (!response.data?.currentAppInstallation?.id)
    throw new Error("App installation ID not found");
  return response.data.currentAppInstallation.id;
};

const storeMetafields = async (
  session: Session,
  metafields: Record<string, string>,
  appInstallationId: string
) => {
  const client = new shopify.clients.Graphql({ session });
  for (const [key, content] of Object.entries(metafields)) {
    const metafieldInput = {
      namespace: process.env.APP_THEME_EXTENSION_ID,
      key,
      type: "json",
      ownerId: appInstallationId,
      value: content,
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

    if (metafieldResponse.data?.metafieldsSet?.userErrors?.length) {
      throw new Error(
        metafieldResponse.data.metafieldsSet.userErrors[0].message
      );
    }
  }

  // const shopMetaResponse = await client.request(`{
  //   shop {
  //     metafields(namespace: "dashdrop-delivery", first: 100) {
  //       edges {
  //         node {
  //           value
  //           key
  //           namespace
  //           type
  //           id
  //         }
  //       }
  //     }
  //   }
  // }`);

  // console.log(shopMetaResponse.data?.shop?.metafields.edges);
};

export default isInitialLoad;
