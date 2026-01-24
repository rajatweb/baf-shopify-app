import { useMemo, useState, useEffect } from "react";
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
  const { data: { data: shopData } = {} } = useGetShopQuery();
  const { data: { data: subscriptions } = {}, isLoading: subscriptionsLoading } =
    useGetActiveSubscriptionsQuery();

  const isUpgradeModalOpen = useAppSelector((state) => state.planUpgradeModal.isOpen);
  const isCancelModalOpen = useAppSelector((state) => state.planCancelModal.showCancelModal);

  const currentSubscription = useMemo(() => subscriptions?.[0] || null, [subscriptions]);
  const isSubscribed = useMemo(() => currentSubscription?.status === "ACTIVE" || false, [currentSubscription]);
  const currentBillingInterval = useMemo(() => isSubscribed ? currentSubscription?.lineItems?.[0]?.plan?.pricingDetails?.interval as "EVERY_30_DAYS" | "ANNUAL" : null, [currentSubscription, isSubscribed]);

  // Initialize selectedInterval - default to ANNUAL if current subscription is yearly
  const [selectedInterval, setSelectedInterval] = useState<
    "EVERY_30_DAYS" | "ANNUAL"
  >("EVERY_30_DAYS");

  // Update selectedInterval when subscription data loads and it's ANNUAL
  useEffect(() => {
    if (currentBillingInterval === "ANNUAL") {
      setSelectedInterval("ANNUAL");
    }
  }, [currentBillingInterval]);
  const currentPlanConfig = useMemo(() => isSubscribed
    ? PLANS.find((p) => p.name === currentSubscription?.name) || PLANS[0]
    : PLANS[0], [isSubscribed, currentSubscription, PLANS]);


  if (subscriptionsLoading) {
    return <AppSkeleton />;
  }

  return (
    <div
      style={{
        maxWidth: "998px",
        margin: "0 auto",
        padding: "20px 16px",
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

        <s-box>
          {/* Usage Card */}
          <PlanLimitCard />
          <s-stack direction="block" gap="base" alignItems="center">

            {/* Billing Interval Selector */}
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

            {/* Trial Banner */}
            {selectedInterval === "EVERY_30_DAYS" && (
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  fontSize: "14px",
                  color: "#16a34a",
                  fontWeight: 500,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="#16a34a"
                  style={{ verticalAlign: "middle", marginRight: "6px" }}
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                7-day free trial on all paid plans • Cancel anytime
              </div>
            )}

            {/* Plans Grid - Top Row: Free, Boutique, Flagship */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                width: "100%",
                marginBottom: "12px",
                alignItems: "stretch",
              }}
            >
              {PLANS.slice(0, 3).map((plan) => (
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

            {/* Plans Grid - Bottom Row: Showroom, Runway (centered) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                width: "100%",
                maxWidth: "66.666%",
                margin: "0 auto",
                alignItems: "stretch",
              }}
            >
              {PLANS.slice(3).map((plan) => (
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
