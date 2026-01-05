import { useState, useEffect } from "react";

interface SubscriptionStatus {
  id: number;
  shop: string;
  planId: string;
  isActive: boolean;
  chargeId?: string | null;
  trialStartDate?: string | null;
  trialEndDate?: string | null;
  isTrialUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/billing/subscription/status");
      if (!response.ok) throw new Error("Failed to fetch subscription status");
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const isTrialActive = () => {
    if (!status?.trialEndDate) return false;
    return new Date() < new Date(status.trialEndDate);
  };

  const canStartTrial = () => {
    return !status?.isTrialUsed;
  };

  const hasActiveSubscription = () => {
    return status?.isActive;
  };

  const getDaysRemaining = () => {
    if (!status?.trialEndDate) return 0;
    const end = new Date(status.trialEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getFormattedTrialEnd = () => {
    if (!status?.trialEndDate) return "";
    return new Date(status.trialEndDate).toLocaleDateString();
  };

  return {
    status,
    loading,
    refetch: fetchSubscriptionStatus,
    isTrialActive,
    canStartTrial,
    hasActiveSubscription,
    getDaysRemaining,
    getFormattedTrialEnd,
  };
};
