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
import { FloorsheetAnalysis } from '../../types/broker';
import { BrokerEngine } from '../analytics/brokerEngine';

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
      totalTraded: summary.tradedScrips ?? 0,
      totalTurnoverNpr: summary.turnover,
      totalVolume: summary.volume
    };
  }

  // Real NEPSE sub-index IDs mapped to display names. Sourced directly
  // from @rumess/nepse-api's IndexIDEnum — not invented.
  private static readonly SECTOR_INDEX_MAP: Array<{ id: string; name: string }> = [
    { id: '51', name: 'Commercial Banks' },
    { id: '55', name: 'Development Banks' },
    { id: '60', name: 'Finance' },
    { id: '52', name: 'Hotels & Tourism' },
    { id: '54', name: 'Hydro Power' },
    { id: '67', name: 'Investment' },
    { id: '65', name: 'Life Insurance' },
    { id: '56', name: 'Manufacturing & Processing' },
    { id: '64', name: 'Microfinance' },
    { id: '66', name: 'Mutual Fund' },
    { id: '59', name: 'Non-Life Insurance' },
    { id: '53', name: 'Others' },
    { id: '61', name: 'Trading' }
  ];

  async getSectorPerformances(): Promise<SectorPerformance[]> {
    const allStocks = await this.getAllStocks();

    const results = await Promise.all(
      NepseDataProvider.SECTOR_INDEX_MAP.map(async sector => {
        const history = await this.scraper.getSectorIndexHistory(sector.id as any);

        if (history.length === 0) {
          return null;
        }

        // History is [timestamp, value] pairs, most sources ordered oldest->newest.
        const sorted = [...history].sort((a, b) => a[0] - b[0]);
        const latest = sorted[sorted.length - 1];
        const latestValue = latest[1];
        const latestTime = latest[0];

        const changeFrom = (daysAgo: number): number | null => {
          const targetTime = latestTime - daysAgo * 24 * 60 * 60 * 1000;
          // Find the closest real data point at or before the target time.
          let closest: [number, number] | null = null;
          for (const point of sorted) {
            if (point[0] <= targetTime) closest = point;
            else break;
          }
          if (!closest || closest[1] === 0) return null;
          return Math.round(((latestValue - closest[1]) / closest[1]) * 1000) / 10;
        };

        const oneDayChange = changeFrom(1);
        const oneWeekChange = changeFrom(7);
        const oneMonthChange = changeFrom(30);
        const threeMonthChange = changeFrom(90);
        const oneYearChange = changeFrom(365);

        // Real top mover within this sector, from real live quotes.
        const sectorStocks = allStocks.filter(s => s.sector === sector.name);
        const topStock = sectorStocks.length
          ? sectorStocks.reduce((best, s) => (s.dayChangePercent > best.dayChangePercent ? s : best))
          : null;

        const momentumBasis = oneMonthChange ?? oneWeekChange ?? oneDayChange;
        const momentum: SectorPerformance['momentum'] =
          momentumBasis === null ? 'Neutral'
            : momentumBasis >= 8 ? 'Strong Bullish'
            : momentumBasis >= 2 ? 'Bullish'
            : momentumBasis <= -8 ? 'Strong Bearish'
            : momentumBasis <= -2 ? 'Bearish'
            : 'Neutral';

        const perf: SectorPerformance = {
          name: sector.name,
          oneDayChange,
          oneWeekChange,
          oneMonthChange,
          threeMonthChange,
          oneYearChange,
          momentum,
          // Real NEPSE-index-vs-sector comparison requires the primary
          // NEPSE index's own change over the same window, computed below.
          relativeStrengthVsNepse: 'In-line',
          topStockSymbol: topStock?.symbol ?? null,
          topStockGain: topStock?.dayChangePercent ?? null
        };

        return perf;
      })
    );

    const sectors = results.filter((s): s is SectorPerformance => s !== null);

    // Now that we have all sector 1M changes, compute the real NEPSE
    // index's own 1M change once and use it to set relative strength.
    const nepseHistory = await this.scraper.getSectorIndexHistory('58' as any);
    if (nepseHistory.length > 0) {
      const sorted = [...nepseHistory].sort((a, b) => a[0] - b[0]);
      const latest = sorted[sorted.length - 1];
      const targetTime = latest[0] - 30 * 24 * 60 * 60 * 1000;
      let closest: [number, number] | null = null;
      for (const point of sorted) {
        if (point[0] <= targetTime) closest = point;
        else break;
      }
      const nepse1M = closest && closest[1] !== 0 ? ((latest[1] - closest[1]) / closest[1]) * 100 : null;

      if (nepse1M !== null) {
        for (const s of sectors) {
          if (s.oneMonthChange === null) continue;
          s.relativeStrengthVsNepse =
            s.oneMonthChange > nepse1M + 1 ? 'Outperforming'
              : s.oneMonthChange < nepse1M - 1 ? 'Underperforming'
              : 'In-line';
        }
      }
    }

    return sectors;
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

  async getFloorsheetAnalysis(symbol: string): Promise<FloorsheetAnalysis> {
    const rows = await this.scraper.getFloorsheetRows(symbol);
    return BrokerEngine.analyze(symbol.trim().toUpperCase(), rows);
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
