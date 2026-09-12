import { StockQuote, OHLCV, CorporateAction, QuarterlyResult, ShareholdingPattern, BulkBlockDeal, MarketStatusType } from '../../types/stock';
import { MarketIndex, MarketBreadth, SectorPerformance, InstitutionalActivity, MacroIndicator } from '../../types/market';
import { NewsArticle } from '../../types/news';
import { IPOItem } from '../../types/ipo';

export interface IDataProvider {
  name: string;
  providerType: 'MOCK' | 'NEPSE_API' | 'LICENSED_FEED';
  
  // Market Level
  getMarketStatus(): Promise<MarketStatusType>;
  getPrimaryIndices(): Promise<MarketIndex[]>;
  getSectoralIndices(): Promise<MarketIndex[]>;
  getMarketBreadth(): Promise<MarketBreadth>;
  getSectorPerformances(): Promise<SectorPerformance[]>;
  getInstitutionalFlows(): Promise<InstitutionalActivity[]>;
  getMacroIndicators(): Promise<MacroIndicator[]>;

  // Stock Level
  searchStocks(query: string): Promise<StockQuote[]>;
  getAllStocks(): Promise<StockQuote[]>;
  getQuote(symbol: string): Promise<StockQuote | null>;
  getHistoricalCandles(symbol: string, timeframe?: string): Promise<OHLCV[]>;
  getQuarterlyResults(symbol: string): Promise<QuarterlyResult[]>;
  getShareholdingPattern(symbol: string): Promise<ShareholdingPattern[]>;
  getCorporateActions(symbol: string): Promise<CorporateAction[]>;
  getBulkBlockDeals(symbol: string): Promise<BulkBlockDeal[]>;

  // News & Corporate Announcements
  getMarketNews(category?: string): Promise<NewsArticle[]>;
  getStockNews(symbol: string): Promise<NewsArticle[]>;

  // IPO
  getIPOs(): Promise<IPOItem[]>;
  getIPOById(id: string): Promise<IPOItem | null>;
}
