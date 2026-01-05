import { useGetActiveSubscriptionsQuery } from "../store/api/subscriptions";

export enum PlanType {
  STARTER = "Starter",
}

export interface PlanConfig {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  features: {
    numberOfGroup: string;
  };
}

export const PLANS: Record<PlanType, PlanConfig> = {
  [PlanType.STARTER]: {
    name: "Starter",
    description: "Perfect for all stores",
    price: 9.99,
    yearlyPrice: 79.99,
    features: {
      numberOfGroup: "unlimited",
    },
  },
};

export function checkPlanAccess(
  currentPlan: PlanType,
  feature: keyof PlanConfig["features"]
): boolean | number | string {
  return PLANS[currentPlan].features[feature];
}

export function useSubscriptionStatus() {
  const { data: {data:activeSubscriptions}={}, isLoading } = useGetActiveSubscriptionsQuery();
  const activeSubscription = activeSubscriptions?.find((subscription) => subscription.status === "ACTIVE");
  return {
    isLoading,
    isActive: !!activeSubscription,
  };
}
