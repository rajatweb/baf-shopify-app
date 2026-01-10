export interface StoreSettings {
  content: {
    type: "custom" | "swatch";
    layout: "horizontal" | "vertical" | "grid";
    swatchStyle?: "circle" | "square";
    showMainTitle: boolean;
    mainTitle: string;
    subTitle: string;
    showPrice: boolean;
    showCompareAtPrice: boolean;
    showProductImage: boolean;
    showSwatchColor: boolean;
    style: {
      borderWidth: string;
      borderStyle: "solid" | "dashed" | "dotted";
      borderColor: string;
      selectedBorderColor: string;
      backgroundColor: string;
      textColor: string;
      priceColor: string;
      compareAtPriceColor: string;
      swatchSize: string;
    };
  };
  createdAt?: string;
  lastModified?: string;
  shop?: string;
}

export interface CreateStoreSettingsRequest {
  content: StoreSettings["content"];
}

export interface UpdateStoreSettingsRequest {
  content: StoreSettings["content"];
}

export interface ThemeStatusResponse {
  success: boolean;
  shopUrl: string;
  themeId: number;
  themeName: string;
  isThemeExtensionDisabled: boolean;
}

export interface AppIdResponse {
  success: boolean;
  id: string;
}
