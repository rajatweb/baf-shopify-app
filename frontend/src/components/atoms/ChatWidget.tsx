import { useEffect } from "react";
import { useTawkTo } from "../../hooks/useTawkTo";

interface ChatWidgetProps {
  open: boolean;
}

export const ChatWidget = ({ open }: ChatWidgetProps) => {
  useTawkTo(open);

  // Hide the custom chat widget when Tawk.to is loaded
  useEffect(() => {
    const tawkToWidget = document.querySelector('#tawkchat-container');
    if (tawkToWidget) {
      tawkToWidget.setAttribute('style', 'display: block !important');
    }
  }, []);

  // Don't render anything as we're using Tawk.to's widget
  return null;
}; 