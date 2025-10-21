import React, { useState, useEffect } from 'react';
import type { SceneDetails } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface ScenarioViewProps {
  scenario: string;
  scenes: SceneDetails[];
}

const CopyButton: React.FC<{ textToCopy: string, title?: string }> = ({ textToCopy, title }) => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white transition-all duration-200"
            title={title}
        >
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
        </button>
    );
};

const ScenarioView: React.FC<ScenarioViewProps> = ({ scenario, scenes }) => {
    const { t } = useLanguage();
    
    return (
        <div className="p-6 space-y-6">
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-300">{t('outputTitle')}</h4>
                    <CopyButton textToCopy={scenario} title={t('copyAllButton')} />
                </div>
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{scenario}</p>
            </div>
            
            <div className="space-y-4">
                {scenes.map(scene => (
                    <div key={scene.scene_number} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="font-semibold text-indigo-400">
                                {t('sceneTitle', { scene_number: scene.scene_number.toString() })}
                            </h5>
                            <CopyButton textToCopy={scene.description} title={t('copySceneButton')} />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{scene.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScenarioView;
