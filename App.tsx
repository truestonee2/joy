import React, { useState, useCallback } from 'react';
import type { PromptInputs, PromptInputKey, HistoryItem, GeneratedOutput } from './types';
import { generateVideoPrompt, getSuggestion } from './services/geminiService';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import PromptOutput from './components/PromptOutput';
import Footer from './components/Footer';
import History from './components/History';
import { useLanguage } from './contexts/LanguageContext';

const initialInputs: PromptInputs = {
  simpleIdea: '',
  genre: '',
  style: '',
  subject: '',
  action: '',
  setting: '',
  camera: '',
  mood: '',
  bgm: '',
  sfx: '',
  voice: '',
  dialogue: '',
  duration: 6,
  segments: 1,
  speakerGender: 'unspecified',
  speakerCount: 2,
  dialogueStyle: '',
};

const App: React.FC = () => {
  const { language } = useLanguage();
  const [inputs, setInputs] = useState<PromptInputs>(initialInputs);

  const [generatedOutput, setGeneratedOutput] = useState<GeneratedOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState<Set<PromptInputKey>>(new Set());
  const [history, setHistory] = useState<HistoryItem[]>([]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null);

    try {
      const result = await generateVideoPrompt(inputs, language);
      setGeneratedOutput(result);
      setHistory(prev => [{ id: Date.now(), output: result }, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSuggestion = useCallback(async (field: PromptInputKey) => {
    if (!inputs.simpleIdea) return;
    setSuggestionLoading(prev => new Set(prev).add(field));
    setError(null);

    try {
        const suggestion = await getSuggestion(field, inputs, language);
        if (!suggestion.startsWith('Error:')) {
            setInputs(prev => ({ ...prev, [field]: suggestion }));
        } else {
            setError(suggestion);
        }
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred while getting a suggestion.');
    } finally {
        setSuggestionLoading(prev => {
            const newSet = new Set(prev);
            newSet.delete(field);
            return newSet;
        });
    }
  }, [inputs, language]);

  const handleReset = useCallback(() => {
    setInputs(initialInputs);
    setGeneratedOutput(null);
    setError(null);
  }, []);
  
  const handleReusePrompt = useCallback((output: GeneratedOutput) => {
    setGeneratedOutput(output);
    const outputElement = document.getElementById('prompt-output');
    if (outputElement) {
        outputElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 md:p-8 shadow-2xl shadow-indigo-900/20 mt-8">
            <PromptForm 
                inputs={inputs} 
                setInputs={setInputs}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onGetSuggestion={handleGetSuggestion}
                suggestionLoading={suggestionLoading}
                onReset={handleReset}
            />
        </div>
        
        <div id="prompt-output">
          <PromptOutput 
              output={generatedOutput} 
              isLoading={isLoading}
              error={error}
          />
        </div>

        <History history={history} onReuse={handleReusePrompt} />
      </main>
      <Footer />
    </div>
  );
};

export default App;