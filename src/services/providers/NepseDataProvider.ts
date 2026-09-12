import {
  IDataProvider
} from './IDataProvider';

import {
  NepseLiveScraper
} from './NepseLiveScraper';

export class NepseDataProvider
  implements IDataProvider {

  name =
    'NEPSE Data Provider';

   providerType: 'NEPSE_API';
  private readonly scraper =
    NepseLiveScraper.getInstance();

  async getMarketStatus(): Promise<any> {
    /*
     * Get status directly from NEPSE.
     *
     * We intentionally don't create a fake
     * OPEN/CLOSED status.
     */
    const summary =
      await this.scraper
        .getLiveMarketSummary();

    return summary;
  }

  async getPrimaryIndices(): Promise<any[]> {
    const summary =
      await this.scraper
        .getLiveMarketSummary();

    return [
      {
        symbol: 'NEPSE',
        name: 'NEPSE Index',

        currentValue:
          summary.nepseIndex,

        change:
          summary.indexChange,

        percentChange:
          summary.indexChangePercent,

        source:
          'NEPSE'
      }
    ];
  }

  async getSectoralIndices(): Promise<any[]> {
    /*
     * This will be connected to
     * getNepseSubIndices() next.
     *
     * Never fabricate sector values.
     */
    return [];
  }

  async getMarketBreadth(): Promise<any> {
    const [
      gainers,
      losers
    ] = await Promise.all([
      this.scraper
        .getLiveMarketSummary()
        .then(x => x.topGainers),

      this.scraper
        .getLiveMarketSummary()
        .then(x => x.topLosers)
    ]);

    return {
      advances:
        gainers.length,

      declines:
        losers.length,

      unchanged: 0,

      advanceDeclineRatio:
        losers.length > 0
          ? gainers.length /
            losers.length
          : gainers.length,

      source:
        'NEPSE'
    };
  }

  async getSectorPerformances(): Promise<any[]> {
    return [];
  }

  async getInstitutionalFlows(): Promise<any[]> {
    /*
     * Do not call random numbers
     * institutional flow data.
     */
    return [];
  }

  async getMacroIndicators(): Promise<any[]> {
    /*
     * Macro data belongs to NRB
     * and other official sources.
     */
    return [];
  }

  async searchStocks(
    query: string
  ): Promise<any[]> {

    return this.scraper
      .search(query);
  }

  async getAllStocks(): Promise<any[]> {

    return this.scraper
      .getAllQuotes();
  }

  async getQuote(
    symbol: string
  ): Promise<any | null> {

    return this.scraper
      .getLiveStockQuote(symbol);
  }

  async getHistoricalCandles(
    symbol: string,
    timeframe = '1D'
  ): Promise<any[]> {

    const candles =
      await this.scraper
        .getHistoricalCandles(
          symbol
        );

    return this.filterTimeframe(
      candles,
      timeframe
    );
  }

  private filterTimeframe(
    candles: any[],
    timeframe: string
  ) {

    if (!candles.length) {
      return [];
    }

    const days =
      this.timeframeDays(
        timeframe
      );

    const cutoff =
      Date.now() -
      days *
      24 *
      60 *
      60 *
      1000;

    return candles.filter(
      candle => {

        const time =
          new Date(
            candle.time
          ).getTime();

        return Number.isFinite(time) &&
          time >= cutoff;
      }
    );
  }

  private timeframeDays(
    timeframe: string
  ): number {

    switch (
      timeframe.toUpperCase()
    ) {

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

  async getQuarterlyResults(
    _symbol: string
  ): Promise<any[]> {

    /*
     * IMPORTANT:
     *
     * Do not return fake financial
     * statements.
     *
     * We will add the actual company
     * disclosure source separately.
     */
    return [];
  }

  async getShareholdingPattern(
    _symbol: string
  ): Promise<any[]> {

    return [];
  }

  async getCorporateActions(
    _symbol: string
  ): Promise<any[]> {

    return [];
  }

  async getBulkBlockDeals(
    _symbol: string
  ): Promise<any[]> {

    return [];
  }

  async getMarketNews(
    _category?: string
  ): Promise<any[]> {

    return [];
  }

  async getStockNews(
    _symbol: string
  ): Promise<any[]> {

    return [];
  }

  async getIPOs(): Promise<any[]> {

    return [];
  }

  async getIPOById(
    _id: string
  ): Promise<any | null> {

    return null;
  }
}