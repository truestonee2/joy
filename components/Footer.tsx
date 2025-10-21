
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="text-center py-8 mt-12">
      <p className="text-gray-500">
        {t('footerText')}
      </p>
    </footer>
  );
};

export default Footer;