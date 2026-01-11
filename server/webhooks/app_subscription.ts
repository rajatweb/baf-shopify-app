import clientProvider from "../utils/clientProvider";
import { decryptData } from "../utils/encryption";
import { updateAppDashboardPlanChange } from "../services/indusenigma";
import prisma from "../utils/prisma";
import { dashboardApi } from "../services/dashboard-api.service";

// Add request tracking to prevent duplicate processing
const processedRequestIds = new Set<string>();

interface SubscriptionPayload {
  app_subscription: {
    admin_graphql_api_id: string;
    name: string;
    status: string;
    admin_graphql_api_shop_id: string;
    created_at: string;
    updated_at: string;
    currency: string;
    capped_amount?: string;
    price: string;
    interval: string;
    plan_handle?: string;
    test: boolean;
  };
}

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

export const handleAppSubscriptionUpdate = async (
  topic: string,
  shop: string,
  body: string,
  webhookId: string,
  apiVersion: string
) => {
  // Check if this webhook was already processed
  if (processedRequestIds.has(webhookId)) {
    console.log(
      `Webhook ${webhookId} for shop ${shop} already processed, skipping`
    );
    return;
  }

  // Mark this webhook as processed
  processedRequestIds.add(webhookId);

  try {
    const payload = JSON.parse(body as string) as SubscriptionPayload;
    const subscriptionData = payload.app_subscription;

    // Extract subscription ID from GraphQL ID format
    const subscriptionId = subscriptionData.admin_graphql_api_id?.split("/").pop() || null;

    // Fetch additional details from API if needed (for fields not in webhook)
    let additionalDetails = null;
    try {
      const { client } = await clientProvider.offline.graphqlClient({ shop });
      const subscriptionsResponse = await client.request(GET_ACTIVE_SUBSCRIPTIONS);
      additionalDetails = subscriptionsResponse.data?.appInstallation?.activeSubscriptions?.find(
        (sub: any) => sub.id === subscriptionData.admin_graphql_api_id
      );
    } catch (apiError) {
      console.error("Error fetching subscription details:", apiError);
      // Continue with webhook payload data only
    }

    // Use webhook payload as primary source, API response for additional fields
    const lineItem = additionalDetails?.lineItems?.[0];
    const pricing = lineItem?.plan?.pricingDetails;

    // Determine if subscription is cancelled/expired (downgrade to Free Plan)
    const isCancelled = subscriptionData.status === "CANCELLED" || subscriptionData.status === "EXPIRED";
    
    // When subscription is cancelled, user is downgrading to Free Plan
    const planName = isCancelled ? "Free Plan" : (subscriptionData.plan_handle || subscriptionData.name);
    const planDisplayName = isCancelled ? "Free Plan" : subscriptionData.name;
    const planPrice = isCancelled ? 0 : (parseFloat(subscriptionData.price) || pricing?.price?.amount);
    const planInterval = isCancelled ? undefined : (subscriptionData.interval || pricing?.interval || "EVERY_30_DAYS");

    console.log("================>>>>", "Subscription data", subscriptionData);
    console.log("================>>>>", "Additional details", additionalDetails);
    console.log("================>>>>", "Pricing", pricing);
    console.log("================>>>>", "Is Cancelled:", isCancelled, "Plan Name:", planName);

    const result = await dashboardApi.subscription({
      appId: process.env.APP_HANDLE || "build-a-fit",
      shop: shop,
      subscription: {
        id: subscriptionId || "",
        name: isCancelled ? "Free Plan" : subscriptionData.name,
        status: subscriptionData.status as "ACTIVE" | "PENDING" | "CANCELLED" | "EXPIRED" | "DECLINED" | "FROZEN",
        
        // Use Free Plan when subscription is cancelled
        planName: planName,
        planDisplayName: planDisplayName,
        
        // Price: 0 for Free Plan when cancelled
        planPrice: planPrice,
        planCurrency: subscriptionData.currency || pricing?.price?.currencyCode || "USD",
        
        // Interval: undefined for Free Plan when cancelled
        planInterval: planInterval,
        
        // Additional fields from API (not in webhook)
        cappedAmount: subscriptionData.capped_amount ? parseFloat(subscriptionData.capped_amount) : undefined,
        isTestSubscription: process.env.SUBSCRIPTION_TEST_MODE?.toString().toLowerCase() === "true" || false,
        trialDays: additionalDetails?.trialDays,
        currentPeriodStart: additionalDetails?.currentPeriodStart,
        currentPeriodEnd: additionalDetails?.currentPeriodEnd,
        activatedAt: additionalDetails?.activatedAt,
        cancelledAt: isCancelled
          ? new Date().toISOString()
          : undefined,
      },
    });

    if (!result.success) {
      console.error('Failed to send subscription event:', result.error);
    }

    console.log("Subscription webhook processed successfully");
  } catch (error) {
    console.error("Error processing subscription webhook:", error);
  }
};

// export const handleAppSubscriptionCancelled = async (
//   req: Request,
//   res: Response
// ) => {
//   // Parse the webhook body as JSON since it comes as text
//   let payload: SubscriptionPayload;
//   try {
//     payload = JSON.parse(req.body as string) as SubscriptionPayload;
//   } catch (parseError) {
//     return;
//   }
// };
