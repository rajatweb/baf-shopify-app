
import { Outlet, Link } from "react-router";

export const SubscriptionGuard = () => {
  return (
    <>

      <s-app-nav>
        <Link to="/" rel="home">
          Home
        </Link>
        <Link to="/playlists">Playlists</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/plans">Plans</Link>
        <Link to="/documentation">Documentation</Link>
      </s-app-nav>
      <Outlet />
    </>
  );
};

export default SubscriptionGuard;
