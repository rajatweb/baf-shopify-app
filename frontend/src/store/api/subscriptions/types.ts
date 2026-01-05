export interface SubscriptionResponse {
  success: boolean;
  data: Subscription[];
}

export interface CreateSubscriptionAPIResponse {
  confirmationUrl: string;
}

export interface Subscription {
  name: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  lineItems: {
    plan: {
      pricingDetails: {
        __typename: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        interval: string;
      };
    };
  }[];
  test: boolean;
}
