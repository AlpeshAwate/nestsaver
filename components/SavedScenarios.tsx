
import React from 'react';
import { SavedScenario } from '../types';
import { TrashIcon } from './icons';
// FIX: Changed import to use scoped @firebase/auth package
import { User } from '@firebase/auth';

interface SavedScenariosProps {
  scenarios: SavedScenario[];
  onLoad: (scenario: SavedScenario) => void;
  onDelete: (id: string) => void;
  user: User | null;
  onLoginRequest: () => void;
}

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)}`;
}

export const SavedScenarios: React.FC<SavedScenariosProps> = ({ scenarios, onLoad, onDelete, user, onLoginRequest }) => {
  if (!user) {
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md text-center border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Log In to View Scenarios</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to save and view your personalized scenarios.</p>
            <button
                onClick={onLoginRequest}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-md transition-colors text-base"
            >
                Log In
            </button>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md text-center border border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">No Saved Scenarios</h2>
        <p className="text-slate-600 dark:text-slate-400">Go to the Simulator tab to run a simulation and save it.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex flex-col justify-between border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate mb-1">{scenario.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Saved on: {new Date(scenario.savedAt).toLocaleDateString()}</p>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Loan:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(scenario.principal)}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Rate:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{scenario.interestRate.toFixed(2)}%</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Tenure:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{scenario.tenureYears.toFixed(1)} Yrs</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Monthly SIP:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(scenario.monthlySIP)}</span>
                </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-5">
            <button
              onClick={() => onLoad(scenario)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm"
            >
              Load
            </button>
            <button
              onClick={() => onDelete(scenario.id)}
              className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
              aria-label="Delete scenario"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};