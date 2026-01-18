import { useCallback } from "react";
import { TPlan } from "../../store/api/subscriptions/types";
import { formatPrice } from "../../utils/currency";
import { useActions } from "../../store/hooks/actions";

type TPlanCardProps = {
    plan: TPlan;
    currentPlan: TPlan;
    selectedInterval: "EVERY_30_DAYS" | "ANNUAL";
    isSubscribed: boolean;
    currentBillingInterval: "EVERY_30_DAYS" | "ANNUAL" | null;
    currencyCode: string;
}

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

export const PlanGridCard = ({ plan, currentPlan, selectedInterval, isSubscribed, currentBillingInterval, currencyCode }: TPlanCardProps) => {
    const isCurrentPlan = currentPlan?.id === plan.id;
    const isUpgrade = currentPlan && plan.maxItems > currentPlan.maxItems;
    const isDowngrade = currentPlan &&
        plan.maxItems < currentPlan.maxItems &&
        plan.maxItems !== -1;

    const isSwitch = isSubscribed && currentPlan?.id === plan.id && plan.id !== "free" && currentBillingInterval !== selectedInterval;

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
                                        currencyCode || "USD"
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
                                        currencyCode || "USD"
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