export type TSubscription = {
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
};

export type TSubscriptionResponse = {
  success: boolean;
  data: TSubscription[];
};

export type TCreateSubscriptionAPIResponse = {
  confirmationUrl: string;
};

export type TPlan = {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  maxItems: number; // -1 means unlimited
  popular?: boolean;
};
