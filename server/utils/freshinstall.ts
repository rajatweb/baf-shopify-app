/**
 *
 * It's relatively easy to overload this function that will result in a long first open time.
 * If something can happen in the background, don't `await FreshInstall()` and instead just
 * `FreshInstall()` in isInitialLoad function.
 *
 */

import { saveDefaultSettings } from "../services/defaultStoreSettings";
import prisma from "./prisma";

const freshInstall = async ({ shop }: { shop: string }) => {
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

  await saveDefaultSettings(shop);
};

export default freshInstall;
