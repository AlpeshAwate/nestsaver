import React, { useMemo } from 'react';
import { SimulationInput } from '../types';
import { calculateEMI, runSimulation } from '../services/simulationService';
import { HbfcBankIcon, IciBankIcon, StateBankIcon, AxisBankIcon, ArrowDownCircleIcon, BanknotesIcon, CheckBadgeIcon } from './icons';

interface BalanceTransferProps {
  currentLoan: SimulationInput;
  onApplyOffer: (newRate: number) => void;
}

interface BankOffer {
  id: string;
  name: string;
  interestRate: number;
  processingFeePercent: number;
  icon: React.ReactNode;
}

const MOCK_OFFERS: BankOffer[] = [
  { id: 'hbfc', name: 'HBFC Bank', interestRate: 8.25, processingFeePercent: 0.5, icon: <HbfcBankIcon className="w-8 h-8" /> },
  { id: 'ici', name: 'ICI Bank', interestRate: 8.30, processingFeePercent: 0.4, icon: <IciBankIcon className="w-8 h-8" /> },
  { id: 'sbi', name: 'State Bank', interestRate: 8.40, processingFeePercent: 0.35, icon: <StateBankIcon className="w-8 h-8" /> },
  { id: 'axis', name: 'Axis Bank', interestRate: 8.35, processingFeePercent: 1.0, icon: <AxisBankIcon className="w-8 h-8" /> },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

export const BalanceTransfer: React.FC<BalanceTransferProps> = ({ currentLoan, onApplyOffer }) => {
    
    // For simplicity, we assume transfer happens at the start of the loan.
    // A more complex implementation would need remaining principal and tenure.
    const { principal, tenureYears } = currentLoan;

    const currentLoanSimulation = useMemo(() => runSimulation(currentLoan), [currentLoan]);
    const currentTotalInterest = currentLoanSimulation?.summary.totalInterestPaidBase ?? 0;

    const processedOffers = useMemo(() => {
        if (principal <= 0 || tenureYears <= 0 || !currentLoanSimulation) return [];
        
        return MOCK_OFFERS.map(offer => {
            if (offer.interestRate >= currentLoan.interestRate) return null; // Only show better offers

            const newEmi = calculateEMI(principal, offer.interestRate, tenureYears);
            const newTotalPayment = newEmi * tenureYears * 12;
            const newTotalInterest = newTotalPayment - principal;
            
            const processingFee = principal * (offer.processingFeePercent / 100);
            
            const newTotalCost = newTotalInterest + processingFee;
            
            const totalSavings = currentTotalInterest - newTotalCost;
            
            if (totalSavings <= 0) return null;

            return {
                ...offer,
                newEmi,
                totalSavings,
                processingFee,
            };
        }).filter((offer): offer is NonNullable<typeof offer> => offer !== null)
          .sort((a, b) => b.totalSavings - a.totalSavings); // Sort by highest savings

    }, [principal, tenureYears, currentLoan.interestRate, currentTotalInterest, currentLoanSimulation]);

    const bestOffer = processedOffers.length > 0 ? processedOffers[0] : null;

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                    <BanknotesIcon className="w-7 h-7 mr-3 text-emerald-500" />
                    Balance Transfer Comparison
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Compare offers from other banks to see how much you could save by transferring your home loan. Calculations are based on your current loan amount and tenure.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Current Loan Amount</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{formatCurrency(principal)}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Current Interest Rate</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{currentLoan.interestRate.toFixed(2)}%</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Loan Tenure</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{tenureYears.toFixed(1)} Years</p>
                    </div>
                </div>
            </div>

            {bestOffer && (
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg border-2 border-dashed border-emerald-500 text-center">
                    <ArrowDownCircleIcon className="w-10 h-10 text-emerald-500 mx-auto mb-2"/>
                    <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">Best Savings Found!</h3>
                    <p className="text-2xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 my-2">{formatCurrency(bestOffer.totalSavings)}</p>
                    <p className="text-emerald-700 dark:text-emerald-300">Potential savings with <span className="font-semibold">{bestOffer.name}'s</span> offer.</p>
                </div>
            )}
            
            {processedOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedOffers.map(offer => (
                         <div key={offer.id} className={`bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex flex-col justify-between border border-slate-200 dark:border-slate-700 transition-all relative ${offer === bestOffer ? 'border-2 border-emerald-500 scale-105' : 'hover:shadow-lg'}`}>
                            {offer === bestOffer && (
                                <div className="absolute -top-3 -right-3 flex items-center bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    <CheckBadgeIcon className="w-4 h-4 mr-1.5"/> Best Deal
                                </div>
                            )}
                            <div>
                                <div className="flex items-center mb-4">
                                    {offer.icon}
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 ml-3">{offer.name}</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">
                                        <span className="font-semibold text-slate-600 dark:text-slate-300">New Rate:</span>
                                        <span className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">{offer.interestRate.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">New EMI:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(offer.newEmi)}/mo</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Processing Fee:</span>
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(offer.processingFee)}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-600">
                                        <span className="font-bold text-slate-600 dark:text-slate-300">Total Savings:</span>
                                        <span className="font-bold text-lg text-green-600 dark:text-green-400">{formatCurrency(offer.totalSavings)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => onApplyOffer(offer.interestRate)}
                                className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-sm"
                            >
                                Apply in Simulator
                            </button>
                         </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md text-center border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">No Better Offers Found</h2>
                    <p className="text-slate-600 dark:text-slate-400">Based on our current data, your interest rate is already competitive. Great job!</p>
                </div>
            )}

            <div className="text-xs text-slate-500 dark:text-slate-500 text-center p-4 bg-slate-100 dark:bg-slate-900/40 rounded-md">
                <strong>Disclaimer:</strong> These offers are illustrative and for simulation purposes only. Actual rates, fees, and eligibility are determined by the respective banks and are subject to change. Always read the offer documents carefully before making a decision.
            </div>
        </div>
    );
};