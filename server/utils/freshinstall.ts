/**
 *
 * It's relatively easy to overload this function that will result in a long first open time.
 * If something can happen in the background, don't `await FreshInstall()` and instead just
 * `FreshInstall()` in isInitialLoad function.
 *
 */

import { saveDefaultSettings } from "../services/defaultStoreSettings";
import prisma from "./prisma";
import { OnlineAccessUser } from "@shopify/shopify-api/dist/ts/lib/auth/oauth/types";

const freshInstall = async ({
  shop,
  userData,
}: {
  shop: string;
  accessToken: string;
  userData: OnlineAccessUser;
}) => {
  await prisma.store.upsert({
    where: {
      shop: shop,
    },
    update: {
      isActive: true,
      shop: shop,
    },
    create: {
      isActive: true,
      shop: shop,
    },
  });

  // await prisma.storeActivityLogs.create({
  //   data: {
  //     shop: shop,
  //     userId: userData?.id ?? null,
  //     firstName: userData?.first_name ?? "",
  //     lastName: userData?.last_name ?? "",
  //     email: userData?.email ?? "",
  //     emailVerified: userData?.email_verified ?? false,
  //     accountOwner: userData?.account_owner ?? false,
  //     locale: userData?.locale ?? "en",
  //     activityType: "fresh_install",
  //     collaborator: userData?.collaborator ?? false,
  //     // createdAt will be set by default in Prisma schema
  //   },
  // });

  await saveDefaultSettings(shop);
};

export default freshInstall;
