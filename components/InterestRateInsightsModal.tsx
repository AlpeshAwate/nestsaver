import React, { useState, useMemo, useEffect } from 'react';
import { ModalTab } from '../types';
import { XMarkIcon, InformationCircleIcon, AcademicCapIcon, UsersIcon, ArrowTrendingUpIcon, CheckCircleIcon, ExclamationTriangleIcon, LightBulbIcon, ArrowsRightLeftIcon, ReceiptPercentIcon } from './icons';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Label } from 'recharts';

interface InterestRateInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInterestRate: number;
  principal: number;
  onSwitchTab: (tabName: 'Simulator' | 'Balance Transfer') => void;
  initialTab?: ModalTab;
}

const repoRateHistory = [
  { date: 'May 20', rate: 4.00 },
  { date: 'May 22', rate: 4.40 },
  { date: 'Jun 22', rate: 4.90 },
  { date: 'Aug 22', rate: 5.40 },
  { date: 'Sep 22', rate: 5.90 },
  { date: 'Dec 22', rate: 6.25 },
  { date: 'Feb 23', rate: 6.50 },
  { date: 'Apr 24', rate: 6.50 },
];

const MARKET_BENCHMARK_RATE = 8.5;

const benchmarkDistributionData = [
  { rate: (MARKET_BENCHMARK_RATE - 0.75).toFixed(2) + '%', borrowers: 5 },
  { rate: (MARKET_BENCHMARK_RATE - 0.50).toFixed(2) + '%', borrowers: 15 },
  { rate: (MARKET_BENCHMARK_RATE - 0.25).toFixed(2) + '%', borrowers: 30 },
  { rate: (MARKET_BENCHMARK_RATE).toFixed(2) + '%', borrowers: 40 },
  { rate: (MARKET_BENCHMARK_RATE + 0.25).toFixed(2) + '%', borrowers: 30 },
  { rate: (MARKET_BENCHMARK_RATE + 0.50).toFixed(2) + '%', borrowers: 15 },
  { rate: (MARKET_BENCHMARK_RATE + 0.75).toFixed(2) + '%', borrowers: 5 },
];

const incomeSlabs = [
    { id: '7L', label: 'Upto ₹7L', rate: 0 },
    { id: '10L', label: '₹7L - ₹10L', rate: 0.15 },
    { id: '15L', label: '₹10L - ₹15L', rate: 0.20 },
    { id: '15L+', label: '> ₹15L', rate: 0.30 },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
};

const LearnSection: React.FC<{onNavigateToTax: () => void}> = ({ onNavigateToTax }) => (
    <div className="space-y-6">
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">What is the RBI Repo Rate?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Repo Rate is the interest rate at which the Reserve Bank of India (RBI) lends money to commercial banks. It's a key tool used by the RBI to control inflation and manage the country's money supply.</p>
        </div>
        <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">How does it affect my Home Loan?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Most home loans today have floating interest rates linked to an external benchmark, which is often the RBI's Repo Rate. When the RBI changes the Repo Rate, your bank adjusts its lending rates accordingly. A lower Repo Rate can lead to lower EMIs, while a higher rate can increase them.</p>
        </div>
        <div className="h-64">
            <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">Historical RBI Repo Rate (%)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={repoRateHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(2px)', border: '1px solid #e2e8f0', color: '#1e293b' }} />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">Did you know about tax savings?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 my-2">You can also claim deductions on interest and principal payments for your home loan.</p>
            <button
                onClick={onNavigateToTax}
                className="font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
                Learn More About Tax Benefits &rarr;
            </button>
        </div>
    </div>
);

const BenchmarkSection: React.FC<{userRate: number}> = ({ userRate }) => {
    const userRateBucketIndex = useMemo(() => {
        let closestIndex = -1;
        let minDiff = Infinity;
        benchmarkDistributionData.forEach((d, i) => {
            const rateValue = parseFloat(d.rate);
            const diff = Math.abs(userRate - rateValue);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        });
        return closestIndex;
    }, [userRate]);

    const insight = useMemo(() => {
        if (userRate <= MARKET_BENCHMARK_RATE) {
            return {
                title: "Great Rate!",
                message: "Congratulations! Your interest rate is competitive and at or below the current market average. You're on a great track to save on interest.",
                Icon: CheckCircleIcon,
                className: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-500",
            };
        }
        return {
            title: "Opportunity Detected!",
            message: "Your interest rate appears higher than the market average. This could be due to your loan being older or changes in market conditions. You have a significant opportunity to save by exploring other options.",
            Icon: ExclamationTriangleIcon,
            className: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-500",
        };
    }, [userRate]);
    
    return (
        <div className="space-y-6">
            <div className="h-72">
                 <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">How Your Rate Compares to the Market</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkDistributionData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                        <XAxis dataKey="rate" stroke="#64748b" tick={{ fontSize: 12 }}>
                            <Label value="Interest Rate Bins" offset={-15} position="insideBottom" fill="#64748b" fontSize={12} />
                        </XAxis>
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} label={{ value: '% of Borrowers', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12, dx: 10 }} />
                        <Tooltip cursor={{fill: 'rgba(128,128,128,0.1)'}} contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(2px)', border: '1px solid #e2e8f0', color: '#1e293b' }} />
                        <Bar dataKey="borrowers" name="% of Borrowers">
                            {benchmarkDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === userRateBucketIndex ? "#f59e0b" : "#34d399"} />
                            ))}
                             {userRateBucketIndex !== -1 && (
                                <Label
                                    content={
                                        <foreignObject x={((userRateBucketIndex + 0.5) / benchmarkDistributionData.length) * 100 + '%'} y="-20" width="100" height="20">
                                            <div style={{ textAlign: 'center', fontSize: '12px', color: '#f59e0b', fontWeight: 'bold' }}>Your Rate: {userRate.toFixed(2)}%</div>
                                        </foreignObject>
                                    }
                                />
                             )}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div className={`p-4 rounded-md flex items-start border-l-4 ${insight.className}`}>
                <insight.Icon className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold">{insight.title}</h4>
                    <p className="text-sm">{insight.message}</p>
                </div>
            </div>
        </div>
    )
};

const TaxBenefitsSection: React.FC<{ principal: number; userInterestRate: number }> = ({ principal, userInterestRate }) => {
    const [activeSlabId, setActiveSlabId] = useState(incomeSlabs[incomeSlabs.length - 1].id);

    const taxCalcs = useMemo(() => {
        let balance = principal;
        let totalInterest = 0;
        const monthlyRate = userInterestRate / 12 / 100;
        // Simplified EMI calculation for this estimation
        const tenureMonths = 20 * 12; 
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
        
        if (!isFinite(emi) || emi <= 0 || principal <= 0 || userInterestRate <= 0) {
            return { annualInterest: 0, deductibleInterest: 0, potentialSavings: 0 };
        }

        for (let i = 0; i < 12; i++) {
            const interestPaid = balance * monthlyRate;
            totalInterest += interestPaid;
            balance -= (emi - interestPaid);
        }

        const deductibleInterest = Math.min(totalInterest, 200000);
        const slab = incomeSlabs.find(s => s.id === activeSlabId);
        const taxRate = slab ? slab.rate : 0;
        const potentialSavings = deductibleInterest * taxRate * 1.04; // Including 4% cess

        return { annualInterest: totalInterest, deductibleInterest, potentialSavings };

    }, [principal, userInterestRate, activeSlabId]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Home Loan Tax Benefits</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">The Indian Income Tax Act offers significant benefits for home loan borrowers. You can claim deductions on both the interest and principal components of your EMI.</p>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                    <li><b>Section 24(b):</b> Deduction of up to ₹2,00,000 per year on the interest paid.</li>
                    <li><b>Section 80C:</b> Deduction of up to ₹1,50,000 per year on the principal repaid (this limit is shared with other investments like PF, ELSS, etc.).</li>
                </ul>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                 <h4 className="text-md font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">Estimate Your Annual Savings</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">1. Select your approximate annual income slab (as per the new tax regime):</p>
                 <div className="flex justify-center space-x-2 mb-4">
                    {incomeSlabs.map((slab) => (
                        <button
                            key={slab.id}
                            onClick={() => setActiveSlabId(slab.id)}
                            className={`flex-1 text-center py-2 px-2 rounded-md transition-all duration-200 text-xs ${
                            activeSlabId === slab.id
                                ? 'bg-emerald-600 text-white font-bold shadow-md transform -translate-y-0.5'
                                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'
                            }`}
                        >
                           {slab.label}
                        </button>
                    ))}
                 </div>

                 <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 text-center">2. Here are your estimated savings based on interest deduction under Section 24(b):</p>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-md">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Est. Annual Interest</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{formatCurrency(taxCalcs.annualInterest)}</p>
                    </div>
                    <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-md">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Max Deductible Interest</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{formatCurrency(taxCalcs.deductibleInterest)}</p>
                    </div>
                     <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-md border border-emerald-500/50">
                        <p className="text-xs text-emerald-800 dark:text-emerald-200">Potential Tax Saved</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(taxCalcs.potentialSavings)}</p>
                    </div>
                 </div>
            </div>

             <div className="text-xs text-slate-500 dark:text-slate-500 text-center p-2 bg-slate-100 dark:bg-slate-900/40 rounded-md">
                <strong>Disclaimer:</strong> This is an illustrative calculation for educational purposes only. Tax laws are subject to change. Please consult a qualified tax advisor for accurate financial planning.
            </div>
        </div>
    );
};


const ActionsSection: React.FC<{ onSwitchTab: InterestRateInsightsModalProps['onSwitchTab']; onClose: () => void; }> = ({ onSwitchTab, onClose }) => (
    <div className="space-y-6">
        <div className="text-center">
             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-1">Take Control of Your Loan</h3>
             <p className="text-sm text-slate-600 dark:text-slate-400">Here are some steps you can take to lower your interest burden and build wealth faster.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg text-center flex flex-col items-center">
                <LightBulbIcon className="w-8 h-8 text-emerald-500 mb-2"/>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Simulate Savings</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 my-2 flex-grow">Use our powerful simulator to see how prepayments and investments can drastically reduce your loan tenure.</p>
                <button 
                    onClick={() => { onSwitchTab('Simulator'); onClose(); }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm mt-2">
                    Go to Simulator
                </button>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg text-center flex flex-col items-center">
                <ArrowsRightLeftIcon className="w-8 h-8 text-emerald-500 mb-2"/>
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Explore Balance Transfer</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 my-2 flex-grow">Compare offers from other lenders who might provide a lower interest rate. We'll help you see the real savings.</p>
                 <button 
                    onClick={() => { onSwitchTab('Balance Transfer'); onClose(); }}
                    className="w-full bg-white dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 border border-emerald-500 text-emerald-600 dark:text-emerald-300 font-semibold py-2 px-3 rounded-md transition-colors text-sm mt-2">
                    Compare Offers
                </button>
            </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-500 text-center p-4 bg-slate-100 dark:bg-slate-900/40 rounded-md">
            <strong>Note:</strong> A balance transfer can lead to significant savings, but always consider processing fees and other charges. Our Balance Transfer tool (coming soon) will help you compare options transparently.
        </div>
    </div>
);

const TABS: { id: ModalTab, name: string, icon: React.ReactNode }[] = [
    { id: 'learn', name: 'Learn & Explore', icon: <AcademicCapIcon className="w-5 h-5 mr-2" /> },
    { id: 'benchmark', name: 'Personal Benchmark', icon: <UsersIcon className="w-5 h-5 mr-2" /> },
    { id: 'tax', name: 'Tax Benefits', icon: <ReceiptPercentIcon className="w-5 h-5 mr-2" /> },
    { id: 'actions', name: 'Next Steps', icon: <ArrowTrendingUpIcon className="w-5 h-5 mr-2" /> },
]

export const InterestRateInsightsModal: React.FC<InterestRateInsightsModalProps> = ({ isOpen, onClose, userInterestRate, principal, onSwitchTab, initialTab }) => {
    const [activeTab, setActiveTab] = useState<ModalTab>(initialTab || 'learn');

    useEffect(() => {
        if (initialTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);
  
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center"><InformationCircleIcon className="w-6 h-6 mr-3 text-emerald-500" />Smart Interest Rate Insights</h2>
                    <button onClick={onClose} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                 <div className="p-2 bg-slate-100 dark:bg-slate-900/50 flex-shrink-0 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex justify-center space-x-2">
                        {TABS.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)} 
                                className={`flex-1 py-2 px-3 text-center font-semibold rounded-md transition-colors text-sm flex items-center justify-center ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50'}`}
                            >
                                {tab.icon} {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    {activeTab === 'learn' && <LearnSection onNavigateToTax={() => setActiveTab('tax')} />}
                    {activeTab === 'benchmark' && <BenchmarkSection userRate={userInterestRate}/>}
                    {activeTab === 'tax' && <TaxBenefitsSection principal={principal} userInterestRate={userInterestRate} />}
                    {activeTab === 'actions' && <ActionsSection onSwitchTab={onSwitchTab} onClose={onClose}/>}
                </div>
            </div>
        </div>
    );
};