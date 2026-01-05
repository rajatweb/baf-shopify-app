import { useAppBridge } from "@shopify/app-bridge-react";

type Progress = "incomplete" | "partiallyComplete" | "complete";
type Tone = "info" | "success" | "warning" | "critical";
type DataPoint = string | number | undefined;
type HeaderType = "string" | "number";

interface Badge {
  content: string;
  progress?: Progress;
  tone?: Tone;
}

export interface Header {
  content: string;
  type?: HeaderType;
}

export interface PickerItem {
  id: string;
  heading: string;
  badges?: Badge[];
  data?: DataPoint[];
  disabled?: boolean;
  selected?: boolean;
  thumbnail?: {
    url: string;
  };
}

interface PickerOptions {
  heading: string;
  items: PickerItem[];
  headers?: Header[];
  multiple?: boolean | number;
}

export const usePicker = () => {
  const app = useAppBridge();

  const openPicker = async (options: PickerOptions) => {
    const selection = await app.picker({
      heading: options.heading,
      items: options.items,
      headers: options.headers,
      multiple: options.multiple || false,
    });

    return selection;
  };

  return { openPicker };
};
