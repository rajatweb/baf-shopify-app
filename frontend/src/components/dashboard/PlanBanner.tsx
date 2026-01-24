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
  const usagePercentage = itemsLimit > 0 ? Math.min((itemsUsed / itemsLimit) * 100, 100) : 0;

  const handleUpgrade = () => {
    navigate("/plans");
  };

  // Determine color and class based on usage
  const getUsageBarClass = () => {
    if (usagePercentage >= 100) return "critical";
    if (usagePercentage >= 80) return "warning";
    return "healthy";
  };

  const usageBarColor = usagePercentage >= 100 
    ? "#ef4444" 
    : usagePercentage >= 80 
        ? "#f59e0b" 
        : "#22c55e";

  // Generate plan message
  const getPlanMessage = () => {
    const itemsRemaining = itemsLimit - itemsUsed;
    const nextPlan = PLANS.find(p => p.maxItems > currentPlan.maxItems);
    
    if (currentPlan.maxItems === -1) {
      return `Unlimited items. <strong>${itemsUsed} products</strong> currently in your widget.`;
    } else if (usagePercentage >= 100) {
      if (nextPlan) {
        return `Your collection has <strong>${itemsUsed} products</strong> but ${currentPlan.name} only displays ${currentPlan.maxItems}. Upgrade to ${nextPlan.name} to show them all.`;
      }
      return `Your collection has <strong>${itemsUsed} products</strong> but ${currentPlan.name} only displays ${currentPlan.maxItems}. Upgrade to show them all.`;
    } else if (itemsRemaining > 0 && nextPlan) {
      return `You have <strong>${itemsRemaining} items</strong> remaining. Upgrade to ${nextPlan.name} for ${nextPlan.maxItems} items.`;
    } else if (itemsRemaining > 0) {
      return `You have <strong>${itemsRemaining} items</strong> remaining.`;
    }
    return `You're using all ${currentPlan.maxItems} items available on ${currentPlan.name}.`;
  };

  const planMessage = getPlanMessage();

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
        borderRadius: "14px",
        padding: "20px 24px",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient circle */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Plan Info */}
        <div style={{ minWidth: "160px" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "4px",
            }}
          >
            Current Plan
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {currentPlan.name}
          </div>
        </div>

        {/* Divider */}
        <span
          style={{
            width: "1px",
            height: "44px",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Usage Info */}
        <div style={{ minWidth: "160px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Items
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {itemsUsed} / {currentPlan.maxItems === -1 ? "∞" : itemsLimit}
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(usagePercentage, 100)}%`,
                height: "100%",
                background: usageBarColor,
                borderRadius: "3px",
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <span
          style={{
            width: "1px",
            height: "44px",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        {/* Plan Message */}
        <div
          style={{
            flex: 1,
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
            lineHeight: "1.5",
          }}
          dangerouslySetInnerHTML={{ __html: planMessage }}
        />
      </div>

      {/* Upgrade Button */}
      <button
        onClick={handleUpgrade}
        style={{
          background: "#fff",
          color: "#1a1a1a",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s",
          position: "relative",
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f5f5f5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
        }}
      >
        Upgrade
      </button>
    </div>
  );
};
