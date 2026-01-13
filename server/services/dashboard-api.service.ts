/**
 * Dashboard API Service
 *
 * Service to send events from your Shopify app to the dashboard API
 *
 * Usage in your Shopify app:
 * ```typescript
 * import { dashboardApi } from './services/dashboard-api.service';
 *
 * // On app install
 * await dashboardApi.install({
 *   appId: 'your-app-id',
 *   shop: 'example.myshopify.com',
 *   storeName: 'Example Store',
 *   email: 'owner@example.com',
 *   metadata: { currency: 'USD', timezone: 'America/New_York' }
 * });
 * ```
 */

const DASHBOARD_API_URL = process.env.DASHBOARD_API_URL || "";
const DASHBOARD_API_KEY = process.env.DASHBOARD_API_KEY || "";

if (!DASHBOARD_API_URL) {
  console.warn("DASHBOARD_API_URL environment variable is not set");
}
if (!DASHBOARD_API_KEY) {
  console.warn("DASHBOARD_API_KEY environment variable is not set");
}

/**
 * Shop metadata from Shopify
 */
export interface ShopMetadata {
  currency?: string;
  timezone?: string;
  shopOwner?: string;
  myshopifyDomain?: string;
}

/**
 * Installation event payload
 */
export interface InstallEventPayload {
  appId: string;
  name: string;
  shop: string;
  storeName: string;
  storeUrl?: string;
  email: string;
  metadata?: ShopMetadata;
}

/**
 * Uninstallation event payload
 */
export interface UninstallEventPayload {
  appId: string;
  shop: string;
}

/**
 * Subscription data from Shopify AppSubscription
 */
export interface SubscriptionData {
  id: string;
  name: string;
  status:
    | "ACTIVE"
    | "PENDING"
    | "CANCELLED"
    | "EXPIRED"
    | "DECLINED"
    | "FROZEN";
  planName: string;
  planDisplayName?: string;
  planPrice?: number;
  planCurrency?: string;
  planInterval?: "EVERY_30_DAYS" | "ANNUAL" | string;
  cappedAmount?: number;
  isTestSubscription?: boolean;
  trialDays?: number;
  currentPeriodStart?: string | Date;
  currentPeriodEnd?: string | Date;
  activatedAt?: string | Date;
  cancelledAt?: string | Date;
}

/**
 * Subscription event payload
 */
export interface SubscriptionEventPayload {
  appId: string;
  shop: string;
  subscription: SubscriptionData;
}

/**
 * API Response wrapper
 */
export interface DashboardApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  message?: string;
}

/**
 * Dashboard API Service
 */
class DashboardApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = DASHBOARD_API_URL;
    this.apiKey = DASHBOARD_API_KEY;
  }

  /**
   * Make HTTP request to dashboard API
   */
  private async request<T = unknown>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
  ): Promise<DashboardApiResponse<T>> {
    if (!this.baseUrl) {
      throw new Error("DASHBOARD_API_URL environment variable is not set");
    }
    if (!this.apiKey) {
      throw new Error("DASHBOARD_API_KEY environment variable is not set");
    }

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          details: data.details || data.message,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error(`Dashboard API ${method} ${endpoint} error:`, error);
      return {
        success: false,
        error: "Network error",
        message: (error as Error)?.message || "Unknown error",
      };
    }
  }

  /**
   * Send app installation event
   *
   * Call this after OAuth callback completes in your Shopify app
   *
   * @example
   * ```typescript
   * await dashboardApi.install({
   *   appId: 'my-app',
   *   shop: 'example.myshopify.com',
   *   storeName: 'Example Store',
   *   email: 'owner@example.com',
   *   metadata: {
   *     currency: 'USD',
   *     timezone: 'America/New_York',
   *     shopOwner: 'John Doe'
   *   }
   * });
   * ```
   */
  async install(payload: InstallEventPayload): Promise<DashboardApiResponse> {
    return this.request("/api/webhooks/install", "POST", payload);
  }

  /**
   * Send app uninstallation event
   *
   * Call this when app/uninstalled webhook is received in your Shopify app
   *
   * @example
   * ```typescript
   * await dashboardApi.uninstall({
   *   appId: 'my-app',
   *   shop: 'example.myshopify.com'
   * });
   * ```
   */
  async uninstall(
    payload: UninstallEventPayload
  ): Promise<DashboardApiResponse> {
    return this.request("/api/webhooks/uninstall", "POST", payload);
  }

  /**
   * Send subscription plan change event
   *
   * Call this when:
   * - app_subscriptions/update webhook is received
   * - app_subscriptions/cancelled webhook is received
   * - Subscription is first created
   * - Plan is upgraded/downgraded
   *
   * @example
   * ```typescript
   * await dashboardApi.subscription({
   *   appId: 'my-app',
   *   shop: 'example.myshopify.com',
   *   subscription: {
   *     id: 'gid://shopify/AppSubscription/123',
   *     name: 'Premium Plan',
   *     status: 'ACTIVE',
   *     planName: 'premium',
   *     planPrice: 29.99,
   *     planCurrency: 'USD',
   *     planInterval: 'EVERY_30_DAYS'
   *   }
   * });
   * ```
   */
  async subscription(
    payload: SubscriptionEventPayload
  ): Promise<DashboardApiResponse> {
    // Ensure dates are strings for JSON serialization
    const normalizedPayload = {
      ...payload,
      subscription: {
        ...payload.subscription,
        currentPeriodStart: payload.subscription.currentPeriodStart
          ? new Date(payload.subscription.currentPeriodStart).toISOString()
          : undefined,
        currentPeriodEnd: payload.subscription.currentPeriodEnd
          ? new Date(payload.subscription.currentPeriodEnd).toISOString()
          : undefined,
        activatedAt: payload.subscription.activatedAt
          ? new Date(payload.subscription.activatedAt).toISOString()
          : undefined,
        cancelledAt: payload.subscription.cancelledAt
          ? new Date(payload.subscription.cancelledAt).toISOString()
          : undefined,
      },
    };

    return this.request(
      "/api/webhooks/subscription",
      "POST",
      normalizedPayload
    );
  }
}

// Export singleton instance
export const dashboardApi = new DashboardApiService();

// Export class for custom instances if needed
export { DashboardApiService };
