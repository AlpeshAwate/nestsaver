
import React, { useState, useMemo } from 'react';
import { SimulationInput } from '../types';
import { runSimulation } from '../services/simulationService';
import { RocketLaunchIcon, ShieldCheckIcon, LightBulbIcon, BellAlertIcon, XMarkIcon, CheckCircleIcon, ArrowRightIcon } from './icons';

interface CoPilotProps {
    inputs: SimulationInput;
}

const formatCurrency = (value: number): React.ReactNode => {
    if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

const formatTenure = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    if (years > 0 && remainingMonths > 0) return `${years}y ${remainingMonths}m`;
    if (years > 0) return `${years} Years`;
    return `${remainingMonths} Months`;
};

const PrepaymentModal: React.FC<{onClose: () => void; savings: any;}> = ({ onClose, savings }) => (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center"><LightBulbIcon className="w-6 h-6 mr-3 text-emerald-500" /> Prepayment Strategy</h2>
                <button onClick={onClose} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"><XMarkIcon className="w-6 h-6" /></button>
            </div>
            <div className="p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-4">Based on the detected credit of <span className="font-bold">{formatCurrency(savings.prepaymentAmount)}</span>, here's the impact of prepaying now:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">Total Interest Saved</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(savings.interestSaved)}</p>
                    </div>
                     <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">Tenure Reduced By</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">{formatTenure(savings.tenureReducedMonths)}</p>
                    </div>
                </div>
                <div className="mt-6 space-y-4">
                     <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-md transition-colors text-base">Prepay Now (Simulated)</button>
                     <button onClick={onClose} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-md transition-colors text-base">Dismiss</button>
                </div>
            </div>
        </div>
    </div>
);


const PrepaymentAdvisor: React.FC<{ inputs: SimulationInput }> = ({ inputs }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isSubscribed, setSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const prepaymentAmount = 75000;

    const savings = useMemo(() => {
        const baseSim = runSimulation(inputs);
        if (!baseSim) return null;

        const prepaySim = runSimulation({ ...inputs, extraAnnualPrepayment: inputs.extraAnnualPrepayment + prepaymentAmount });
        if (!prepaySim) return null;

        const interestSaved = baseSim.summary.totalInterestPaidBase - prepaySim.summary.totalInterestPaidWithPrepayment;
        const tenureReducedMonths = baseSim.summary.tenureReducedMonths;

        return {
            prepaymentAmount,
            interestSaved,
            tenureReducedMonths
        };
    }, [inputs, prepaymentAmount]);

    const handleSubscribe = () => {
        setIsLoading(true);
        setTimeout(() => {
            setSubscribed(true);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center mb-2">
                <LightBulbIcon className="w-6 h-6 mr-3 text-emerald-500" /> Proactive Prepayment Advisor
            </h3>
            {!isSubscribed ? (
                <>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Let us monitor your linked account for large credits (like bonuses or FD maturities) and notify you of opportunities to save by prepaying your loan.</p>
                    <button onClick={handleSubscribe} disabled={isLoading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50">
                        {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Connect Account & Enable'}
                    </button>
                </>
            ) : (
                <>
                    <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 p-3 rounded-md text-sm mb-4">
                        <CheckCircleIcon className="w-5 h-5 mr-3" /> Monitoring is active. We'll alert you of new opportunities.
                    </div>
                    {savings && (
                        <div className="bg-amber-100 dark:bg-amber-900/40 border-l-4 border-amber-500 text-amber-900 dark:text-amber-100 p-4 rounded-r-lg">
                            <div className="flex items-start">
                                <BellAlertIcon className="h-6 w-6 mr-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                <div>
                                    <p className="font-bold">Opportunity: {formatCurrency(savings.prepaymentAmount)} available to prepay!</p>
                                    <p className="text-sm mt-1">A credit of {formatCurrency(savings.prepaymentAmount)} was detected. Prepaying now could save an estimated <span className="font-semibold">{formatCurrency(savings.interestSaved)}</span> in interest and shorten your loan by <span className="font-semibold">{formatTenure(savings.tenureReducedMonths)}</span>.</p>
                                    <button onClick={() => setModalOpen(true)} className="text-sm font-bold text-amber-900 dark:text-amber-100 hover:underline mt-2 flex items-center">
                                        View Plan <ArrowRightIcon className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {isModalOpen && savings && <PrepaymentModal onClose={() => setModalOpen(false)} savings={savings} />}
        </div>
    );
};

const EmiShield: React.FC<{ inputs: SimulationInput }> = ({ inputs }) => {
    const [step, setStep] = useState<'initial' | 'loading' | 'onboarded' | 'activated' | 'repaid'>('initial');
    
    const emi = inputs.monthlyEMI > 0 ? inputs.monthlyEMI : 0;
    const shieldLimit = emi * 1.10;

    const handleCheckEligibility = () => {
        setStep('loading');
        setTimeout(() => setStep('onboarded'), 2000);
    };

    const handleActivate = () => {
        setStep('loading');
        setTimeout(() => setStep('activated'), 1500);
    };
    
    const handleRepay = () => {
        setStep('loading');
        setTimeout(() => setStep('repaid'), 1500);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center mb-2">
                <ShieldCheckIcon className="w-6 h-6 mr-3 text-emerald-500" /> EMI Shield - Bounce Protection
            </h3>
            
            {step === 'initial' && (
                <>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Avoid EMI bounce charges and protect your credit score. We can provide a small, short-term credit line to cover your EMI if your balance is low on the debit date.</p>
                    <button onClick={handleCheckEligibility} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors">Check Eligibility (Simulated)</button>
                </>
            )}

            {step === 'loading' && (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
                </div>
            )}
            
            {step === 'onboarded' && (
                <>
                    <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 p-3 rounded-md text-sm mb-4">
                        <CheckCircleIcon className="w-5 h-5 mr-3" /> Congratulations! You're eligible for an EMI Shield up to <span className="font-bold ml-1">{formatCurrency(shieldLimit)}</span>.
                    </div>
                     <div className="bg-red-100 dark:bg-red-900/40 border-l-4 border-red-500 text-red-900 dark:text-red-100 p-4 rounded-r-lg">
                        <div className="flex items-start">
                            <BellAlertIcon className="h-6 w-6 mr-3 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Heads up - Your EMI of {formatCurrency(emi)} is due tomorrow.</p>
                                <p className="text-sm mt-1">Your linked account balance appears low. Activate EMI shield to avoid bounce charges?</p>
                                <button onClick={handleActivate} className="mt-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm">Activate EMI Shield Now</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {step === 'activated' && (
                 <>
                    <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 p-3 rounded-md text-sm mb-4">
                        <CheckCircleIcon className="w-5 h-5 mr-3" /> EMI Shield is active. <span className="font-bold mx-1">{formatCurrency(emi)}</span> transferred to your account.
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg text-center">
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">We'll notify you when your salary is credited. You can then repay the shield amount with one click.</p>
                        <button onClick={handleRepay} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors">Repay EMI Shield Now</button>
                    </div>
                </>
            )}

            {step === 'repaid' && (
                <div className="flex items-center text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 p-3 rounded-md text-sm mb-4">
                    <CheckCircleIcon className="w-5 h-5 mr-3" /> Thank you! Your EMI Shield has been repaid.
                </div>
            )}

        </div>
    );
};


export const CoPilot: React.FC<CoPilotProps> = ({ inputs }) => {
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <RocketLaunchIcon className="w-12 h-12 mx-auto text-emerald-500 mb-2" />
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Financial Co-Pilot</h1>
                <p className="mt-2 text-md text-slate-600 dark:text-slate-400">Proactive tools to help you clear loans early and manage your finances smartly.</p>
            </div>

            <PrepaymentAdvisor inputs={inputs} />
            <EmiShield inputs={inputs} />

        </div>
    );
};
