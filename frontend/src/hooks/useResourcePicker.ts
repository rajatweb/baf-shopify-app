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
  selectionIds?: Resource[] | string[];
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

    // Build resource picker options with required fields
    const resourcePickerOptions: {
      type: ResourceType;
      action: ActionType;
      multiple: boolean | number;
      filter?: Filters;
      selectionIds?: string[];
    } = {
      type: options.type,
      action: options.action || "add",
      multiple: options.multiple || false,
    };

    // Build filter object only if we have meaningful filter options
    if (options.filter || exclusionQuery) {
      const filter: Filters = {};
      
      // Copy existing filter properties if they exist
      if (options.filter) {
        if (options.filter.archived !== undefined) filter.archived = options.filter.archived;
        if (options.filter.draft !== undefined) filter.draft = options.filter.draft;
        if (options.filter.hidden !== undefined) filter.hidden = options.filter.hidden;
        if (options.filter.variants !== undefined) filter.variants = options.filter.variants;
        if (options.filter.query) filter.query = options.filter.query;
      }
      
      // Add exclusion query if present
      if (exclusionQuery) {
        filter.query = filter.query 
          ? `${filter.query} ${exclusionQuery}` 
          : exclusionQuery;
      }

      // Only add filter if it has at least one property
      if (Object.keys(filter).length > 0) {
        resourcePickerOptions.filter = filter;
      }
    }

    // Convert selectionIds to array of strings if provided
    // Shopify App Bridge expects selectionIds to be an array of strings (IDs)
    if (options.selectionIds && Array.isArray(options.selectionIds) && options.selectionIds.length > 0) {
      // Check if it's an array of objects with id property or array of strings
      resourcePickerOptions.selectionIds = options.selectionIds.map((item) => 
        typeof item === 'string' ? item : item.id
      );
    }

    // Type assertion needed because App Bridge types expect BaseResource[] 
    // but actually accepts string[] for selectionIds
    const selection = await app.resourcePicker(resourcePickerOptions as Parameters<typeof app.resourcePicker>[0]);

    return selection;
  };

  return { openResourcePicker };
};
