import { Modal } from "@shopify/polaris";
import { useCancelSubscriptionMutation } from "../../../store/api/subscriptions";
import { useToast } from "../../../hooks/useToast";
import { useActions } from "../../../store/hooks/actions";
import { useAppSelector } from "../../../store/hooks/redux";

export const PlansCancelModal = () => {
  const { showToast } = useToast();

  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const { closePlanCancelModal } = useActions();
  const isOpen = useAppSelector((state) => state.planCancelModal.showCancelModal);

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      showToast(
        "Subscription cancelled successfully. You've been switched to the free plan."
      );
      closePlanCancelModal();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      showToast("Failed to cancel subscription. Please try again.", { isError: true });
    }
  };
  return (
    <Modal
      open={isOpen}
      onClose={closePlanCancelModal}
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
          onAction: () => closePlanCancelModal(),
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
  );
};