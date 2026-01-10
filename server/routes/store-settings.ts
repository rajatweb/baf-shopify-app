import { Router, Request, Response } from "express";
import prisma from "../utils/prisma";
import { saveAppMetafiles } from "../utils/appMetafilesProvider";

const storeSettingsRoutes = Router();

storeSettingsRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const shop = res.locals.user_session.shop;

    if (!shop) {
      res
        .status(400)
        .json({ error: "Shop parameter is required", status: 400 });
    }

    // Expect settings in request body as an object
    const settingsObj = req.body.settings;
    if (!settingsObj || typeof settingsObj !== "object") {
      res
        .status(400)
        .json({ error: "Settings must be an object", status: 400 });
    }

    const settingsString = JSON.stringify(settingsObj);

    // Upsert: create if not exists, otherwise update
    const updatedStoreSettings = await prisma.storeSettings.upsert({
      where: { shop },
      create: { shop, content: settingsString },
      update: { content: settingsString },
    });

    const urlSettings = JSON.stringify(settingsObj.urlSettings);

    await saveAppMetafiles(req, res, "url-settings", urlSettings);
    res
      .status(200)
      .json({ data: JSON.parse(updatedStoreSettings.content), status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save store settings", status: 500 });
  }
});

storeSettingsRoutes.get("/", async (req, res) => {
  try {
    const shop = res.locals.user_session.shop;

    if (!shop) {
      res.status(400).json({ error: "Shop parameter is required" });
      return;
    }

    // findUnique cannot have orderBy
    const storeSettings = await prisma.storeSettings.findUnique({
      where: { shop },
    });

    // Parse JSON string to object
    const settings = storeSettings?.content
      ? JSON.parse(storeSettings.content)
      : {};

    res.json({ data: settings, status: 200 });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch store settings", status: 500 });
  }
});

export default storeSettingsRoutes;
