import { AlertTriangle, Check } from "lucide-react";

interface StatusBannerProps {
  type: "warning" | "success";
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const StatusBanner = ({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: StatusBannerProps) => {
  const isSuccess = type === "success";

  return (
    <div style={{ marginTop: "var(--p-space-500)", marginBottom: "var(--p-space-500)" }}>
      <div
        style={{
          background: isSuccess ? "#dcfce7" : "#fef3c7",
          border: `1px solid ${isSuccess ? "#86efac" : "#fcd34d"}`,
          borderRadius: "var(--p-border-radius-200)",
          padding: "var(--p-space-400)",
        }}
      >
        <s-stack direction="inline" gap="base" alignItems="center">
          {isSuccess ? (
            <Check size={20} color="#15803d" />
          ) : (
            <AlertTriangle size={20} color="#92400e" />
          )}
          <div style={{ flex: 1 }}>
            <s-stack direction="block" gap="small-300">
              <span style={{ color: isSuccess ? "#15803d" : "#92400e", fontWeight: 600 }}>
                {title}
              </span>
              {description && (
                <span style={{ fontSize: "13px", color: "#6d7175" }}>
                  {description}
                </span>
              )}
            </s-stack>
          </div>
          {actionLabel && onAction && (
            <s-button variant={isSuccess ? "secondary" : "primary"} onClick={onAction}>
              {actionLabel}
            </s-button>
          )}
        </s-stack>
      </div>
    </div>
  );
};