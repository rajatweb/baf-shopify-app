import prisma from "../utils/prisma";

const defaultSettings = {
  position: "bottom-right",
  theme: "light",
  collection: "",
  showWatermark: false,
  customLogo: "",
  logoSize: "medium",
  enableAddToCart: true,
  showProductLabels: true,
  showFilters: true,
  hideSoldOut: false,
  showButtonText: true,
  buttonText: "Build A Fit",
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
