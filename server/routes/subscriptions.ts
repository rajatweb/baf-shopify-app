import { Router, Request, Response } from "express";
import clientProvider from "../utils/clientProvider";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { emailService } from "../services/emailService";
import { updateSubscriptionData, enforcePlanLimitsOnDowngrade } from "../utils/planEnforcement";

const subscriptionsRoutes = Router();
const prisma = new PrismaClient();

interface SubscriptionCreateParams {
  planName: string;
  planPrice: number;
  planInterval: "ANNUAL" | "EVERY_30_DAYS";
}

// GraphQL Queries
const GET_ACTIVE_SUBSCRIPTIONS = `
  query GetActiveSubscriptions {
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
  }
`;

const CREATE_SUBSCRIPTION = `
  mutation CreateSubscription(
    $name: String!
    $returnUrl: URL!
    $test: Boolean!
    $trialDays: Int!
    $price: Decimal!
    $interval: AppPricingInterval!
  ) {
    appSubscriptionCreate(
      name: $name
      returnUrl: $returnUrl
      test: $test
      trialDays: $trialDays
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { amount: $price, currencyCode: USD }
              interval: $interval
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
  }
`;

const CANCEL_SUBSCRIPTION = `
  mutation CancelSubscription($id: ID!) {
    appSubscriptionCancel(
      id: $id
    ) {
      appSubscription {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

subscriptionsRoutes.get(
  "/active-subscriptions",
  async (req: Request, res: Response) => {
    try {
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      const response = await client.request(GET_ACTIVE_SUBSCRIPTIONS);

      const subscriptions = response.data.appInstallation.activeSubscriptions;

      res.status(200).json({
        success: true,
        data: subscriptions,
      });
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch subscription data",
        details:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "stage"
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

subscriptionsRoutes.post(
  "/create-subscription",
  async (req: Request<{}, {}, SubscriptionCreateParams>, res: Response) => {
    try {
      const { planName, planPrice, planInterval } = req.body;

      // Validate required fields
      if (!planName || !planPrice || !planInterval) {
        res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
        return;
      }

      const shop = res.locals.user_session.shop;

      // Use the correct admin.shopify.com format for return URL
      const shopDomain = shop.replace('.myshopify.com', '');
      const returnUrl = `https://admin.shopify.com/store/${shopDomain}/apps/${process.env.NODE_ENV === "development" ? process.env.APP_HANDLE : "wavexp-playlist-music-player"}?shop=${shop}`;
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      
      const variables = {
        name: planName,
        returnUrl,
        // Ensure proper boolean: only 'true' enables test mode
        test: String(process.env.SUBSCRIPTION_TEST_MODE).toLowerCase() === 'true',
        trialDays: 0,
        price: planPrice,
        interval: planInterval,
      };

      const response = await client.request(CREATE_SUBSCRIPTION, { variables });

      const { userErrors, confirmationUrl, appSubscription } =
        response.data.appSubscriptionCreate;

      if (userErrors.length > 0) {
        res.status(400).json({
          success: false,
          errors: userErrors,
        });
        return;
      }

      // Note: Database will be updated via webhook when subscription becomes active
      // Do not update database here as user hasn't completed payment yet

      // Send upgrade email notification to the user
      try {
        const userEmail =
          res.locals.user_session.onlineAccessInfo?.associated_user?.email;
        if (userEmail) {
          // await emailService.sendPlanUpgradedEmail(userEmail, shop, planName);
        }
      } catch (emailError) {
        console.error("Failed to send upgrade email:", emailError);
        // Don't fail the request if email fails
      }

      res.status(200).json({
        success: true,
        confirmationUrl,
        subscription: appSubscription,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create subscription",
        details:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "stage"
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

subscriptionsRoutes.post(
  "/cancel-subscription",
  async (req: Request, res: Response) => {
    try {
      const shop = res.locals.user_session.shop;
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      // First get the active subscription ID
      const subsResponse = await client.request(GET_ACTIVE_SUBSCRIPTIONS);

      const activeSubscription =
        subsResponse.data.appInstallation.activeSubscriptions[0];

      if (!activeSubscription?.id) {
        res.status(400).json({
          success: false,
          error: "No active subscription found",
        });
        return;
      }

      // Then cancel it
      const response = await client.request(CANCEL_SUBSCRIPTION, {
        variables: {
          id: activeSubscription.id,
        },
      });

      // Update database to reflect cancellation and enforce free plan limits
      try {
        // Update subscription data to free plan
        await updateSubscriptionData(shop, {
          status: "CANCELLED",
          name: "Free Plan",
          subscriptionId: activeSubscription.id,
        });

        // Enforce plan limits for music player when downgrading
        await enforcePlanLimitsOnDowngrade(shop, {
          status: "CANCELLED",
          name: "Free Plan",
        });

        console.log(`✅ Updated database for ${shop} to Free Plan and enforced limits`);
      } catch (dbError) {
        console.error("Failed to update database or enforce limits:", dbError);
        // Don't fail the subscription cancellation if database update fails
      }

      res.status(200).json({
        success: true,
        data: response.data,
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({
        success: false,
        error: "Failed to cancel subscription",
        details:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "stage"
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

// Handle plan downgrade and condition status management
subscriptionsRoutes.post(
  "/downgrade-conditions",
  async (req: Request, res: Response) => {
    try {
      const shop = res.locals.user_session.shop;

      // This endpoint is now deprecated for music player app
      // Plan enforcement is handled by the music-player routes
      
      res.status(200).json({
        success: true,
        message: "Plan enforcement handled by music player service",
      });
    } catch (error) {
      console.error("Error in downgrade conditions:", error);
      res.status(500).json({
        success: false,
        error: "Failed to process downgrade",
        details:
          process.env.NODE_ENV === "development" ||
          process.env.NODE_ENV === "stage"
            ? (error as Error).message
            : undefined,
      });
    }
  }
);

subscriptionsRoutes.post(
  "/reactivate-conditions",
  async (req: Request, res: Response) => {
    try {
      const shop = res.locals.user_session.shop;
      const store = await prisma.store.findFirst({
        where: { shop },
      });

      if (!store) {
        res.status(404).json({ success: false, message: "Store not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "All inactive conditions reactivated successfully",
        data: {},
      });
    } catch (error) {
      console.error("Error reactivating conditions:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to reactivate conditions" });
    }
  }
);

export default subscriptionsRoutes;
