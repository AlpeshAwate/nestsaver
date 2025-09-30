import React, { useState, useMemo } from 'react';
import { SimulationInput } from '../types';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, CheckCircleIcon } from './icons';

interface FundExplorerProps {
  onSelectFund: (rate: number) => void;
}

interface Fund {
    id: string;
    name: string;
    fundHouse: string;
    category: 'Equity' | 'Debt' | 'Hybrid' | 'Index Fund';
    subCategory: string;
    riskLevel: 'Low' | 'Moderate' | 'High';
    returns: {
        oneYear: number;
        threeYear: number;
        fiveYear: number;
    };
}

const MOCK_FUNDS: Fund[] = [
    { id: '1', name: 'HBFC Bluechip Fund', fundHouse: 'HBFC AMC', category: 'Equity', subCategory: 'Large Cap', riskLevel: 'High', returns: { oneYear: 25.5, threeYear: 18.2, fiveYear: 15.8 } },
    { id: '2', name: 'ICI Prudential Gilt Fund', fundHouse: 'ICI Prudential', category: 'Debt', subCategory: 'Gilt', riskLevel: 'Low', returns: { oneYear: 7.2, threeYear: 6.8, fiveYear: 7.5 } },
    { id: '3', name: 'Axis Balanced Advantage Fund', fundHouse: 'Axis AMC', category: 'Hybrid', subCategory: 'Dynamic Asset Allocation', riskLevel: 'Moderate', returns: { oneYear: 15.1, threeYear: 12.5, fiveYear: 11.9 } },
    { id: '4', name: 'UTI Nifty 50 Index Fund', fundHouse: 'UTI Mutual Fund', category: 'Index Fund', subCategory: 'Large Cap', riskLevel: 'High', returns: { oneYear: 22.8, threeYear: 16.5, fiveYear: 14.9 } },
    { id: '5', name: 'Quant Small Cap Fund', fundHouse: 'Quant AMC', category: 'Equity', subCategory: 'Small Cap', riskLevel: 'High', returns: { oneYear: 45.2, threeYear: 42.1, fiveYear: 35.5 } },
    { id: '6', name: 'Parag Parikh Flexi Cap Fund', fundHouse: 'PPFAS AMC', category: 'Equity', subCategory: 'Flexi Cap', riskLevel: 'High', returns: { oneYear: 30.1, threeYear: 21.3, fiveYear: 19.8 } },
    { id: '7', name: 'SBI Magnum Constant Maturity', fundHouse: 'SBI Mutual Fund', category: 'Debt', subCategory: 'Constant Maturity', riskLevel: 'Moderate', returns: { oneYear: 6.8, threeYear: 6.2, fiveYear: 7.1 } },
    { id: '8', name: 'Mirae Asset Hybrid Equity Fund', fundHouse: 'Mirae Asset', category: 'Hybrid', subCategory: 'Aggressive Hybrid', riskLevel: 'High', returns: { oneYear: 18.9, threeYear: 14.8, fiveYear: 13.5 } },
    { id: '9', name: 'Motilal Oswal S&P 500 Index', fundHouse: 'Motilal Oswal', category: 'Index Fund', subCategory: 'International', riskLevel: 'High', returns: { oneYear: 28.3, threeYear: 15.1, fiveYear: 16.2 } },
    { id: '10', name: 'Kotak Liquid Fund', fundHouse: 'Kotak Mahindra', category: 'Debt', subCategory: 'Liquid', riskLevel: 'Low', returns: { oneYear: 7.0, threeYear: 5.5, fiveYear: 5.8 } },
];

const FUND_CATEGORIES: Fund['category'][] = ['Equity', 'Debt', 'Hybrid', 'Index Fund'];
const RISK_LEVELS: Fund['riskLevel'][] = ['Low', 'Moderate', 'High'];
const SORT_OPTIONS = [
    { value: 'fiveYear_desc', label: '5Y Return (High to Low)' },
    { value: 'fiveYear_asc', label: '5Y Return (Low to High)' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
];

const RiskBadge: React.FC<{ level: Fund['riskLevel'] }> = ({ level }) => {
    const styles = {
        Low: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200',
        Moderate: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
        High: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200',
    };
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[level]}`}>{level} Risk</span>;
};

export const FundExplorer: React.FC<FundExplorerProps> = ({ onSelectFund }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Fund['category'] | 'All'>('All');
    const [riskFilter, setRiskFilter] = useState<Fund['riskLevel'] | 'All'>('All');
    const [sortOption, setSortOption] = useState(SORT_OPTIONS[0].value);
    const [appliedFundId, setAppliedFundId] = useState<string | null>(null);

    const filteredAndSortedFunds = useMemo(() => {
        let funds = MOCK_FUNDS.filter(fund => {
            const matchesCategory = categoryFilter === 'All' || fund.category === categoryFilter;
            const matchesRisk = riskFilter === 'All' || fund.riskLevel === riskFilter;
            const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) || fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesRisk && matchesSearch;
        });

        const [sortBy, order] = sortOption.split('_');

        funds.sort((a, b) => {
            if (sortBy === 'name') {
                return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            if (sortBy === 'fiveYear') {
                return order === 'asc' ? a.returns.fiveYear - b.returns.fiveYear : b.returns.fiveYear - a.returns.fiveYear;
            }
            return 0;
        });
        
        return funds;
    }, [searchQuery, categoryFilter, riskFilter, sortOption]);
    
    const handleApply = (fund: Fund) => {
        onSelectFund(fund.returns.fiveYear);
        setAppliedFundId(fund.id);
        setTimeout(() => setAppliedFundId(null), 2000); // Reset after 2 seconds
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Fund Explorer</h2>
                <p className="text-slate-600 dark:text-slate-400">Discover and compare mutual funds for your SIP investments. Click "Apply to Simulator" to see the potential impact of a fund on your financial goals.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name or AMC..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 pl-10 pr-3 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        />
                    </div>
                    {/* Sort */}
                    <div>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-2 px-3 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        >
                            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
                 {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Category:</span>
                        <div className="flex items-center bg-slate-200 dark:bg-slate-600 rounded-md p-0.5 text-xs">
                            <button onClick={() => setCategoryFilter('All')} className={`px-2 py-0.5 rounded-sm transition-colors ${categoryFilter === 'All' ? 'bg-white dark:bg-slate-800 font-semibold shadow-sm' : ''}`}>All</button>
                            {FUND_CATEGORIES.map(cat => (
                                <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-2 py-0.5 rounded-sm transition-colors ${categoryFilter === cat ? 'bg-white dark:bg-slate-800 font-semibold shadow-sm' : ''}`}>{cat}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Risk:</span>
                         <div className="flex items-center bg-slate-200 dark:bg-slate-600 rounded-md p-0.5 text-xs">
                            <button onClick={() => setRiskFilter('All')} className={`px-2 py-0.5 rounded-sm transition-colors ${riskFilter === 'All' ? 'bg-white dark:bg-slate-800 font-semibold shadow-sm' : ''}`}>All</button>
                            {RISK_LEVELS.map(risk => (
                                <button key={risk} onClick={() => setRiskFilter(risk)} className={`px-2 py-0.5 rounded-sm transition-colors ${riskFilter === risk ? 'bg-white dark:bg-slate-800 font-semibold shadow-sm' : ''}`}>{risk}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedFunds.map(fund => (
                    <div key={fund.id} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex flex-col justify-between border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 pr-2">{fund.name}</h3>
                                <RiskBadge level={fund.riskLevel} />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{fund.fundHouse} • {fund.category} - {fund.subCategory}</p>
                            
                            <div className="text-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md">
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">5-Year CAGR</p>
                                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{fund.returns.fiveYear.toFixed(2)}%</p>
                            </div>

                            <div className="flex justify-around mt-4 text-center text-sm">
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">1Y</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">{fund.returns.oneYear.toFixed(2)}%</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400">3Y</p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">{fund.returns.threeYear.toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleApply(fund)}
                            className={`w-full mt-5 font-bold py-2.5 px-4 rounded-md transition-colors text-sm flex items-center justify-center ${
                                appliedFundId === fund.id 
                                ? 'bg-green-600 text-white' 
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                        >
                            {appliedFundId === fund.id ? (
                                <><CheckCircleIcon className="w-5 h-5 mr-2"/> Applied!</>
                            ) : (
                                'Apply to Simulator'
                            )}
                        </button>
                    </div>
                ))}
            </div>

             {filteredAndSortedFunds.length === 0 && (
                <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Funds Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filter criteria.</p>
                </div>
            )}

            <div className="text-xs text-slate-500 dark:text-slate-500 text-center p-4 bg-slate-100 dark:bg-slate-900/40 rounded-md">
                <strong>Disclaimer:</strong> Mutual fund data is for illustrative purposes only. Past performance is not indicative of future returns. Investments are subject to market risks.
            </div>
        </div>
    );
};
