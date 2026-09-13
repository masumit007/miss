import { IDataProvider } from './IDataProvider';
import { NepseLiveScraper } from './NepseLiveScraper';
import {
  StockQuote,
  OHLCV,
  CorporateAction,
  QuarterlyResult,
  ShareholdingPattern,
  BulkBlockDeal,
  MarketStatusType
} from '../../types/stock';
import {
  MarketIndex,
  MarketBreadth,
  SectorPerformance,
  InstitutionalActivity,
  MacroIndicator
} from '../../types/market';
import { NewsArticle } from '../../types/news';
import { IPOItem } from '../../types/ipo';

export class NepseDataProvider implements IDataProvider {
  name = 'NEPSE Data Provider';
  providerType: 'NEPSE_API' = 'NEPSE_API';

  private readonly scraper = NepseLiveScraper.getInstance();

  async getMarketStatus(): Promise<MarketStatusType> {
    try {
      const status = await this.scraper.getMarketStatus();
      const isOpen = String((status as any)?.isOpen ?? '').toUpperCase();

      if (isOpen === 'OPEN') return 'OPEN';
      if (isOpen === 'CLOSE' || isOpen === 'CLOSED') return 'CLOSED';

      return 'UNKNOWN';
    } catch {
      return 'UNKNOWN';
    }
  }

  async getPrimaryIndices(): Promise<MarketIndex[]> {
    const summary = await this.scraper.getLiveMarketSummary();

    if (summary.nepseIndex === null) {
      // We couldn't get a real NEPSE index value — don't invent one.
      return [];
    }

    return [
      {
        symbol: 'NEPSE',
        name: 'NEPSE Index',
        currentValue: summary.nepseIndex,
        change: summary.indexChange ?? 0,
        percentChange: summary.indexChangePercent ?? 0,
        high: summary.nepseIndex,
        low: summary.nepseIndex,
        open: null,
        previousClose:
          summary.indexChange !== null
            ? summary.nepseIndex - summary.indexChange
            : summary.nepseIndex,
        yearlyHigh: summary.nepseIndex,
        yearlyLow: summary.nepseIndex,
        sparkline: null
      }
    ];
  }

  async getSectoralIndices(): Promise<MarketIndex[]> {
    try {
      const subIndices = await this.scraper.getAllSubIndices();

      return subIndices.map(sub => ({
        symbol: sub.index,
        name: sub.index,
        currentValue: sub.currentValue,
        change: sub.change,
        percentChange: sub.perChange,
        // NepseSubIndex doesn't expose high/low/52wk range — real gap, not fabricated.
        high: sub.currentValue,
        low: sub.currentValue,
        open: null,
        previousClose: sub.currentValue - sub.change,
        yearlyHigh: sub.currentValue,
        yearlyLow: sub.currentValue,
        sparkline: null
      }));
    } catch {
      return [];
    }
  }

  async getMarketBreadth(): Promise<MarketBreadth> {
    const summary = await this.scraper.getLiveMarketSummary();

    const advances = summary.topGainers.length;
    const declines = summary.topLosers.length;

    return {
      advances,
      declines,
      // NEPSE's top-10 lists don't tell us the true unchanged count or
      // 52-week high/low counts — 0 here means "not computed", and callers
      // should treat this breadth object as partial, not exhaustive.
      unchanged: 0,
      advanceDeclineRatio: declines > 0 ? advances / declines : advances,
      newFiftyTwoWeekHighs: 0,
      newFiftyTwoWeekLows: 0,
      totalTraded: summary.tradedScrips ?? 0
    };
  }

  async getSectorPerformances(): Promise<SectorPerformance[]> {
    /*
     * Would require historical index series per sector (1D/1W/1M/3M/1Y
     * change) which isn't wired up yet. Never fabricate momentum/relative
     * strength labels — return empty until real historical data is joined.
     */
    return [];
  }

  async getInstitutionalFlows(): Promise<InstitutionalActivity[]> {
    /*
     * NEPSE does not publish an FII/DII-style daily flow feed the way
     * NSE/BSE do. There's no legitimate public source for this yet.
     */
    return [];
  }

  async getMacroIndicators(): Promise<MacroIndicator[]> {
    /*
     * Macro data (inflation, policy rate, remittance, forex reserves)
     * belongs to Nepal Rastra Bank / official sources and isn't wired up.
     */
    return [];
  }

  async searchStocks(query: string): Promise<StockQuote[]> {
    return this.scraper.search(query);
  }

  async getAllStocks(): Promise<StockQuote[]> {
    return this.scraper.getAllQuotes();
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    return this.scraper.getLiveStockQuote(symbol);
  }

  async getHistoricalCandles(symbol: string, timeframe = '1D'): Promise<OHLCV[]> {
    const candles = await this.scraper.getHistoricalCandles(symbol);

    return this.filterTimeframe(candles, timeframe);
  }

  private filterTimeframe(candles: OHLCV[], timeframe: string): OHLCV[] {
    if (!candles.length) {
      return [];
    }

    const days = this.timeframeDays(timeframe);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    return candles.filter(candle => {
      const time = new Date(candle.time).getTime();
      return Number.isFinite(time) && time >= cutoff;
    });
  }

  private timeframeDays(timeframe: string): number {
    switch (timeframe.toUpperCase()) {
      case '1W':
        return 7;
      case '1M':
        return 31;
      case '3M':
        return 93;
      case '6M':
        return 186;
      case '1Y':
        return 365;
      case '5Y':
        return 1825;
      default:
        return 30;
    }
  }

  async getQuarterlyResults(_symbol: string): Promise<QuarterlyResult[]> {
    /*
     * IMPORTANT: do not return fake financial statements. NEPSE company
     * disclosures aren't wired up as a structured source yet — return
     * empty and let the UI show "Data unavailable" rather than invent
     * revenue/EPS/profit numbers.
     */
    return [];
  }

  async getShareholdingPattern(_symbol: string): Promise<ShareholdingPattern[]> {
    return [];
  }

  async getCorporateActions(_symbol: string): Promise<CorporateAction[]> {
    return [];
  }

  async getBulkBlockDeals(_symbol: string): Promise<BulkBlockDeal[]> {
    return [];
  }

  async getMarketNews(_category?: string): Promise<NewsArticle[]> {
    return [];
  }

  async getStockNews(_symbol: string): Promise<NewsArticle[]> {
    return [];
  }

  async getIPOs(): Promise<IPOItem[]> {
    return [];
  }

  async getIPOById(_id: string): Promise<IPOItem | null> {
    return null;
  }
}
