export type TShop = {
  name: string;
  currencyCode: string;
  currencyFormats: {
    moneyFormat: string;
    moneyWithCurrencyFormat: string;
    currencySymbol: string;
  };
};

export type TShopResponse = {
  status: number;
  data?: TShop;
  message?: string;
};
