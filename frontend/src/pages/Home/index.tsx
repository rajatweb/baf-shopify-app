import {
  AppSkeleton,
  ThemeIntegrationWidgetCard,
} from "../../components/commons";
import {
  PlanBanner,
  StatusBanner,
  StatsGrid,
  WidgetCard,
  EmptyState,
} from "../../components/dashboard";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "../../store/api/settings";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useResourcePicker } from "../../hooks/useResourcePicker";

import AppHeader from "../../components/commons/Header";
import { useGetShopAnalyticsQuery } from "../../store/api/shop-analytics";
import { useGetShopQuery } from "../../store/api/shop";

// Dummy data for dashboard
const dummyPlanData = {
  planName: "Basic Plan",
  planDetails: "50 items • Custom branding",
  itemsUsed: 45,
  itemsLimit: 50,
};

export default function Home() {


  const { data: { data: settings } = {}, isLoading } = useGetSettingsQuery();
  const { data: { data: shopAnalytics } = {}, isLoading: isShopAnalyticsLoading } = useGetShopAnalyticsQuery({ params: { days: "30", limit: 3 } });
  const { data: { data: shopData } = {}, isLoading: isShopLoading } = useGetShopQuery();

  const [updateSettings] = useUpdateSettingsMutation();

  const storeCurrencySymbol = useMemo(() => shopData?.currencyFormats?.currencySymbol || "$", [shopData]);
  const collectionId = settings?.collectionSettings?.id;
  const navigate = useNavigate();
  const shopify = useAppBridge();
  const { openResourcePicker } = useResourcePicker();

  const openResourcePickerHandler = useCallback(async () => {
    if (settings) {
      try {
        const selected = await openResourcePicker({ type: "collection", action: "select" });
        if (selected?.selection[0]) {
          const selectedCollection = selected?.selection[0] as {
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

          await updateSettings({
            settings: {
              ...settings,
              collectionSettings: {
                ...settings.collectionSettings,
                id,
                title,
                productCount: productsCount,
                collectionHandle: handle,
              },
            },
          }).unwrap();
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
  }, [openResourcePicker, shopify, settings, updateSettings]);

  const handleCollectionChange = useCallback(
    async (collectionId: string) => {
      if (settings && collectionId) {
        try {
          const selected = await openResourcePicker({
            type: "collection",
            action: "select",
            selectionIds: [{ id: collectionId }],
          });
          if (selected?.selection[0]) {
            const selectedCollection = selected?.selection[0] as {
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
            await updateSettings({
              settings: {
                ...settings,
                collectionSettings: {
                  ...settings.collectionSettings,
                  id,
                  title,
                  productCount: productsCount,
                  collectionHandle: handle,
                },
              },
            }).unwrap();
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
    },
    [openResourcePicker, shopify, updateSettings, settings]
  );

  const handleUpgrade = useCallback(() => {
    navigate("/plans");
  }, [navigate]);

  const handleEditSettings = useCallback(() => {
    navigate("/settings");
  }, [navigate]);

  const handlePreview = useCallback(() => {
    // TODO: Implement preview functionality
    shopify.toast.show("Preview functionality coming soon");
  }, [shopify]);

  if (isLoading || isShopAnalyticsLoading || isShopLoading) {
    return <AppSkeleton />;
  }
  // Show dashboard with collection configured
  const usagePercentage =
    (dummyPlanData.itemsUsed / dummyPlanData.itemsLimit) * 100;
  const isNearLimit = usagePercentage >= 90;

  const widgetPositionOptions = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
  ]

  return (
    <div
      style={{
        paddingBottom: "var(--p-space-1600)",
      }}
    >
      {!collectionId ? <s-page>
        <ThemeIntegrationWidgetCard />
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
      </s-page> :
        <s-page>
          <AppHeader
            title="Build A Fit"
            subtitle="Let customers create and share outfit combinations"
            actionButton={{
              label: "Settings",
              variant: "primary",
              onClick: () => {
                navigate("/settings");
              },
            }}
          />

          <PlanBanner
            planName={dummyPlanData.planName}
            planDetails={dummyPlanData.planDetails}
            itemsUsed={dummyPlanData.itemsUsed}
            itemsLimit={dummyPlanData.itemsLimit}
            onUpgrade={handleUpgrade}
          />
          <s-stack direction="block" gap="base">
            {isNearLimit ? (
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
            )}

            {shopAnalytics?.analytics && <StatsGrid analytics={shopAnalytics.analytics} currentCurrencySymbol={storeCurrencySymbol} />}

            <WidgetCard
              isLive={true}
              widgetName={
                settings?.collectionSettings?.title
              }
              widgetMeta={`${settings?.collectionSettings?.productCount
                } products • ${widgetPositionOptions.find(option => option.value === settings?.appearanceSettings?.position)?.label}`}
              topProducts={shopAnalytics?.products || []}
              onEditSettings={handleEditSettings}
              onChangeCollection={() => handleCollectionChange(collectionId)}
            />
          </s-stack>
        </s-page>}
    </div>
  );
}
