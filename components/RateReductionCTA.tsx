
import React from 'react';
import { User } from '@firebase/auth';
import { LightBulbIcon, ChatBubbleLeftRightIcon, ArrowsRightLeftIcon, KeyIcon } from './icons';

interface RateReductionCTAProps {
  rateReduction: number;
  user: User | null;
  onLoginRequest: () => void;
  onRenegotiateRequest: () => void;
  onBalanceTransferRequest: () => void;
}

export const RateReductionCTA: React.FC<RateReductionCTAProps> = ({ rateReduction, user, onLoginRequest, onRenegotiateRequest, onBalanceTransferRequest }) => {
    return (
        <div className="bg-amber-100 dark:bg-amber-900/40 border-l-4 border-amber-500 text-amber-900 dark:text-amber-100 p-4 rounded-r-lg space-y-3">
            <div className="flex items-center">
                <LightBulbIcon className="h-6 w-6 mr-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                    <p className="font-bold text-base">Opportunity Detected!</p>
                    <p className="text-sm font-medium">
                        You could lower your interest rate by up to{' '}
                        <strong className="text-lg">{rateReduction.toFixed(2)}%</strong>.
                    </p>
                </div>
            </div>
            
            {user ? (
                <div>
                    <p className="text-xs mb-2.5">Based on your profile, you may have these options:</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button 
                            onClick={onRenegotiateRequest} 
                            className="flex-1 flex items-center justify-center text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded-md transition-colors"
                        >
                            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2"/>
                            Renegotiate
                        </button>
                        <button 
                            onClick={onBalanceTransferRequest}
                            className="flex-1 flex items-center justify-center text-sm bg-white dark:bg-amber-400/20 hover:bg-amber-50 dark:hover:bg-amber-400/30 border border-amber-500 text-amber-800 dark:text-amber-100 font-semibold py-2 px-3 rounded-md transition-colors"
                        >
                            <ArrowsRightLeftIcon className="w-4 h-4 mr-2"/>
                            Balance Transfer
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 mb-3 max-w-xs">Log in to see personalized savings based on your location, bank, and CIBIL score.</p>
                    <button 
                        onClick={onLoginRequest}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm w-full flex items-center justify-center"
                    >
                        <KeyIcon className="w-4 h-4 mr-2"/>
                        Log In to Unlock Savings
                    </button>
                </div>
            )}
        </div>
    );
}