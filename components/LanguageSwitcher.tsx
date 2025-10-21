
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const buttonClasses = (lang: 'en' | 'ko') => 
    `px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
      language === lang 
        ? 'bg-indigo-500 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <button onClick={() => setLanguage('en')} className={buttonClasses('en')}>
        {t('english')}
      </button>
      <button onClick={() => setLanguage('ko')} className={buttonClasses('ko')}>
        {t('korean')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
