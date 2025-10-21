import React, { useCallback } from 'react';
import type { PromptInputs, PromptInputKey } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface PromptFormProps {
  inputs: PromptInputs;
  setInputs: React.Dispatch<React.SetStateAction<PromptInputs>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onGetSuggestion: (field: PromptInputKey) => void;
  suggestionLoading: Set<PromptInputKey>;
  onReset: () => void;
}

const InputField: React.FC<{
  id: PromptInputKey;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onGetSuggestion: (field: PromptInputKey) => void;
  suggestionLoading: Set<PromptInputKey>;
  isSuggestionDisabled: boolean;
}> = ({ id, label, value, onChange, placeholder, onGetSuggestion, suggestionLoading, isSuggestionDisabled }) => {
  const { t } = useLanguage();
  const isCurrentlyLoading = suggestionLoading.has(id);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-10 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        />
        <button
          type="button"
          onClick={() => onGetSuggestion(id)}
          disabled={isSuggestionDisabled || isCurrentlyLoading}
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-400 hover:text-indigo-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label={t('getSuggestionAriaLabel', { field: label })}
        >
          {isCurrentlyLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
const MemoizedInputField = React.memo(InputField);

const TextareaField: React.FC<{
  id: PromptInputKey;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  onGetSuggestion: (field: PromptInputKey) => void;
  suggestionLoading: Set<PromptInputKey>;
  isSuggestionDisabled: boolean;
  rows?: number;
}> = ({ id, label, value, onChange, placeholder, onGetSuggestion, suggestionLoading, isSuggestionDisabled, rows = 3 }) => {
  const { t } = useLanguage();
  const isCurrentlyLoading = suggestionLoading.has(id);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <textarea
          id={id}
          name={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-10 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
        />
        <button
          type="button"
          onClick={() => onGetSuggestion(id)}
          disabled={isSuggestionDisabled || isCurrentlyLoading}
          className="absolute top-0 right-0 flex items-center justify-center w-10 h-10 text-gray-400 hover:text-indigo-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          aria-label={t('getSuggestionAriaLabel', { field: label })}
        >
          {isCurrentlyLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          ) : (
            <SparklesIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
const MemoizedTextareaField = React.memo(TextareaField);


const PromptForm: React.FC<PromptFormProps> = ({ inputs, setInputs, onSubmit, isLoading, onGetSuggestion, suggestionLoading, onReset }) => {
  const { t } = useLanguage();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const type = 'type' in e.target ? e.target.type : '';
    setInputs((prev) => ({ 
        ...prev, 
        [name]: (type === 'range' || type === 'number') ? parseInt(value, 10) : value 
    }));
  }, [setInputs]);

  const isSuggestionDisabled = isLoading || !inputs.simpleIdea.trim();

  const fields: {id: PromptInputKey, labelKey: any, placeholderKey: any}[] = [
      { id: 'genre', labelKey: 'genreLabel', placeholderKey: 'genrePlaceholder' },
      { id: 'style', labelKey: 'styleLabel', placeholderKey: 'stylePlaceholder' },
      { id: 'subject', labelKey: 'subjectLabel', placeholderKey: 'subjectPlaceholder' },
      { id: 'action', labelKey: 'actionLabel', placeholderKey: 'actionPlaceholder' },
      { id: 'setting', labelKey: 'settingLabel', placeholderKey: 'settingPlaceholder' },
      { id: 'camera', labelKey: 'cameraLabel', placeholderKey: 'cameraPlaceholder' },
      { id: 'mood', labelKey: 'moodLabel', placeholderKey: 'moodPlaceholder' },
      { id: 'bgm', labelKey: 'bgmLabel', placeholderKey: 'bgmPlaceholder' },
      { id: 'sfx', labelKey: 'sfxLabel', placeholderKey: 'sfxPlaceholder' },
      { id: 'voice', labelKey: 'voiceLabel', placeholderKey: 'voicePlaceholder' },
  ];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="simpleIdea" className="block text-sm font-medium text-gray-400 mb-2">
          {t('simpleIdeaLabel')}
        </label>
        <textarea
          id="simpleIdea"
          name="simpleIdea"
          rows={3}
          value={inputs.simpleIdea}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
          placeholder={t('simpleIdeaPlaceholder')}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map(field => (
            <MemoizedInputField 
                key={field.id}
                id={field.id} 
                label={t(field.labelKey)} 
                value={inputs[field.id] as string} 
                onChange={handleChange} 
                placeholder={t(field.placeholderKey)}
                onGetSuggestion={onGetSuggestion}
                suggestionLoading={suggestionLoading}
                isSuggestionDisabled={isSuggestionDisabled}
            />
        ))}
      </div>

      <div className="border-t border-gray-700 pt-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-300 -mb-2">{t('dialogueDetailsTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="speakerGender" className="block text-sm font-medium text-gray-400 mb-2">{t('speakerGenderLabel')}</label>
                <select
                    id="speakerGender"
                    name="speakerGender"
                    value={inputs.speakerGender}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-3 pr-10 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
                    <option value="unspecified">{t('unspecified')}</option>
                    <option value="male">{t('male')}</option>
                    <option value="female">{t('female')}</option>
                    <option value="multiple">{t('multiple')}</option>
                </select>
            </div>

            {inputs.speakerGender === 'multiple' && (
                <div>
                    <label htmlFor="speakerCount" className="block text-sm font-medium text-gray-400 mb-2">{t('speakerCountLabel')}</label>
                    <input
                        type="number"
                        id="speakerCount"
                        name="speakerCount"
                        value={inputs.speakerCount}
                        onChange={handleChange}
                        min="2"
                        className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                </div>
            )}

            <div className={inputs.speakerGender !== 'multiple' ? 'md:col-span-2' : ''}>
                <MemoizedInputField
                    id={'dialogueStyle'}
                    label={t('dialogueStyleLabel')}
                    value={inputs.dialogueStyle}
                    onChange={handleChange}
                    placeholder={t('dialogueStylePlaceholder')}
                    onGetSuggestion={onGetSuggestion}
                    suggestionLoading={suggestionLoading}
                    isSuggestionDisabled={isSuggestionDisabled}
                />
            </div>

            <div className="md:col-span-3">
               <MemoizedTextareaField
                    id="dialogue"
                    label={t('dialogueLabel')}
                    value={inputs.dialogue}
                    onChange={handleChange}
                    placeholder={t('dialoguePlaceholder')}
                    onGetSuggestion={onGetSuggestion}
                    suggestionLoading={suggestionLoading}
                    isSuggestionDisabled={isSuggestionDisabled}
                />
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
        <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">
                {t('durationLabel')}: <span className="font-bold text-indigo-400">{inputs.duration}s</span>
            </label>
            <input
                type="range"
                id="duration"
                name="duration"
                min="6"
                max="15"
                step="1"
                value={inputs.duration}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>
        <div>
            <label htmlFor="segments" className="block text-sm font-medium text-gray-400 mb-2">
                {t('segmentsLabel')}: <span className="font-bold text-indigo-400">{inputs.segments}</span>
            </label>
            <input
                type="range"
                id="segments"
                name="segments"
                min="1"
                max="10"
                step="1"
                value={inputs.segments}
                onChange={handleChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="w-full flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
        >
          {t('resetButton')}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {t('generatingButton')}
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              {t('generateButton')}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PromptForm;