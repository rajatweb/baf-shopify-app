import express from "express";
import prisma from "../../utils/prisma";
import clientProvider from "../../utils/clientProvider";

const stripCollectionString = (collectionId: string) => {
  return collectionId.replace("gid://shopify/Collection/", "");
};

const router = express.Router();

router.get("/", async (req, res) => {
  // const { client } = await clientProvider.offline.graphqlClient({
  //   shop: res.locals.user_shop,
  // });
  res.status(200).send({ content: "Proxy Be Working" });
});

router.get("/store-settings", async (req, res) => {
  // const { client } = await clientProvider.offline.graphqlClient({
  //   shop: res.locals.user_shop,
  // });
  const shop = res.locals.user_shop;
  const storeSettings = await prisma.storeSettings.findUnique({
    where: { shop },
  });
  const settings = JSON.parse(storeSettings?.content || "{}");

  res.status(200).send({
    data: {
      ...settings,
      collectionSettings: {
        ...settings.collectionSettings,
        id: settings.collectionSettings?.id
          ? stripCollectionString(settings.collectionSettings?.id)
          : "",
      },
    },
  });
});

export default router;
