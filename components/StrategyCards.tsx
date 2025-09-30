import React from 'react';
import { CircleStackIcon, CalendarDaysIcon, HomeModernIcon, ArrowTrendingUpIcon } from './icons';

interface StrategyCardsProps {
  summary: {
    totalInterestPaidBase: number;
    totalInterestPaidWithPrepayment: number;
    interestSaved: number;
    tenureReducedMonths: number;
    finalSipCorpusNominal: number;
    loanFreeMonth: number | null;
  };
}

const formatCurrency = (value: number): React.ReactNode => {
    let numPart: string;
    let unitPart: string | null = null;

    if (Math.abs(value) >= 10000000) {
        numPart = (value / 10000000).toFixed(2);
        unitPart = 'Cr';
    } else if (Math.abs(value) >= 100000) {
        numPart = (value / 100000).toFixed(2);
        unitPart = 'L';
    } else {
        numPart = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
    }
    
    return (
        <>
            <span className="font-sans">₹</span> {numPart}
            {unitPart && <span className="text-xl ml-1 font-semibold text-slate-500 dark:text-slate-400 align-baseline">{unitPart}</span>}
        </>
    );
};

const formatTenure = (months: number): React.ReactNode => {
    if (months <= 0) {
        return <>0 <span className="text-xl ml-1 font-semibold text-slate-500 dark:text-slate-400 align-baseline">Yrs</span></>;
    }
    const years = months / 12;
    const yearStr = years.toFixed(1);
    
    return (
        <>
            {yearStr}
            <span className="text-xl ml-1 font-semibold text-slate-500 dark:text-slate-400 align-baseline">Yrs</span>
        </>
    );
};


const InfoCard: React.FC<{ title: string; value: React.ReactNode; subtext: string; icon: React.ReactNode; isPositive?: boolean }> = ({ title, value, subtext, icon, isPositive=true }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex flex-col text-center border border-slate-200 dark:border-slate-700 min-h-[140px]">
        <div className="flex items-center justify-center text-slate-600 dark:text-slate-400">
            {icon}
            <p className="text-sm ml-2">{title}</p>
        </div>
        <div className="flex-grow flex flex-col justify-center">
            <p className={`text-3xl font-bold tracking-tight ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{subtext}</p>
        </div>
    </div>
);

export const StrategyCards: React.FC<StrategyCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex flex-col text-center border border-slate-200 dark:border-slate-700 min-h-[140px]">
            <div className="flex items-center justify-center text-slate-600 dark:text-slate-400">
                <CircleStackIcon className="w-5 h-5"/>
                <p className="text-sm ml-2">Interest Saved</p>
            </div>
            <div className="flex-grow flex flex-col justify-center">
                <p className="text-4xl font-bold tracking-tight text-green-600 dark:text-green-400">
                    {formatCurrency(summary.interestSaved)}
                </p>
                {summary.interestSaved > 0 ? (
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-2 space-y-1">
                     <p>
                        Original: <span className="line-through">{formatCurrency(summary.totalInterestPaidBase)}</span>
                     </p>
                     <p>
                        New: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(summary.totalInterestPaidWithPrepayment)}</span>
                     </p>
                  </div>
                ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">No interest saved with current plan.</p>
                )}
            </div>
        </div>
       <InfoCard
            icon={<CalendarDaysIcon className="w-5 h-5"/>}
            title="Tenure Reduced"
            value={formatTenure(summary.tenureReducedMonths)}
            subtext={`Saved ${summary.tenureReducedMonths} months of EMI`}
            isPositive={summary.tenureReducedMonths > 0}
        />
        {summary.loanFreeMonth !== null && summary.loanFreeMonth > 0 && (
            <InfoCard
                icon={<HomeModernIcon className="w-5 h-5"/>}
                title="Loan-Free In"
                value={formatTenure(summary.loanFreeMonth)}
                subtext="When SIP corpus covers loan"
                isPositive
            />
        )}
        <InfoCard
            icon={<ArrowTrendingUpIcon className="w-5 h-5"/>}
            title="Wealth Gained"
            value={formatCurrency(summary.finalSipCorpusNominal)}
            subtext="Final SIP corpus (Nominal)"
            isPositive={summary.finalSipCorpusNominal > 0}
        />
    </div>
  );
};