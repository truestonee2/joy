import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { translations, TranslationKey } from '../lib/translations';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, values?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko'); // Default to Korean

  const t = useCallback((key: TranslationKey, values?: Record<string, string>): string => {
    let translation = translations[language][key] || key;
    if (values) {
        Object.keys(values).forEach(valueKey => {
            const regex = new RegExp(`{${valueKey}}`, 'g');
            translation = translation.replace(regex, values[valueKey]);
        });
    }
    return translation;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
