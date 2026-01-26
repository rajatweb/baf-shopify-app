import { TPlan, TSubscription } from "../store/api/subscriptions/types";

export const isPlusPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Runway" || subscription.name === "Plus"
  );
};

export const isProPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Showroom" || subscription.name === "Pro"
  );
};

export const isBasicPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Flagship" || subscription.name === "Basic"
  );
};

export const isStarterPlan = (subscriptions: TSubscription[]): boolean => {
  return !!subscriptions.find(
    (subscription: TSubscription) => subscription.name === "Boutique" || subscription.name === "Starter"
  );
};

// Base features available to all plans
const BASE_FEATURES: string[] = [
  "Analytics",
];

// Incremental features per plan tier (only new features added at each level)
const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    "8 items max",
    "Basic backgrounds",
    "Home page only",
  ],
  starter: [
    "30 items max",
    "All backgrounds",
    "Site-wide",
    "Product filters",
  ],
  basic: [
    "60 items max",
    "Custom branding",
    "Hide Sold Out Products Toggle",
  ],
  plus: [
    "Unlimited items",
    "Priority support",
  ],
};

// Feature replacement rules (new feature replaces old one)
const FEATURE_REPLACEMENTS: Record<string, string[]> = {
  "All backgrounds": ["Basic backgrounds"],
  "Site-wide": ["Home page only"],
};

// Item limit features (only show the highest one)
const ITEM_LIMIT_FEATURES = [
  "8 items max",
  "30 items max",
  "60 items max",
  "Unlimited items",
];

// Build cumulative features for a plan
const buildCumulativeFeatures = (planId: string): string[] => {
  const planOrder = ["free", "starter", "basic", "plus"];
  const planIndex = planOrder.indexOf(planId);
  
  if (planIndex === -1) return BASE_FEATURES;
  
  // Collect all features from base + all plans up to and including current plan
  const features: string[] = [...BASE_FEATURES];
  let itemLimitFeature = "";
  
  for (let i = 0; i <= planIndex; i++) {
    const currentPlanId = planOrder[i];
    const planFeatures = PLAN_FEATURES[currentPlanId] || [];
    
    planFeatures.forEach((feature) => {
      // Handle item limits specially - only keep the highest one
      if (ITEM_LIMIT_FEATURES.includes(feature)) {
        itemLimitFeature = feature; // Always keep the latest (highest) item limit
      } else {
        // Check if this feature replaces any existing features
        const replacements = FEATURE_REPLACEMENTS[feature];
        if (replacements) {
          // Remove old features that are replaced
          replacements.forEach((oldFeature) => {
            const index = features.indexOf(oldFeature);
            if (index !== -1) {
              features.splice(index, 1);
            }
          });
        }
        
        // Add the new feature if not already present
        if (!features.includes(feature)) {
          features.push(feature);
        }
      }
    });
  }
  
  // Insert item limit at the beginning (after base features)
  if (itemLimitFeature) {
    features.splice(BASE_FEATURES.length, 0, itemLimitFeature);
  }
  
  return features;
};

export const PLANS: TPlan[] = [
  {
    id: "free",
    name: "Free",
    badge: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: buildCumulativeFeatures("free"),
    maxItems: 8,
  },
  {
    id: "starter",
    name: "Boutique",
    badge: "Boutique",
    monthlyPrice: 10,
    yearlyPrice: 100,
    features: buildCumulativeFeatures("starter"),
    maxItems: 30,
  },
  {
    id: "basic",
    name: "Flagship",
    badge: "Flagship",
    monthlyPrice: 25,
    yearlyPrice: 249,
    features: buildCumulativeFeatures("basic"),
    maxItems: 60,
    popular: true,
  },
  {
    id: "plus",
    name: "Runway",
    badge: "Runway",
    monthlyPrice: 50,
    yearlyPrice: 498,
    features: buildCumulativeFeatures("plus"),
    maxItems: -1, // -1 means unlimited
  },
];
