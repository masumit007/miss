export interface ScoreSubfactor {
  name: string;
  weight: number; // e.g. 0.25 (25%)
  score: number; // 0-100
  weightedScore: number;
  confidence: 'High' | 'Medium' | 'Low';
  positiveFactors: string[];
  negativeFactors: string[];
  missingFactors: string[];
}

export interface MultiFactorScore {
  symbol: string;
  overallScore: number; // 0 to 100
  ratingCategory: 'Outstanding Research Profile (85-100)' | 'Strong Profile (70-84)' | 'Moderate / Mixed (50-69)' | 'Weak / Cautionary (30-49)' | 'Poor / High Risk (0-29)';
  quickVerdict: 'Strong Research Profile' | 'Mixed' | 'Caution' | 'Weak Research Profile' | 'Insufficient Data';
  subfactors: {
    fundamentals: ScoreSubfactor; // 25%
    technicals: ScoreSubfactor; // 20%
    growth: ScoreSubfactor; // 15%
    valuation: ScoreSubfactor; // 15%
    smartMoney: ScoreSubfactor; // 10%
    risk: ScoreSubfactor; // 5%
    newsSentiment: ScoreSubfactor; // 5%
    macroSector: ScoreSubfactor; // 5%
  };
  whyItScoredHigh: string[];
  whatCouldGoWrong: string[];
  keyRisks: string[];
  dataGaps: string[];
  valuationConcerns: string[];
  technicalConcerns: string[];
  dataCompletenessPercent: number;
  lastCalculated: string;
}
