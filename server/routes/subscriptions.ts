import { Router, Request, Response } from "express";
import clientProvider from "../utils/clientProvider";

const subscriptionsRoutes = Router();

subscriptionsRoutes.get(
  "/active-subscriptions",
  async (req: Request, res: Response) => {
    try {
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });
      const response = await client.request(
        `{
        appInstallation {
          activeSubscriptions {
            id
            name
            status
            lineItems {
              plan {
                pricingDetails {
                  ... on AppRecurringPricing {
                    __typename
                    price {
                      amount
                      currencyCode
                    }
                    interval
                  }
                }
              }
            }
            test
          }
        }
      }`
      );
      res.status(200).json({
        success: true,
        data: response.data.appInstallation.activeSubscriptions,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch subscription data",
      });
    }
  }
);

subscriptionsRoutes.post(
  "/create-subscription",
  async (req: Request, res: Response) => {
    try {
      const { planName, planPrice, planInterval } = req.body;
      const searchQuery = res.locals.user_session.shop;
      const returnUrl = `${process.env.SHOPIFY_APP_URL}/?shop=${searchQuery}`;
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      const response = await client.request(
        `mutation CreateSubscription {
          appSubscriptionCreate(
            name: "${planName}"
            returnUrl: "${returnUrl}"
            test: true
            trialDays: 14
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    price: { 
                      amount: ${planPrice}, 
                      currencyCode: USD 
                    }
                    interval: ${planInterval}
                  }
                }
              }
            ]
          ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
              status
            }
          }
        }`
      );

      if (response.data.appSubscriptionCreate.userErrors.length > 0) {
        res.status(400).json({
          success: false,
          errors: response.data.appSubscriptionCreate.userErrors,
        });
        return;
      }

      res.status(200).json({
        success: true,
        confirmationUrl: response.data.appSubscriptionCreate.confirmationUrl,
        subscription: response.data.appSubscriptionCreate.appSubscription,
      });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to create subscription",
      });
      return;
    }
  }
);

subscriptionsRoutes.post(
  "/cancel-subscription",
  async (req: Request, res: Response) => {
    try {
      const { planId } = req.body;
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      const response = await client.request(
        `mutation AppSubscriptionCancel($id: ID!, $prorate: Boolean) {
          appSubscriptionCancel(id: $id, prorate: $prorate) {
            userErrors {
              field
              message
            }
            appSubscription {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }`,
        {
          variables: {
            id: `gid://shopify/AppSubscription/${planId}`,
            prorate: true,
          },
        }
      );
      if (response.data.appSubscriptionCancel.userErrors.length > 0) {
        res.status(400).json({
          success: false,
          errors: response.data.appSubscriptionCancel.userErrors,
        });
        return;
      }
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
      }
      res.status(500).json({
        success: false,
        error: "Failed to cancel subscription",
      });
      return;
    }
  }
);

export default subscriptionsRoutes;
