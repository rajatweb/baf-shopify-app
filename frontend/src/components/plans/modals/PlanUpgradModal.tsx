import { Modal } from "@shopify/polaris";
import { useCreateSubscriptionMutation, useCancelSubscriptionMutation } from "../../../store/api/subscriptions";
import { useAppSelector } from "../../../store/hooks/redux";
import { useToast } from "../../../hooks/useToast";
import { useActions } from "../../../store/hooks/actions";
import { useMemo } from "react";
import { formatPrice } from "../../../utils/currency";
import { useCallback } from 'react';

export const PlanUpgradeModal = () => {

    const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation();
    const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

    const { closePlanUpgradeModal } = useActions();

    const { showToast } = useToast();

    const isOpen = useAppSelector((state) => state.planUpgradeModal.isOpen);

    const {
        isDowngrade,
        isSwitch,
        selectedPlan,
        selectedInterval,
        currentBillingInterval,
        currencyCode
    } = useAppSelector((state) => state.planUpgradeModal.initialValue);

    const handleUpgrade = useCallback(async () => {

        try {
            if (!selectedPlan) throw new Error("Selected plan is required");
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
            if (error instanceof Error) {
                showToast(error.message, { isError: true });
            } else {
                showToast("Failed to upgrade plan. Please try again.", { isError: true });
            }
        }
    }, [selectedPlan, selectedInterval, createSubscription, showToast]);

    const handleCancel = async () => {
        try {
            await cancelSubscription().unwrap();
            showToast(
                "Subscription cancelled successfully. You've been switched to the free plan."
            );
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch {
            showToast("Failed to cancel subscription. Please try again.", { isError: true });
        }
    };

    const title = useMemo(() => {
        return isDowngrade ? "Downgrade to Free Plan"
            : isSwitch
                ? `Switch to ${selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"} Billing`
                : `Upgrade to ${selectedPlan?.name} Plan`;
    }, [isDowngrade, isSwitch, selectedPlan, selectedInterval])

    const primaryActionContent = useMemo(() => {
        return isDowngrade
            ? `Downgrade to ${selectedPlan?.name}`
            : isSwitch
                ? `Switch to ${selectedInterval === "EVERY_30_DAYS" ? "Monthly" : "Yearly"}`
                : `Upgrade to ${selectedPlan?.name}`;
    }, [isDowngrade, isSwitch, selectedPlan, selectedInterval])

    return (
        <Modal
            open={isOpen}
            onClose={closePlanUpgradeModal}
            title={title}
            primaryAction={{
                content: primaryActionContent,
                onAction:
                    isDowngrade ? handleCancel
                        : handleUpgrade,
                loading: isCreating || isCancelling,
                disabled: isCreating || isCancelling,
            }}
            secondaryActions={[
                {
                    content: "Cancel",
                    onAction: () => closePlanUpgradeModal(),
                },
            ]}
        >
            <Modal.Section>
                <s-stack direction="block" gap="base">
                    {isDowngrade ? (
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
                    ) : isSwitch ? (
                        <>
                            <s-text>
                                You're about to switch your {selectedPlan?.name} Plan
                                billing from{" "}
                                {currentBillingInterval === "EVERY_30_DAYS" ? "monthly" : "yearly"}
                                to{" "}
                                {selectedInterval === "EVERY_30_DAYS" ? "monthly" : "yearly"}
                                billing.
                            </s-text>
                            <s-text>
                                Your new billing will be{" "}
                                {formatPrice(
                                    selectedInterval === "EVERY_30_DAYS"
                                        ? selectedPlan?.monthlyPrice || 0
                                        : selectedPlan?.yearlyPrice || 0,
                                    currencyCode || "USD"
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
                                        currencyCode || "USD"
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
                                    currencyCode || "USD"
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
    );
};