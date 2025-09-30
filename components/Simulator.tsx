import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SimulationInput, SimulationOutput } from '../types';
import { runSimulation, calculateEMI, calculateTenure, calculateInterestRate } from '../services/simulationService';
import { InputSlider } from './InputSlider';
import { StrategyCards } from './StrategyCards';
import { SimulationChart } from './SimulationChart';
import { AmortizationTable } from './AmortizationTable';
import { ArrowPathIcon, CalculatorIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from './icons';

interface SimulatorProps {
  inputs: SimulationInput;
  onInputsChange: (inputs: SimulationInput) => void;
  defaultValues: SimulationInput;
  onTaxInsightsRequest: () => void;
  theme: 'light' | 'dark';
}

const MARKET_BENCHMARK_RATE = 8.5;
const BEST_OFFER_RATE = 8.0;
const RBI_REPO_RATE = 6.5;

type CalculableField = 'interestRate' | 'tenureYears' | 'monthlyEMI';

const SIP_RISK_CATEGORIES = [
  { name: 'Conservative', rate: 7 },
  { name: 'Moderate', rate: 10 },
  { name: 'Aggressive', rate: 16 },
];

const validateInputs = (inputs: SimulationInput): Partial<Record<keyof SimulationInput, string>> => {
    const errors: Partial<Record<keyof SimulationInput, string>> = {};
    const { principal, interestRate, tenureYears, monthlyEMI, extraAnnualPrepayment, monthlySIP, sipReturnRate, inflationRate } = inputs;

    // Loan Amount
    if (principal < 100000) {
        errors.principal = 'Amount must be at least ₹1,00,000.';
    } else if (principal > 20000000) {
        errors.principal = 'Amount cannot exceed ₹2,00,00,000.';
    }

    // Interest Rate
    if (interestRate <= 0) {
        errors.interestRate = 'Rate must be a positive number.';
    } else if (interestRate > 25) {
        errors.interestRate = 'Rate above 25% is unlikely. Please check.';
    }

    // Tenure
    if (tenureYears <= 0) {
        errors.tenureYears = 'Tenure must be a positive number.';
    } else if (tenureYears > 30) {
        errors.tenureYears = 'Tenure cannot be more than 30 years.';
    }

    // Monthly EMI
    if (monthlyEMI < 0) {
        errors.monthlyEMI = 'EMI must be a positive number.';
    } else if (principal > 0 && interestRate > 0 && monthlyEMI > 0) {
        const monthlyInterest = principal * (interestRate / 12 / 100);
        if (monthlyEMI <= monthlyInterest) {
            errors.monthlyEMI = `EMI must be > ₹${monthlyInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })} to cover interest.`;
        }
    }
    
    // Extra Annual Prepayment
    if (extraAnnualPrepayment < 0) {
        errors.extraAnnualPrepayment = 'Cannot be negative.';
    } else if (extraAnnualPrepayment > principal && principal > 0) {
        errors.extraAnnualPrepayment = 'Cannot be more than the loan amount.';
    }

    // Monthly SIP
    if (monthlySIP < 0) {
        errors.monthlySIP = 'Cannot be negative.';
    }

    // SIP Return Rate
    if (sipReturnRate <= 0 && monthlySIP > 0) {
        errors.sipReturnRate = 'Return rate must be positive for SIP.';
    } else if (sipReturnRate > 40) {
        errors.sipReturnRate = 'Returns above 40% are optimistic. Please check.';
    }

    // Inflation Rate
    if (inflationRate < 0) {
        errors.inflationRate = 'Cannot be negative.';
    } else if (inflationRate > 15) {
        errors.inflationRate = 'Inflation above 15% is high. Please check.';
    }

    return errors;
};


export const Simulator: React.FC<SimulatorProps> = ({ inputs, onInputsChange, defaultValues, onTaxInsightsRequest, theme }) => {
  const [calculatedField, setCalculatedField] = useState<CalculableField>('monthlyEMI');
  const [justCalculated, setJustCalculated] = useState<string | null>(null);
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [activeSipCategory, setActiveSipCategory] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SimulationInput, string>>>({});

  const triggerHighlight = useCallback((field: string) => {
    setJustCalculated(field);
    setTimeout(() => setJustCalculated(null), 1200);
  }, []);

  useEffect(() => {
    const matchingCategory = SIP_RISK_CATEGORIES.find(c => c.rate === inputs.sipReturnRate);
    if (matchingCategory) {
      setActiveSipCategory(matchingCategory.name);
    } else if (inputs.sipReturnRate > 0) {
      setActiveSipCategory('Custom');
    } else {
      setActiveSipCategory(null);
    }
  }, [inputs.sipReturnRate]);

  // Main effect for validation and recalculation
  useEffect(() => {
    const validationErrors = validateInputs(inputs);
    
    const { principal, interestRate, tenureYears, monthlyEMI } = inputs;

    const prereqsMet = 
        principal > 0 && 
        !validationErrors.principal &&
        (calculatedField !== 'interestRate' ? (interestRate > 0 && !validationErrors.interestRate) : true) &&
        (calculatedField !== 'tenureYears' ? (tenureYears > 0 && !validationErrors.tenureYears) : true) &&
        (calculatedField !== 'monthlyEMI' ? (monthlyEMI > 0 && !validationErrors.monthlyEMI) : true);

    let finalInputs = { ...inputs };
    let inputsChanged = false;

    if (prereqsMet) {
        if (calculatedField === 'monthlyEMI') {
            const calculatedValue = calculateEMI(principal, interestRate, tenureYears);
            if (!isFinite(calculatedValue) || calculatedValue <= 0) {
                validationErrors.monthlyEMI = "Cannot calculate a valid EMI.";
            } else if (Math.round(calculatedValue) !== Math.round(monthlyEMI)) {
                finalInputs = { ...finalInputs, monthlyEMI: calculatedValue };
                triggerHighlight(calculatedField);
                inputsChanged = true;
            }
        } else if (calculatedField === 'tenureYears') {
            const calculatedValue = calculateTenure(principal, interestRate, monthlyEMI);
            if (!isFinite(calculatedValue) || calculatedValue <= 0) {
                validationErrors.monthlyEMI = "With this EMI, the loan will never be repaid.";
            } else if (calculatedValue > 30) {
                const minEmiFor30Years = calculateEMI(principal, interestRate, 30);
                validationErrors.monthlyEMI = `For a 30-yr tenure, EMI must be at least ₹${minEmiFor30Years.toLocaleString('en-IN', {maximumFractionDigits: 0})}.`;
                finalInputs = { ...finalInputs, tenureYears: 0 }; // Invalidate tenure
                inputsChanged = true;
            } else if (Math.abs(calculatedValue - tenureYears) > 0.01) {
                finalInputs = { ...finalInputs, tenureYears: calculatedValue };
                triggerHighlight(calculatedField);
                inputsChanged = true;
            }
        } else if (calculatedField === 'interestRate') {
            const calculatedValue = calculateInterestRate(principal, tenureYears, monthlyEMI);
            if (!isFinite(calculatedValue) || calculatedValue <= 0 || calculatedValue > 50) {
                validationErrors.interestRate = "Cannot calculate a realistic rate with these inputs.";
            } else if (Math.abs(calculatedValue - interestRate) > 0.01) {
                finalInputs = { ...finalInputs, interestRate: calculatedValue };
                triggerHighlight(calculatedField);
                inputsChanged = true;
            }
        }
    }

    setErrors(validationErrors);
    
    if (inputsChanged) {
        onInputsChange(finalInputs);
    }
  }, [inputs, calculatedField, onInputsChange, triggerHighlight]);

  const handleInputChange = useCallback((field: keyof SimulationInput, value: number) => {
    onInputsChange({ ...inputs, [field]: value });
  }, [inputs, onInputsChange]);


  const handleSipCategorySelect = (category: { name: string; rate: number }) => {
    handleInputChange('sipReturnRate', category.rate);
  };

  const simulationResults: SimulationOutput | null = useMemo(() => {
    if (inputs.principal > 0 && inputs.interestRate > 0 && inputs.tenureYears > 0 && inputs.monthlyEMI > 0 && Object.keys(errors).length === 0) {
      return runSimulation(inputs);
    }
    return null;
  }, [inputs, errors]);

  const resetDefaults = () => {
    onInputsChange(defaultValues);
    setCalculatedField('monthlyEMI');
    setTenureUnit('years');
    setErrors({});
  };

  const rateInsight = useMemo(() => {
    if (inputs.interestRate <= 0 || calculatedField === 'interestRate' || errors.interestRate) {
      return null;
    }

    if (inputs.interestRate < RBI_REPO_RATE) {
      return {
        type: 'error' as const,
        message: `Interest rate is unlikely to be lower than the current RBI Repo Rate (${RBI_REPO_RATE}%). Please check your input.`,
        icon: <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />,
        className: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200',
      };
    }

    if (inputs.interestRate > MARKET_BENCHMARK_RATE) {
      return {
        type: 'warning' as const,
        message: `Your rate appears higher than the current market average (~${MARKET_BENCHMARK_RATE}%). Consider talking to your bank or exploring a balance transfer.`,
        icon: <ExclamationTriangleIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />,
        className: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200',
      };
    }

    return {
      type: 'success' as const,
      message: `Your interest rate looks competitive against the current market average!`,
      icon: <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />,
      className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200',
    };
  }, [inputs.interestRate, calculatedField, errors.interestRate]);

  const tenureProps = useMemo(() => {
    const isYears = tenureUnit === 'years';
    return {
        value: isYears ? parseFloat(inputs.tenureYears.toFixed(1)) : Math.round(inputs.tenureYears * 12),
        min: isYears ? 1 : 12,
        max: isYears ? 30 : 360,
        step: 1,
        placeholder: isYears ? 'Enter Years' : 'Enter Months',
        onChange: (v: number) => handleInputChange('tenureYears', isYears ? v : v / 12),
    };
  }, [tenureUnit, inputs.tenureYears, handleInputChange]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-6 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center gap-2">
             <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center shrink-0"><CalculatorIcon className="w-6 h-6 mr-2 text-emerald-500" /> Loan & Investment</h2>
             <button onClick={resetDefaults} className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition flex items-center">
                    <ArrowPathIcon className="w-4 h-4 mr-1"/> Reset
            </button>
          </div>
          
          <InputSlider label="Loan Amount (₹)" value={inputs.principal} onChange={(v) => handleInputChange('principal', v)} min={100000} max={20000000} step={100000} format="currency" error={errors.principal} />
          
          <div className="space-y-4 bg-slate-100/70 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-center text-slate-600 dark:text-slate-400">Adjust any two values, and we'll calculate the third. Click the <CalculatorIcon className="w-3 h-3 inline-block"/> icon to choose what to solve for.</p>
            <InputSlider 
              label="Interest Rate (%)" 
              value={inputs.interestRate} 
              onChange={(v) => handleInputChange('interestRate', v)} 
              min={RBI_REPO_RATE} max={20} step={0.05} format="percent"
              isBeingCalculated={calculatedField === 'interestRate'}
              onSelectToCalculate={() => setCalculatedField('interestRate')}
              wasJustCalculated={justCalculated === 'interestRate'}
              placeholder="Enter Rate"
              error={errors.interestRate}
            />
            
            <InputSlider 
              label="Tenure" 
              value={tenureProps.value} 
              onChange={tenureProps.onChange} 
              min={tenureProps.min} max={tenureProps.max} step={tenureProps.step}
              isBeingCalculated={calculatedField === 'tenureYears'}
              onSelectToCalculate={() => setCalculatedField('tenureYears')}
              wasJustCalculated={justCalculated === 'tenureYears'}
              placeholder={tenureProps.placeholder}
              error={errors.tenureYears}
              unitToggle={{
                currentUnit: tenureUnit,
                options: [{label: 'Yrs', value: 'years'}, {label: 'Mos', value: 'months'}],
                onUnitChange: (unit) => setTenureUnit(unit as 'years' | 'months'),
              }}
            />
            
            <InputSlider 
              label="Monthly EMI (₹)" 
              value={inputs.monthlyEMI} 
              onChange={(v) => handleInputChange('monthlyEMI', v)} 
              min={1000} max={300000} step={1000} format="currency"
              isBeingCalculated={calculatedField === 'monthlyEMI'}
              onSelectToCalculate={() => setCalculatedField('monthlyEMI')}
              wasJustCalculated={justCalculated === 'monthlyEMI'}
              placeholder="Enter EMI"
              error={errors.monthlyEMI}
            />

            {rateInsight && (rateInsight.type === 'error' || rateInsight.type === 'warning' || rateInsight.type === 'success') && (
                <div className={`p-2.5 rounded-md text-xs flex items-start ${rateInsight.className}`}>
                    {rateInsight.icon}
                    <span className="leading-snug">
                        {rateInsight.message}
                    </span>
                </div>
            )}
          </div>

          <hr className="border-slate-200 dark:border-slate-700"/>

          <div>
              <InputSlider label="Extra Annual Prepayment (₹)" value={inputs.extraAnnualPrepayment} onChange={(v) => handleInputChange('extraAnnualPrepayment', v)} min={0} max={1000000} step={10000} format="currency" error={errors.extraAnnualPrepayment} />
              <div className="px-2 pt-1 text-xs">
                <button onClick={onTaxInsightsRequest} className="flex items-center text-emerald-600 dark:text-emerald-400 hover:underline transition-colors">
                    <InformationCircleIcon className="w-4 h-4 mr-1.5" />
                    <span>Did you know? Your prepayment principal can be tax-deductible.</span>
                </button>
                <p className="mt-1 text-slate-600 dark:text-slate-400 pl-[22px]">
                    Up to ₹1.5L of principal repayment is eligible under Sec 80C (within a shared limit).
                </p>
              </div>
          </div>

          <InputSlider label="Monthly SIP (₹)" value={inputs.monthlySIP} onChange={(v) => handleInputChange('monthlySIP', Math.round(v))} min={0} max={100000} step={1000} format="currency" error={errors.monthlySIP} />
          
          <div>
            <InputSlider label="Expected SIP Return (%)" value={inputs.sipReturnRate} onChange={(v) => handleInputChange('sipReturnRate', v)} min={1} max={36} step={0.5} format="percent" error={errors.sipReturnRate} />
            <div className="px-2 pb-2 mt-2">
              <div className="flex justify-between space-x-2">
                {SIP_RISK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleSipCategorySelect(cat)}
                    className={`flex-1 text-center py-1.5 px-2 rounded-md transition-all duration-200 text-xs ${
                      activeSipCategory === cat.name
                        ? 'bg-emerald-600 text-white font-bold shadow-md transform -translate-y-0.5'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span className="font-semibold block">{cat.name}</span>
                    <span className="text-xs opacity-80">{`(~${cat.rate}%)`}</span>
                  </button>
                ))}
              </div>
              {activeSipCategory === 'Custom' && (
                <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 pt-2 font-semibold">
                    Custom Rate: {inputs.sipReturnRate.toFixed(1)}%
                </p>
              )}
            </div>
          </div>

          <InputSlider label="Inflation Rate (%)" value={inputs.inflationRate} onChange={(v) => handleInputChange('inflationRate', v)} min={1} max={10} step={0.1} format="percent" error={errors.inflationRate} />
        </div>

        {/* Right column with Chart, Strategy Cards, and Amortization Table */}
        <div className="lg:col-span-2 space-y-8">
            {simulationResults ? (
                <>
                    <SimulationChart 
                        data={simulationResults.chartData} 
                        theme={theme} 
                        loanFreeMonth={simulationResults.summary.loanFreeMonth}
                    />
                    <StrategyCards summary={simulationResults.summary} />
                    <AmortizationTable data={simulationResults.amortizationData} />
                </>
            ) : (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md text-center flex flex-col justify-center items-center h-full border border-slate-200 dark:border-slate-700">
                    <ExclamationTriangleIcon className="w-12 h-12 text-amber-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Incomplete or Invalid Data</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md">Please fill in all required loan details (Loan Amount, Rate, Tenure, EMI) and resolve any errors to see the simulation results.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};