interface PlanBannerProps {
  planName: string;
  planDetails: string;
  itemsUsed: number;
  itemsLimit: number;
  onUpgrade?: () => void;
}

export const PlanBanner = ({
  planName,
  planDetails,
  itemsUsed,
  itemsLimit,
  onUpgrade,
}: PlanBannerProps) => {
  const usagePercentage = (itemsUsed / itemsLimit) * 100;

  // Determine color based on usage
  const getUsageColor = () => {
    if (usagePercentage >= 90) return "#ef4444"; // red
    if (usagePercentage >= 70) return "#facc15"; // yellow
    return "#22c55e"; // green
  };

  const usageColor = getUsageColor();

  return (
    <div
      style={{
        background: "#000",
        borderRadius: "var(--p-border-radius-200)",
        padding: "var(--p-space-400)",
      }}
    >
      <s-stack
        direction="inline"
        justifyContent="space-between"
        alignItems="center"
        gap="large"
      >
        <s-stack direction="inline" gap="large" alignItems="center">
          <s-stack direction="block" gap="small-300">
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
              {planName}
            </span>
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 600 }}>
              {planDetails}
            </span>
          </s-stack>
          <s-stack direction="block" gap="small-300">
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
              Items used
            </span>
            <div
              style={{
                width: "140px",
                height: "8px",
                background: "rgba(255,255,255,0.25)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${usagePercentage}%`,
                  height: "100%",
                  background: usageColor,
                  borderRadius: "4px",
                }}
              />
            </div>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>
              {itemsUsed} / {itemsLimit}
            </span>
          </s-stack>
        </s-stack>
        {onUpgrade && (
          <s-button variant="secondary" onClick={onUpgrade}>
            Upgrade
          </s-button>
        )}
      </s-stack>
    </div>
  );
};
