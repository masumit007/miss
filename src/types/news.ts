export type NewsSentimentType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

export type CorporateEventType = 
  | 'Earnings / Results'
  | 'Contract / Order Win'
  | 'M&A / Acquisition'
  | 'Dividend'
  | 'Bonus / Split'
  | 'Management / Board Change'
  | 'Regulatory Action'
  | 'Capacity Expansion'
  | 'Fundraising / Debt'
  | 'Credit Rating'
  | 'General Market News';

export type NewsSourceTier = 'Official Filing (NEPSE/SEBON)' | 'Reputable Financial Press' | 'Major News Outlet' | 'Industry Publication';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceTier: NewsSourceTier;
  url: string;
  publishedAt: string; // ISO date
  publishedTimeFormatted: string; // "Today at 11:30 AM"
  symbolsMentioned: string[];
  primarySymbol?: string;
  sentiment: NewsSentimentType;
  sentimentScore: number; // -1.0 (very negative) to +1.0 (very positive)
  sentimentReasoning: string;
  eventType: CorporateEventType;
  isFact: boolean; // true for official regulatory filings, false for opinion/analysis
  duplicateSourcesCount: number;
}
