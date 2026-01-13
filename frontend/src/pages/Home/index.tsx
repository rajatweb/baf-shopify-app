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
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import AppHeader from "../../components/commons/Header";

// Dummy data for dashboard
const dummyPlanData = {
  planName: "Basic Plan",
  planDetails: "50 items • Custom branding",
  itemsUsed: 45,
  itemsLimit: 50,
};

const dummyStats = [
  {
    label: "Revenue",
    value: "$847",
    change: { value: "23%", positive: true },
  },
  {
    label: "Fits Shared",
    value: 156,
    change: { value: "12%", positive: true },
  },
  {
    label: "Product Clicks",
    value: 1247,
    change: { value: "8%", positive: true },
  },
  {
    label: "Conversion",
    value: "4.2%",
    change: { value: "0.5%", positive: true },
  },
];

const dummyTopProducts = [
  {
    rank: 1,
    name: "Classic White Tee",
    fitsCount: 67,
    clicksCount: 23,
  },
  {
    rank: 2,
    name: "Vintage Denim Jacket",
    fitsCount: 54,
    clicksCount: 19,
  },
  {
    rank: 3,
    name: "High-Rise Straight Jeans",
    fitsCount: 48,
    clicksCount: 31,
  },
];

export default function Home() {
  const { data: { data: settings } = {}, isLoading } = useGetSettingsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const collectionId = settings?.collectionSettings?.id;
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const openResourcePicker = useCallback(async () => {
    if (settings) {
      try {
        const selected = await shopify.resourcePicker({ type: "collection" });
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
  }, [shopify, settings, updateSettings]);

  const handleCollectionChange = useCallback(
    async (collectionId: string) => {
      if (settings && collectionId) {
        try {
          const selected = await shopify.resourcePicker({
            type: "collection",
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
    [shopify, updateSettings, settings]
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

  if (isLoading) {
    return <AppSkeleton />;
  }

  // Show empty state if no collection is configured
  if (!collectionId) {
    return (
      <s-page>
        <ThemeIntegrationWidgetCard />
        <s-stack direction="block" gap="base">
          <StatusBanner
            type="warning"
            title="Enable the app embed"
            description="Go to theme settings to display the widget on your store."
            actionLabel="Enable Now"
            onAction={() => {
              // @ts-expect-error - process.env is defined in vite.config.ts
              const apiKey: string = process.env.SHOPIFY_API_KEY || "";
              window.open(
                `shopify://admin/themes/current/editor?context=apps&template=product&activateAppId=${apiKey}/baf-app-widget`,
                "_blank"
              );
            }}
          />

          <EmptyState
            heading="Set up your outfit builder"
            description="Select a collection and customize how the widget appears on your store."
            primaryAction={{
              label: "Get Started",
              onClick: openResourcePicker,
            }}
          />
        </s-stack>
      </s-page>
    );
  }

  // Show dashboard with collection configured
  const usagePercentage =
    (dummyPlanData.itemsUsed / dummyPlanData.itemsLimit) * 100;
  const isNearLimit = usagePercentage >= 90;

  return (
    <div
      style={{
        paddingBottom: "var(--p-space-1600)",
      }}
    >
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

          <StatsGrid stats={dummyStats} />

          <WidgetCard
            isLive={true}
            widgetName={
              settings?.collectionSettings?.title || "Summer Collection"
            }
            widgetMeta={`${
              settings?.collectionSettings?.productCount || 42
            } products • Bottom right`}
            topProducts={dummyTopProducts}
            onEditSettings={handleEditSettings}
            onChangeCollection={() => handleCollectionChange(collectionId)}
          />
        </s-stack>
      </s-page>
    </div>
  );
}
