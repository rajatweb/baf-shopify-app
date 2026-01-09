import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
  req: Request,
  res: Response
) => {
  // Parse the webhook body as JSON since it comes as text
  let payload: SubscriptionPayload;
  try {
    payload = JSON.parse(req.body as string) as SubscriptionPayload;
  } catch (parseError) {
    return;
  }
};

export const handleAppSubscriptionCancelled = async (
  req: Request,
  res: Response
) => {
  // Parse the webhook body as JSON since it comes as text
  let payload: SubscriptionPayload;
  try {
    payload = JSON.parse(req.body as string) as SubscriptionPayload;
  } catch (parseError) {
    return;
  }
};
