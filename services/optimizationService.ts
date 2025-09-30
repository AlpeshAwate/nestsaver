import { SimulationInput, SimulationOutput, OptimizationStrategy } from '../types';
import { runSimulation, calculateEMI } from './simulationService';

// Helper to run a basic simulation and get the summary
const getSimulationSummary = (inputs: SimulationInput): SimulationOutput['summary'] => {
    const results = runSimulation(inputs);
    // Provide a default summary if simulation fails
    return results ? results.summary : {
        totalInterestPaidBase: 0,
        totalInterestPaidWithPrepayment: 0,
        interestSaved: 0,
        tenureReducedMonths: 0,
        finalSipCorpusNominal: 0,
        finalSipCorpusReal: 0,
        loanFreeMonth: null,
    };
};

// This is the key function for the aggressive strategy
const runSipClosureSimulation = (baseInputs: SimulationInput, aggressiveInputs: SimulationInput): SimulationOutput['summary'] => {
    // This function simulates paying off the loan with the SIP corpus when possible.

    const { principal, interestRate, tenureYears } = baseInputs;
    const { extraAnnualPrepayment, monthlySIP, sipReturnRate } = aggressiveInputs;
    
    const monthlyInterestRate = interestRate / 12 / 100;
    const monthlySipRate = sipReturnRate / 12 / 100;
    const baseEMI = baseInputs.monthlyEMI > 0 ? baseInputs.monthlyEMI : calculateEMI(principal, interestRate, tenureYears);

    if (!baseEMI || !isFinite(baseEMI) || baseEMI <= principal * monthlyInterestRate) {
        return getSimulationSummary(aggressiveInputs); // Fallback to standard simulation
    }
    
    const baseTenureMonths = Math.round(tenureYears * 12);

    let prepaymentBalance = principal;
    let sipCorpus = 0;
    let totalInterestPaid = 0;
    let closureMonth: number | null = null;
    
    // Simulate month by month
    for (let month = 1; month <= baseTenureMonths * 2; month++) { // Allow exceeding original tenure to find crossover
        // Accrue interest
        const interestForMonth = prepaymentBalance * monthlyInterestRate;
        totalInterestPaid += interestForMonth;

        // Make EMI payment
        const principalPaid = baseEMI - interestForMonth;
        prepaymentBalance -= principalPaid;

        // Make annual prepayment
        if (month > 0 && month % 12 === 0) {
            prepaymentBalance -= extraAnnualPrepayment;
        }

        // Grow SIP
        sipCorpus = (sipCorpus + monthlySIP) * (1 + monthlySipRate);

        // Check for closure condition
        if (prepaymentBalance > 0 && sipCorpus >= prepaymentBalance) {
            closureMonth = month;
            break; // Exit the loop once the loan can be closed
        }

        if (prepaymentBalance <= 0) {
            closureMonth = month; // Loan paid off normally
            break;
        }
    }

    const standardBaseResults = runSimulation(baseInputs);
    if (!standardBaseResults) return getSimulationSummary(aggressiveInputs);

    if (closureMonth) {
        let finalSipCorpus = 0;
        let remainingSipCorpusAfterClosure = 0;
        
        if (sipCorpus >= prepaymentBalance && prepaymentBalance > 0) {
            remainingSipCorpusAfterClosure = sipCorpus - prepaymentBalance;
        } else {
            // This means loan was paid off normally, SIP corpus is untouched
            remainingSipCorpusAfterClosure = sipCorpus;
        }

        finalSipCorpus = remainingSipCorpusAfterClosure;
        
        // Compound the remaining SIP and future contributions until the original tenure ends
        const targetMonth = Math.max(baseTenureMonths, closureMonth);
        for (let month = closureMonth + 1; month <= targetMonth; month++) {
            finalSipCorpus = (finalSipCorpus + monthlySIP) * (1 + monthlySipRate);
        }
        
        return {
            totalInterestPaidBase: standardBaseResults.summary.totalInterestPaidBase,
            totalInterestPaidWithPrepayment: totalInterestPaid,
            interestSaved: standardBaseResults.summary.totalInterestPaidBase - totalInterestPaid,
            tenureReducedMonths: baseTenureMonths - closureMonth,
            finalSipCorpusNominal: finalSipCorpus,
            finalSipCorpusReal: 0, // Not calculating this for simplicity now
            loanFreeMonth: closureMonth,
        };

    } else {
        // If closure never happens, return standard simulation results for aggressive inputs
        return getSimulationSummary(aggressiveInputs);
    }
};

export const generateOptimizationStrategies = (baseInputs: SimulationInput, annualSurplus: number): OptimizationStrategy[] => {
    if (annualSurplus <= 0) return [];
    
    // 1. Conservative Strategy: 100% surplus to prepayment
    const conservativeInputs: SimulationInput = {
        ...baseInputs,
        extraAnnualPrepayment: baseInputs.extraAnnualPrepayment + annualSurplus,
        monthlySIP: Math.round(baseInputs.monthlySIP), // Keep SIP as integer
    };
    const conservativeResults = getSimulationSummary(conservativeInputs);

    // 2. Moderate Strategy: Split surplus ~50/50
    const moderatePrepaymentIncrease = Math.round(annualSurplus * 0.5);
    const remainingSurplusForSip = annualSurplus - moderatePrepaymentIncrease;
    const moderateSipIncrease = Math.round(remainingSurplusForSip / 12);
    const moderateInputs: SimulationInput = {
        ...baseInputs,
        extraAnnualPrepayment: baseInputs.extraAnnualPrepayment + moderatePrepaymentIncrease,
        monthlySIP: Math.round(baseInputs.monthlySIP) + moderateSipIncrease,
    };
    const moderateResults = getSimulationSummary(moderateInputs);

    // 3. Aggressive Strategy: 100% surplus to SIP
    const aggressiveSipIncrease = Math.round(annualSurplus / 12);
    const aggressiveInputs: SimulationInput = {
        ...baseInputs,
        extraAnnualPrepayment: baseInputs.extraAnnualPrepayment, // No surplus to prepayment
        monthlySIP: Math.round(baseInputs.monthlySIP) + aggressiveSipIncrease,
    };
    const aggressiveResults = runSipClosureSimulation(baseInputs, aggressiveInputs);

    return [
        {
            name: "Rapid Prepayment",
            description: "Focuses on clearing your loan as fast as possible by allocating 100% of your surplus to prepayments. Minimizes interest paid.",
            riskLevel: "Conservative",
            inputs: {
                extraAnnualPrepayment: conservativeInputs.extraAnnualPrepayment,
                monthlySIP: conservativeInputs.monthlySIP,
            },
            results: conservativeResults,
        },
        {
            name: "Balanced Growth",
            description: "Splits your surplus between prepayments and SIP investments. A balanced approach to reducing debt and building wealth.",
            riskLevel: "Moderate",
            inputs: {
                extraAnnualPrepayment: moderateInputs.extraAnnualPrepayment,
                monthlySIP: moderateInputs.monthlySIP,
            },
            results: moderateResults,
        },
        {
            name: "Wealth Maximizer",
            description: "Prioritizes wealth creation by investing your entire surplus into SIPs. Aims to use the grown corpus to pay off the loan.",
            riskLevel: "Aggressive",
            inputs: {
                extraAnnualPrepayment: aggressiveInputs.extraAnnualPrepayment,
                monthlySIP: aggressiveInputs.monthlySIP,
            },
            results: aggressiveResults,
        },
    ];
};