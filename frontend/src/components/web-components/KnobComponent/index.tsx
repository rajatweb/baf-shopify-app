import { TKnobProps } from "../types";
import styles from "./knob.module.css";

export const KnobComponent = ({
  selected,
  label,
  onValueChange,
  name,
  description,
  disabled = false,
}: TKnobProps) => {
  return (
    <s-box background="base" border="base" borderRadius="base" padding="base">
      <s-stack direction="inline" justifyContent="space-between">
        <s-stack
          direction="inline"
          justifyContent="start"
          gap="small"
          alignItems="center"
        >
          <s-text color={disabled ? "subdued" : "base"}>{label}</s-text>
        </s-stack>
        <button
          id=":rgi:"
          className={`${styles.track} ${selected && styles.track_on} ${
            disabled ? styles.track_disabled : ""
          }`}
          aria-label={label}
          role="switch"
          type="button"
          aria-checked="false"
          disabled={disabled}
          onClick={() => !disabled && onValueChange({ name, value: !selected })}
          style={{
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <div className={`${styles.knob} ${selected && styles.knob_on}`}></div>
        </button>
      </s-stack>
      {description && (
        <s-text color={disabled ? "subdued" : "base"}>{description}</s-text>
      )}
    </s-box>
  );
};
