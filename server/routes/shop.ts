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
          }
        }`
    );
    res.status(200).json(shop);
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: true });
  }
});

shopRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: res.locals.user_session.shop,
    });
    const shop = await client.request(
      `{
        shop {
          name
          currencyCode
          currencyFormats {... on CurrencyFormats { moneyFormat moneyWithCurrencyFormat }}
        }
      }`
    );
    if (shop?.data?.shop) {
      res.status(200).json({
        status: 200,
        data: {
          shop: {
            ...shop.data.shop,
            currencyFormats: {
              ...shop.data.shop.currencyFormats,
              currencySymbol:
                shop.data.shop?.currencyFormats?.moneyFormat?.replace(
                  "{{amount}}",
                  ""
                ),
            },
          },
        },
      });
    } else {
      res
        .status(400)
        .send({ message: "Failed to fetch shop data", status: 400 });
    }
  } catch (e) {
    res.status(400).send({ error: true });
  }
});

export default shopRoutes;
