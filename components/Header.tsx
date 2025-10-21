
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useLanguage();
  return (
    <header className="relative text-center py-8">
      <LanguageSwitcher />
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        {t('appTitle')}
      </h1>
      <p className="mt-4 text-lg text-gray-400">
        {t('appSubtitle')}
      </p>
    </header>
  );
};

export default Header;