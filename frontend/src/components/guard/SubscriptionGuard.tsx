import { Outlet, Link } from "react-router";
import { NavMenu } from "@shopify/app-bridge-react";
// import { useLazyGetActiveSubscriptionsQuery } from "../../store/api/subscriptions";
// import { useEffect, useState } from "react";
// import { AppSpinner } from "../commons/AppSpinner";

export const SubscriptionGuard = () => {
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const shop = searchParams.get("shop")?.split(".")[0];

  // const [activeSubscription, setActiveSubscription] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [fetchActiveSubscriptions] = useLazyGetActiveSubscriptionsQuery();

  // useEffect(() => {
  //   fetchActiveSubscriptions().then((res) => {
  //     setIsLoading(false);
  //     setActiveSubscription(
  //       !!res.data?.data.find(
  //         (subscription) => subscription.status === "ACTIVE"
  //       )
  //     );
  //   });
  // }, [fetchActiveSubscriptions]);

  // if (isLoading) {
  //   return <AppSpinner />;
  // }

  // if (!activeSubscription && !isLoading) {
  //   window.top!.location.href = `https://admin.shopify.com/store/${shop}/charges/${process.env.APP_HANDLE}/pricing_plans`;
  // }

  return (
    <>
      <NavMenu>
        <Link to="/" rel="home">
          Home
        </Link>
        <Link to="/settings">Settings</Link>
        <Link to="/plans">Plans</Link>
        <Link to="/documentation">Documentation</Link>
      </NavMenu>
      <Outlet />
    </>
  );
};

export default SubscriptionGuard;
