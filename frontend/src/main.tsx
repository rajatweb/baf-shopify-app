import { onLCP, onINP, onCLS } from "web-vitals";
import "@shopify/polaris/build/esm/styles.css";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";

const App = lazy(() => import("./App"));

// Monitor LCP
onLCP(
  (lcp) => {
    console.log("web vitals - LCP in seconds:", lcp.value / 1000);
    console.log("web vitals - LCP entries:", lcp.entries);
  },
  { reportAllChanges: true }
);

// Monitor INP
onINP(
  (inp) => {
    console.log("web vitals - INP in seconds:", inp.value / 1000);
  },
  { reportAllChanges: true }
);

// Monitor CLS
onCLS(
  (cls) => {
    console.log("web vitals - CLS in seconds:", cls.value / 1000);
  },
  { reportAllChanges: true }
);

// Only mount when idle or AppBridge is ready
function mountApp() {
  const container = document.getElementById("shopify-app");
  if (!container) return;
  const root = createRoot(container);
  root.render(
    <Suspense fallback={<div style={{ textAlign: "center" }}> Loading...</div>}>
      <App />
    </Suspense>
  );
}

// Wait for idle time or load event
if (typeof window !== "undefined" && "requestIdleCallback" in window) {
  requestIdleCallback(mountApp);
} else if (typeof window !== "undefined") {
  // Cast window to Window type to fix TypeScript error
  (window as Window).addEventListener("load", mountApp);
} else {
  console.log("App is not ready");
}
