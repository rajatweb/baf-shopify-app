import { useMemo } from "react";
import { useGetSettingsQuery } from "../../store/api/settings";
export const PlanLimitCard = () => {

    const { data: { data: storeSettings } = {}, isLoading: isLoadingSettings } = useGetSettingsQuery();
    const currentUsage = useMemo(() => {
        if (isLoadingSettings) return { itemsUsed: 0, itemsLimit: 0 };
        if (!storeSettings) return { itemsUsed: 0, itemsLimit: 0 };
        const collectionSettings = storeSettings?.collectionSettings;
        return {
            itemsUsed: collectionSettings?.productCount || 0,
            itemsLimit: collectionSettings?.productLimit || 0,
        };
    }, [storeSettings, isLoadingSettings]);

    const usagePercentage = useMemo(() => {
        return (currentUsage.itemsUsed / currentUsage.itemsLimit) * 100;
    }, [currentUsage]);


    return <div style={{ width: "100%", marginBottom: "24px" }}>
        <s-box
            background="base"
            border="base"
            borderRadius="base"
            padding="base"
        >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <div style={{ minWidth: "200px" }}>
                    <div style={{ fontSize: "13px", marginBottom: "4px" }}>
                        <s-text color="subdued">Current usage</s-text>
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>
                        {currentUsage.itemsUsed} of {currentUsage.itemsLimit}{" "}
                        items
                    </div>
                    {usagePercentage >= 100 && (
                        <s-text tone="critical">
                            Displaying on your store. Upgrade your plan to display more products.
                        </s-text>
                    )}

                </div>
                <div style={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
                    <div
                        style={{
                            width: "100%",
                            height: "8px",
                            background: "#e1e3e5",
                            borderRadius: "4px",
                            overflow: "hidden",
                            marginBottom: "6px",
                        }}
                    >
                        <div
                            style={{
                                width: `${usagePercentage}%`,
                                height: "100%",
                                background:
                                    usagePercentage >= 90
                                        ? "#ef4444"
                                        : usagePercentage >= 70
                                            ? "#facc15"
                                            : "#22c55e",
                                borderRadius: "4px",
                            }}
                        />
                    </div>
                    <div style={{ fontSize: "12px", textAlign: "right" }}>
                        <s-text color="subdued">
                            {Math.round(usagePercentage)}% of plan limit
                        </s-text>
                    </div>
                </div>
            </div>
        </s-box>
    </div>
}