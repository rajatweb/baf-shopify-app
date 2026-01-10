import { configureStore } from "@reduxjs/toolkit";
import { storeApi } from "./api/store";
import { subscriptionsApi } from "./api/subscriptions";
import { shopApi } from "./api/shop";
import { settingsApi } from "./api/settings";

export const store = configureStore({
  reducer: {
    [storeApi.reducerPath]: storeApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      storeApi.middleware,
      subscriptionsApi.middleware,
      shopApi.middleware,
      settingsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
