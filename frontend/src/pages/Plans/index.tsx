import { useState } from "react";
import { Modal } from "@shopify/polaris";
import {
  useGetActiveSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "../../store/api/subscriptions";
import { useGetShopQuery } from "../../store/api/shop";
import { formatPrice } from "../../utils/currency";
import { useNavigate } from "react-router-dom";
import { ButtonGroupComponent } from "../../components/web-components/ButtonGroupComponent";
import AppSkeleton from "../../components/commons/AppSkeleton";

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  trialDays: number;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Get started",
    monthlyPrice: 0,
    yearlyPrice: 0,
    trialDays: 0,
    features: [
      "Homepage only",
      "1 playlist, 2 tracks max",
      "Mini-bar player only",
      "Light mode only",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For stores wanting background music",
    monthlyPrice: 7,
    yearlyPrice: 70,
    trialDays: 7,
    features: [
      "7-day free trial",
      "Unlimited playlists & tracks",
      "Mini-bar or floating button",
      "Autoplay with seamless site-wide playback",
      "YouTube & SoundCloud tracks",
      "Light or dark mode",
      "Custom CSS",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    description: "For artists & labels",
    monthlyPrice: 20,
    yearlyPrice: 200,
    trialDays: 7,
    features: [
      "7-day free trial",
      "Everything in Pro, plus:",
      "Platform links (Spotify, Apple Music, YouTube, etc.)",
      "Music Videos",
      "CTA badges & Lyrics",
      "Custom colors",
      "Crossfade transitions",
      "Album art backdrop",
    ],
    popular: true,
  },
];

export default function Plans() {
  const navigate = useNavigate();

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
    ? PLANS.find((p) => p.name === currentSubscription?.name)
    : PLANS[0];

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
        trialDays: selectedPlan.trialDays || 0,
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

  const PlanCard = ({ plan }: { plan: Plan }) => {
    const isCurrentPlan = currentPlanConfig?.id === plan.id;
    const isUpgrade =
      currentPlanConfig &&
      plan.id !== "free" &&
      (currentPlanConfig.id === "free" ||
        (currentPlanConfig.id === "pro" && plan.id === "studio"));

    // Downgrade: Studio to Pro, or any paid plan to Free
    const isDowngrade =
      currentPlanConfig?.id !== "free" &&
      (plan.id === "free" ||
        (currentPlanConfig?.id === "studio" && plan.id === "pro"));

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
          border={isCurrentPlan ? "base" : "base"}
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
                <s-heading>{plan.name}</s-heading>
                {isCurrentPlan && <s-badge tone="info">Current</s-badge>}
              </s-stack>
              <s-text color="subdued">{plan.description}</s-text>
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
                    ? "Free"
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

              {plan.monthlyPrice > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selectedInterval === "ANNUAL" &&
                    plan.yearlyPrice < plan.monthlyPrice * 12 && (
                      <s-badge tone="success">
                        Save{" "}
                        {formatPrice(
                          plan.monthlyPrice * 12 - plan.yearlyPrice,
                          shop?.data?.shop.currencyCode || "USD"
                        )}
                      </s-badge>
                    )}
                  {plan.trialDays > 0 && (
                    <s-badge tone="warning">
                      {" "}
                      {plan.trialDays}-day trial
                    </s-badge>
                  )}
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

            {/* Track Limits Info for Free Plan */}
            {plan.id === "free" && (
              <s-box background="subdued" padding="base" borderRadius="base">
                <s-text tone="critical" type="strong">
                  Unlock unlimited playlists, tracks, and premium features with
                  Pro or Studio plans!
                </s-text>
              </s-box>
            )}
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
                  ? "Current Plan"
                  : isDowngrade
                  ? plan.id === "free"
                    ? "Downgrade to Free"
                    : `Downgrade to ${plan.name}`
                  : isUpgrade
                  ? `Upgrade to ${plan.name}`
                  : isSwitch
                  ? `Switch to ${
                      selectedInterval === "EVERY_30_DAYS"
                        ? "Monthly"
                        : "Yearly"
                    }`
                  : plan.id === "free"
                  ? "Get Started"
                  : `Upgrade to ${plan.name}`}
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
      <s-page heading="Playlists">
        {/* <s-section> */}
        {/* <div style={{ marginBottom: "24px", marginTop: "24px" }}>
        <s-button variant="primary" onClick={() => openPlaylistCreateModal()}>
          + Create Playlist
        </s-button>
      </div> */}

        <s-stack
          direction="inline"
          justifyContent="space-between"
          alignItems="center"
          paddingBlock="large"
        >
          <s-heading>Choose Your Plan</s-heading>

          <s-button
            variant="tertiary"
            icon="arrow-left"
            onClick={() => navigate("/")}
          >
            Back to Home
          </s-button>
        </s-stack>
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
                You have access to basic music player features. Upgrade to
                unlock more capabilities.
              </s-text>
            </s-stack>
          </s-banner>
        )}
        <s-box>
          <s-stack direction="block" gap="base" alignItems="center">
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
                : currentPlanConfig?.id === "studio" &&
                  selectedPlan?.id === "pro"
                ? "Downgrade to Pro Plan"
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
                  : currentPlanConfig?.id === "studio" &&
                    selectedPlan?.id === "pro"
                  ? "Downgrade to Pro"
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
                  : currentPlanConfig?.id === "studio" &&
                    selectedPlan?.id === "pro"
                  ? handleUpgrade
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
                        <s-text>Limit you to 1 playlist, 2 tracks max</s-text>
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>Restrict playback to homepage only</s-text>
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>Remove advanced features</s-text>
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
                ) : currentPlanConfig?.id === "studio" &&
                  selectedPlan?.id === "pro" ? (
                  <>
                    <s-text>
                      You're about to downgrade from Studio to Pro Plan. This
                      will:
                    </s-text>
                    <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>Cancel your Studio subscription</s-text>
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>
                          Remove Studio-only features (videos, platform links,
                          custom colors, etc.)
                        </s-text>
                      </li>
                      <li style={{ marginBottom: "8px" }}>
                        <s-text>
                          Switch to Pro Plan with all Pro features
                        </s-text>
                      </li>
                    </ul>
                    <s-box
                      background="subdued"
                      padding="small-400"
                      borderRadius="small-200"
                    >
                      <s-text color="subdued">
                        You can upgrade back to Studio anytime to restore all
                        features.
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
                  You'll lose access to all premium features. Your current
                  playlists will continue to work until the end of your billing
                  period.
                </s-text>
              </s-stack>
            </Modal.Section>
          </Modal>
        </s-box>
      </s-page>
    </div>
  );
}
