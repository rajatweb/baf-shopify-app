import { configureStore } from "@reduxjs/toolkit";
import { storeSettingsApi } from "./api/store";
import { subscriptionsApi } from "./api/subscriptions";
import { shopApi } from "./api/shop";
import { featureRequestsApi } from "./api/feature-requests";
import { musicPlayerApi } from "./api/music-player";

export const store = configureStore({
  reducer: {
    [storeSettingsApi.reducerPath]: storeSettingsApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [featureRequestsApi.reducerPath]: featureRequestsApi.reducer,
    [musicPlayerApi.reducerPath]: musicPlayerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
          storeSettingsApi.middleware,
    subscriptionsApi.middleware,
    shopApi.middleware,
    featureRequestsApi.middleware,
    musicPlayerApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
