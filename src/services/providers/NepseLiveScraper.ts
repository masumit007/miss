import {
  NepseClient
} from '../nepse/NepseClient';

import {
  normalizeQuote,
  normalizeOHLCV
} from '../nepse/NepseNormalizer';

export interface MarketSummary {
  nepseIndex: number | null;
  indexChange: number | null;
  indexChangePercent: number | null;

  turnover: number | null;
  volume: number | null;
  transactions: number | null;
  tradedScrips: number | null;

  topGainers: Array<{
    symbol: string;
    price: number | null;
    changePercent: number | null;
  }>;

  topLosers: Array<{
    symbol: string;
    price: number | null;
    changePercent: number | null;
  }>;

  fetchedAt: string;
  source: string;
}

export class NepseLiveScraper {
  private static instance:
    NepseLiveScraper;

  private readonly client:
    NepseClient;

  private constructor() {
    this.client =
      NepseClient.getInstance();
  }

  public static getInstance():
    NepseLiveScraper {

    if (!NepseLiveScraper.instance) {
      NepseLiveScraper.instance =
        new NepseLiveScraper();
    }

    return NepseLiveScraper.instance;
  }

  async getLiveMarketSummary():
    Promise<MarketSummary> {

    const [
      summaryRaw,
      indicesRaw,
      gainersRaw,
      losersRaw
    ] = await Promise.all([
      this.client.getMarketSummary(),
      this.client.getIndices(),
      this.client.getGainers(),
      this.client.getLosers()
    ]);

    const summary =
      summaryRaw as any;

    const indices =
      Array.isArray(indicesRaw)
        ? indicesRaw
        : [];

    const nepseIndexRaw =
      indices.find(
        (item: any) => {

          const name =
            String(
              item?.indexName ??
              item?.name ??
              ''
            ).toUpperCase();

          return name === 'NEPSE' ||
            name.includes('NEPSE INDEX');
        }
      ) ?? indices[0];

    const nepseIndex =
      this.number(
        nepseIndexRaw?.currentValue ??
        nepseIndexRaw?.indexValue ??
        nepseIndexRaw?.value
      );

    const indexChange =
      this.number(
        nepseIndexRaw?.change ??
        nepseIndexRaw?.difference
      );

    const indexChangePercent =
      this.number(
        nepseIndexRaw?.percentageChange ??
        nepseIndexRaw?.percentChange
      );

    return {
      nepseIndex,
      indexChange,
      indexChangePercent,

      turnover:
        this.number(
          summary?.['Total Turnover Rs:'] ??
          summary?.totalTurnover ??
          summary?.totalTradedValue
        ),

      volume:
        this.number(
          summary?.['Total Traded Shares'] ??
          summary?.totalTradedShares ??
          summary?.totalVolume
        ),

      transactions:
        this.number(
          summary?.['Total Transactions'] ??
          summary?.totalTransactions
        ),

      tradedScrips:
        this.number(
          summary?.['Total Scrips Traded'] ??
          summary?.totalScripsTraded
        ),

      topGainers:
        this.normalizeMovers(
          gainersRaw
        ),

      topLosers:
        this.normalizeMovers(
          losersRaw
        ),

      fetchedAt:
        new Date().toISOString(),

      source:
        'NEPSE'
    };
  }

  async getLiveStockQuote(
    symbol: string
  ) {

    const normalized =
      symbol
        .trim()
        .toUpperCase();

    if (!normalized) {
      return null;
    }

    const raw =
      await this.client.getLiveMarket();

    const list =
      Array.isArray(raw)
        ? raw
        : Array.isArray(
            (raw as any)?.data
          )
          ? (raw as any).data
          : [];

    const found =
      list.find(
        (item: any) =>
          String(
            item?.symbol ??
            item?.securitySymbol ??
            item?.ticker ??
            ''
          ).toUpperCase() ===
          normalized
      );

    return normalizeQuote(found);
  }

  async getAllQuotes() {

    const raw =
      await this.client.getLiveMarket();

    const list =
      Array.isArray(raw)
        ? raw
        : Array.isArray(
            (raw as any)?.data
          )
          ? (raw as any).data
          : [];

    return list
      .map(normalizeQuote)
      .filter(Boolean);
  }

  async search(
    query: string
  ) {

    const q =
      query
        .trim()
        .toUpperCase();

    const stocks =
      await this.getAllQuotes();

    if (!q) {
      return stocks.slice(0, 50);
    }

    return stocks.filter(
      stock =>
        stock.symbol
          .toUpperCase()
          .includes(q) ||
        stock.name
          .toUpperCase()
          .includes(q)
    );
  }

  async getHistoricalCandles(
    symbol: string
  ) {

    const raw =
      await this.client
        .getPriceVolumeHistory(
          symbol
            .trim()
            .toUpperCase()
        );

    const list =
      Array.isArray(raw)
        ? raw
        : Array.isArray(
            (raw as any)?.data
          )
          ? (raw as any).data
          : [];

    return list
      .map(normalizeOHLCV)
      .filter(Boolean);
  }

  async getAllSecurities() {
    return this.client
      .getSecurities();
  }

  async getCompanyDetails(
    symbol: string
  ) {
    return this.client
      .getSecurityDetails(
        symbol
          .trim()
          .toUpperCase()
      );
  }

  async getMarketDepth(
    symbol: string
  ) {
    return this.client
      .getMarketDepth(
        symbol
          .trim()
          .toUpperCase()
      );
  }

  async getFloorsheet(
    symbol?: string
  ) {
    return this.client
      .getFloorsheet(
        symbol
          ? {
              symbol:
                symbol
                  .trim()
                  .toUpperCase()
            }
          : undefined
      );
  }

  private number(
    value: unknown
  ): number | null {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return null;
    }

    const parsed =
      Number(
        String(value)
          .replace(/,/g, '')
          .replace(/%/g, '')
          .trim()
      );

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  private normalizeMovers(
    raw: any
  ) {

    const list =
      Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : [];

    return list.map(
      (item: any) => {

        const symbol =
          String(
            item?.symbol ??
            item?.securitySymbol ??
            item?.ticker ??
            ''
          ).toUpperCase();

        const price =
          this.number(
            item?.lastTradedPrice ??
            item?.ltp ??
            item?.price
          );

        const changePercent =
          this.number(
            item?.percentageChange ??
            item?.changePercent ??
            item?.percentChange
          );

        return {
          symbol,
          price,
          changePercent
        };
      }
    );
  }
}