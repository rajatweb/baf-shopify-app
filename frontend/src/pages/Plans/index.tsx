import { useState } from "react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Box,
  Divider,
  List,
  Modal,
  Spinner,
  Toast,
  Tabs,
  Frame,
  Banner,
} from "@shopify/polaris";
import {
  useGetActiveSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "../../store/api/subscriptions";
import { useGetShopQuery } from "../../store/api/shop";
import { formatPrice } from "../../utils/currency";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { subscriptionsApi } from "../../store/api/subscriptions";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxTracks: number;
  trackLengthLimit?: number; // in seconds
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free Plan (Demo Mode)",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "1 playlist maximum",
      "2 tracks maximum per playlist",
      "Full-length tracks (no time limit)",
      "Basic music player functionality",
      "Limited customization options",
      "Mini-bar display only (no floating button)",
      "Light theme only (no dark mode)",
      "Homepage only (no cross-page playback)",
      "Email support",
    ],
    maxTracks: 2,
    trackLengthLimit: -1, // No limit
  },
  {
    id: "pro",
    name: "Pro Plan (Full Experience)",
    monthlyPrice: 7,
    yearlyPrice: 70, // 2 months free when paid yearly
    features: [
      "Unlimited playlists",
      "Unlimited tracks per playlist",
      "Full track length support",
      "Full customization options",
      "Mini-bar or floating button display",
      "Light or dark theme options",
      "Persistent playback across all pages",
      "Autoplay functionality",
      "Advanced playlist management",
      "Priority email support",
      "Analytics and reporting",
    ],
    maxTracks: -1, // -1 means unlimited
    popular: true,
  },
];

export default function Plans() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<
    "EVERY_30_DAYS" | "ANNUAL"
  >("EVERY_30_DAYS");
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  // Queries
  const { data: shop } = useGetShopQuery();
  const { data: subscriptions, isLoading: subscriptionsLoading, refetch: refetchSubscriptions } =
    useGetActiveSubscriptionsQuery();

  // Force refresh subscription data
  const forceRefreshSubscriptions = () => {
    dispatch(subscriptionsApi.util.invalidateTags(['Subscriptions']));
    refetchSubscriptions();
  };

  // Mutations
  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation();
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  // Get current subscription
  const currentSubscription = subscriptions?.data?.[0];
  const isSubscribed = currentSubscription?.status === "ACTIVE";

  const currentPlanConfig = isSubscribed
    ? PLANS.find((p) => p.name === currentSubscription?.name)
    : PLANS[0];

  const showToast = (message: string, isError = false) => {
    setToastMessage(message);
    setToastError(isError);
    setToastActive(true);
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
        // For embedded apps, we need to redirect the top window
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
      // Refresh the page after successful cancellation
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
      // Refresh the page after successful switch to free
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
      currentPlanConfig?.maxTracks !== -1 && plan.maxTracks === -1;
    const isDowngrade =
      currentPlanConfig?.maxTracks === -1 && plan.maxTracks !== -1;
    
    // Check if user wants to switch billing interval for the same plan
    const currentBillingInterval = currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.interval;
    const isSwitch =
      isSubscribed &&
      currentPlanConfig?.id === plan.id &&
      plan.id === "pro" && // Only Pro plan has billing options
      currentBillingInterval !== selectedInterval;

    return (
      <Card padding="0">
        <Box padding="400" width="100%">
          <BlockStack gap="400" align="start">
            {/* Header */}
            <BlockStack gap="200">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h3" fontWeight="semibold">
                  {plan.name}
                </Text>
                <InlineStack gap="200" align="center">
                  {plan.popular && <Badge tone="success">Most Popular</Badge>}
                  {isCurrentPlan && <Badge tone="info">Current Plan</Badge>}
                </InlineStack>
              </InlineStack>

              <BlockStack gap="100">
                <Text variant="headingLg" as="h2" fontWeight="bold">
                  {plan.monthlyPrice === 0
                    ? "Free"
                    : formatPrice(
                        selectedInterval === "EVERY_30_DAYS"
                          ? plan.monthlyPrice
                          : plan.yearlyPrice,
                        shop?.data?.shop.currencyCode || "USD"
                      )}
                </Text>
                {plan.monthlyPrice > 0 && (
                  <Text variant="bodySm" tone="subdued" as="p">
                    per{" "}
                    {selectedInterval === "EVERY_30_DAYS" ? "month" : "year"}
                    {selectedInterval === "ANNUAL" &&
                      plan.yearlyPrice < plan.monthlyPrice * 12 && (
                        <Text variant="bodySm" tone="success" as="span">
                          {" "}
                          (Save{" "}
                          {formatPrice(
                            plan.monthlyPrice * 12 - plan.yearlyPrice,
                            shop?.data?.shop.currencyCode || "USD"
                          )}
                          )
                        </Text>
                      )}
                  </Text>
                )}
              </BlockStack>
            </BlockStack>

            <Divider />

            {/* Features */}
            <BlockStack gap="200" align="start">
              <Text variant="bodyMd" fontWeight="semibold" as="p">
                What's included:
              </Text>
              <List type="bullet">
                {plan.features.map((feature, index) => (
                  <List.Item key={index}>
                    <Text variant="bodyMd" as="p">
                      {feature}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </BlockStack>

            {/* Track Limits Info for Free Plan */}
            {plan.id === "free" && (
              <Box
                background="bg-surface-secondary"
                padding="300"
                borderRadius="200"
                width="100%"
              >
                <BlockStack gap="200" align="start">
                  <Text variant="bodySm" fontWeight="semibold" as="p">
                    Free Plan Limits:
                  </Text>
                  <Text variant="bodySm" as="p">
                    • Maximum 2 tracks per playlist
                  </Text>
                  <Text variant="bodySm" as="p">
                    • Full-length tracks (no time limit)
                  </Text>
                  <Text variant="bodySm" as="p">
                    • "Powered by WEBEXP" branding always visible
                  </Text>
                  <Text variant="bodySm" tone="critical" as="p">
                    Upgrade to Pro for unlimited tracks and full features!
                  </Text>
                </BlockStack>
              </Box>
            )}

            {/* Action Button */}
            <Button
              variant={isCurrentPlan && !isSwitch ? "secondary" : "primary"}
              disabled={isCurrentPlan && !isSwitch}
              size="large"
              fullWidth
              loading={isCreating}
              onClick={() => {
                if (isUpgrade || isSwitch || isDowngrade) {
                  setSelectedPlan(plan);
                  setShowUpgradeModal(true);
                }
              }}
            >
              {isCurrentPlan && !isSwitch
                ? "Current Plan"
                : isDowngrade
                ? "Downgrade to Free"
                : isUpgrade
                ? "Upgrade Now"
                : isSwitch
                ? `Switch to ${selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"}`
                : "Get Started"}
            </Button>
          </BlockStack>
        </Box>
      </Card>
    );
  };

  if (subscriptionsLoading) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <BlockStack gap="400" align="center">
                <Spinner size="large" />
                <Text as="p" tone="subdued">
                  Loading plans...
                </Text>
              </BlockStack>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <div style={{ paddingBottom: "var(--p-space-1600)" }}>
      <Frame>
        <Page
          title="Choose Your Music Player Plan"
          subtitle="Select the plan that best fits your music player needs"
          backAction={{
            content: "Back",
            onAction: () => navigate(-1),
          }}
        >
          <Layout>
            <Layout.Section>
              <BlockStack gap="400" align="start">
                {/* Current Plan Status */}
                {isSubscribed && (
                  <Banner
                    title={`You're currently on the ${currentSubscription.name}`}
                    tone="success"
                    action={{
                      content: "Refresh Data",
                      onAction: forceRefreshSubscriptions,
                    }}
                  >
                    <BlockStack gap="200">
                      <Text as="p">
                        Your subscription is active and you have access to unlimited tracks and advanced music player features.
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Status: {currentSubscription.status} • You can switch to the free plan anytime
                      </Text>
                    </BlockStack>
                  </Banner>
                )}

                {!isSubscribed && (
                  <Banner
                    title="You're currently on the Free Plan"
                    tone="info"
                    action={{
                      content: "Refresh Data",
                      onAction: forceRefreshSubscriptions,
                    }}
                  >
                    <BlockStack gap="200">
                      <Text as="p">
                        You have access to basic music player features with limited tracks and customization options.
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        Upgrade to Pro for unlimited tracks, full customization, and advanced features.
                      </Text>
                    </BlockStack>
                  </Banner>
                )}

                {/* Billing Interval Tabs */}
                <Box padding="400" width="100%">
                  <BlockStack gap="400" align="center">
                    <InlineStack align="center">
                      <Tabs
                        tabs={[
                          {
                            id: "monthly",
                            content: "Monthly",
                            accessibilityLabel: "Monthly billing",
                            panelID: "monthly-panel",
                          },
                          {
                            id: "yearly",
                            content: "Yearly (Save 17%)",
                            accessibilityLabel: "Yearly billing",
                            panelID: "yearly-panel",
                          },
                        ]}
                        selected={selectedInterval === "EVERY_30_DAYS" ? 0 : 1}
                        onSelect={(selectedTabIndex) => {
                          setSelectedInterval(
                            selectedTabIndex === 0 ? "EVERY_30_DAYS" : "ANNUAL"
                          );
                        }}
                      />
                    </InlineStack>
                  </BlockStack>
                </Box>

                {/* Plans */}
                <InlineStack gap="400" align="center" wrap>
                  {PLANS.map((plan) => (
                    <Box
                      key={plan.id}
                      minWidth="300px"
                      maxWidth="400px"
                      width="100%"
                    >
                      <PlanCard plan={plan} />
                    </Box>
                  ))}
                </InlineStack>
              </BlockStack>
            </Layout.Section>
          </Layout>

          {/* Upgrade/Downgrade Modal */}
          <Modal
            open={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            title={
              selectedPlan?.id === "free" && currentPlanConfig?.id === "pro"
                ? "Downgrade to Free Plan"
                : selectedPlan?.id === currentPlanConfig?.id && isSubscribed
                ? `Switch to ${selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"} Billing`
                : "Upgrade to Pro Plan"
            }
            primaryAction={{
              content:
                selectedPlan?.id === "free" && currentPlanConfig?.id === "pro"
                  ? "Downgrade Now"
                  : selectedPlan?.id === currentPlanConfig?.id && isSubscribed
                  ? `Switch to ${selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"}`
                  : "Upgrade Now",
              onAction:
                selectedPlan?.id === "free" && currentPlanConfig?.id === "pro"
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
              <BlockStack gap="400">
                {selectedPlan?.id === "free" &&
                currentPlanConfig?.id === "pro" ? (
                  // Downgrade to free plan
                  <>
                    <Text as="p">
                      You're about to downgrade to the Free Plan. This will:
                    </Text>
                    <List type="bullet">
                      <List.Item>
                        <Text as="p">Cancel your current Pro subscription</Text>
                      </List.Item>
                      <List.Item>
                        <Text as="p">
                          Limit you to 1 track per playlist
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text as="p">
                          Remove full-length track support
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text as="p">
                          Show "Powered by WEBEXP" branding on all players
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text as="p">
                          Remove persistent playback across pages
                        </Text>
                      </List.Item>
                    </List>
                    <Box
                      background="bg-surface-secondary"
                      padding="300"
                      borderRadius="200"
                    >
                      <Text variant="bodySm" tone="subdued" as="p">
                        You can upgrade back to Pro anytime to restore all features.
                      </Text>
                    </Box>
                  </>
                ) : selectedPlan?.id === currentPlanConfig?.id &&
                  isSubscribed ? (
                  // Switch billing for pro users
                  <>
                    <Text as="p">
                      You're about to switch your Pro Plan billing from{" "}
                      {currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.interval === "EVERY_30_DAYS" ? "monthly" : "yearly"}{" "}
                      to{" "}
                      {selectedInterval === "EVERY_30_DAYS" ? "monthly" : "yearly"} billing.
                    </Text>
                    <Text as="p">
                      Your new billing will be{" "}
                      {formatPrice(
                        selectedInterval === "EVERY_30_DAYS"
                          ? selectedPlan?.monthlyPrice || 0
                          : selectedPlan?.yearlyPrice || 0,
                        shop?.data?.shop.currencyCode || "USD"
                      )}{" "}
                      per {selectedInterval === "EVERY_30_DAYS" ? "month" : "year"}.
                    </Text>
                    {selectedInterval === "ANNUAL" && (
                      <Text as="p" tone="success">
                        💰 You'll save{" "}
                        {formatPrice(
                          (selectedPlan?.monthlyPrice || 0) * 12 - (selectedPlan?.yearlyPrice || 0),
                          shop?.data?.shop.currencyCode || "USD"
                        )}{" "}
                        by switching to yearly billing!
                      </Text>
                    )}
                    <Box
                      background="bg-surface-secondary"
                      padding="300"
                      borderRadius="200"
                    >
                      <Text variant="bodySm" tone="subdued" as="p">
                        You'll be redirected to Shopify to complete the billing change.
                      </Text>
                    </Box>
                  </>
                ) : (
                  <>
                    <Text as="p">
                      You're about to{" "}
                      {selectedPlan?.id === currentPlanConfig?.id
                        ? "switch billing for"
                        : "upgrade to"}{" "}
                      the {selectedPlan?.name} for{" "}
                      {formatPrice(
                        selectedInterval === "EVERY_30_DAYS"
                          ? selectedPlan?.monthlyPrice || 0
                          : selectedPlan?.yearlyPrice || 0,
                        shop?.data?.shop.currencyCode || "USD"
                      )}{" "}
                      per{" "}
                      {selectedInterval === "EVERY_30_DAYS" ? "month" : "year"}.
                    </Text>
                    <Text as="p">
                      This will give you unlimited tracks, full customization options, and advanced music player features.
                    </Text>
                    <Box
                      background="bg-surface-secondary"
                      padding="300"
                      borderRadius="200"
                    >
                      <Text variant="bodySm" tone="subdued" as="p">
                        You'll be redirected to Shopify to complete the
                        subscription process.
                      </Text>
                    </Box>
                  </>
                )}
              </BlockStack>
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
              <BlockStack gap="400">
                <Text as="p">
                  Are you sure you want to cancel your subscription?
                </Text>
                <Text as="p">
                  You'll lose access to unlimited tracks and advanced music player features. Your current playlists will continue to work until the end of your billing period.
                </Text>
              </BlockStack>
            </Modal.Section>
          </Modal>

          {/* Toast */}
          {toastActive && (
            <Toast
              content={toastMessage}
              error={toastError}
              onDismiss={() => setToastActive(false)}
            />
          )}
        </Page>
      </Frame>
    </div>
  );
}
