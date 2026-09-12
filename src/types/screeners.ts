import { StockQuote } from './stock';
import { FullTechnicalAnalysis } from './technicals';
import { FullFundamentalAnalysis } from './fundamentals';
import { MultiFactorScore } from './scoring';

export type ScreenerPresetType = 
  | 'breakout'
  | 'support_rebound'
  | 'smart_money_accumulation'
  | 'piotroski_high'
  | 'low_debt_growth'
  | 'oversold_reversal'
  | 'high_dividend'
  | 'buffett_compounders'
  | 'canslim_leaders'
  | 'high_momentum_adx'
  | 'low_volatility'
  | 'value_gems'
  | 'fii_buying_spree'
  | 'golden_cross'
  | 'custom'
  | 'ai_natural_language';

export interface ScreenerFilterRule {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | 'between' | 'in';
  value: any;
  secondValue?: any;
}

export interface CustomScreenerConfig {
  id: string;
  name: string;
  description: string;
  rules: ScreenerFilterRule[];
}

export interface ScreenerResultItem {
  quote: StockQuote;
  technicals: FullTechnicalAnalysis;
  fundamentals: FullFundamentalAnalysis;
  score: MultiFactorScore;
  matchedCriteria: string[];
}
