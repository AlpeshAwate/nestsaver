import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CalculatorIcon, ExclamationTriangleIcon } from './icons';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format?: 'currency' | 'percent' | 'number';
  isBeingCalculated?: boolean;
  onSelectToCalculate?: () => void;
  wasJustCalculated?: boolean;
  placeholder?: string;
  error?: string;
  unitToggle?: {
    currentUnit: string;
    options: { label: string; value: string }[];
    onUnitChange: (unit: string) => void;
  };
}

export const InputSlider: React.FC<InputSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = 'number',
  isBeingCalculated = false,
  onSelectToCalculate,
  wasJustCalculated = false,
  placeholder,
  error,
  unitToggle,
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
        if (value === 0 && !isBeingCalculated && placeholder) {
            setInputValue('');
        } else {
            setInputValue(value.toString());
        }
    }
  }, [value, isBeingCalculated, placeholder]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const processValue = (val: string): number => {
    let cleanedValue = val.replace(/[₹,%\s]/g, '').trim();
    if (cleanedValue === '') return 0;
    let numericValue = parseFloat(cleanedValue);
    
    if (isNaN(numericValue)) return value; 
    
    return Math.max(min, Math.min(max, numericValue));
  }

  const handleCommit = () => {
    const numericValue = processValue(inputValue);
    onChange(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommit();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === 'Escape') {
      setInputValue(value.toString());
      (e.target as HTMLInputElement).blur();
    }
  };

  const displayValue = useMemo(() => {
    if (isBeingCalculated) {
        if (value === 0) return '';
        if (format === 'currency') return value.toFixed(0);
        if (format === 'percent') return value.toFixed(2);
        if (value % 1 === 0) return value.toFixed(0);
        return value.toFixed(1);
    }
    return inputValue;
  }, [isBeingCalculated, value, inputValue, format]);

  return (
    <div className={`space-y-1 p-2 rounded-md ${wasJustCalculated ? 'animate-highlight' : ''}`}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <div className="flex items-center space-x-2">
           {unitToggle && (
             <div className="flex items-center bg-slate-200 dark:bg-slate-600 rounded-md p-0.5 text-xs">
               {unitToggle.options.map(opt => (
                 <button
                   key={opt.value}
                   onClick={() => unitToggle.onUnitChange(opt.value)}
                   className={`px-2 py-0.5 rounded-sm transition-colors ${
                     unitToggle.currentUnit === opt.value
                       ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                       : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-500/50'
                   }`}
                   aria-pressed={unitToggle.currentUnit === opt.value}
                 >
                   {opt.label}
                 </button>
               ))}
             </div>
           )}
           {onSelectToCalculate && (
             <button onClick={onSelectToCalculate} className={`p-1 rounded-md transition-colors ${isBeingCalculated ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500'}`} title={`Click to calculate ${label}`}>
                <CalculatorIcon className="w-4 h-4" />
             </button>
           )}
           <div className="relative">
              {format === 'currency' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none">₹</span>}
              <input
                ref={inputRef}
                type="text"
                value={displayValue}
                placeholder={placeholder}
                onChange={handleInputChange}
                onBlur={handleCommit}
                onKeyDown={handleKeyDown}
                className={`w-32 bg-white dark:bg-slate-700 border rounded-md py-1 text-right text-sm font-semibold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition
                  ${isBeingCalculated ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}
                  ${format === 'currency' ? 'pl-7' : 'px-3'}
                  ${format === 'percent' ? 'pr-7' : ''}
                  ${error ? 'border-red-500/80 dark:border-red-500/70' : 'border-slate-300 dark:border-slate-600'}
                  disabled:opacity-80 disabled:cursor-not-allowed
                  placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal
                `}
                disabled={isBeingCalculated}
                aria-label={label}
              />
              {format === 'percent' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none">%</span>}
           </div>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isBeingCalculated}
      />
      {error && (
        <div className="flex items-start text-xs text-red-600 dark:text-red-400 pt-1 px-1">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
        </div>
      )}
    </div>
  );
};