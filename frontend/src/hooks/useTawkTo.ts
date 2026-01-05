import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: {
      maximize: () => void;
      minimize: () => void;
      toggle: () => void;
    };
    Tawk_LoadStart?: Date;
  }
}

export const useTawkTo = (isOpen: boolean) => {
  useEffect(() => {
    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {
      maximize: () => {},
      minimize: () => {},
      toggle: () => {},
    };
    window.Tawk_LoadStart = new Date();

    // Load Tawk.to script
    const loadTawkTo = () => {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = process.env.TAWK_TO_SCRIPT_URL || "";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode?.insertBefore(s1, s0);
    };

    // Load script if not already loaded
    if (!document.querySelector('script[src*="tawk.to"]')) {
      loadTawkTo();
    }

    // Handle chat visibility
    if (window.Tawk_API) {
      if (isOpen) {
        window.Tawk_API.maximize();
      } else {
        window.Tawk_API.minimize();
      }
    }

    // Cleanup function
    return () => {
      if (window.Tawk_API) {
        window.Tawk_API.minimize();
      }
    };
  }, [isOpen]);

  // Function to toggle chat
  const toggleChat = () => {
    if (window.Tawk_API) {
      window.Tawk_API.toggle();
    }
  };

  return { toggleChat };
};
