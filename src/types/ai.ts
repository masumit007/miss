export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  toolCallsExecuted?: {
    toolName: string;
    params: any;
    resultSummary: string;
  }[];
  structuredVerdict?: {
    quickVerdict: string;
    fundamentalsSummary: string;
    technicalsSummary: string;
    valuationSummary: string;
    growthSummary: string;
    ownershipSummary: string;
    risks: string[];
    keySupport: string;
    keyResistance: string;
    invalidationConditions: string[];
    dataFreshness: string;
    sources: string[];
    finalEducationalAssessment: string;
  };
}

export interface ResearchReport {
  id: string;
  symbol: string;
  companyName: string;
  reportDate: string;
  generatedBy: string; // "MISS AI Quantitative Engine"
  executiveSummary: string;
  businessOverview: string;
  growthAndQuality: string;
  financialPerformance: string;
  valuationAssessment: string;
  technicalLandscape: string;
  ownershipAndSmartMoney: string;
  newsAndCorporateDevelopments: string;
  industryAndMacroContext: string;
  keyRisks: string[];
  bullCase: string;
  bearCase: string;
  baseCase: string;
  keyTechnicalReferenceLevels: {
    support1: string;
    support2: string;
    resistance1: string;
    resistance2: string;
  };
  frameworkScores: {
    piotroski: string;
    canslim: string;
    buffett: string;
    graham: string;
    peterLynch: string;
  };
  overallResearchScore: number;
  dataSources: string[];
  disclaimer: string;
}
