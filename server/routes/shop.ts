import { Router, Request, Response } from "express";
import clientProvider from "../utils/clientProvider";

const shopRoutes = Router();

shopRoutes.get("/plan", async (req: Request, res: Response) => {
  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: res.locals.user_session.shop,
    });
    const shop = await client.request(
      `{
          shop {
            name
            plan {
                shopifyPlus
                partnerDevelopment
                displayName
            }
            currencyCode
          }
        }`
    );
    res.status(200).json(shop);
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: true });
  }
});

export default shopRoutes;