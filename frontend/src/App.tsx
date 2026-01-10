import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { RouterProvider } from "react-router";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import AppBridgeProvider from "./providers/AppBridgeProvider";

import { appRoutes } from "./routes/appRoutes";
import { Provider } from "react-redux";
import { store } from "./store";



function App() {
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider>
        <Provider store={store}>
          <RouterProvider router={appRoutes} />
        </Provider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

export default App;
