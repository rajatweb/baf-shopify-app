import { Router } from "express";
import multer from "multer";
import {
  deleteFileFromShopifyAssets,
  uploadFileToShopifyAssets,
} from "../services/shopifyAssetsService";
import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { AssetType } from "@prisma/client";
import clientProvider from "../utils/clientProvider";

const shopAssetsRoutes = Router();
const upload = multer();

shopAssetsRoutes.post(
  "/",
  upload.single("fileData"),
  async (req: Request, res: Response) => {
    try {
      const fileData = req.file;
      if (!fileData) {
        res.status(400).json({
          success: false,
          error: "No file data provided",
        });
        return;
      }
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });
      const result = await uploadFileToShopifyAssets({ client, fileData });
      if (!result) {
        res.status(400).json({
          success: false,
          error: "Failed to upload audio file to Shopify",
        });
        return;
      }
      const shopAsset = await prisma.shopAsset.create({
        data: {
          shopifyFileId: result.shopifyFileId,
          url: result.url,
          type: result.type as AssetType,
          mimeType: result.mimeType,
          shop: result.shop,
        },
      });
      res.status(200).json({ success: true, data: shopAsset, status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json({ success: false, error: error.message, status: 400 });
        return;
      }
      res.status(500).json({
        success: false,
        error: "Failed to upload audio file to Shopify",
        status: 500,
      });
    }
  }
);

shopAssetsRoutes.delete("/", async (req: Request, res: Response) => {
  try {
    const { fileUrl } = req.body;
    const shopifyFileId = await prisma.shopAsset.findFirst({
      where: { url: fileUrl },
    });
    if (!shopifyFileId) {
      res
        .status(400)
        .json({ success: false, error: "File not found", status: 400 });
      return;
    }
    const { client } = await clientProvider.online.graphqlClient({ req, res });
    const result = await deleteFileFromShopifyAssets(
      client,
      shopifyFileId.shopifyFileId
    );
    if (!result) {
      res.status(400).json({
        success: false,
        error: "Failed to delete audio file from Shopify",
        status: 400,
      });
      return;
    }
    await prisma.shopAsset.delete({
      where: { shopifyFileId: shopifyFileId.shopifyFileId },
    });
    res
      .status(200)
      .json({ success: true, data: shopifyFileId.id, status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ success: false, error: error.message, status: 400 });
      return;
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete from Shopify",
      status: 500,
    });
  }
});

shopAssetsRoutes.get(
  "/get-asset-detail",
  async (req: Request, res: Response) => {
    try {
      const fileUrl = req.query.fileUrl as string;
      if (!fileUrl) {
        res
          .status(400)
          .json({ success: false, error: "File URL is required", status: 400 });
        return;
      }
      const asset = await prisma.shopAsset.findFirst({
        where: { url: fileUrl },
      });
      if (!asset) {
        res
          .status(400)
          .json({ success: false, error: "Asset not found", status: 400 });
        return;
      }
      res.status(200).json({ success: true, data: asset, status: 200 });
    } catch (error) {
      if (error instanceof Error) {
        res
          .status(400)
          .json({ success: false, error: error.message, status: 400 });
        return;
      }
      res.status(500).json({
        success: false,
        error: "Failed to get asset detail",
        status: 500,
      });
    }
  }
);

export default shopAssetsRoutes;
