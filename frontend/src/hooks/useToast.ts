import { useAppBridge } from '@shopify/app-bridge-react';

interface ToastOptions {
  action?: string;
  duration?: number;
  isError?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

export const useToast = () => {
  const app = useAppBridge();

  const showToast = (message: string, opts?: ToastOptions) => {
    app.toast.show(message, {
      action: opts?.action,
      duration: opts?.duration || 5000,
      isError: opts?.isError || false,
      onAction: opts?.onAction,
      onDismiss: opts?.onDismiss,
    });
  };

  return { showToast };
};