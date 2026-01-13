import { useState } from "react";
import { Modal } from "@shopify/polaris";
import {
  useGetActiveSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "../../store/api/subscriptions";
import { useGetShopQuery } from "../../store/api/shop";
import { formatPrice } from "../../utils/currency";
import { ButtonGroupComponent } from "../../components/web-components/ButtonGroupComponent";
import AppSkeleton from "../../components/commons/AppSkeleton";
import AppHeader from "../../components/commons/Header";

interface Plan {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxItems: number; // -1 means unlimited
  popular?: boolean;
}

const PLANS: Plan[] = [
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

export default function Plans() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<
    "EVERY_30_DAYS" | "ANNUAL"
  >("EVERY_30_DAYS");

  const { data: shop } = useGetShopQuery();
  const { data: subscriptions, isLoading: subscriptionsLoading } =
    useGetActiveSubscriptionsQuery();

  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const currentSubscription = subscriptions?.data?.[0];
  const isSubscribed = currentSubscription?.status === "ACTIVE";

  const currentPlanConfig = isSubscribed
    ? PLANS.find((p) => p.name === currentSubscription?.name) || PLANS[0]
    : PLANS[0];

  // Dummy usage data - TODO: Replace with actual usage from API
  const currentUsage = {
    itemsUsed: 23,
    itemsLimit: currentPlanConfig?.maxItems || 50,
  };
  const usagePercentage =
    (currentUsage.itemsUsed / currentUsage.itemsLimit) * 100;

  const showToast = (message: string, isError = false) => {
    if (typeof shopify !== "undefined" && shopify.toast) {
      shopify.toast.show(message, { isError });
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      const result = await createSubscription({
        planName: selectedPlan.name,
        planPrice:
          selectedInterval === "EVERY_30_DAYS"
            ? selectedPlan.monthlyPrice
            : selectedPlan.yearlyPrice,
        planInterval: selectedInterval,
      }).unwrap();

      if (result.confirmationUrl) {
        if (window.top && window.top !== window) {
          window.top.location.href = result.confirmationUrl;
        } else {
          window.location.href = result.confirmationUrl;
        }
      }
    } catch (error) {
      console.error("Failed to create subscription:", error);
      showToast("Failed to upgrade plan. Please try again.", true);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      showToast(
        "Subscription cancelled successfully. You've been switched to the free plan."
      );
      setShowCancelModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      showToast("Failed to cancel subscription. Please try again.", true);
    }
  };

  const handleSwitchToFree = async () => {
    try {
      await cancelSubscription().unwrap();
      showToast("Successfully switched to the free plan.");
      setShowCancelModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Failed to switch to free plan:", error);
      showToast("Failed to switch to free plan. Please try again.", true);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case "free":
        return "#6d7175";
      case "starter":
        return "#3b82f6";
      case "basic":
        return "#10b981";
      case "pro":
        return "#8b5cf6";
      case "plus":
        return "#f59e0b";
      default:
        return "#6d7175";
    }
  };

  const PlanCard = ({ plan }: { plan: Plan }) => {
    const isCurrentPlan = currentPlanConfig?.id === plan.id;
    const isUpgrade =
      currentPlanConfig && plan.maxItems > currentPlanConfig.maxItems;
    const isDowngrade =
      currentPlanConfig &&
      plan.maxItems < currentPlanConfig.maxItems &&
      plan.maxItems !== -1;

    const currentBillingInterval =
      currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.interval;
    const isSwitch =
      isSubscribed &&
      currentPlanConfig?.id === plan.id &&
      plan.id !== "free" &&
      currentBillingInterval !== selectedInterval;

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          position: "relative",
        }}
      >
        {/* Popular Badge */}
        {plan.popular && (
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                background: "#202223",
                color: "white",
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                whiteSpace: "nowrap",
              }}
            >
              MOST POPULAR
            </div>
          </div>
        )}

        <s-box
          background="base"
          border="base"
          borderRadius="base"
          padding="large"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              gap: "24px",
            }}
          >
            {/* Header */}
            <s-stack direction="block" gap="small-200">
              <s-stack
                direction="inline"
                justifyContent="space-between"
                alignItems="center"
              >
                <div
                  style={{
                    background: getBadgeColor(plan.badge),
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  {plan.badge}
                </div>
                {isCurrentPlan && <s-badge tone="info">Current</s-badge>}
              </s-stack>
            </s-stack>

            {/* Pricing */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(16px, 4vw, 32px)",
                    fontWeight: 600,
                    lineHeight: "1",
                    color: "#202223",
                  }}
                >
                  {plan.monthlyPrice === 0
                    ? "$0"
                    : formatPrice(
                        selectedInterval === "EVERY_30_DAYS"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice,
                        shop?.data?.shop.currencyCode || "USD"
                      )}
                </div>
                {plan.monthlyPrice > 0 && (
                  <s-text color="subdued">
                    /{selectedInterval === "EVERY_30_DAYS" ? "mo" : "yr"}
                  </s-text>
                )}
              </div>

              {plan.monthlyPrice > 0 && selectedInterval === "ANNUAL" && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <s-badge tone="success">
                    Save{" "}
                    {formatPrice(
                      plan.monthlyPrice * 12 - plan.yearlyPrice,
                      shop?.data?.shop.currencyCode || "USD"
                    )}
                  </s-badge>
                </div>
              )}
            </div>

            <s-divider />

            {/* Features */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <s-stack direction="block" gap="small-400" alignItems="start">
                <s-text type="strong">Features</s-text>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "0",
                    listStyle: "none",
                    lineHeight: "1.8",
                    width: "100%",
                  }}
                >
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          marginTop: "6px",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#6d7175",
                          flexShrink: 0,
                        }}
                      />
                      <s-text color="subdued">{feature}</s-text>
                    </li>
                  ))}
                </ul>
              </s-stack>
            </div>

            {/* Action Button */}
            <div
              style={{
                width: "100%",
                marginTop: "auto",
                paddingTop: "8px",
              }}
            >
              <s-button
                variant={isCurrentPlan && !isSwitch ? "secondary" : "primary"}
                disabled={isCurrentPlan && !isSwitch}
                loading={isCreating}
                onClick={() => {
                  if (
                    isUpgrade ||
                    isSwitch ||
                    isDowngrade ||
                    (!isCurrentPlan && plan.id !== "free")
                  ) {
                    setSelectedPlan(plan);
                    setShowUpgradeModal(true);
                  }
                }}
              >
                {isCurrentPlan && !isSwitch
                  ? "Manage"
                  : isDowngrade
                  ? "Downgrade"
                  : isUpgrade
                  ? "Upgrade"
                  : "Get Started"}
              </s-button>
            </div>
          </div>
        </s-box>
      </div>
    );
  };

  if (subscriptionsLoading) {
    return <AppSkeleton />;
  }

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <s-page>
        <AppHeader
          title="Plans"
          subtitle="Choose the plan that best suits your needs"
          showBackButton={true}
          backButtonPath="/"
          backButtonLabel="Back"
        />

        {/* Current Plan Status */}
        {isSubscribed && (
          <s-banner tone="success" onDismiss={undefined}>
            <s-stack direction="block" gap="small-300">
              <s-text type="strong">
                You're currently on the {currentSubscription.name} Plan
              </s-text>
              <s-text>
                Your subscription is active and you have access to all features
                included in your plan.
              </s-text>
              <s-text color="subdued">
                Status: {currentSubscription.status} • You can switch plans
                anytime
              </s-text>
            </s-stack>
          </s-banner>
        )}

        {!isSubscribed && (
          <s-banner tone="warning" onDismiss={undefined}>
            <s-stack direction="block" gap="small-300">
              <s-text type="strong">You're currently on the Free Plan</s-text>
              <s-text>
                You have access to basic features. Upgrade to unlock more
                capabilities.
              </s-text>
            </s-stack>
          </s-banner>
        )}

        <s-box>
          <s-stack direction="block" gap="base" alignItems="center">
            {/* Usage Card */}
            <div style={{ width: "100%", marginBottom: "24px" }}>
              <s-box
                background="base"
                border="base"
                borderRadius="base"
                padding="base"
              >
                <s-stack
                  direction="inline"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="large"
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#6d7175",
                        marginBottom: "4px",
                      }}
                    >
                      Current usage
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>
                      {currentUsage.itemsUsed} of {currentUsage.itemsLimit}{" "}
                      items
                    </div>
                  </div>
                  <div style={{ flex: 1, maxWidth: "300px" }}>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "#e1e3e5",
                        borderRadius: "4px",
                        overflow: "hidden",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: `${usagePercentage}%`,
                          height: "100%",
                          background:
                            usagePercentage >= 90
                              ? "#ef4444"
                              : usagePercentage >= 70
                              ? "#facc15"
                              : "#22c55e",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6d7175",
                        textAlign: "right",
                      }}
                    >
                      {Math.round(usagePercentage)}% of plan limit
                    </div>
                  </div>
                </s-stack>
              </s-box>
            </div>

            {/* Billing Interval Selector */}
            <s-box padding="base">
              <ButtonGroupComponent
                label=""
                name="interval"
                value={selectedInterval}
                options={[
                  { label: "Monthly", value: "EVERY_30_DAYS" },
                  { label: "Yearly (Save 17%)", value: "ANNUAL" },
                ]}
                onValueChange={(_, value) => {
                  setSelectedInterval(value as "EVERY_30_DAYS" | "ANNUAL");
                }}
              />
            </s-box>

            {/* Plans Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                width: "100%",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 16px",
              }}
            >
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <PlanCard plan={plan} />
                </div>
              ))}
            </div>
          </s-stack>

          {/* Upgrade/Downgrade Modal */}
          <Modal
            open={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            title={
              selectedPlan?.id === "free" && currentPlanConfig?.id !== "free"
                ? "Downgrade to Free Plan"
                : selectedPlan?.id === currentPlanConfig?.id && isSubscribed
                ? `Switch to ${
                    selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"
                  } Billing`
                : `Upgrade to ${selectedPlan?.name} Plan`
            }
            primaryAction={{
              content:
                selectedPlan?.id === "free" && currentPlanConfig?.id !== "free"
                  ? "Downgrade Now"
                  : selectedPlan?.id === currentPlanConfig?.id && isSubscribed
                  ? `Switch to ${
                      selectedInterval === "EVERY_30_DAYS"
                        ? "Monthly"
                        : "Yearly"
                    }`
                  : "Upgrade Now",
              onAction:
                selectedPlan?.id === "free" && currentPlanConfig?.id !== "free"
                  ? handleSwitchToFree
                  : selectedPlan?.id === currentPlanConfig?.id && isSubscribed
                  ? handleUpgrade
                  : handleUpgrade,
              loading: isCreating || isCancelling,
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: () => setShowUpgradeModal(false),
              },
            ]}
          >
            <Modal.Section>
              <s-stack direction="block" gap="base">
                {selectedPlan?.id === "free" &&
                currentPlanConfig?.id !== "free" ? (
                  <>
                    <s-text>
                      You're about to downgrade to the Free Plan. This will:
                    </s-text>
                    <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>Cancel your current subscription</s-text>
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>Limit you to 8 items max</s-text>
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>
                          Restrict to basic backgrounds and homepage only
                        </s-text>
                      </li>
                    </ul>
                    <s-box
                      background="subdued"
                      padding="small-400"
                      borderRadius="small-200"
                    >
                      <s-text color="subdued">
                        You can upgrade back anytime to restore all features.
                      </s-text>
                    </s-box>
                  </>
                ) : selectedPlan?.id === currentPlanConfig?.id &&
                  isSubscribed ? (
                  <>
                    <s-text>
                      You're about to switch your {selectedPlan?.name} Plan
                      billing from{" "}
                      {currentSubscription?.lineItems?.[0]?.plan?.pricingDetails
                        ?.interval === "EVERY_30_DAYS"
                        ? "monthly"
                        : "yearly"}{" "}
                      to{" "}
                      {selectedInterval === "EVERY_30_DAYS"
                        ? "monthly"
                        : "yearly"}{" "}
                      billing.
                    </s-text>
                    <s-text>
                      Your new billing will be{" "}
                      {formatPrice(
                        selectedInterval === "EVERY_30_DAYS"
                          ? selectedPlan?.monthlyPrice || 0
                          : selectedPlan?.yearlyPrice || 0,
                        shop?.data?.shop.currencyCode || "USD"
                      )}{" "}
                      per{" "}
                      {selectedInterval === "EVERY_30_DAYS" ? "month" : "year"}.
                    </s-text>
                    {selectedInterval === "ANNUAL" && (
                      <s-text>
                        💰 You'll save{" "}
                        {formatPrice(
                          (selectedPlan?.monthlyPrice || 0) * 12 -
                            (selectedPlan?.yearlyPrice || 0),
                          shop?.data?.shop.currencyCode || "USD"
                        )}{" "}
                        by switching to yearly billing!
                      </s-text>
                    )}
                    <s-box
                      background="subdued"
                      padding="small-400"
                      borderRadius="small-200"
                    >
                      <s-text color="subdued">
                        You'll be redirected to Shopify to complete the billing
                        change.
                      </s-text>
                    </s-box>
                  </>
                ) : (
                  <>
                    <s-text>
                      You're about to upgrade to the {selectedPlan?.name} Plan
                      for{" "}
                      {formatPrice(
                        selectedInterval === "EVERY_30_DAYS"
                          ? selectedPlan?.monthlyPrice || 0
                          : selectedPlan?.yearlyPrice || 0,
                        shop?.data?.shop.currencyCode || "USD"
                      )}{" "}
                      per{" "}
                      {selectedInterval === "EVERY_30_DAYS" ? "month" : "year"}.
                    </s-text>
                    <s-text>
                      This will give you access to all features included in the{" "}
                      {selectedPlan?.name} Plan.
                    </s-text>
                    <s-box
                      background="subdued"
                      padding="small-400"
                      borderRadius="small-200"
                    >
                      <s-text color="subdued">
                        You'll be redirected to Shopify to complete the
                        subscription process.
                      </s-text>
                    </s-box>
                  </>
                )}
              </s-stack>
            </Modal.Section>
          </Modal>

          {/* Cancel Modal */}
          <Modal
            open={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            title="Cancel Subscription"
            primaryAction={{
              content: "Cancel Subscription",
              onAction: handleCancel,
              loading: isCancelling,
              destructive: true,
            }}
            secondaryActions={[
              {
                content: "Keep Subscription",
                onAction: () => setShowCancelModal(false),
              },
            ]}
          >
            <Modal.Section>
              <s-stack direction="block" gap="base">
                <s-text>
                  Are you sure you want to cancel your subscription?
                </s-text>
                <s-text>
                  You'll lose access to all premium features. Your current items
                  will continue to work until the end of your billing period.
                </s-text>
              </s-stack>
            </Modal.Section>
          </Modal>
        </s-box>
      </s-page>
    </div>
  );
}
