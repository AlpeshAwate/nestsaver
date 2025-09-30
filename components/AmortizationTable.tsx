import React, { useState, useMemo, useEffect } from 'react';
import { AmortizationDataPoint } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface AmortizationTableProps {
  data: AmortizationDataPoint[];
}

interface YearlyDataPoint {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalInterest: number;
  endingBalance: number;
}


const ROWS_PER_PAGE = 12;

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const yearlyData = useMemo<YearlyDataPoint[]>(() => {
    if (viewMode !== 'yearly' || !data || data.length === 0) return [];
    
    const yearlySummary: YearlyDataPoint[] = [];
    const numYears = Math.ceil(data.length / 12);

    for (let year = 1; year <= numYears; year++) {
      const startIndex = (year - 1) * 12;
      const endIndex = year * 12;
      const yearChunk = data.slice(startIndex, endIndex);

      if (yearChunk.length > 0) {
        const lastMonthOfYear = yearChunk[yearChunk.length - 1];
        yearlySummary.push({
          year: year,
          principalPaid: yearChunk.reduce((acc, row) => acc + row.principalPaid, 0),
          interestPaid: yearChunk.reduce((acc, row) => acc + row.interestPaid, 0),
          totalInterest: lastMonthOfYear.totalInterest,
          endingBalance: lastMonthOfYear.endingBalance,
        });
      }
    }
    return yearlySummary;
  }, [data, viewMode]);

  const totalPages = viewMode === 'monthly' ? Math.ceil(data.length / ROWS_PER_PAGE) : 1;

  const paginatedData = useMemo(() => {
    if (viewMode !== 'monthly') return [];
    return data.slice(
      (currentPage - 1) * ROWS_PER_PAGE,
      currentPage * ROWS_PER_PAGE
    );
  }, [data, currentPage, viewMode]);

  const displayData = viewMode === 'monthly' ? paginatedData : yearlyData;

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Amortization Schedule (Base Loan)</h3>
        <div className="flex items-center bg-slate-200 dark:bg-slate-700 rounded-md p-0.5 text-xs self-start sm:self-center">
            {(['Monthly', 'Yearly'] as const).map(mode => (
            <button
                key={mode}
                onClick={() => setViewMode(mode.toLowerCase() as 'monthly' | 'yearly')}
                className={`px-3 py-1.5 rounded-sm transition-colors ${
                viewMode === mode.toLowerCase()
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-600/50'
                }`}
                aria-pressed={viewMode === mode.toLowerCase()}
            >
                {mode}
            </button>
            ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
          <thead className="text-xs text-slate-600 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3">{viewMode === 'monthly' ? 'Month' : 'Year'}</th>
              <th scope="col" className="px-6 py-3">Principal Paid</th>
              <th scope="col" className="px-6 py-3">Interest Paid</th>
              <th scope="col" className="px-6 py-3">Total Interest Paid</th>
              <th scope="col" className="px-6 py-3">Ending Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => (
              <tr key={viewMode === 'monthly' ? (row as AmortizationDataPoint).month : (row as YearlyDataPoint).year} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{viewMode === 'monthly' ? (row as AmortizationDataPoint).month : (row as YearlyDataPoint).year}</td>
                <td className="px-6 py-4">{formatCurrency(row.principalPaid)}</td>
                <td className="px-6 py-4 text-red-600 dark:text-red-400">{formatCurrency(row.interestPaid)}</td>
                <td className="px-6 py-4">{formatCurrency(row.totalInterest)}</td>
                <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(row.endingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {viewMode === 'monthly' && totalPages > 1 && (
        <div className="flex justify-between items-center pt-4 text-sm text-slate-600 dark:text-slate-400">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center space-x-2">
            <button onClick={() => goToPage(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">First</button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRightIcon className="w-5 h-5" />
            </button>
            <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">Last</button>
            </div>
        </div>
      )}
    </div>
  );
};