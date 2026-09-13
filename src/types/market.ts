import { DataFreshness, MarketStatusType } from './stock';

export interface MarketIndex {
  symbol: string;
  name: string;
  currentValue: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  /** Not exposed by the NEPSE index feed — null unless separately sourced. */
  open: number | null;
  previousClose: number;
  yearlyHigh: number;
  yearlyLow: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  /** Requires a separate index-history call; null until that's wired up. */
  sparkline: number[] | null;
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
  relativeStrengthVsNepse: 'Outperforming' | 'In-line' | 'Underperforming';
  topStockSymbol: string;
  topStockGain: number;
  foreignFlowStatus?: 'Net Inflow' | 'Net Outflow' | 'Neutral';
}

export interface InstitutionalActivity {
  date: string;
  foreignGrossPurchase: number; // Crores
  foreignGrossSales: number;
  foreignNet: number;
  institutionalGrossPurchase: number;
  institutionalGrossSales: number;
  institutionalNet: number;
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
  recentInstitutionalFlows: InstitutionalActivity[];
  macro: MacroIndicator[];
  marketRegime: {
    regime: 'Bull Market' | 'Bear Market' | 'Sideways / Rangebound' | 'High Volatility Consolidation' | 'Transition Phase';
    confidenceScore: number;
    explanation: string;
    keyDrivers: string[];
  };
  freshness: DataFreshness;
}
