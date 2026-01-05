import { useGetLanguageSettingsQuery } from '../store/api/language-settings';
import { getLanguageByCode } from '../../../shared/constants/languages';

export function useLanguageSettings() {
  const { 
    data: languageSettings, 
    isLoading, 
    error,
    refetch 
  } = useGetLanguageSettingsQuery();

  const primaryLanguage = languageSettings?.primaryLanguage || 'en';
  
  const primaryLanguageInfo = getLanguageByCode(primaryLanguage);

  return {
    // Data
    languageSettings,
    primaryLanguage,
    primaryLanguageInfo,
    
    // State
    isLoading,
    error,
    
    // Actions
    refetch,
    
    // Utilities
    getLanguageInfo: (languageCode: string) => getLanguageByCode(languageCode),
  };
} 