export type TUrlSettings = {
  isHomePageOnly: boolean;
  excludeUrls: string[];
};
export type TCollectionSettings = {
  id: string;
  title: string;
  productCount: number;
  productLimit: number;
};
export type TAppearanceSettings = {
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme: "light" | "dark";
  showButtonText: boolean;
  buttonText: string;
};
export type TGeneralSettings = {
  showFilters: boolean;
  hideSoldOut: boolean;
};
export type TCanvasSettings = {
  showProductLabels: boolean;
};
export type TBrandingSettings = {
  showWatermark: boolean;
  customLogo: string;
  logoSize: "small" | "medium" | "large";
};
export type TAdditionalSettings = {
  enableAddToCart: boolean;
};
export type TCustomCssSettings = {
  customCss: string;
};

export type TStoreSettings = {
  urlSettings: TUrlSettings;
  collectionSettings: TCollectionSettings;
  appearanceSettings: TAppearanceSettings;
  generalSettings: TGeneralSettings;
  canvasSettings: TCanvasSettings;
  brandingSettings: TBrandingSettings;
  additionalSettings: TAdditionalSettings;
  customCssSettings: TCustomCssSettings;
};

export type TGetStoreSettingsResponse = {
  data: TStoreSettings;
  status: number;
};

export type TUpdateStoreSettingsRequest = {
  settings: TStoreSettings;
};

export type TUpdateStoreSettingsResponse = {
  data?: TStoreSettings;
  status: number;
  message?: string;
};
