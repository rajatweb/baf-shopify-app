type TProps = {
    label: string;
    value: string;
    details?: string;
    placeholder?: string;
    name: string;
    disabled?: boolean;
    onValueChange: ({ name, value }: { name: string; value: string }) => void;
    maxLength?: number;
}

export const TextFieldComponent = ({ label, value, placeholder, details, name, disabled, onValueChange, maxLength }: TProps) => {
    return <s-text-field
        label={label}
        details={details}
        placeholder={placeholder}
        autocomplete="off"
        value={value}
        disabled={disabled}
        onInput={(event) => {
            const value = (event.target as HTMLInputElement).value;
            if (maxLength && value.length > maxLength) {
                event.preventDefault();
                return;
            }
        }}
        onChange={(event) => {
            const e = event.target as HTMLInputElement;
            onValueChange({ name, value: e.value })
        }}
    />
}