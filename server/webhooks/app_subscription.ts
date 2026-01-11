import clientProvider from "../utils/clientProvider";
import { decryptData } from "../utils/encryption";
import { updateAppDashboardPlanChange } from "../services/indusenigma";
import prisma from "../utils/prisma";

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
  // console.log("================>>>>", "Subscription webhook received", {
  //   topic,
  //   shop,
  //   webhookId,
  // });

  try {
    // Parse the webhook body as JSON since it comes as text
    const payload = JSON.parse(body as string) as SubscriptionPayload;

    console.log("================>>>>", "Payload", body);

    // Fetch session from database to get user information
    const session = await prisma.session.findFirst({
      where: {
        shop: shop,
        isOnline: true,
      },
      orderBy: {
        id: "desc", // Get the most recent session
      },
    });

    const sessionContent = decryptData(session?.content || "");
    const user = sessionContent?.onlineAccessInfo?.associated_user;

    // Fetch current active subscriptions from Shopify API
    let currentSubscriptions = null;
    try {
      const { client } = await clientProvider.offline.graphqlClient({
        shop: shop,
      });

      const subscriptionsResponse = await client.request(
        GET_ACTIVE_SUBSCRIPTIONS
      );
      currentSubscriptions =
        subscriptionsResponse.data?.appInstallation?.activeSubscriptions || [];
    } catch (apiError) {
      console.error("Error fetching active subscriptions:", apiError);
      // Continue even if API call fails
    }

    // Determine if this is a downgrade to free (cancellation)
    const hasActiveSubscription =
      currentSubscriptions &&
      currentSubscriptions.length > 0 &&
      currentSubscriptions.some((sub: any) => sub.status === "ACTIVE");


    // Get current subscription details if available
    const currentSubscription = currentSubscriptions?.[0];
    const currentPlanPrice =
      currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.price?.amount;

    console.log("================>>>>", "Current subscription", currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.price);
    console.log("================>>>>", "Current plan price", currentPlanPrice);
    console.log("================>>>>", "Current test", currentSubscription?.test);
    const currentPlanCurrency =
      currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.price
        ?.currencyCode;
    const currentPlanInterval =
      currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.interval;

    // Extract subscription ID from GraphQL ID format
    const subscriptionId =
      payload.app_subscription.admin_graphql_api_id?.split("/").pop() || null;


    // Update dashboard with plan change information
    await updateAppDashboardPlanChange({
      shop: shop,
      name: payload.app_subscription.name,
      status: payload.app_subscription.status,
      admin_graphql_api_shop_id:
        payload.app_subscription.admin_graphql_api_shop_id,
      created_at: payload.app_subscription.created_at,
      updated_at: payload.app_subscription.updated_at,
      currency: payload.app_subscription.currency || currentPlanCurrency || "USD",
      capped_amount: payload.app_subscription.capped_amount,
      plan_price: currentPlanPrice,
      plan_interval: currentPlanInterval,
      test: payload.app_subscription.test,
    }).catch((error) => {
      // Don't fail the webhook if dashboard update fails
      console.error("Failed to update app dashboard:", error);
    });

    console.log(
      "================>>>>",
      "Subscription webhook processed successfully"
    );
  } catch (parseError) {
    console.error("Error parsing subscription webhook:", parseError);
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
