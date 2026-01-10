type TProps = {
    label: string;
    value: string;
    details?: string;
    placeholder?: string;
    rows: number
    name: string;
    disabled?: boolean;
    onValueChange: ({ name, value }: { name: string; value: string }) => void;
}

export const TextAreaComponent = ({ label, value, placeholder, details, rows, name, disabled, onValueChange }: TProps) => {
    return <s-text-area
        label={label}
        rows={rows}
        details={details}
        placeholder={placeholder}
        autocomplete="off"
        value={value}
        disabled={disabled}
        onInput={(event) => {
            const e = event.target as HTMLInputElement;
            onValueChange({ name, value: e.value })
        }}
    />
}