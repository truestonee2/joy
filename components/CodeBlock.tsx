import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
  showCopyAll: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, language, code, showCopyAll }) => {
  const { t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
  };
  
  const copyButtonTitle = showCopyAll ? t('copyAllButton') : t('copySceneButton');

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-lg border-b border-gray-700">
        <span className="text-sm font-semibold text-gray-400">{title}</span>
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200"
          title={copyButtonTitle}
        >
          {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;