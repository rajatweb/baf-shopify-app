import { useAppBridge } from "@shopify/app-bridge-react";

type ResourceType = "product" | "variant" | "collection";
type ActionType = "add" | "select";

interface Filters {
  archived?: boolean;
  draft?: boolean;
  hidden?: boolean;
  query?: string;
  variants?: boolean;
}

interface Resource {
  id: string;
  variants?: Resource[];
}

interface ResourcePickerOptions {
  type: ResourceType;
  action?: ActionType;
  filter?: Filters;
  multiple?: boolean | number;
  query?: string;
  selectionIds?: Resource[];
}

export const useResourcePicker = () => {
  const app = useAppBridge();

  const openResourcePicker = async (
    options: ResourcePickerOptions,
    excludedProductHandles?: string[]
  ) => {
    const exclusionQuery = excludedProductHandles?.length
      ? excludedProductHandles.map((handle) => `-handle:${handle}`).join(" ")
      : "";

    const selection = await app.resourcePicker({
      type: options.type,
      action: options.action || "add",
      filter: {
        ...options.filter,
        query: exclusionQuery, // Exclude products by handle
      },
      multiple: options.multiple || false,
      selectionIds: options.selectionIds,
    });

    return selection;
  };

  return { openResourcePicker };
};
