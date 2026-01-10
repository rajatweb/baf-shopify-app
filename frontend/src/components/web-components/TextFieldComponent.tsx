type TProps = {
    label: string;
    value: string;
    details?: string;
    placeholder?: string;
    name: string;
    disabled?: boolean;
    onValueChange: ({ name, value }: { name: string; value: string }) => void;
}

export const TextFieldComponent = ({ label, value, placeholder, details, name, disabled, onValueChange }: TProps) => {
    return <s-text-field
        label={label}
        details={details}
        placeholder={placeholder}
        autocomplete="off"
        value={value}
        disabled={disabled}
        onChange={(event) => {
            const e = event.target as HTMLInputElement;
            onValueChange({ name, value: e.value })
        }}
    />
}