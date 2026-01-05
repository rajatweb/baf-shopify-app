// Currency symbol mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  JPY: "¥",
  CHF: "CHF",
  SEK: "kr",
  DKK: "kr",
  NOK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RUB: "₽",
  BRL: "R$",
  MXN: "$",
  INR: "₹",
  KRW: "₩",
  SGD: "S$",
  HKD: "HK$",
  NZD: "NZ$",
  ZAR: "R",
  TRY: "₺",
  ILS: "₪",
  AED: "د.إ",
  SAR: "ر.س",
  THB: "฿",
  MYR: "RM",
  PHP: "₱",
  IDR: "Rp",
  VND: "₫",
};

/**
 * Get currency symbol for a given currency code
 * @param currencyCode - The currency code (e.g., "USD", "EUR")
 * @returns The currency symbol or the currency code if symbol not found
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] || currencyCode;
};

/**
 * Format a price with currency symbol
 * @param price - The price value
 * @param currencyCode - The currency code
 * @param showSymbol - Whether to show the currency symbol (default: true)
 * @returns Formatted price string
 */
export const formatPrice = (
  price: string | number,
  currencyCode: string,
  showSymbol: boolean = true
): string => {
  const symbol = showSymbol ? getCurrencySymbol(currencyCode) : "";
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return showSymbol ? `${symbol}0.00` : "0.00";
  }
  
  return showSymbol ? `${symbol}${numericPrice.toFixed(2)}` : numericPrice.toFixed(2);
}; 