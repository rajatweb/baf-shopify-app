import { useState } from "react";
import { AppSkeleton, ThemeIntegrationWidgetCard } from "../../components/commons";
import { useAppBridge } from "@shopify/app-bridge-react";


export default function Home() {

  const [isLoading] = useState(false);


  const shopify = useAppBridge();

  const openResourcePicker = async () => {
    const selected = await shopify.resourcePicker({ type: 'collection' });
    console.log("selected", selected);
  }




  // Loading state
  if (isLoading) {
    return <AppSkeleton />;
  }


  return (
    <s-page>

      {/* Theme Integration Warning */}
      <ThemeIntegrationWidgetCard />
      <s-stack>
        <s-text>Hello World</s-text>
        <s-button
          variant="primary"
          onClick={openResourcePicker}
        >
          Open Resource Picker
        </s-button>
      </s-stack>
    </s-page>
  );
}
