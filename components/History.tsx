import React, { useState, useEffect } from 'react';
import type { HistoryItem, GeneratedOutput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import ReuseIcon from './icons/ReuseIcon';

interface HistoryProps {
  history: HistoryItem[];
  onReuse: (output: GeneratedOutput) => void;
}

const History: React.FC<HistoryProps> = ({ history, onReuse }) => {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (copiedId !== null) {
      const timer = setTimeout(() => setCopiedId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.output.scenario);
    setCopiedId(item.id);
  };

  return (
    <div className="mt-8">
      <details className="bg-gray-800/50 border border-gray-700 rounded-lg group">
        <summary className="p-4 cursor-pointer text-lg font-semibold text-gray-300 list-none flex justify-between items-center transition-colors hover:bg-gray-800">
          {t('historyTitle')}
          <svg className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <div className="border-t border-gray-700">
          {history.length === 0 ? (
            <p className="p-4 text-gray-500">{t('emptyHistory')}</p>
          ) : (
            <ul className="space-y-2 p-2 max-h-96 overflow-y-auto">
              {history.map((item) => (
                <li key={item.id} className="p-3 bg-gray-800 rounded-md flex justify-between items-center gap-4">
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-indigo-300 truncate">{item.output.json.title}</p>
                    <p className="text-gray-400 text-sm truncate">{item.output.scenario}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onReuse(item.output)}
                      className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                      aria-label={t('historyItemAriaLabel')}
                      title={t('reuseButton')}
                    >
                      <ReuseIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
                      aria-label={t('copyAriaLabel')}
                      title={t('copyButton')}
                    >
                      {copiedId === item.id ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>
    </div>
  );
};

export default React.memo(History);