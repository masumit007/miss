export interface FinancialYearData {
  year: string; // "FY26", "FY25", "FY24", "FY23", "FY22"
  revenue: number; // Crores INR
  ebitda: number;
  operatingProfit: number;
  netProfit: number;
  eps: number;
  operatingCashFlow: number;
  capex: number;
  freeCashFlow: number;
  totalAssets: number;
  totalEquity: number;
  totalDebt: number;
  cashAndInvestments: number;
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  receivables: number;
  payables: number;
  sharesCount: number;
  dividendPerShare: number;
}

export interface PiotroskiItem {
  id: number;
  category: 'Profitability' | 'Leverage & Liquidity' | 'Operating Efficiency';
  title: string;
  criterion: string;
  passed: boolean;
  actualValue: string;
  explanation: string;
}

export interface PiotroskiScorecard {
  score: number; // 0 to 9
  maxScore: 9;
  classification: 'Very Strong Financial Health (8-9)' | 'Stable / Average Health (5-7)' | 'Weak / Distressed Health (0-4)' | 'Insufficient Data';
  items: PiotroskiItem[];
  summary: string;
}

export interface FrameworkCANSLIM {
  c_score: number; // 0-15
  c_reason: string;
  a_score: number; // 0-15
  a_reason: string;
  n_score: number; // 0-15
  n_reason: string;
  s_score: number; // 0-15
  s_reason: string;
  l_score: number; // 0-15
  l_reason: string;
  i_score: number; // 0-15
  i_reason: string;
  m_score: number; // 0-10
  m_reason: string;
  totalScore: number; // 0-100 (sub-scores are 0 wherever required source data is unavailable)
  verdict: 'Strong Leader Candidate' | 'Moderate CANSLIM Setup' | 'Lagging / Weak' | 'Insufficient Data';
}

export interface FrameworkBuffett {
  circleOfCompetence: string;
  durableMoatRating: 'Wide Moat' | 'Narrow Moat' | 'No Moat / Commodity';
  earningsConsistencyScore: number; // 0-100
  roeTenYearAverage: number; // %
  debtSafety: 'Conservative / Minimal Debt' | 'Moderate Debt' | 'Heavy Debt Burden';
  ownerEarningsQuality: 'High Cash Conversion' | 'Moderate' | 'Poor';
  estimatedIntrinsicValueRange: string;
  marginOfSafety: string;
  buffettQualityScore: number; // 0-100
  verdict: 'Buffett-Style Quality Compounder' | 'Acceptable Business' | 'Fails Quality Filters' | 'Insufficient Data';
  disclaimer: string;
}

export interface FrameworkGraham {
  grahamNumber: number;
  currentPriceVsGrahamNumber: number; // % discount or premium
  peMultiple: number;
  pbMultiple: number;
  peTimesPb: number; // Graham threshold: < 22.5
  currentRatio: number; // Graham threshold: > 2.0
  debtToNetCurrentAssets: number | null; // Graham threshold: < 1.1 — null if balance sheet data unavailable
  earningsStabilityYears: number | null; // >= 10 yrs — null unless enough real history exists
  dividendRecordYears: number | null; // null unless real dividend history is available
  grahamScore: number; // 0-100
  classification: 'Defensive Value' | 'Enterprising Value' | 'Overvalued / Does Not Meet Graham Criteria' | 'Insufficient Data';
  disclaimer: string;
}

export interface FrameworkPeterLynch {
  category: 'Fast Grower' | 'Stalwart' | 'Slow Grower' | 'Cyclical' | 'Turnaround' | 'Asset Play';
  pegRatio: number;
  earningsGrowthRate: number; // %
  debtSafety: string;
  institutionalOwnershipPercent: number | null; // null unless a real ownership source is joined in
  businessSimplicityNote: string;
  lynchScore: number; // 0-100
  verdict: string;
}

export interface FullFundamentalAnalysis {
  symbol: string;
  sector: string;
  industry: string;
  isFinancialSector: boolean;
  profitability: {
    roe: number;
    roce: number;
    roa: number;
    operatingMargin: number;
    netMargin: number;
    grossMargin: number;
    roe3YrAvg: number;
    roe5YrAvg: number;
    profitabilityScore: number; // 0-100
    sectorComparison: string;
  };
  growth: {
    revenueYoY: number;
    revenue3YrCAGR: number;
    revenue5YrCAGR: number;
    netProfitYoY: number;
    netProfit3YrCAGR: number;
    netProfit5YrCAGR: number;
    epsYoY: number;
    eps3YrCAGR: number;
    growthScore: number; // 0-100
    growthTrajectory: 'Accelerating' | 'Steady Growth' | 'Decelerating' | 'Contracting';
  };
  valuation: {
    pe: number;
    forwardPe?: number;
    peg: number;
    pb: number;
    evToEbitda: number;
    priceToSales: number;
    priceToCashFlow: number;
    dividendYield: number;
    sectorMedianPe: number;
    historical5YrPe: number;
    valuationScore: number; // 0-100 (Higher = more attractively valued)
    valuationVerdict: 'Potentially Low / Undervalued' | 'Fair Valuation' | 'Elevated / Expensive';
    explanation: string;
  };
  balanceSheet: {
    totalDebtCrores: number;
    debtToEquity: number;
    interestCoverage: number;
    currentRatio: number;
    quickRatio: number;
    cashAndEquivalentsCrores: number;
    netDebtCrores: number;
    freeCashFlowCrores: number;
    fcfYield: number;
    cashConversionCycleDays: number;
    leverageCategory: 'Low Leverage (Healthy)' | 'Moderate Leverage' | 'High Leverage (Caution)';
    solvencyScore: number; // 0-100
  };
  earningsQuality: {
    cfoToNetProfitRatio: number;
    accrualStatus: 'Healthy Cash Conversion' | 'Accrual Heavy / Divergence Detected';
    exceptionalItemsNotes: string;
    flag: string;
  };
  piotroski: PiotroskiScorecard;
  canslim: FrameworkCANSLIM;
  buffett: FrameworkBuffett;
  graham: FrameworkGraham;
  peterLynch: FrameworkPeterLynch;
  historicalYears: FinancialYearData[];
}
