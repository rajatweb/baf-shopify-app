import { AppSkeleton, ThemeIntegrationWidgetCard } from "../../components/commons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "../../store/api/settings";
import { useCallback } from "react";


export default function Home() {

  const { data: { data: settings } = {}, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdatingSettings }] = useUpdateSettingsMutation();
  const collectionId = settings?.collectionSettings?.id;

  const shopify = useAppBridge();

  const openResourcePicker = useCallback(async () => {
    if (settings) {
      try {
        const selected = await shopify.resourcePicker({ type: 'collection' });
        if (selected?.selection[0]) {
          const selectedCollection = selected?.selection[0] as { id: string, title: string, productsCount: number };
          const { id = "", title = "", productsCount = 0 } = selectedCollection;
          await updateSettings({ settings: { ...settings, collectionSettings: { ...settings.collectionSettings, id, title, productCount: productsCount } } }).unwrap();
          shopify.toast.show("Collection selected successfully");
        } else {
          throw new Error("No collection selected to select");
        }
      } catch (error) {
        if (error instanceof Error) {
          shopify.toast.show(error.message, {
            isError: true,
          });
        } else {
          shopify.toast.show("Failed to select collection", {
            isError: true,
          });
        }
      }
    }
  }, [shopify, settings, updateSettings]);

  const handleCollectionChange = useCallback(async (collectionId: string) => {
    if (settings && collectionId) {
      try {
        const selected = await shopify.resourcePicker({ type: 'collection', selectionIds: [{ id: collectionId }] });
        if (selected?.selection[0]) {
          const selectedCollection = selected?.selection[0] as { id: string, title: string, productsCount: number };
          const { id = "", title = "", productsCount = 0 } = selectedCollection;
          await updateSettings({ settings: { ...settings, collectionSettings: { ...settings.collectionSettings, id, title, productCount: productsCount } } }).unwrap();
          shopify.toast.show("Collection changed successfully");
        } else {
          throw new Error("No collection selected to change");
        }
      } catch (error) {
        if (error instanceof Error) {
          shopify.toast.show(error.message, {
            isError: true,
          });
        } else {
          shopify.toast.show("Failed to change collection", {
            isError: true,
          });
        }
      }
    }
  }, [shopify, updateSettings, settings]);

  if (isLoading) {
    return <AppSkeleton />;
  }
  return (
    <s-page>

      {/* Theme Integration Warning */}
      <ThemeIntegrationWidgetCard />
      <s-stack>
        {collectionId ?
          <s-stack direction="inline" justifyContent="space-between" alignItems="center" gap="small">
            <s-text>Collection: {settings?.collectionSettings?.title}</s-text>
            <s-text>Product Count: {settings?.collectionSettings?.productCount}</s-text>
            <s-button
              variant="primary"
              onClick={() => handleCollectionChange(collectionId)}
              disabled={isUpdatingSettings}
              loading={isUpdatingSettings}
            >

              Change Collection
            </s-button>
          </s-stack> :
          <s-button
            variant="primary"
            onClick={openResourcePicker}
            disabled={isUpdatingSettings}
            loading={isUpdatingSettings}
          >
            Select Collection
          </s-button>
        }
      </s-stack>
    </s-page>
  );
}
