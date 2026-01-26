import { useCallback } from "react";
import { TPlan } from "../../store/api/subscriptions/types";
import { formatPrice } from "../../utils/currency";
import { useActions } from "../../store/hooks/actions";
import { PLANS } from "../../utils/planUtils";

type TPlanCardProps = {
    plan: TPlan;
    currentPlan: TPlan;
    selectedInterval: "EVERY_30_DAYS" | "ANNUAL";
    isSubscribed: boolean;
    currentBillingInterval: "EVERY_30_DAYS" | "ANNUAL" | null;
    currencyCode: string;
}

const getTierStyles = (badge: string) => {
    switch (badge.toLowerCase()) {
        case "free":
            return { background: "#f3f4f6", color: "#6b7280" };
        case "boutique":
        case "starter":
            return { background: "#dbeafe", color: "#1d4ed8" };
        case "flagship":
        case "basic":
            return { background: "#dcfce7", color: "#16a34a" };
        case "showroom":
        case "pro":
            return { background: "#1a1a1a", color: "#fff" };
        case "runway":
        case "plus":
            return { background: "linear-gradient(135deg, #8b5cf6, #6366f1)", color: "#fff" };
        default:
            return { background: "#f3f4f6", color: "#6b7280" };
    }
};

export const PlanGridCard = ({ plan, currentPlan, selectedInterval, isSubscribed, currentBillingInterval, currencyCode }: TPlanCardProps) => {
    const isCurrentPlan = currentPlan?.id === plan.id;
    
    // Check if switching to yearly billing (monthly to yearly)
    const isSwitchingToYearly = isSubscribed && 
        currentBillingInterval === "EVERY_30_DAYS" && 
        selectedInterval === "ANNUAL" &&
        plan.id !== "free";
    
    // Handle unlimited (-1) case properly
    // If switching to yearly, treat it as upgrade for all paid plans
    const isUpgrade = currentPlan && 
        (isSwitchingToYearly || // Switching to yearly is an upgrade
         (plan.maxItems === -1 && currentPlan.maxItems !== -1) || // Target is unlimited, current is not
         (currentPlan.maxItems !== -1 && plan.maxItems !== -1 && plan.maxItems > currentPlan.maxItems)); // Both limited, compare normally
    
    // Only show downgrade if not switching to yearly and it's actually a lower tier
    const isDowngrade = currentPlan && !isCurrentPlan && !isSwitchingToYearly &&
        ((currentPlan.maxItems === -1 && plan.maxItems !== -1) || // Current is unlimited, target is not
         (currentPlan.maxItems !== -1 && plan.maxItems !== -1 && plan.maxItems < currentPlan.maxItems)); // Both limited, compare normally

    const isSwitch = isSubscribed && currentPlan?.id === plan.id && plan.id !== "free" && currentBillingInterval !== selectedInterval;
    // Find the next tier up from current plan
    const nextTierUp = PLANS.find(p => p.maxItems > currentPlan?.maxItems && 
        (!PLANS.find(p2 => p2.maxItems > currentPlan?.maxItems && p2.maxItems < p.maxItems)));
    const isRecommended = !isCurrentPlan && currentPlan && nextTierUp?.id === plan.id;

    const { openPlanUpgradeModal } = useActions();

    const handleUpgrade = useCallback((selectedPlan: TPlan) => {
        openPlanUpgradeModal({
            selectedPlan: selectedPlan,
            selectedInterval: selectedInterval,
            isUpgrade: isUpgrade,
            isDowngrade: isDowngrade,
            isSwitch: isSwitch,
            currencyCode: currencyCode,
            currentBillingInterval: currentBillingInterval,
        });
    }, [openPlanUpgradeModal, plan, selectedInterval, isCurrentPlan, isSwitch, isDowngrade, isUpgrade, currentBillingInterval, currencyCode]);

    const tierStyles = getTierStyles(plan.badge);
    const monthlyPrice = plan.monthlyPrice;
    const yearlyPrice = plan.yearlyPrice;
    // When annual is selected, show monthly equivalent (yearlyPrice / 12)
    const displayPrice = selectedInterval === "EVERY_30_DAYS" 
        ? monthlyPrice 
        : Math.round((yearlyPrice / 12) * 100) / 100; // Round to 2 decimal places
    const savings = monthlyPrice > 0 ? monthlyPrice * 12 - yearlyPrice : 0;
    const hasSavings = savings > 0 && selectedInterval === "ANNUAL";

    // Calculate annual price text (matches HTML reference)
    const getAnnualPriceText = () => {
        if (plan.monthlyPrice === 0) return null;
        const annualTotal = yearlyPrice;
        if (selectedInterval === "ANNUAL") {
            // When annual is selected, show "billed annually"
            return `$${annualTotal} billed annually`;
        } else {
            // When monthly is selected, show "or $X/year and save 17%"
            if (hasSavings) {
                const savingsPercent = Math.round((savings / (monthlyPrice * 12)) * 100);
                return `or $${annualTotal}/year and save ${savingsPercent}%`;
            }
            return `or $${annualTotal}/year`;
        }
    };

    const annualPriceText = getAnnualPriceText();

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
            {/* Current/Recommended Badge */}
            {(isCurrentPlan || isRecommended) && (
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
                            background: "#1a1a1a",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {isCurrentPlan ? "Current Plan" : "Recommended"}
                    </div>
                </div>
            )}

            {/* Plan Card */}
            <div
                style={{
                    background: "#fff",
                    border: isCurrentPlan || isRecommended 
                        ? "2px solid #1a1a1a" 
                        : "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "20px",
                    position: "relative",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    boxShadow: isRecommended ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                }}
                onMouseEnter={(e) => {
                    if (!isCurrentPlan && !isRecommended) {
                        e.currentTarget.style.borderColor = "#d1d5db";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isCurrentPlan && !isRecommended) {
                        e.currentTarget.style.borderColor = "#e5e7eb";
                    }
                }}
            >
                {/* Plan Tier Badge */}
                <span
                    style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.3px",
                        marginBottom: "16px",
                        background: tierStyles.background,
                        color: tierStyles.color,
                        width: "fit-content",
                    }}
                >
                    {plan.badge}
                </span>

                {/* Pricing */}
                <div style={{ marginBottom: "4px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "6px",
                            flexWrap: "wrap",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "32px",
                                fontWeight: 700,
                                letterSpacing: "-1px",
                                color: "#1a1a1a",
                            }}
                        >
                            {plan.monthlyPrice === 0
                                ? "$0"
                                : formatPrice(displayPrice, currencyCode || "USD")}
                        </span>
                        {plan.monthlyPrice > 0 && (
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    fontWeight: 400,
                                }}
                            >
                                / month
                            </span>
                        )}
                    </div>
                    {annualPriceText && (
                        <div
                            style={{
                                fontSize: "12px",
                                color: hasSavings ? "#16a34a" : "#6b7280",
                                marginBottom: "20px",
                                minHeight: "18px",
                                fontWeight: hasSavings ? 500 : 400,
                            }}
                        >
                            {annualPriceText}
                        </div>
                    )}
                    {!annualPriceText && plan.monthlyPrice === 0 && (
                        <div style={{ marginBottom: "20px", minHeight: "18px" }}>&nbsp;</div>
                    )}
                </div>

                {/* Features */}
                <ul
                    style={{
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        marginBottom: "20px",
                        borderTop: "1px solid #f3f4f6",
                        paddingTop: "16px",
                        flex: 1,
                    }}
                >
                    {plan.features.map((feature, index) => {
                        const isHighlight = index === 0; // First feature is highlighted
                        return (
                            <li
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "8px",
                                    fontSize: "13px",
                                    color: isHighlight ? "#1a1a1a" : "#374151",
                                    padding: "6px 0",
                                    fontWeight: isHighlight ? 600 : 400,
                                }}
                            >
                                <svg
                                    className="check-icon"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 20 20"
                                    fill="#22c55e"
                                    style={{
                                        flexShrink: 0,
                                        marginTop: "1px",
                                    }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>{feature}</span>
                            </li>
                        );
                    })}
                </ul>

                {/* Action Button */}
                <button
                    className={`plan-cta ${
                        isCurrentPlan && !isSwitch
                            ? "cta-current"
                            : isDowngrade
                            ? "cta-downgrade"
                            : "cta-upgrade"
                    }`}
                    disabled={isCurrentPlan && !isSwitch}
                    onClick={() => {
                        if (
                            isUpgrade ||
                            isSwitch ||
                            isDowngrade ||
                            (!isCurrentPlan && plan.id !== "free")
                        ) {
                            handleUpgrade(plan);
                        }
                    }}
                    style={{
                        width: "100%",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: isCurrentPlan && !isSwitch ? "default" : "pointer",
                        transition: "all 0.15s",
                        border: "none",
                        background: isCurrentPlan && !isSwitch
                            ? "#f3f4f6"
                            : isDowngrade
                            ? "#fff"
                            : "#1a1a1a",
                        color: isCurrentPlan && !isSwitch
                            ? "#9ca3af"
                            : isDowngrade
                            ? "#6b7280"
                            : "#fff",
                        borderWidth: isDowngrade ? "1px" : "0",
                        borderStyle: isDowngrade ? "solid" : "none",
                        borderColor: isDowngrade ? "#e5e7eb" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                        if (!(isCurrentPlan && !isSwitch)) {
                            if (isDowngrade) {
                                e.currentTarget.style.background = "#f9fafb";
                            } else {
                                e.currentTarget.style.background = "#333";
                            }
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!(isCurrentPlan && !isSwitch)) {
                            if (isDowngrade) {
                                e.currentTarget.style.background = "#fff";
                            } else {
                                e.currentTarget.style.background = "#1a1a1a";
                            }
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
                        ? `Switch to ${selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"}`
                        : plan.id === "free"
                        ? "Get Started"
                        : `Upgrade to ${plan.name}`}
                </button>
            </div>
        </div>
    );
};