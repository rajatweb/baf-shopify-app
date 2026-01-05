export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isRTL: false,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isRTL: false,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isRTL: false,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isRTL: false,
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    isRTL: false,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    isRTL: false,
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    isRTL: false,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isRTL: false,
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    isRTL: false,
  },
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    isRTL: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    isRTL: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    isRTL: false,
  },
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getLanguageName(code: string): string {
  const language = getLanguageByCode(code);
  return language ? language.name : 'Unknown';
} 