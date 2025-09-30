import React from 'react';
import { XMarkIcon, MegaphoneIcon } from './icons';

interface GoogleAdProps {
    onClose: () => void;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ onClose }) => {
    return (
        <div className="relative bg-slate-100 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 overflow-hidden">
            {/* Ad Label */}
            <div className="absolute top-1 left-1 bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                Ad
            </div>
            
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-1 right-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full"
                aria-label="Close advertisement"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4">
                <div className="hidden sm:block bg-emerald-500 p-3 rounded-full text-white">
                    <MegaphoneIcon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Upgrade to the Nova Platinum Card</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Earn 5% cashback on all spends and enjoy exclusive travel benefits. Limited time offer!</p>
                </div>
            </div>
            
            <a 
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex-shrink-0 text-sm bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Learn More
            </a>
        </div>
    );
};
