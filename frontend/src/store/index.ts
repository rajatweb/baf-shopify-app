import { configureStore } from "@reduxjs/toolkit";
import { storeApi } from "./api/store";
import { subscriptionsApi } from "./api/subscriptions";
import { shopApi } from "./api/shop";

import { settingsApi } from "./api/settings";

export const store = configureStore({
  reducer: {
    [settingsApi.reducerPath]: settingsApi.reducer,
    [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      settingsApi.middleware,
      subscriptionsApi.middleware,
      shopApi.middleware,
      storeApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
