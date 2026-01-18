
import { Banner } from "@shopify/polaris";
import { TShopPlan } from "../../store/api/shop";
function ShopPlan({ shop }: { shop: TShopPlan }) {
  const isSupportedPlan =
    shop.plan.shopifyPlus ||
    shop.plan.displayName === "Advanced Shopify";

  if (shop.plan.partnerDevelopment) {
    return (
      <Banner
        title="Development Store Detected"
        tone="info"
      >
        <p>
          You're currently using a development store. All Simple Shipping Rates features are fully available for testing and development.
          To use this app in production, you'll need to upgrade to a paid Shopify plan (Advanced Shopify or Shopify Plus) when you're ready to launch your store.
        </p>
      </Banner>
    );
  }

  if (!isSupportedPlan) {
    return (
      <Banner
        title="Plan Upgrade Required"
        tone="warning"
        action={{
          content: "View Plans",
          url: "https://www.shopify.com/pricing",
          external: true,
        }}
      >
        <p>
          Simple Shipping Rates requires a Shopify Plus or Advanced Shopify plan to function properly.
          Upgrade your plan to unlock all shipping rate features, analytics, and advanced customization options.
        </p>
      </Banner>
    );
  }

  return null;
}

export default ShopPlan;
