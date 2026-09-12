import { DataFreshness, MarketStatusType } from './stock';

export interface MarketIndex {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  yearlyHigh: number;
  yearlyLow: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  sparkline: number[];
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
  advanceDeclineRatio: number;
  newFiftyTwoWeekHighs: number;
  newFiftyTwoWeekLows: number;
  totalTraded: number;
}

export interface SectorPerformance {
  name: string;
  oneDayChange: number;
  oneWeekChange: number;
  oneMonthChange: number;
  threeMonthChange: number;
  oneYearChange: number;
  momentum: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strong Bearish';
  relativeStrengthVsNifty: 'Outperforming' | 'In-line' | 'Underperforming';
  topStockSymbol: string;
  topStockGain: number;
  fiiFlowStatus?: 'Net Inflow' | 'Net Outflow' | 'Neutral';
}

export interface InstitutionalActivity {
  date: string;
  fiiGrossPurchase: number; // Crores
  fiiGrossSales: number;
  fiiNet: number;
  diiGrossPurchase: number;
  diiGrossSales: number;
  diiNet: number;
  totalNet: number;
}

export interface MacroIndicator {
  name: string;
  currentValue: string;
  previousValue: string;
  changeDirection: 'UP' | 'DOWN' | 'NEUTRAL';
  impactOnEquities: 'Bullish' | 'Bearish' | 'Neutral';
  lastUpdated: string;
  source: string;
  relevanceExplanation: string;
}

export interface MarketOverviewData {
  marketStatus: MarketStatusType;
  primaryIndices: MarketIndex[];
  sectoralIndices: MarketIndex[];
  breadth: MarketBreadth;
  sectors: SectorPerformance[];
  recentFiiDii: InstitutionalActivity[];
  macro: MacroIndicator[];
  marketRegime: {
    regime: 'Bull Market' | 'Bear Market' | 'Sideways / Rangebound' | 'High Volatility Consolidation' | 'Transition Phase';
    confidenceScore: number;
    explanation: string;
    keyDrivers: string[];
  };
  freshness: DataFreshness;
}
