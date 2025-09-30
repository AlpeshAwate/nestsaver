
import React, { useState, useRef, useEffect } from 'react';
// FIX: Changed import to use scoped @firebase/auth package
import { User } from '@firebase/auth';
import { ChartBarIcon, UserCircleIcon, ShieldCheckIcon, ChevronDownIcon, SunIcon, MoonIcon, InformationCircleIcon } from './icons';
import { UserProfile } from '../types';
import { auth } from '../services/firebase';

type Theme = 'light' | 'dark';

interface HeaderProps {
  user: User | null;
  userProfile: UserProfile | null;
  onLogin: () => void;
  onSignUp: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onRepoRateClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, userProfile, onLogin, onSignUp, theme, setTheme, onRepoRateClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setIsDropdownOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <ChartBarIcon className="w-8 h-8 text-emerald-500 mr-3"/>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Paisabridge</h1>
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

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  <UserCircleIcon className="w-8 h-8"/>
                  <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Signed in as</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{userProfile?.name || user.email}</p>
                    </div>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-500 dark:hover:text-emerald-400"
                    >
                      Log Out
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button onClick={onLogin} className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-md">
                  Log In
                </button>
                <button onClick={onSignUp} className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors px-3 py-1.5 rounded-md">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
