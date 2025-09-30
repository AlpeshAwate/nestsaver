import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceDot, Label, Line } from 'recharts';
import { ChartDataPoint } from '../types';

interface SimulationChartProps {
  data: ChartDataPoint[];
  theme: 'light' | 'dark';
  loanFreeMonth: number | null;
}

const formatCurrencyForAxis = (value: number) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)} K`;
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const month = label;
        const years = Math.floor(month / 12);
        const remainingMonths = month % 12;
        
        const sortedPayload = [...payload].sort((a, b) => {
            const order = ['prepaymentLoanBalance', 'baseLoanBalance', 'sipNominalCorpus', 'sipRealCorpus'];
            return order.indexOf(a.dataKey) - order.indexOf(b.dataKey);
        });

        return (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-sm">
                <p className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {`Year ${years}, Month ${remainingMonths} (Total: ${month})`}
                </p>
                <ul className="space-y-1">
                    {sortedPayload.map((pld: any) => {
                         if (pld.value === 0 && month > 0) return null;
                         return (
                            <li key={pld.dataKey} style={{ color: pld.color }}>
                                <span className="font-semibold">{pld.name}: </span>
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(pld.value)}
                            </li>
                         )
                    })}
                </ul>
            </div>
        );
    }
    return null;
};

export const SimulationChart: React.FC<SimulationChartProps> = ({ data, theme, loanFreeMonth }) => {
    const colors = {
        stroke: theme === 'dark' ? '#475569' : '#cbd5e1', // slate-600 / slate-300
        text: theme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 / slate-500
        prepaymentLoan: '#10b981', // emerald-500
        baseLoan: '#f97316', // orange-500
        sipNominal: '#3b82f6', // blue-500
        sipReal: '#a855f7', // purple-500
        loanFreeDot: theme === 'dark' ? '#fde047' : '#f59e0b' // yellow-300 / amber-500
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md h-[500px] flex flex-col border border-slate-200 dark:border-slate-700">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Loan vs. Investment Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 20 }}>
                    <defs>
                        <linearGradient id="colorPrepaymentLoan" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={colors.prepaymentLoan} stopOpacity={0.6}/>
                            <stop offset="95%" stopColor={colors.prepaymentLoan} stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorSipNominal" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor={colors.sipNominal} stopOpacity={0.6}/>
                            <stop offset="95%" stopColor={colors.sipNominal} stopOpacity={0.05}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.stroke} />
                    <XAxis 
                        dataKey="month" 
                        tickFormatter={(month) => (month / 12).toFixed(2)} 
                        stroke={colors.text} 
                        tick={{ fontSize: 12 }} 
                        interval="preserveStartEnd"
                        padding={{ left: 20, right: 20 }}
                    >
                         <Label value="Years" offset={-15} position="insideBottom" fill={colors.text} fontSize={12} />
                    </XAxis>
                    <YAxis 
                        tickFormatter={formatCurrencyForAxis} 
                        stroke={colors.text} 
                        tick={{ fontSize: 12 }}
                        domain={[0, 'auto']}
                        allowDataOverflow
                    >
                        <Label value="Amount (₹)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill={colors.text} fontSize={12} />
                    </YAxis>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    
                    <Line type="monotone" dataKey="baseLoanBalance" name="Base Loan (Ref.)" stroke={colors.baseLoan} strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="sipRealCorpus" name="SIP (Real Value)" stroke={colors.sipReal} strokeWidth={2} dot={false} strokeDasharray="3 3" />

                    <Area type="monotone" dataKey="prepaymentLoanBalance" name="Prepayment Loan" stroke={colors.prepaymentLoan} fillOpacity={1} fill="url(#colorPrepaymentLoan)" strokeWidth={2} dot={false} />
                    <Area type="monotone" dataKey="sipNominalCorpus" name="SIP Corpus (Nominal)" stroke={colors.sipNominal} fillOpacity={1} fill="url(#colorSipNominal)" strokeWidth={2} dot={false} />
                    
                    {loanFreeMonth && data[loanFreeMonth] && (
                        <ReferenceLine x={loanFreeMonth} stroke={colors.loanFreeDot} strokeDasharray="4 4">
                            <Label value={`Loan-Free in ${(loanFreeMonth / 12).toFixed(1)} Yrs`} position="insideTop" fill={colors.text} fontSize={12} dy={-10} />
                        </ReferenceLine>
                    )}
                     {loanFreeMonth && data[loanFreeMonth] && (
                        <ReferenceDot 
                            x={loanFreeMonth} 
                            y={data[loanFreeMonth].sipNominalCorpus}
                            r={6} 
                            fill={colors.loanFreeDot} 
                            stroke={theme === 'dark' ? '#1e293b' : '#ffffff'}
                            strokeWidth={2}
                        />
                     )}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};