interface AnalyticsData {
  type: string;
  value: number;
  timestamp: string;
  [key: string]: string | number;
}

export function safeSendAnalytics(data: AnalyticsData) {
  try {
    // First try using sendBeacon
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      return navigator.sendBeacon("/api/analytics", blob);
    }

    // Fallback to fetch if sendBeacon fails
    return fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      keepalive: true, // Important for page unload scenarios
    }).catch((error) => {
  
      // Store in localStorage for retry later
      const failedRequests = JSON.parse(
        localStorage.getItem("failedAnalytics") || "[]"
      );
      failedRequests.push(data);
      localStorage.setItem("failedAnalytics", JSON.stringify(failedRequests));
    });
  } catch (error) {

  }
}

// Retry failed analytics
export function retryFailedAnalytics() {
  try {
    const failedRequests = JSON.parse(
      localStorage.getItem("failedAnalytics") || "[]"
    ) as AnalyticsData[];
    if (failedRequests.length > 0) {
      failedRequests.forEach((data: AnalyticsData) => {
        safeSendAnalytics(data);
      });
      localStorage.removeItem("failedAnalytics");
    }
  } catch (error) {
    
  }
}
