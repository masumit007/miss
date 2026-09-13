export type ExchangeType = 'NEPSE';

export type MarketStatusType = 'OPEN' | 'CLOSED' | 'PRE-OPEN' | 'POST-MARKET' | 'UNKNOWN';

export type DataStatusType = 'LIVE' | 'DELAYED' | 'EOD' | 'CACHED' | 'UNAVAILABLE' | 'DEMO DATA';

export interface DataFreshness {
  timestamp: string; // ISO string
  formattedTime: string; // "12 Sep 2026 15:42:10 NPT"
  source: string; // "HamroShare Live", "NEPSE Official", "Approved Provider"
  status: DataStatusType;
  completeness: number; // 0 to 100%
  confidence: 'High' | 'Medium' | 'Low';
}

export interface OHLCV {
  time: string; // YYYY-MM-DD or timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  deliveryVolume?: number;
  deliveryPercent?: number;
  vwap?: number;
}

export interface StockQuote {
  symbol: string;
  exchange: ExchangeType;
  /** Internal NEPSE security/company id (from @rumess/nepse-api), when known. */
  securityId?: number | string;
  name: string;

  // --- Always present when the live scraper returns a quote at all ---
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  turnover: number;

  // --- NOT provided by NEPSE's live market feed today. These require a
  // separate join against getSecurityDetails() / getCompanies() that MISS
  // does not yet perform for every quote. Null means "not fetched / not
  // available from the source" — NEVER fabricate a value for these. ---
  isin: string | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  averageVolume: number | null; // 20d avg
  volumeRatio: number | null;
  marketCap: number | null; // NPR Crores (1 Crore = 1,00,00,000 NPR)
  freeFloatMarketCap?: number | null;
  faceValue: number | null;
  sharesOutstanding: number | null;
  /**
   * Only populated when cross-referenced against the company list
   * (sectorName). Null when that lookup hasn't happened or the source has
   * no value. Always guard with `sector ?? ''` — never assume non-null.
   */
  sector: string | null;
  industry: string | null;
  beta: number | null;
  deliveryPercentage?: number | null;
  freshness: DataFreshness;
}

export interface CorporateAction {
  id: string;
  symbol: string;
  type: 'Dividend' | 'Bonus' | 'Stock Split' | 'Rights Issue' | 'Buyback' | 'Merger' | 'Demerger' | 'AGM' | 'Results';
  announcementDate: string;
  recordDate?: string;
  exDate?: string;
  details: string;
  dividendAmount?: number;
  dividendPercent?: number;
  bonusRatio?: string;
  splitRatio?: string;
  rightsRatio?: string;
  impactSentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface QuarterlyResult {
  period: string; // e.g., "082/083 Q4"
  filingDate: string;
  revenue: number; // in Crores NPR
  revenueYoYGrowth: number;
  operatingProfit: number;
  operatingMargin: number;
  netProfit: number;
  netProfitYoYGrowth: number;
  netMargin: number;
  eps: number;
  epsYoYGrowth: number;
  cfo: number;
  capex: number;
  freeCashFlow: number;
  interestCoverage: number;
  rawResultsSummary: string;
  beatMiss: 'Beat' | 'Miss' | 'In-Line';
}

export interface ShareholdingPattern {
  period: string;
  promoterHolding: number;
  promoterPledged: number; // % of promoter holding
  foreignHolding: number;
  institutionalHolding: number;
  publicHolding: number;
  otherHolding: number;
  foreignInvestorCount?: number;
  institutionalInvestorCount?: number;
  totalShareholders?: number;
}

export interface BulkBlockDeal {
  date: string;
  symbol: string;
  clientName: string;
  dealType: 'BULK' | 'BLOCK';
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  valueCrores: number;
  percentageTraded?: number;
}
