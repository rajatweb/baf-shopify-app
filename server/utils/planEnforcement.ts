import prisma from "./prisma";
import { defaultSettings } from "../services/defaultStoreSettings";
export const planEnforcement = async (
  shop: string,
  plan: string
): Promise<boolean> => {
  const storeSettings = await prisma.storeSettings.findUnique({
    where: { shop },
  });

  if (!storeSettings) return false;

  const settings = JSON.parse(storeSettings?.content || "{}");
  if (Object.keys(settings)?.length === 0) return false;
  let updatedSettings = settings;
  if (plan === "free") {
    updatedSettings = defaultSettings;
  }
  if (plan === "starter") {
    updatedSettings = {
      ...updatedSettings,
      collectionSettings: {
        ...updatedSettings.collectionSettings,
        productLimit: 25,
      },
    };
  }
  if (plan === "basic") {
    updatedSettings = {
      ...updatedSettings,
      collectionSettings: {
        ...updatedSettings.collectionSettings,
        productLimit: 50,
      },
      brandingSettings: {
        showWatermark: true,
        customLogo: "",
        logoSize: 100,
      },
      generalSettings: {
        ...updatedSettings.generalSettings,
        showFilters: false,
      },
    };
  }
  if (plan === "pro") {
    updatedSettings = {
      ...updatedSettings,
      collectionSettings: {
        ...updatedSettings.collectionSettings,
        productLimit: 150,
      },
    };
  }
  if (plan === "plus") {
    updatedSettings = {
      ...updatedSettings,
      collectionSettings: {
        ...updatedSettings.collectionSettings,
        productLimit: 250,
      },
    };
  }
  await prisma.storeSettings.update({
    where: { shop },
    data: {
      content: JSON.stringify(updatedSettings),
    },
  });

  return true;
};
