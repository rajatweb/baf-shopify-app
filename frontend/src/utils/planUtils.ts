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
    "25 items max",
    "All backgrounds",
    "Site-wide",
  ],
  basic: [
    "50 items max",
    "Custom branding",
    "Hide Sold Out Products Toggle",
  ],
  pro: [
    "150 items max",
    "Product Filters",
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
  "25 items max",
  "50 items max",
  "150 items max",
  "Unlimited items",
];

// Build cumulative features for a plan
const buildCumulativeFeatures = (planId: string): string[] => {
  const planOrder = ["free", "starter", "basic", "pro", "plus"];
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
    name: "Starter",
    badge: "Starter",
    monthlyPrice: 9,
    yearlyPrice: 90,
    features: buildCumulativeFeatures("starter"),
    maxItems: 25,
  },
  {
    id: "basic",
    name: "Basic",
    badge: "Basic",
    monthlyPrice: 15,
    yearlyPrice: 150,
    features: buildCumulativeFeatures("basic"),
    maxItems: 50,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Pro",
    monthlyPrice: 30,
    yearlyPrice: 300,
    features: buildCumulativeFeatures("pro"),
    maxItems: 150,
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Plus",
    monthlyPrice: 50,
    yearlyPrice: 500,
    features: buildCumulativeFeatures("plus"),
    maxItems: -1, // -1 means unlimited
  },
];
