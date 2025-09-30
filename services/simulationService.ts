import { SimulationInput, SimulationOutput, ChartDataPoint, AmortizationDataPoint } from '../types';

export function calculateEMI(principal: number, annualRate: number, tenureYears: number): number {
    if (principal <= 0 || annualRate < 0 || tenureYears <= 0) return 0;
    if (annualRate === 0) return principal / (tenureYears * 12);
    const monthlyRate = annualRate / 12 / 100;
    const numberOfMonths = tenureYears * 12;
    if (monthlyRate === 0) return principal / numberOfMonths;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    return emi;
}

export const runSimulation = (inputs: SimulationInput): SimulationOutput | null => {
    const { principal, interestRate, tenureYears, extraAnnualPrepayment, monthlySIP, sipReturnRate, inflationRate } = inputs;
    
    if (principal <= 0 || interestRate < 0 || tenureYears <= 0) {
        return null;
    }

    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlySipRate = sipReturnRate / 12 / 100;
    const monthlyInflationRate = inflationRate / 12 / 100;

    const baseEMI = inputs.monthlyEMI > 0 ? inputs.monthlyEMI : calculateEMI(principal, interestRate, tenureYears);

    if (!baseEMI || baseEMI === Infinity || !isFinite(baseEMI) || baseEMI <= principal * monthlyInterestRate) {
        return null;
    }


    // --- Base Scenario Calculation ---
    let baseBalance = principal;
    let totalInterestPaidBase = 0;
    const baseLoanData: number[] = [principal];
    const baseAmortization: AmortizationDataPoint[] = [];

    let month = 0;
    while (baseBalance > 0 && month < tenureYears * 12 * 5) { // safety break increased
        month++;
        const interestPaid = baseBalance * monthlyInterestRate;
        const principalPaid = baseEMI - interestPaid;
        baseBalance -= principalPaid;
        totalInterestPaidBase += interestPaid;
        baseLoanData.push(Math.max(0, baseBalance));
        baseAmortization.push({
            month,
            principalPaid,
            interestPaid,
            endingBalance: Math.max(0, baseBalance),
            totalInterest: totalInterestPaidBase
        });
        if (baseBalance <=0) break;
    }
    const baseTenureMonths = month;

    // --- Prepayment Scenario Calculation ---
    let prepaymentBalance = principal;
    let totalInterestPaidWithPrepayment = 0;
    const prepaymentLoanData: number[] = [principal];
    
    month = 0;
    while (prepaymentBalance > 0 && month < tenureYears * 12 * 5) { // safety break increased
        month++;
        const interestPaid = prepaymentBalance * monthlyInterestRate;
        const principalPaid = baseEMI - interestPaid;
        prepaymentBalance -= principalPaid;
        totalInterestPaidWithPrepayment += interestPaid;
        
        if (month > 0 && month % 12 === 0) {
            prepaymentBalance -= extraAnnualPrepayment;
        }

        prepaymentLoanData.push(Math.max(0, prepaymentBalance));
        if (prepaymentBalance <= 0) break;
    }
    const prepaymentTenureMonths = month;

    // --- SIP Calculation ---
    const maxMonths = baseTenureMonths;
    let sipNominalCorpus = 0;
    let sipRealCorpus = 0;
    const sipNominalData: number[] = [0];
    const sipRealData: number[] = [0];

    for (let m = 1; m <= maxMonths; m++) {
        sipNominalCorpus = (sipNominalCorpus + monthlySIP) * (1 + monthlySipRate);
        sipRealCorpus = ((sipRealCorpus + monthlySIP) * (1 + monthlySipRate)) / (1 + monthlyInflationRate);
        sipNominalData.push(sipNominalCorpus);
        sipRealData.push(sipRealCorpus);
    }
    
    // --- Combine into Chart Data ---
    const chartData: ChartDataPoint[] = [];
    for (let i = 0; i <= maxMonths; i++) {
        chartData.push({
            month: i,
            baseLoanBalance: baseLoanData[i] ?? 0,
            prepaymentLoanBalance: prepaymentLoanData[i] ?? 0,
            sipNominalCorpus: sipNominalData[i] ?? 0,
            sipRealCorpus: sipRealData[i] ?? 0,
        });
    }

    // --- Calculate Loan-Free Crossover Point ---
    const loanFreeMonthIndex = chartData.findIndex(p => p.prepaymentLoanBalance > 0 && p.sipNominalCorpus >= p.prepaymentLoanBalance);
    const loanFreeMonth = loanFreeMonthIndex !== -1 ? chartData[loanFreeMonthIndex].month : null;


    return {
        chartData,
        amortizationData: baseAmortization,
        summary: {
            totalInterestPaidBase,
            totalInterestPaidWithPrepayment,
            interestSaved: totalInterestPaidBase - totalInterestPaidWithPrepayment,
            tenureReducedMonths: baseTenureMonths - prepaymentTenureMonths,
            finalSipCorpusNominal: sipNominalCorpus,
            finalSipCorpusReal: sipRealCorpus,
            loanFreeMonth,
        },
    };
};

export const calculateTenure = (principal: number, annualRate: number, emi: number): number => {
    if (principal <= 0 || annualRate < 0 || emi <= 0) return 0;
    const monthlyRate = annualRate / 12 / 100;
    if(emi <= principal * monthlyRate) return Infinity; // EMI too low, loan will never be paid off
    if (monthlyRate === 0) {
        return (principal / emi) / 12;
    }
    const n = Math.log(emi / (emi - principal * monthlyRate)) / Math.log(1 + monthlyRate);
    return n / 12;
}

export const calculateInterestRate = (principal: number, tenureYears: number, emi: number): number => {
    if (principal <= 0 || tenureYears <= 0 || emi <= 0 || emi * tenureYears * 12 <= principal) {
        return 0;
    }

    let low = 0;
    let high = 50; // 50% max annual rate
    let mid = 0;

    for(let i=0; i < 50; i++) { // Limit iterations to prevent infinite loops
        mid = (low + high) / 2;
        if(mid === low || mid === high) break;
        const calculatedEmi = calculateEMI(principal, mid, tenureYears);
        if (calculatedEmi > emi) {
            high = mid;
        } else {
            low = mid;
        }
    }
    
    return mid;
};