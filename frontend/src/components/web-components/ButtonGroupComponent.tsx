type TProps = {
    label: string;
    name: string;
    value: string;
    options: { label: string; value: string }[];
    onValueChange: (name: string, value: string) => void;
    details?: string;
    disabled?: boolean;
  };
  
  export const ButtonGroupComponent = ({
    label,
    name,
    options,
    onValueChange,
    value,
    details,
    disabled = false,
  }: TProps) => {
    // If label is empty, render as billing toggle (matching HTML reference)
    if (!label) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#e5e7eb",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            {options.map((item, index) => {
              const isSelected = item.value === value;
              // Extract main label and save text from format like "Yearly (Save 17%)"
              const match = item.label.match(/^(.+?)\s*\((.+?)\)$/);
              const mainLabel = match ? match[1].trim() : item.label;
              const saveText = match ? match[2].trim() : null;
  
              return (
                <button
                  key={index}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onValueChange(name, item.value)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    border: "none",
                    cursor: disabled ? "not-allowed" : "pointer",
                    background: isSelected ? "#fff" : "transparent",
                    color: isSelected ? "#1a1a1a" : "#6b7280",
                    transition: "all 0.15s",
                    boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                    opacity: disabled ? 0.6 : 1,
                  }}
                >
                  {mainLabel}
                  {saveText && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#16a34a",
                        marginLeft: "6px",
                      }}
                    >
                      {saveText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // Original implementation for labeled button groups
    return (
      <s-stack direction="block" gap="small-300">
        <s-stack
          direction="inline"
          justifyContent="space-between"
          alignItems="center"
        >
          <s-text type="strong">{label}</s-text>
          <div
            style={{
              display: "inline-flex",
              gap: 0,
              borderRadius: "var(--p-border-radius-200)",
              border: "1px solid var(--p-border-subdued)",
              overflow: "hidden",
              backgroundColor: "var(--p-color-bg-surface-secondary)",
              opacity: disabled ? 0.6 : 1,
            }}
          >
            {options.map((item, index) => {
              const isSelected = item.value === value;
              const isLast = index === options.length - 1;
  
              return (
                <button
                  key={index}
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && onValueChange(name, item.value)}
                  style={{
                    padding: "var(--p-space-200) var(--p-space-400)",
                    border: "none",
                    borderRight: !isLast
                      ? "1px solid var(--p-border-subdued)"
                      : "none",
                    backgroundColor: isSelected ? "#000000" : "transparent",
                    color: isSelected ? "#ffffff" : "var(--p-color-text-subdued)",
                    cursor: disabled ? "not-allowed" : "pointer",
                    transition: "all 0.15s ease",
                    fontWeight: isSelected ? "600" : "400",
                    fontSize: "var(--p-font-size-275)",
                    lineHeight: "var(--p-line-height-300)",
                    whiteSpace: "nowrap",
                    position: "relative",
                    minWidth: "fit-content",
                    opacity: disabled ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor =
                        "var(--p-color-bg-surface-hover)";
                      e.currentTarget.style.color = "var(--p-color-text)";
                    } else {
                      e.currentTarget.style.backgroundColor = "#000000";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--p-color-text-subdued)";
                    } else {
                      e.currentTarget.style.backgroundColor = "#000000";
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </s-stack>
        {details && (
          <s-text tone="info">
            {details}
          </s-text>
        )}
      </s-stack>
    );
  };