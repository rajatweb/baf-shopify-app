import { useAppBridge } from '@shopify/app-bridge-react';

export const useLoading = () => {
  const app = useAppBridge();

  const setLoading = (isLoading: boolean) => {
    app.loading(isLoading);
  };

  return { setLoading };
};