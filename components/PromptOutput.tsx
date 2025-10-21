import React, { useState } from 'react';
import Loader from './Loader';
import { useLanguage } from '../contexts/LanguageContext';
import type { GeneratedOutput } from '../types';
import ScenarioView from './ScenarioView';
import JsonView from './JsonView';

interface PromptOutputProps {
  output: GeneratedOutput | null;
  isLoading: boolean;
  error: string | null;
}

const PromptOutput: React.FC<PromptOutputProps> = ({ output, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<'scenario' | 'json'>('scenario');
  const { t } = useLanguage();

  if (isLoading) {
    return (
        <div className="mt-8 text-center p-8 bg-gray-800/50 border border-gray-700 rounded-lg">
            <Loader />
            <p className="mt-4 text-lg text-gray-400 font-semibold">{t('loadingMessageTitle')}</p>
            <p className="mt-2 text-gray-500">{t('loadingMessageSubtitle')}</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-md text-red-300">
        <p className="font-semibold">{t('errorTitle')}</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!output) {
    return null;
  }
  
  const tabClasses = (tabName: 'scenario' | 'json') => 
    `px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
      activeTab === tabName 
        ? 'bg-gray-800 text-white' 
        : 'bg-gray-900 text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
    }`;

  return (
    <div className="mt-8">
       <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('scenario')} className={tabClasses('scenario')}>
            {t('scenarioTab')}
          </button>
          <button onClick={() => setActiveTab('json')} className={tabClasses('json')}>
            {t('jsonTab')}
          </button>
        </nav>
      </div>
      
      <div className="bg-gray-800 border border-t-0 border-gray-700 rounded-b-lg">
        {activeTab === 'scenario' ? (
          <ScenarioView scenario={output.scenario} scenes={output.json.scenes} />
        ) : (
          <JsonView json={output.json} />
        )}
      </div>
    </div>
  );
};

export default PromptOutput;