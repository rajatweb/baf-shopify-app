import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import SubscriptionGuard from "../components/guard/SubscriptionGuard";
import AppSkeleton from "../components/commons/AppSkeleton";

const Home = lazy(() => import("../pages/Home"));
const Plans = lazy(() => import("../pages/Plans"));
const Settings = lazy(() => import("../pages/Settings"));
const FeatureRequests = lazy(() => import("../pages/FeatureRequests"));
const Documentation = lazy(() => import("../pages/Documentation"));
const Analytics = lazy(() => import("../pages/Analytics"));

export const appRoutes = createBrowserRouter([
  {
    element: <SubscriptionGuard />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AppSkeleton />}>
            <Home />
          </Suspense>
        ),
      },

      {
        path: "/analytics",
        element: (
          <Suspense fallback={<AppSkeleton />}>
            <Analytics />
          </Suspense>
        ),
      },

      {
        path: "/plans",
        element: (
          <Suspense fallback={<AppSkeleton />}>
            <Plans />
          </Suspense>
        ),
      },
      {
        path: "/settings",
        element: (
          <Suspense fallback={<AppSkeleton />}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "/feature-requests",
        element: (
          <Suspense fallback={<AppSkeleton />}>
            <FeatureRequests />
          </Suspense>
        ),
      },
      {
        path: "/documentation",
        element: (
          <Suspense fallback={<AppSkeleton />}>
            <Documentation />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <></>,
  },
]);
