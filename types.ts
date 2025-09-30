// FIX: Removed self-referential import of SimulationOutput, which was causing a conflict as it's defined in this file.

export interface SimulationInput {
  principal: number;
  interestRate: number;
  tenureYears: number;
  monthlyEMI: number;
  extraAnnualPrepayment: number;
  monthlySIP: number;
  sipReturnRate: number;
  inflationRate: number;
}

export interface AmortizationDataPoint {
  month: number;
  principalPaid: number;
  interestPaid: number;
  endingBalance: number;
  totalInterest: number;
}

export interface ChartDataPoint {
  month: number;
  baseLoanBalance: number;
  prepaymentLoanBalance: number;
  sipNominalCorpus: number;
  sipRealCorpus: number;
}

export interface SimulationOutput {
  chartData: ChartDataPoint[];
  amortizationData: AmortizationDataPoint[];
  summary: {
    totalInterestPaidBase: number;
    totalInterestPaidWithPrepayment: number;
    interestSaved: number;
    tenureReducedMonths: number;
    finalSipCorpusNominal: number;
    finalSipCorpusReal: number;
    loanFreeMonth: number | null;
  };
}

export interface SavedScenario extends SimulationInput {
  id: string;
  name: string;
  savedAt: any; // Can be string (from client) or Firebase Timestamp
}

export interface UserProfile {
  name: string;
  email: string;
  createdAt: any; // Firebase Timestamp
}

export type ModalTab = 'learn' | 'benchmark' | 'tax' | 'actions';

export interface OptimizationStrategy {
  name:string;
  description: string;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  inputs: Partial<SimulationInput>;
  results: SimulationOutput['summary'];
}