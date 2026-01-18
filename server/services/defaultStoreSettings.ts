import prisma from "../utils/prisma";

export const defaultSettings = {
  collectionSettings: {
    id: "",
    title: "",
    productCount: 0,
    productLimit: 8,
    collectionHandle: "",
  },
  appearanceSettings: {
    position: "bottom-right",
    showButtonText: true,
    buttonText: "Build A Fit",
    theme: "light",
  },
  generalSettings: {
    showFilters: false,
    hideSoldOut: false,
  },
  canvasSettings: {
    showProductLabels: false,
  },
  brandingSettings: {
    showWatermark: true,
    customLogo: "",
    logoSize: 100,
  },
  additionalSettings: {
    enableAddToCart: true,
  },
  customCssSettings: {
    customCss: "",
  },
  urlSettings: {
    isHomePageOnly: true,
    excludeUrls: [],
  },
};

const saveDefaultSettings = async (shop: string) => {
  await prisma.storeSettings.upsert({
    where: { shop },
    update: {
      content: JSON.stringify(defaultSettings),
    },
    create: {
      shop,
      content: JSON.stringify(defaultSettings),
    },
  });
};

export { saveDefaultSettings };
