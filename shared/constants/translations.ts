export interface Translations {
  [key: string]: {
    [languageCode: string]: string;
  };
}

export const CARRIER_RATES_TRANSLATIONS: Translations = {
  // Service name translations
  'service_name': {
    'en': 'Smart Shipping Rates',
    'es': 'Tarifas de Envío Inteligentes',
    'fr': 'Tarifs d\'Expédition Intelligents',
    'de': 'Intelligente Versandkosten',
    'it': 'Tariffe di Spedizione Intelligenti',
    'pt': 'Taxas de Envio Inteligentes',
    'nl': 'Slimme Verzendkosten',
    'ja': 'スマート配送料金',
    'ko': '스마트 배송 요금',
    'zh': '智能运费',
    'ar': 'أسعار الشحن الذكية',
    'hi': 'स्मार्ट शिपिंग दरें',
  },

  // Condition type translations
  'zip_condition': {
    'en': 'Zip Code Based',
    'es': 'Basado en Código Postal',
    'fr': 'Basé sur le Code Postal',
    'de': 'Postleitzahl-basiert',
    'it': 'Basato sul Codice Postale',
    'pt': 'Baseado no Código Postal',
    'nl': 'Postcode-gebaseerd',
    'ja': '郵便番号ベース',
    'ko': '우편번호 기반',
    'zh': '基于邮政编码',
    'ar': 'بناءً على الرمز البريدي',
    'hi': 'पिन कोड आधारित',
  },

  'distance_condition': {
    'en': 'Distance Based',
    'es': 'Basado en Distancia',
    'fr': 'Basé sur la Distance',
    'de': 'Entfernungs-basiert',
    'it': 'Basato sulla Distanza',
    'pt': 'Baseado na Distância',
    'nl': 'Afstand-gebaseerd',
    'ja': '距離ベース',
    'ko': '거리 기반',
    'zh': '基于距离',
    'ar': 'بناءً على المسافة',
    'hi': 'दूरी आधारित',
  },

  'cart_condition': {
    'en': 'Cart Value Based',
    'es': 'Basado en Valor del Carrito',
    'fr': 'Basé sur la Valeur du Panier',
    'de': 'Warenkorb-Wert-basiert',
    'it': 'Basato sul Valore del Carrello',
    'pt': 'Baseado no Valor do Carrinho',
    'nl': 'Winkelwagen-waarde-gebaseerd',
    'ja': 'カート価格ベース',
    'ko': '장바구니 가치 기반',
    'zh': '基于购物车价值',
    'ar': 'بناءً على قيمة السلة',
    'hi': 'कार्ट मूल्य आधारित',
  },

  // Shipping method descriptions
  'standard_shipping': {
    'en': 'Standard Shipping',
    'es': 'Envío Estándar',
    'fr': 'Expédition Standard',
    'de': 'Standardversand',
    'it': 'Spedizione Standard',
    'pt': 'Envio Padrão',
    'nl': 'Standaardverzending',
    'ja': '標準配送',
    'ko': '표준 배송',
    'zh': '标准配送',
    'ar': 'الشحن القياسي',
    'hi': 'मानक शिपिंग',
  },

  'express_shipping': {
    'en': 'Express Shipping',
    'es': 'Envío Express',
    'fr': 'Expédition Express',
    'de': 'Expressversand',
    'it': 'Spedizione Express',
    'pt': 'Envio Expresso',
    'nl': 'Expressverzending',
    'ja': '速達配送',
    'ko': '특급 배송',
    'zh': '快速配送',
    'ar': 'الشحن السريع',
    'hi': 'एक्सप्रेस शिपिंग',
  },

  'free_shipping': {
    'en': 'Free Shipping',
    'es': 'Envío Gratis',
    'fr': 'Livraison Gratuite',
    'de': 'Kostenloser Versand',
    'it': 'Spedizione Gratuita',
    'pt': 'Envio Grátis',
    'nl': 'Gratis Verzending',
    'ja': '無料配送',
    'ko': '무료 배송',
    'zh': '免费配送',
    'ar': 'شحن مجاني',
    'hi': 'मुफ्त शिपिंग',
  },

  // Time estimates
  'delivery_time_standard': {
    'en': '3-5 business days',
    'es': '3-5 días hábiles',
    'fr': '3-5 jours ouvrables',
    'de': '3-5 Werktage',
    'it': '3-5 giorni lavorativi',
    'pt': '3-5 dias úteis',
    'nl': '3-5 werkdagen',
    'ja': '3-5営業日',
    'ko': '3-5 영업일',
    'zh': '3-5个工作日',
    'ar': '3-5 أيام عمل',
    'hi': '3-5 कार्य दिवस',
  },

  'delivery_time_express': {
    'en': '1-2 business days',
    'es': '1-2 días hábiles',
    'fr': '1-2 jours ouvrables',
    'de': '1-2 Werktage',
    'it': '1-2 giorni lavorativi',
    'pt': '1-2 dias úteis',
    'nl': '1-2 werkdagen',
    'ja': '1-2営業日',
    'ko': '1-2 영업일',
    'zh': '1-2个工作日',
    'ar': '1-2 أيام عمل',
    'hi': '1-2 कार्य दिवस',
  },

  'delivery_time_free': {
    'en': '5-7 business days',
    'es': '5-7 días hábiles',
    'fr': '5-7 jours ouvrables',
    'de': '5-7 Werktage',
    'it': '5-7 giorni lavorativi',
    'pt': '5-7 dias úteis',
    'nl': '5-7 werkdagen',
    'ja': '5-7営業日',
    'ko': '5-7 영업일',
    'zh': '5-7个工作日',
    'ar': '5-7 أيام عمل',
    'hi': '5-7 कार्य दिवस',
  },

  // Error messages
  'error_no_rates': {
    'en': 'No shipping rates available for your location',
    'es': 'No hay tarifas de envío disponibles para su ubicación',
    'fr': 'Aucun tarif d\'expédition disponible pour votre localisation',
    'de': 'Keine Versandkosten für Ihren Standort verfügbar',
    'it': 'Nessuna tariffa di spedizione disponibile per la tua posizione',
    'pt': 'Nenhuma taxa de envio disponível para sua localização',
    'nl': 'Geen verzendkosten beschikbaar voor uw locatie',
    'ja': 'お客様の地域には配送料金がありません',
    'ko': '귀하의 위치에 사용 가능한 배송 요금이 없습니다',
    'zh': '您的位置没有可用的运费',
    'ar': 'لا توجد أسعار شحن متاحة لموقعك',
    'hi': 'आपके स्थान के लिए कोई शिपिंग दर उपलब्ध नहीं है',
  },

  'error_calculation_failed': {
    'en': 'Unable to calculate shipping rate',
    'es': 'No se pudo calcular la tarifa de envío',
    'fr': 'Impossible de calculer le tarif d\'expédition',
    'de': 'Versandkosten konnten nicht berechnet werden',
    'it': 'Impossibile calcolare la tariffa di spedizione',
    'pt': 'Não foi possível calcular a taxa de envio',
    'nl': 'Verzendkosten konden niet worden berekend',
    'ja': '配送料金を計算できませんでした',
    'ko': '배송 요금을 계산할 수 없습니다',
    'zh': '无法计算运费',
    'ar': 'تعذر حساب سعر الشحن',
    'hi': 'शिपिंग दर की गणना नहीं कर सकते',
  },

  // Success messages
  'rate_calculated': {
    'en': 'Shipping rate calculated successfully',
    'es': 'Tarifa de envío calculada exitosamente',
    'fr': 'Tarif d\'expédition calculé avec succès',
    'de': 'Versandkosten erfolgreich berechnet',
    'it': 'Tariffa di spedizione calcolata con successo',
    'pt': 'Taxa de envio calculada com sucesso',
    'nl': 'Verzendkosten succesvol berekend',
    'ja': '配送料金が正常に計算されました',
    'ko': '배송 요금이 성공적으로 계산되었습니다',
    'zh': '运费计算成功',
    'ar': 'تم حساب سعر الشحن بنجاح',
    'hi': 'शिपिंग दर सफलतापूर्वक गणना की गई',
  },
};

export function getTranslation(key: string, languageCode: string): string {
  const translations = CARRIER_RATES_TRANSLATIONS[key];
  if (!translations) {
    return key; // Return key if translation not found
  }
  
  // Return translation for the language, fallback to English, then key
  return translations[languageCode] || translations['en'] || key;
}

export function getTranslationsForLanguage(languageCode: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  Object.keys(CARRIER_RATES_TRANSLATIONS).forEach(key => {
    result[key] = getTranslation(key, languageCode);
  });
  
  return result;
} 