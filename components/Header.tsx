import React from 'react';
import { ChartBarIcon, ShieldCheckIcon, SunIcon, MoonIcon, InformationCircleIcon } from './icons';

type Theme = 'light' | 'dark';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onRepoRateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, onRepoRateClick }) => {

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-emerald-500 mr-3"/>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">NestSaver</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-6">
                <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">CIBIL Score</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-end">
                    <ShieldCheckIcon className="w-5 h-5 mr-1.5 text-green-500" />
                    720
                </p>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-600"></div>
                <button onClick={onRepoRateClick} className="text-right hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-md transition-colors">
                    <div className="flex items-center gap-1.5 justify-end">
                        <p className="text-sm text-slate-600 dark:text-slate-400">RBI Repo Rate</p>
                        <InformationCircleIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">6.50%</p>
                </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-600 hidden sm:block"></div>
            
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};