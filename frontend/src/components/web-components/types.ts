export type TSelectOption = {
  value: string;
  label: string;
};
export type TSelectProps = {
  label: string;
  options: TSelectOption[];
  value?: string;
  disabled?: boolean;
  icon?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  name: string;
  details?: string;
  onValueChange: ({ name, value }: { name: string; value: string }) => void;
};

export type TRangeSliderProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  name: string;
  prefix?: string;
  suffix?: string;
  label?: string;
  onValueChange: ({ name, value }: { name: string; value: number }) => void;
  isTextField?: boolean;
  details?: string;
  disabled?: boolean;
  isTextFieldDisabled?: boolean;
};

export type TKnobProps = {
  selected: boolean;
  label: string;
  name: string;
  description?: string;
  disabled?: boolean;
  onValueChange: ({ name, value }: { name: string; value: boolean }) => void;
};
