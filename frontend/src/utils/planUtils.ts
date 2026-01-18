import { TPlan, TSubscription } from "../store/api/subscriptions/types";

export const isPlusPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Plus"
  );
};

export const isProPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Pro"
  );
};

export const isBasicPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Basic"
  );
};

export const isStarterPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Starter"
  );
};

export const PLANS: TPlan[] = [
  {
    id: "free",
    name: "Free",
    badge: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "8 items max",
      "Basic backgrounds",
      "Home page only",
      "Analytics",
    ],
    maxItems: 8,
  },
  {
    id: "starter",
    name: "Starter",
    badge: "Starter",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: ["25 items max", "All backgrounds", "Site-wide", "Analytics"],
    maxItems: 25,
  },
  {
    id: "basic",
    name: "Basic",
    badge: "Basic",
    monthlyPrice: 15,
    yearlyPrice: 150,
    features: [
      "50 items max",
      "All backgrounds",
      "Custom branding",
      "Site-wide",
      "Hide Sold Out Products Toggle",
    ],
    maxItems: 50,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Pro",
    monthlyPrice: 30,
    yearlyPrice: 300,
    features: [
      "150 items max",
      "All backgrounds",
      "Custom branding",
      "Site-wide",
      "Product Filters",
    ],
    maxItems: 150,
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Plus",
    monthlyPrice: 50,
    yearlyPrice: 500,
    features: [
      "Unlimited items",
      "All backgrounds",
      "Custom branding",
      "Priority support",
    ],
    maxItems: -1, // -1 means unlimited
  },
];
