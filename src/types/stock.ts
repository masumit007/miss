export type ExchangeType = 'NSE' | 'BSE' | 'NEPSE';

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
  bseCode?: string;
  isin: string;
  name: string;
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volume: number;
  averageVolume: number; // 20d avg
  volumeRatio: number;
  marketCap: number; // in Crores NPR / Arb
  freeFloatMarketCap?: number;
  faceValue: number;
  sharesOutstanding: number; // in Crores / Shares
  sector: string;
  industry: string;
  beta: number;
  deliveryPercentage?: number;
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
  fiiHolding: number;
  diiHolding: number;
  publicHolding: number;
  otherHolding: number;
  fiiCount?: number;
  diiCount?: number;
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
