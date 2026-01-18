import { useGetSettingsQuery } from "../../store/api/settings";
import { useNavigate } from "react-router-dom";
import { useGetActiveSubscriptionsQuery } from "../../store/api/subscriptions";
import { PLANS } from "../../utils/planUtils";
import { useMemo } from "react";

export const PlanBanner = () => {
  const { data: { data: storeSettings } = {} } = useGetSettingsQuery();
  const { data: { data: subscriptions } = {} } = useGetActiveSubscriptionsQuery();
  const currentPlan = useMemo(() => {
    if (!subscriptions) return PLANS[0];
    return PLANS.find((p) => p.name === subscriptions?.[0]?.name) || PLANS[0];
  }, [subscriptions, PLANS]);
  const navigate = useNavigate();
  const itemsUsed = storeSettings?.collectionSettings?.productCount || 0;
  const itemsLimit = storeSettings?.collectionSettings?.productLimit || 0;
  const usagePercentage = (itemsUsed / itemsLimit) * 100;

  const handleUpgrade = () => {
    navigate("/plans");
  };

  // Determine color based on usage
  const getUsageColor = () => {
    if (usagePercentage >= 90) return "#ef4444"; // red
    if (usagePercentage >= 70) return "#facc15"; // yellow
    return "#22c55e"; // green
  };

  const usageColor = getUsageColor();

  return (
    <div
      style={{
        background: "#000",
        borderRadius: "var(--p-border-radius-200)",
        padding: "var(--p-space-400)",
      }}
    >
      <s-stack
        direction="inline"
        justifyContent="space-between"
        alignItems="center"
        gap="large"
      >
        <s-stack direction="inline" gap="large" alignItems="center">
          <s-stack direction="block" gap="small-300">
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
              {currentPlan.name}
            </span>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>
              {`${currentPlan.features[0]}`}
            </span>
          </s-stack>
          <s-stack direction="block" gap="small-300">
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
              Items used
            </span>
            <div
              style={{
                width: "140px",
                height: "8px",
                background: "rgba(255,255,255,0.25)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${usagePercentage}%`,
                  height: "100%",
                  background: usageColor,
                  borderRadius: "4px",
                }}
              />
            </div>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
              {itemsUsed} / {itemsLimit}
            </span>
          </s-stack>
        </s-stack>
        <s-button variant="secondary" onClick={handleUpgrade}>
          Upgrade
        </s-button>
      </s-stack>
    </div>
  );
};
