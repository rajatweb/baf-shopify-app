import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetActiveSubscriptionsQuery,
} from "../../store/api/subscriptions";
import { useGetShopQuery } from "../../store/api/shop";
import { ButtonGroupComponent } from "../../components/web-components/ButtonGroupComponent";
import AppSkeleton from "../../components/commons/AppSkeleton";
import { useAppSelector } from "../../store/hooks/redux";
import { PLANS } from "../../utils/planUtils";

import { PlansCancelModal, PlanLimitCard, PlanGridCard, PlanUpgradeModal } from "../../components/plans";





export default function Plans() {

  const navigate = useNavigate();
  const [selectedInterval, setSelectedInterval] = useState<
    "EVERY_30_DAYS" | "ANNUAL"
  >("EVERY_30_DAYS");

  const { data: { data: shopData } = {} } = useGetShopQuery();
  const { data: { data: subscriptions } = {}, isLoading: subscriptionsLoading } =
    useGetActiveSubscriptionsQuery();

  const isUpgradeModalOpen = useAppSelector((state) => state.planUpgradeModal.isOpen);
  const isCancelModalOpen = useAppSelector((state) => state.planCancelModal.showCancelModal);

  const currentSubscription = useMemo(() => subscriptions?.[0] || null, [subscriptions]);
  const isSubscribed = useMemo(() => currentSubscription?.status === "ACTIVE" || false, [currentSubscription]);
  const currentBillingInterval = useMemo(() => isSubscribed ? currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.interval as "EVERY_30_DAYS" | "ANNUAL" : null, [currentSubscription, isSubscribed]);
  const currentPlanConfig = useMemo(() => isSubscribed
    ? PLANS.find((p) => p.name === currentSubscription?.name) || PLANS[0]
    : PLANS[0], [isSubscribed, currentSubscription, PLANS]);


  if (subscriptionsLoading) {
    return <AppSkeleton />;
  }

  return (
    <div
      style={{
        marginTop: "var(--p-space-800)",
        paddingBottom: "var(--p-space-1600)",
      }}
    >
      <s-page heading="Plans">
        <s-link slot="breadcrumb-actions" href="/">
          Home
        </s-link>
        <s-button
          slot="secondary-actions"
          variant="secondary"
          icon="arrow-left"
          onClick={() => navigate("/")}
        >
          Back to Home
        </s-button>

        {/* Current Plan Status */}
        {isSubscribed && (
          <s-banner tone="success" onDismiss={undefined}>
            <s-stack direction="block" gap="small-300">
              <s-text type="strong">
                You're currently on the {currentSubscription?.name} Plan
              </s-text>
              <s-text>
                Your subscription is active and you have access to all features
                included in your plan.
              </s-text>
              <s-text color="subdued">
                Status: {currentSubscription?.status} • You can switch plans
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
            <PlanLimitCard />

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
                  <PlanGridCard
                    plan={plan}
                    currentPlan={currentPlanConfig}
                    selectedInterval={selectedInterval}
                    isSubscribed={isSubscribed}
                    currentBillingInterval={currentBillingInterval}
                    currencyCode={shopData?.currencyCode || "USD"} />
                </div>
              ))}
            </div>
          </s-stack>

          {/* Upgrade/Downgrade Modal */}
          {isUpgradeModalOpen && <PlanUpgradeModal />}

          {isCancelModalOpen && <PlansCancelModal />}
        </s-box>
      </s-page>
    </div>
  );
}
