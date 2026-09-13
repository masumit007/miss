import { NepseClient } from '../nepse/NepseClient';
import { normalizeQuote, normalizeOHLCV } from '../nepse/NepseNormalizer';
import { StockQuote, OHLCV } from '../../types/stock';

export interface MarketMover {
  symbol: string;
  price: number | null;
  changePercent: number | null;
}

export interface MarketSummary {
  nepseIndex: number | null;
  indexChange: number | null;
  indexChangePercent: number | null;

  turnover: number | null;
  volume: number | null;
  transactions: number | null;
  tradedScrips: number | null;

  topGainers: MarketMover[];
  topLosers: MarketMover[];

  fetchedAt: string;
  source: string;
}

export class NepseLiveScraper {
  private static instance: NepseLiveScraper;

  private readonly client: NepseClient;

  // Sector/industry rarely changes intraday — cache the symbol->sector
  // join from the real company list instead of refetching it per quote.
  private sectorMapCache: Map<string, string> | null = null;
  private sectorMapFetchedAt = 0;
  private readonly SECTOR_MAP_TTL_MS = 60 * 60 * 1000; // 1 hour

  private constructor() {
    this.client = NepseClient.getInstance();
  }

  public static getInstance(): NepseLiveScraper {
    if (!NepseLiveScraper.instance) {
      NepseLiveScraper.instance = new NepseLiveScraper();
    }

    return NepseLiveScraper.instance;
  }

  /**
   * Real symbol -> sectorName join from getCompanies(). Cached for an
   * hour since this genuinely doesn't change intraday. Returns an empty
   * map (never fabricated sectors) if the real source fails.
   */
  private async getSectorMap(): Promise<Map<string, string>> {
    const isFresh = this.sectorMapCache && Date.now() - this.sectorMapFetchedAt < this.SECTOR_MAP_TTL_MS;

    if (isFresh) {
      return this.sectorMapCache!;
    }

    try {
      const companies = await this.client.getCompanies();
      const map = new Map<string, string>();

      for (const company of Array.isArray(companies) ? companies : []) {
        const symbol = String((company as any)?.symbol ?? '').toUpperCase();
        const sectorName = String((company as any)?.sectorName ?? '').trim();

        if (symbol && sectorName) {
          map.set(symbol, sectorName);
        }
      }

      this.sectorMapCache = map;
      this.sectorMapFetchedAt = Date.now();

      return map;
    } catch {
      // Real source failed — return whatever we had cached (possibly
      // empty) rather than fabricating sector data.
      return this.sectorMapCache ?? new Map();
    }
  }

  private async enrichSector(quote: StockQuote): Promise<StockQuote> {
    if (quote.sector) {
      return quote;
    }

    const sectorMap = await this.getSectorMap();
    const sector = sectorMap.get(quote.symbol) ?? null;

    return sector ? { ...quote, sector } : quote;
  }

  async getLiveMarketSummary(): Promise<MarketSummary> {
    const [summaryRaw, indices, gainersRaw, losersRaw] = await Promise.all([
      this.client.getMarketSummary(),
      this.client.getIndices(),
      this.client.getGainers(),
      this.client.getLosers()
    ]);

    const summary = (summaryRaw ?? {}) as Record<string, unknown>;

    // Real field on NepseIndex is `index` (the index name), not `indexName`/`name`.
    const nepseIndexRaw =
      (Array.isArray(indices) ? indices : []).find(item => {
        const name = String(item?.index ?? '').toUpperCase();
        return name === 'NEPSE' || name.includes('NEPSE INDEX');
      }) ?? (Array.isArray(indices) ? indices[0] : undefined);

    return {
      nepseIndex: this.number(nepseIndexRaw?.currentValue),
      indexChange: this.number(nepseIndexRaw?.change),
      indexChangePercent: this.number(nepseIndexRaw?.perChange),

      turnover: this.number(
        summary['Total Turnover Rs:'] ?? summary['totalTurnover'] ?? summary['totalTradedValue']
      ),

      volume: this.number(
        summary['Total Traded Shares'] ?? summary['totalTradedShares'] ?? summary['totalVolume']
      ),

      transactions: this.number(
        summary['Total Transactions'] ?? summary['totalTransactions']
      ),

      tradedScrips: this.number(
        summary['Total Scrips Traded'] ?? summary['totalScripsTraded']
      ),

      topGainers: this.normalizeMovers(gainersRaw),
      topLosers: this.normalizeMovers(losersRaw),

      fetchedAt: new Date().toISOString(),
      source: 'NEPSE'
    };
  }

  async getLiveStockQuote(symbol: string): Promise<StockQuote | null> {
    const normalized = symbol.trim().toUpperCase();

    if (!normalized) {
      return null;
    }

    const list = await this.client.getLiveMarket();

    const found = (Array.isArray(list) ? list : []).find(
      item => String(item?.symbol ?? '').toUpperCase() === normalized
    );

    const quote = found ? normalizeQuote(found) : null;

    return quote ? this.enrichSector(quote) : null;
  }

  async getAllQuotes(): Promise<StockQuote[]> {
    const list = await this.client.getLiveMarket();

    const quotes = (Array.isArray(list) ? list : [])
      .map(normalizeQuote)
      .filter((q): q is StockQuote => q !== null);

    // One real sector-map fetch (cached) shared across the whole batch,
    // not one per stock.
    const sectorMap = await this.getSectorMap();

    return quotes.map(quote => {
      if (quote.sector) return quote;
      const sector = sectorMap.get(quote.symbol);
      return sector ? { ...quote, sector } : quote;
    });
  }

  async search(query: string): Promise<StockQuote[]> {
    const q = query.trim().toUpperCase();
    const stocks = await this.getAllQuotes();

    if (!q) {
      return stocks.slice(0, 50);
    }

    return stocks.filter(
      stock =>
        stock.symbol.toUpperCase().includes(q) ||
        stock.name.toUpperCase().includes(q)
    );
  }

  async getHistoricalCandles(symbol: string): Promise<OHLCV[]> {
    const raw = await this.client.getPriceVolumeHistory(symbol.trim().toUpperCase());

    const list = Array.isArray(raw)
      ? raw
      : Array.isArray((raw as any)?.content)
        ? (raw as any).content
        : [];

    return list.map(normalizeOHLCV).filter((c: OHLCV | null): c is OHLCV => c !== null);
  }

  async getAllSecurities() {
    return this.client.getSecurities();
  }

  async getAllSubIndices() {
    const raw = await this.client.getSubIndices();
    return Array.isArray(raw) ? raw : [];
  }

  async getCompanyDetails(symbol: string) {
    return this.client.getSecurityDetails(symbol.trim().toUpperCase());
  }

  async getMarketStatus() {
    return this.client.getMarketStatus();
  }

  async getMarketDepth(symbol: string) {
    return this.client.getMarketDepth(symbol.trim().toUpperCase());
  }

  async getFloorsheet(symbol?: string) {
    return this.client.getFloorsheet(symbol ? { symbol: symbol.trim().toUpperCase() } : undefined);
  }

  private number(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(String(value).replace(/,/g, '').replace(/%/g, '').trim());

    return Number.isFinite(parsed) ? parsed : null;
  }

  private normalizeMovers(raw: unknown): MarketMover[] {
    const list = Array.isArray(raw) ? raw : [];

    return list.map((item: any) => ({
      symbol: String(item?.symbol ?? '').toUpperCase(),
      price: this.number(item?.ltp ?? item?.lastTradedPrice ?? item?.price),
      changePercent: this.number(item?.percentChange ?? item?.percentageChange)
    }));
  }
}
