import { NepseClient } from '../nepse/NepseClient';
import { normalizeQuote, normalizeOHLCV, extractSecurityDetailsPatch } from '../nepse/NepseNormalizer';
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

  /**
   * Fills in fields the live-market feed alone doesn't carry (52-week
   * high/low, ISIN, face value, market cap, listed shares, industry)
   * using the real getSecurityDetails() endpoint. Only used for
   * single-symbol lookups (stock detail page) — deliberately NOT applied
   * to getAllQuotes(), since that would mean one extra NEPSE round-trip
   * per stock on a full-listing request.
   *
   * If the details call fails for any reason, the original quote is
   * returned unchanged rather than the whole lookup failing — this is a
   * genuine enrichment, not a required field.
   */
  private async enrichSecurityDetails(quote: StockQuote): Promise<StockQuote> {
    try {
      const details = await this.client.getSecurityDetails(quote.symbol);
      const patch = extractSecurityDetailsPatch(details);

      return {
        ...quote,
        ...patch,
        // Only use the details endpoint's industry as a sector fallback —
        // never overwrite a sector the live feed already gave us.
        sector: quote.sector ?? patch.industry ?? quote.sector
      };
    } catch (error) {
      console.error(`getSecurityDetails enrichment failed for ${quote.symbol}:`, error);
      return quote;
    }
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

    if (!quote) {
      return null;
    }

    const withSector = await this.enrichSector(quote);
    return this.enrichSecurityDetails(withSector);
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

  // Sector index history (for computing real sector performance) is
  // fetched from the real NEPSE index-graph endpoint and cached — it's
  // expensive to pull per sub-index and doesn't change intraday history.
  private sectorHistoryCache = new Map<string, { data: [number, number][]; fetchedAt: number }>();
  private readonly SECTOR_HISTORY_TTL_MS = 30 * 60 * 1000; // 30 minutes

  async getSectorIndexHistory(indexId: import('@rumess/nepse-api').IndexIDEnum): Promise<[number, number][]> {
    const cached = this.sectorHistoryCache.get(indexId);
    if (cached && Date.now() - cached.fetchedAt < this.SECTOR_HISTORY_TTL_MS) {
      return cached.data;
    }

    try {
      const raw = await this.client.getIndexGraph(indexId);
      const data = Array.isArray(raw) ? (raw as [number, number][]) : [];
      this.sectorHistoryCache.set(indexId, { data, fetchedAt: Date.now() });
      return data;
    } catch {
      // Real source failed — return cached (possibly empty), never fabricate.
      return cached?.data ?? [];
    }
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

  /**
   * Pulls up to `maxPages` of real floorsheet rows for a symbol and
   * flattens them. Bounded so a single request can't hang or cause a
   * serverless function timeout — see BrokerEngine for how this is
   * disclosed in the result (transactionsAnalyzed reflects what was
   * actually pulled, not the full day's floorsheet).
   */
  async getFloorsheetRows(symbol: string, maxPages = 3, pageSize = 500): Promise<any[]> {
    const normalized = symbol.trim().toUpperCase();
    const rows: any[] = [];

    for (let page = 0; page < maxPages; page++) {
      try {
        const result: any = await this.client.getFloorsheet({ symbol: normalized, page, size: pageSize });
        const content = result?.floorsheets?.content ?? result?.content ?? [];
        if (!Array.isArray(content) || content.length === 0) break;
        rows.push(...content);
        if (content.length < pageSize) break; // last page
      } catch {
        break; // real source failed — return what we already have, never fabricate more.
      }
    }

    return rows;
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
