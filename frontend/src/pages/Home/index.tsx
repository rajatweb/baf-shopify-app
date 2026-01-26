import {
  AppSkeleton,
  ThemeIntegrationWidgetCard,
} from "../../components/commons";
import {
  PlanBanner,
  StatsGrid,
  WidgetCard,
  EmptyState,
} from "../../components/dashboard";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../store/api/settings";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResourcePicker } from "../../hooks/useResourcePicker";
import { useGetShopAnalyticsQuery } from "../../store/api/shop-analytics";
import { useGetShopQuery } from "../../store/api/shop";

export default function Home() {
  const { data: { data: settings } = {}, isLoading } = useGetSettingsQuery();
  const {
    data: { data: shopAnalytics } = {},
    isLoading: isShopAnalyticsLoading,
  } = useGetShopAnalyticsQuery({ params: { days: "7", limit: 3 } });
  const { data: { data: shopData } = {}, isLoading: isShopLoading } =
    useGetShopQuery();

  const [updateSettings] = useUpdateSettingsMutation();
  const [isChangingCollection, setIsChangingCollection] = useState(false);

  const storeCurrencySymbol = useMemo(
    () => shopData?.currencyFormats?.currencySymbol || "$",
    [shopData]
  );
  const collectionId = settings?.collectionSettings?.id;
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const { openResourcePicker } = useResourcePicker();

  const openResourcePickerHandler = useCallback(async () => {
    if (!settings) {
      shopify.toast.show("Settings are not set. Please set up your settings first.", {
        isError: true,
      });
      return;
    }
    try {
      const selected = await openResourcePicker({ type: "collection", action: "select" });
      if (selected?.selection && selected.selection.length > 0) {
        const selectedCollection = selected.selection[0] as {
          id: string;
          title: string;
          productsCount: number;
          handle: string;
        };
        const {
          id = "",
          title = "",
          productsCount = 0,
          handle = "",
        } = selectedCollection;

        // Strip the GID prefix before saving (to match backend format)
        const strippedId = id.replace("gid://shopify/Collection/", "");

        // Ensure we have settings object, use existing or create new structure
        const currentSettings = settings


        await updateSettings({
          settings: {
            ...currentSettings,
            collectionSettings: {
              ...currentSettings?.collectionSettings,
              id: strippedId,
              title,
              productCount: productsCount,
              collectionHandle: handle,
            },
          },
        }).unwrap();
        shopify.toast.show("Collection selected successfully");
      } else {
        // User cancelled the picker - this is not an error
        return;
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
  }, [openResourcePicker, shopify, settings, updateSettings]);

  const handleCollectionChange = useCallback(
    async (collectionId: string) => {
      if (!settings || !collectionId) {
        shopify.toast.show("Settings or collection ID is missing", {
          isError: true,
        });
        return;
      }

      setIsChangingCollection(true);
      try {
        // Open resource picker without pre-selection to allow user to choose any collection
        const selected = await openResourcePicker({
          type: "collection",
          action: "select",
        });

        // Check if user made a selection (not cancelled)
        if (selected?.selection && Array.isArray(selected.selection) && selected.selection.length > 0) {
          const selectedCollection = selected.selection[0] as {
            id: string;
            title: string;
            productsCount: number;
            handle: string;
          };

          if (!selectedCollection || !selectedCollection.id) {
            throw new Error("Invalid collection data received");
          }

          const {
            id = "",
            title = "",
            productsCount = 0,
            handle = "",
          } = selectedCollection;

          // Strip the GID prefix before saving (to match backend format)
          const strippedId = id.replace("gid://shopify/Collection/", "");

          // Check if collection actually changed
          const currentStrippedId = collectionId.replace("gid://shopify/Collection/", "");
          if (strippedId === currentStrippedId && title === settings.collectionSettings?.title) {
            shopify.toast.show("Same collection selected. No changes made.");
            return;
          }

          await updateSettings({
            settings: {
              ...settings,
              collectionSettings: {
                ...settings.collectionSettings,
                id: strippedId,
                title,
                productCount: productsCount,
                collectionHandle: handle,
              },
            },
          }).unwrap();
          shopify.toast.show("Collection changed successfully");
        } else {
          // User cancelled - not an error, just return silently
          return;
        }
      } catch (error) {
        if (error instanceof Error) {
          shopify.toast.show(error.message, {
            isError: true,
          });
        } else {
          shopify.toast.show("Failed to change collection. Please try again.", {
            isError: true,
          });
        }
      } finally {
        setIsChangingCollection(false);
      }
    },
    [openResourcePicker, shopify, updateSettings, settings]
  );


  const handleEditSettings = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  if (isLoading || isShopAnalyticsLoading || isShopLoading) {
    return <AppSkeleton />;
  }

  const widgetPositionOptions = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
  ];

  return (
    <div
      style={{
        maxWidth: "998px",
        margin: "0 auto",
        padding: "20px 16px",
      }}
    >
      <s-page heading="Build A Fit">
        <s-button
          slot="primary-action"
          variant="primary"
          icon="settings"
          onClick={handleEditSettings}
        >
          Settings
        </s-button>

        <ThemeIntegrationWidgetCard />

        {!collectionId ? (
          <s-stack direction="block" gap="base">
            <EmptyState
              heading="Set up your outfit builder"
              description="Select a collection and customize how the widget appears on your store."
              primaryAction={{
                label: "Get Started",
                onClick: openResourcePickerHandler,
              }}
            />
          </s-stack>
        ) : (
          <>
            <PlanBanner />
            <s-stack direction="block" gap="base">
              {/* {isNearLimit ? (
                <StatusBanner
                  type="warning"
                  title="You're almost at your item limit"
                  description="Upgrade to Pro for 150 items or Plus for unlimited."
                  actionLabel="Upgrade Now"
                  onAction={handleUpgrade}
                />
              ) : (
                <StatusBanner
                  type="success"
                  title="Widget is live on your store"
                  actionLabel="Preview"
                  onAction={handlePreview}
                />
              )} */}

              {shopAnalytics?.analytics && (
                <StatsGrid
                  analytics={shopAnalytics.analytics}
                  currentCurrencySymbol={storeCurrencySymbol}
                  timePeriod="7"
                />
              )}

              <WidgetCard
                isLive={true}
                widgetName={settings?.collectionSettings?.title}
                widgetMeta={`${settings?.collectionSettings?.productCount
                  } products • ${widgetPositionOptions.find(
                    (option) =>
                      option.value === settings?.appearanceSettings?.position
                  )?.label
                  }`}
                topProducts={shopAnalytics?.products || []}
                onEditSettings={handleEditSettings}
                onChangeCollection={() => handleCollectionChange(collectionId)}
                isChangingCollection={isChangingCollection}
              />
            </s-stack>
          </>
        )}
      </s-page>
    </div>
  );
}
