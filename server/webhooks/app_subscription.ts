import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { planEnforcement } from "../utils/planEnforcement";

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

export const handleAppSubscriptionUpdate = async (
  topic: string,
  shop: string,
  body: string,
  webhookId: string,
  apiVersion: string
) => {
  try {
    const payload = JSON.parse(body as string) as SubscriptionPayload;
    const subscriptionData = payload.app_subscription;
    const isCancelled =
      subscriptionData.status === "CANCELLED" ||
      subscriptionData.status === "EXPIRED";
    if (isCancelled) {
      await planEnforcement(shop, "free");
    } else {
      await planEnforcement(
        shop,
        subscriptionData?.name?.toLowerCase() || "free"
      );
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error handling app subscription update");
  }
};
