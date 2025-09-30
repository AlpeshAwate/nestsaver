import React, { useState } from 'react';
import { SimulationInput, OptimizationStrategy } from '../types';
import { generateOptimizationStrategies } from '../services/optimizationService';
import { XMarkIcon, LightBulbIcon, ShieldCheckIcon, ScaleIcon, RocketLaunchIcon, CheckCircleIcon } from './icons';
import { InputSlider } from './InputSlider';


const formatCurrency = (value: number): React.ReactNode => {
    let numPart: string;
    let unitPart: string | null = null;
    if (value < 0) return `₹ 0`;
    if (Math.abs(value) >= 10000000) {
        numPart = (value / 10000000).toFixed(2);
        unitPart = 'Cr';
    } else if (Math.abs(value) >= 100000) {
        numPart = (value / 100000).toFixed(2);
        unitPart = 'L';
    } else {
        numPart = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
    }
    return <><span className="font-sans">₹</span> {numPart}{unitPart && <span className="text-lg ml-1 font-semibold text-slate-500 dark:text-slate-400 align-baseline">{unitPart}</span>}</>;
};

const formatTenure = (months: number): React.ReactNode => {
    if (months <= 0) return <>0 <span className="text-lg ml-1 font-semibold text-slate-500 dark:text-slate-400 align-baseline">Yrs</span></>;
    const years = months / 12;
    const yearStr = years.toFixed(1);
    return <>{yearStr}<span className="text-lg ml-1 font-semibold text-slate-500 dark:text-slate-400 align-baseline">Yrs</span></>;
};

const formatCurrencySimple = (value: number): string => {
    if (value < 0) return '₹ 0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

const RISK_ICONS = {
    Conservative: <ShieldCheckIcon className="w-6 h-6" />,
    Moderate: <ScaleIcon className="w-6 h-6" />,
    Aggressive: <RocketLaunchIcon className="w-6 h-6" />
};

const RISK_COLORS = {
    Conservative: "text-blue-500 dark:text-blue-400",
    Moderate: "text-amber-500 dark:text-amber-400",
    Aggressive: "text-red-500 dark:text-red-400"
}

interface StrategyResultCardProps {
  strategy: OptimizationStrategy;
  onApply: () => void;
}

const StrategyResultCard: React.FC<StrategyResultCardProps> = ({ strategy, onApply }) => {
    const { name, description, riskLevel, results, inputs } = strategy;
    const { loanFreeMonth, interestSaved, finalSipCorpusNominal } = results;

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center mb-2">
                    <span className={`${RISK_COLORS[riskLevel]} mr-2`}>{RISK_ICONS[riskLevel]}</span>
                    <h4 className={`text-lg font-bold ${RISK_COLORS[riskLevel]}`}>{name}</h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 h-12">{description}</p>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-baseline">
                        <span className="text-slate-600 dark:text-slate-400">Loan-Free In</span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{loanFreeMonth ? formatTenure(loanFreeMonth) : '-'}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-slate-600 dark:text-slate-400">Interest Saved</span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatCurrency(interestSaved)}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                        <span className="text-slate-600 dark:text-slate-400">Wealth Gained</span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatCurrency(finalSipCorpusNominal)}</span>
                    </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600 space-y-1.5 text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-center mb-2">New Allocation:</p>
                    <div className="flex justify-between items-baseline">
                       <span className="text-slate-600 dark:text-slate-400">Annual Prepayment:</span>
                       <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrencySimple(inputs.extraAnnualPrepayment ?? 0)}</span>
                   </div>
                   <div className="flex justify-between items-baseline">
                       <span className="text-slate-600 dark:text-slate-400">Monthly SIP:</span>
                       <span className="font-bold text-slate-800 dark:text-slate-200">{formatCurrencySimple(inputs.monthlySIP ?? 0)}</span>
                   </div>
                </div>
            </div>
            <button
                onClick={onApply}
                className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-md transition flex items-center justify-center text-sm">
                <CheckCircleIcon className="w-5 h-5 mr-2" /> Apply Strategy
            </button>
        </div>
    );
};


interface OptimizationResultsProps {
    strategies: OptimizationStrategy[];
    onApplyStrategy: (inputs: Partial<SimulationInput>) => void;
}

export const OptimizationResults: React.FC<OptimizationResultsProps> = ({ strategies, onApplyStrategy }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2 text-emerald-500" /> Your Personalized Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strategies.map(strat => (
                    <StrategyResultCard 
                        key={strat.name} 
                        strategy={strat}
                        onApply={() => onApplyStrategy(strat.inputs)}
                    />
                ))}
            </div>
        </div>
    );
};


interface OptimizationStrategiesProps {
  baseInputs: SimulationInput;
  onStrategiesGenerated: (strategies: OptimizationStrategy[] | null) => void;
}

export const OptimizationStrategies: React.FC<OptimizationStrategiesProps> = ({ baseInputs, onStrategiesGenerated }) => {
    const [annualSurplus, setAnnualSurplus] = useState(100000);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = () => {
        setIsLoading(true);
        // Using a timeout to give a feel of calculation
        setTimeout(() => {
            const generated = generateOptimizationStrategies(baseInputs, annualSurplus);
            onStrategiesGenerated(generated);
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">Enter the total extra amount you can save per year. We'll generate personalized strategies to help you become debt-free faster and build more wealth.</p>
                <div className="space-y-4">
                    <InputSlider 
                        label="My Annual Surplus (₹)"
                        value={annualSurplus}
                        onChange={setAnnualSurplus}
                        min={0} max={2000000} step={10000} format="currency"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading || annualSurplus <= 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-md transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading 
                            ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            : 'Generate Strategies'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};