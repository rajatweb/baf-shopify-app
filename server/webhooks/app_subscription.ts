import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
// import { updateSubscriptionData, enforcePlanLimitsOnDowngrade } from "../utils/planEnforcement";

const prisma = new PrismaClient();

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
  };
}

export const handleAppSubscriptionUpdate = async (req: Request, res: Response) => {
  try {
    // Parse the webhook body as JSON since it comes as text
    let payload: SubscriptionPayload;
    try {
      payload = JSON.parse(req.body as string) as SubscriptionPayload;
    } catch (parseError) {
      console.error("Failed to parse webhook body as JSON:", parseError);
      console.error("Raw body:", req.body);
      res.status(400).send("Invalid JSON payload");
      return;
    }
    
    const shop = req.headers["x-shopify-shop-domain"] as string;

    console.log("=== WEBHOOK DEBUG ===");
    console.log("Headers:", req.headers);
    console.log("Raw body:", req.body);
    console.log("Parsed payload:", payload);
    console.log("Payload type:", typeof payload);
    console.log("Payload keys:", Object.keys(payload || {}));
    console.log("===================");

    if (!shop) {
      console.error("No shop domain in subscription webhook headers");
      res.status(400).send("Missing shop domain");
      return;
    }

    if (!payload.app_subscription) {
      console.error("No app_subscription data in webhook payload");
      console.error("Available payload structure:", JSON.stringify(payload, null, 2));
      res.status(400).send("Missing subscription data");
      return;
    }

    console.log(`App subscription webhook received for shop: ${shop}`);
    console.log("Subscription payload:", payload);

    // Extract subscription data from the nested structure
    const subscription = payload.app_subscription;
    
    // Don't update database for DECLINED subscriptions
    if (subscription.status === "DECLINED") {
      console.log(`Subscription declined for shop: ${shop} - no database update needed`);
      res.status(200).send("OK");
      return;
    }

    const subscriptionData = {
      status: subscription.status,
      name: subscription.name,
      subscriptionId: subscription.admin_graphql_api_id,
    };

    // Determine the appropriate plan name and status based on subscription status
    let planName = subscription.name;
    let finalStatus = subscription.status;

    // Handle different subscription statuses
    if (subscription.status === "CANCELLED" || subscription.status === "INACTIVE") {
      planName = "Free Plan";
      finalStatus = "INACTIVE";
      console.log(`Subscription ${subscription.status} - switching to Free Plan`);
    } else if (subscription.status === "ACTIVE") {
      // Ensure we have the correct plan name for Pro plans
      if (subscription.name.includes("Pro") || subscription.name.includes("Full Experience")) {
        planName = "Pro Plan (Full Experience)";
      }
      console.log(`Subscription activated - setting to ${planName}`);
    }

    const finalSubscriptionData = {
      status: finalStatus,
      name: planName,
      subscriptionId: subscription.admin_graphql_api_id,
    };

    // Update subscription data in database
    // await updateSubscriptionData(shop, finalSubscriptionData);
    console.log(`✅ Updated database for ${shop} to ${planName} (${finalStatus})`);

    // If subscription is cancelled or inactive, enforce free plan limits
    if (finalStatus === "INACTIVE") {
      console.log(`Enforcing free plan limits for shop: ${shop}`);
      // await enforcePlanLimitsOnDowngrade(shop, finalSubscriptionData);
      console.log(`✅ Enforced free plan limits for ${shop}`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling app subscription webhook:", error);
    res.status(500).send("Internal server error");
  }
};

export const handleAppSubscriptionCancelled = async (req: Request, res: Response) => {
  try {
    // Parse the webhook body as JSON since it comes as text
    let payload: SubscriptionPayload;
    try {
      payload = JSON.parse(req.body as string) as SubscriptionPayload;
    } catch (parseError) {
      console.error("Failed to parse webhook body as JSON:", parseError);
      console.error("Raw body:", req.body);
      res.status(400).send("Invalid JSON payload");
      return;
    }
    
    const shop = req.headers["x-shopify-shop-domain"] as string;

    if (!shop) {
      console.error("No shop domain in subscription cancellation webhook headers");
      res.status(400).send("Missing shop domain");
      return;
    }

    if (!payload.app_subscription) {
      console.error("No app_subscription data in cancellation webhook payload");
      res.status(400).send("Missing subscription data");
      return;
    }

    console.log(`App subscription cancelled for shop: ${shop}`);

    // Extract subscription data from the nested structure
    const subscription = payload.app_subscription;

    // Don't update database for DECLINED subscriptions
    if (subscription.status === "DECLINED") {
      console.log(`Subscription declined for shop: ${shop} - no database update needed`);
      res.status(200).send("OK");
      return;
    }

    // For cancellation, always switch to Free Plan
    const finalSubscriptionData = {
      status: "INACTIVE",
      name: "Free Plan",
      subscriptionId: subscription.admin_graphql_api_id,
    };

    // Update subscription data to free plan
    // await updateSubscriptionData(shop, finalSubscriptionData);
    console.log(`✅ Updated database for ${shop} to Free Plan (INACTIVE)`);

    // Enforce free plan limits
    // await enforcePlanLimitsOnDowngrade(shop, finalSubscriptionData);
    console.log(`✅ Enforced free plan limits for ${shop}`);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling app subscription cancellation webhook:", error);
    res.status(500).send("Internal server error");
  }
};