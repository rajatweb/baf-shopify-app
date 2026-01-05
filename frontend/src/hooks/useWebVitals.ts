import { useAppBridge } from "@shopify/app-bridge-react";

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
}

type WebVitalsCallback = (metrics: WebVitalsMetric) => void | Promise<void>;

export const useWebVitals = () => {
  const app = useAppBridge();

  const startMonitoring = async (callback: WebVitalsCallback) => {
    if (app.webVitals && app.webVitals.onReport) {
      await app.webVitals.onReport(async (metrics: WebVitalsMetric) => {
        await callback(metrics);
      });
    }
  };

  return { startMonitoring };
};
