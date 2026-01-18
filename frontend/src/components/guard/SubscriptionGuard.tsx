import { Outlet, Link } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";


export const SubscriptionGuard = () => {
  return (
    <>
      <NavMenu>
        <Link to="/" rel="home">
          Home
        </Link>
        <Link to="/analytics">Analytics</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/plans">Plans</Link>
        <Link to="/documentation">Documentation</Link>
      </NavMenu>
      <Outlet />
    </>
  );
};

export default SubscriptionGuard;
