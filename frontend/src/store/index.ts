import { configureStore } from "@reduxjs/toolkit";
import { storeApi } from "./api/store";
import { subscriptionsApi } from "./api/subscriptions";
import { shopApi } from "./api/shop";
import { settingsApi } from "./api/settings";
import { shopAssetsApi } from "./api/shop-assests";
import { shopAnalyticsApi } from "./api/shop-analytics";
import { PlanCancelModalReducer } from "./slices/plans/PlanCancelModalSlice";
import { planUpgradeModalReducer } from "./slices/plans/PlanUpgradeModalSlice";

export const store = configureStore({
  reducer: {
    [storeApi.reducerPath]: storeApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [shopAssetsApi.reducerPath]: shopAssetsApi.reducer,
    [shopAnalyticsApi.reducerPath]: shopAnalyticsApi.reducer,
    planCancelModal: PlanCancelModalReducer,
    planUpgradeModal: planUpgradeModalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      storeApi.middleware,
      subscriptionsApi.middleware,
      shopApi.middleware,
      settingsApi.middleware,
      shopAssetsApi.middleware,
      shopAnalyticsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
