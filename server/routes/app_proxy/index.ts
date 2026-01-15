import express from "express";
import prisma from "../../utils/prisma";
import { Prisma } from "@prisma/client";

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

router.post("/product-click", async (req, res) => {
  const shop = res.locals.user_shop;
  const { productId, productTitle, productImageUrl } = req.body;

  if (!productId) {
    res.status(400).send({ error: true, message: "Product ID is required" });
    return;
  }

  if (!productTitle) {
    res.status(400).send({ error: true, message: "Product Title is required" });
    return;
  }

  if (!productImageUrl) {
    res
      .status(400)
      .send({ error: true, message: "Product Image URL is required" });
    return;
  }

  try {
    await prisma.productAnalytics.upsert({
      where: {
        shop_productId: {
          shop,
          productId,
        },
      },
      update: {
        totalProductClicks: {
          increment: 1,
        },
      },
      create: {
        shop,
        productId,
        productTitle,
        productImageUrl: productImageUrl || "",
        totalProductClicks: 1,
        shared: 0,
        addToCartCount: 0,
        purchaseCount: 0,
        conversionRate: 0,
      },
    });
    res.status(200).send({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).send({ error: true, message: error.message });
      return;
    }
    res.status(500).send({
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product click",
    });
  }
});

router.post("/product-add-to-cart", async (req, res) => {
  const shop = res.locals.user_shop;
  const { productId } = req.body;
  if (!productId) {
    res.status(400).send({ error: true, message: "Product ID is required" });
    return;
  }

  try {
    await prisma.productAnalytics.update({
      where: {
        shop_productId: {
          shop,
          productId: productId,
        },
      },
      data: {
        addToCartCount: {
          increment: 1,
        },
      },
    });
    res.status(200).send({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).send({ error: true, message: error.message });
      return;
    }
    res.status(500).send({
      error: true,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update product add to cart",
    });
  }
});

router.post("/fits-shared", async (req, res) => {
  const shop = res.locals.user_shop;
  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    res.status(400).send({ error: true, message: "Product IDs are required" });
    return;
  }

  try {
    for (const productId of productIds) {
      await prisma.productAnalytics.update({
        where: {
          shop_productId: {
            shop,
            productId: productId,
          },
        },
        data: {
          shared: { increment: 1 },
        },
      });
    }
    res.status(200).send({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).send({ error: true, message: error.message });
      return;
    }
    res.status(500).send({
      error: true,
      message:
        error instanceof Error ? error.message : "Failed to update fits shared",
    });
  }
});

export default router;
