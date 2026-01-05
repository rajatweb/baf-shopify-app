import { Router, Request, Response } from "express";
import clientProvider from "../utils/clientProvider";

const userRoutes = Router();

userRoutes.get("/debug/activeWebhooks", async (req: Request, res: Response) => {
  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: res.locals.user_session.shop,
    });
    const activeWebhooks = await client.request(
      `{
          webhookSubscriptions(first: 25) {
              edges {
                  node {
                      topic
                      endpoint {
                      __typename
                      ... on WebhookHttpEndpoint {
                          callbackUrl
                      }
                      }
                  }
              }
          }
        }`
    );
    res.status(200).json(activeWebhooks);
  } catch (e) {
    console.error(e);
    res.status(400).send({ error: true });
  }
});
export default userRoutes;
