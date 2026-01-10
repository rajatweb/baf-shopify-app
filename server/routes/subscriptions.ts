import { Router, Request, Response } from "express";
import clientProvider from "../utils/clientProvider";
import { updateAppDashboard, updateAppDashboardPlanChange } from "../services/indusenigma";

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
      const { planName, planPrice, planInterval, trialDays } = req.body;
      const session = res.locals.user_session;
      const shop = session.shop;
      const user = session.onlineAccessInfo?.associated_user;
      const returnUrl = `${process.env.SHOPIFY_APP_URL}/?shop=${shop}`;
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      // Fetch current subscriptions to get previous plan info
      let previousSubscription = null;
      try {
        const currentSubscriptionsResponse = await client.request(
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
        previousSubscription =
          currentSubscriptionsResponse.data?.appInstallation?.activeSubscriptions?.[0] ||
          null;
      } catch (error) {
        console.log("Could not fetch previous subscription:", error);
      }

      const response = await client.request(
        `mutation CreateSubscription {
          appSubscriptionCreate(
            name: "${planName}"
            returnUrl: "${returnUrl}"
            test: true
            trialDays: ${trialDays || 14}
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

      const subscription = response.data.appSubscriptionCreate.appSubscription;

      res.status(200).json({
        success: true,
        confirmationUrl: response.data.appSubscriptionCreate.confirmationUrl,
        subscription: subscription,
      });

      console.log("================>>>>", "Subscription created successfully");
      
      // Extract subscription ID from GraphQL ID format
      const subscriptionId = subscription.id?.split("/").pop() || null;
      const previousPlanPrice = previousSubscription?.lineItems?.[0]?.plan?.pricingDetails?.price?.amount || null;

      // Send plan change data with all analytics information
      await updateAppDashboardPlanChange({
        planChange: true,
        email: user?.email || "",
        storeName: user?.first_name || shop,
        storeUrl: shop,
        shop: shop,
        action: "planChange",
        // Subscription/Plan information
        subscriptionId: subscriptionId,
        subscriptionName: planName,
        subscriptionStatus: subscription.status,
        planName: planName,
        planPrice: parseFloat(planPrice),
        planCurrency: "USD",
        planInterval: planInterval,
        trialDays: trialDays || 14,
        isTest: true,
        // Previous plan information
        previousPlanName: previousSubscription?.name || null,
        previousPlanPrice: previousPlanPrice ? parseFloat(previousPlanPrice) : undefined,
        previousPlanStatus: previousSubscription?.status || null,
        // Change metadata
        changeType: previousSubscription ? "upgrade" : "trial_start",
        // User information
        firstName: user?.first_name,
        lastName: user?.last_name,
        userId: user?.id,
        accountOwner: user?.account_owner,
      }).catch((error) => {
        // Don't fail the subscription creation if dashboard update fails
        console.error("Failed to update app dashboard:", error);
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
      const session = res.locals.user_session;
      const shop = session.shop;
      const user = session.onlineAccessInfo?.associated_user;
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });

      // Fetch current subscription details before cancellation
      let subscriptionDetails = null;
      try {
        const subscriptionsResponse = await client.request(
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
        subscriptionDetails =
          subscriptionsResponse.data?.appInstallation?.activeSubscriptions?.find(
            (sub: any) => sub.id?.includes(planId)
          ) || null;
      } catch (error) {
        console.log("Could not fetch subscription details:", error);
      }

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

      const cancelledSubscription = response.data.appSubscriptionCancel.appSubscription;

      res.status(200).json({
        success: true,
      });

      // Extract subscription details
      const subscriptionId = cancelledSubscription.id?.split("/").pop() || planId;
      const planPrice = subscriptionDetails?.lineItems?.[0]?.plan?.pricingDetails?.price?.amount || null;

      // Send plan change data for cancellation
      await updateAppDashboardPlanChange({
        planChange: true,
        email: user?.email || "",
        storeName: user?.first_name || shop,
        storeUrl: shop,
        shop: shop,
        action: "planChange",
        // Subscription/Plan information
        subscriptionId: subscriptionId,
        subscriptionName: subscriptionDetails?.name || null,
        subscriptionStatus: cancelledSubscription.status,
        planName: subscriptionDetails?.name || null,
        planPrice: planPrice ? parseFloat(planPrice) : undefined,
        planCurrency: subscriptionDetails?.lineItems?.[0]?.plan?.pricingDetails?.price?.currencyCode || null,
        planInterval: subscriptionDetails?.lineItems?.[0]?.plan?.pricingDetails?.interval || null,
        isTest: subscriptionDetails?.test ?? false,
        // Previous plan information (current plan before cancellation)
        previousPlanName: subscriptionDetails?.name || null,
        previousPlanPrice: planPrice ? parseFloat(planPrice) : undefined,
        previousPlanStatus: subscriptionDetails?.status || null,
        // Change metadata
        changeType: "cancel",
        changeReason: "User requested cancellation",
        // User information
        firstName: user?.first_name,
        lastName: user?.last_name,
        userId: user?.id,
        accountOwner: user?.account_owner,
      }).catch((error) => {
        // Don't fail the cancellation if dashboard update fails
        console.error("Failed to update app dashboard:", error);
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
