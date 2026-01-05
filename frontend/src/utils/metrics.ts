import { onLCP, onINP, onCLS } from 'web-vitals';

export function reportWebVitals() {
  onLCP((metric) => {
    // Send to analytics
    // Example: sendToAnalytics('LCP', metric.value);
  }, {reportAllChanges: true});

  onINP((metric) => {
    // Send to analytics
    // Example: sendToAnalytics('INP', metric.value);
  });

  onCLS((metric) => {
    // Send to analytics
    // Example: sendToAnalytics('CLS', metric.value);
  });
} 