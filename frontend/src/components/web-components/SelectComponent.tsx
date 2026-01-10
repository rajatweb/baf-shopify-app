import { TSelectProps } from "./types";

export const SelectComponent = ({
  label,
  options,
  name,
  value,
  onValueChange,
  details,
  disabled,
  error,
  required,
  placeholder,
}: TSelectProps) => {
  return (
    <s-box paddingBlockStart="small">
      <s-select
        label={label}
        name={name}
        value={value}
        disabled={disabled}
        error={error}
        required={required}
        placeholder={placeholder}
        details={details}
        onChange={(event) => {
          const { name, value } = event.target as HTMLSelectElement;
          onValueChange({ name, value });
        }}
      >
        {options.map((item, key) => (
          <s-option key={key} value={item.value}>
            {item.label}
          </s-option>
        ))}
      </s-select>
    </s-box>
  );
};