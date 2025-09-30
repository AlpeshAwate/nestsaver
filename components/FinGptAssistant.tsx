
import React, { useState, useEffect } from 'react';
import { SimulationInput } from '../types';
import { generateBankNegotiationScript } from '../services/geminiService';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from './icons';

interface FinGptAssistantProps {
  simulationInputs: SimulationInput | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const FinGptAssistant: React.FC<FinGptAssistantProps> = ({ simulationInputs, isOpen, onOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState('');

  useEffect(() => {
    // When the modal opens, if there's no script, generate one automatically.
    if (isOpen && !script && !isLoading) {
      handleGenerateScript();
    }
  }, [isOpen]);

  const handleGenerateScript = async () => {
    if (!simulationInputs) {
      setScript("Please configure your loan details in the simulator first.");
      return;
    }
    setIsLoading(true);
    setScript('');
    try {
      const generatedScript = await generateBankNegotiationScript(simulationInputs);
      setScript(generatedScript);
    } catch (error)
    {
      setScript("Sorry, I couldn't generate a script right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none z-50 flex items-center"
        aria-label="Open Fin-GPT Assistant"
      >
        <SparklesIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl z-50 border border-slate-200 dark:border-slate-700">
      <div className="p-4 flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 rounded-t-xl">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2 text-emerald-500" />
          Fin-GPT Assistant
        </h3>
        <button onClick={onClose} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 h-80 overflow-y-auto space-y-4">
        <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-sm">
            <p>Here is a script you can use to negotiate a better interest rate with your bank, based on your current loan details.</p>
        </div>
        {isLoading && (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        )}
        {script && (
            <div className="p-3 bg-slate-800 dark:bg-black/50 rounded-lg text-slate-200 dark:text-slate-300 text-sm whitespace-pre-wrap font-mono">
                {script}
            </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleGenerateScript}
          disabled={isLoading || !simulationInputs}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generating...' : 
            <>
                <PaperAirplaneIcon className="w-5 h-5 mr-2" />
                Regenerate Script
            </>
          }
        </button>
      </div>
    </div>
  );
};