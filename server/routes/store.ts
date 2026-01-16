import { Router, Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import clientProvider from "../utils/clientProvider";

const storeRoutes = Router();

storeRoutes.post("/settings", async (req: Request, res: Response) => {
  try {
    const { shop } = res.locals.user_session;
    const { content } = req.body;

    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
    });

    const appinstallation = await client.request(`
      {
        currentAppInstallation {
          id
        }
      }
    `);

    const stringifySettings = JSON.stringify(content);

    const metafieldInput = {
      namespace: process.env.APP_THEME_EXTENSION_ID,
      key: "store-settings",
      type: "json",
      ownerId: appinstallation.data.currentAppInstallation.id,
      value: stringifySettings,
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

    // Check for metafield errors
    if (metafieldResponse.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(
        metafieldResponse.data.metafieldsSet.userErrors[0].message
      );
    }

    res.status(201).json({ success: true });
  } catch (error: any) {
    if (error.code === "P2002") {
      res
        .status(400)
        .json({ message: "A group with this title already exists" });
    } else {
      res.status(500).json({ message: "Error creating product group" });
    }
  }
});

storeRoutes.get("/theme/status", async (req: Request, res: Response) => {
  try {
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
    });

    // Get shop details
    const shopResponse = await client.request(`
      {
        shop {
          id
          name
          primaryDomain {
            url
          }
        }
      }
    `);

    const { shop, accessToken } = res.locals.user_session;

    // Fetch active theme
    const themeResponse = await fetch(
      `https://${shop}/admin/api/2024-01/themes.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const themeData = await themeResponse.json();
    const activeTheme = themeData.themes.find(
      (theme: any) => theme.role === "main"
    );

    if (!activeTheme) {
      throw new Error("No active theme found.");
    }

    // Fetch settings.json
    const settingsResponse = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${activeTheme.id}/assets.json?asset[key]=config/settings_data.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    const settingsData = await settingsResponse.json();
    const settingsJson = JSON.parse(settingsData.asset.value);

    let isThemeExtensionDisabled = true;

    Object.values(settingsJson.current.blocks || {}).forEach((block: any) => {
      const isBuildAFitBlock =
        block.type.includes("blocks/baf-app-widget") ||
        block.type.includes("baf-app-widget") ||
        block.type.includes(process.env.APP_HANDLE);

      // console.log(isBuildAFitBlock);
      // console.log(block);

      if (isBuildAFitBlock) {
        isThemeExtensionDisabled = block.disabled;
      }
    });

    res.status(200).json({
      success: true,
      shopUrl: shopResponse.data.shop.primaryDomain.url,
      themeId: activeTheme.id,
      themeName: activeTheme.name,
      isThemeExtensionDisabled,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to check theme status",
      });
    }
  }
});

storeRoutes.get("/appId", async (req: Request, res: Response) => {
  try {
    const { shop } = res.locals.user_session;
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
    });

    const appinstallation = await client.request(`
      {
        currentAppInstallation {
          id
        }
      }
    `);

    res.status(200).json({
      success: true,
      appId: appinstallation.data.currentAppInstallation.id,
    });
  } catch (error) {
    console.error("Error enabling theme:", error);
    res.status(500).json({
      success: false,
      error: "Failed to enable theme",
    });
  }
});

export default storeRoutes;
