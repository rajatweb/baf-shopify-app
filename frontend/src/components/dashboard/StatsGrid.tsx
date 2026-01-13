interface Stat {
  label: string;
  value: string | number;
  change?: {
    value: string;
    positive?: boolean;
  };
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {stats.map((stat, index) => (
        <s-box
          key={index}
          background="base"
          border="base"
          borderRadius="base"
          padding="base"
        >
          <s-stack direction="block" gap="small-300">
            <span style={{ fontSize: "13px", color: "#6d7175" }}>
              {stat.label}
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700 }}>
              {typeof stat.value === "number" 
                ? stat.value.toLocaleString() 
                : stat.value}
            </span>
            {stat.change && (
              <span
                style={{
                  fontSize: "12px",
                  color: stat.change.positive !== false ? "#16a34a" : "#dc2626",
                }}
              >
                {stat.change.positive !== false ? "↑" : "↓"} {stat.change.value}
              </span>
            )}
          </s-stack>
        </s-box>
      ))}
    </div>
  );
};