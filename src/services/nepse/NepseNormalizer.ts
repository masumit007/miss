import { DataValidator } from './DataValidator';
import { StockQuote, OHLCV } from '../../types/stock';

function get(object: any, keys: string[]): any {
  if (!object || typeof object !== 'object') {
    return null;
  }

  for (const key of keys) {
    const value = object[key];

    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return null;
}

function toNumber(value: any): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(
    String(value).replace(/,/g, '').replace(/%/g, '').trim()
  );

  return Number.isFinite(number) ? number : null;
}

function toString(value: any): string {
  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

/*
|--------------------------------------------------------------------------
| QUOTE NORMALIZER
|--------------------------------------------------------------------------
| Produces a real StockQuote from a raw NEPSE live-market record, or null
| if the record doesn't carry enough real data to build one. NEVER fills
| a missing required field with a fabricated number — if a required field
| (price/OHLCV) can't be parsed, the whole quote is treated as unavailable
| rather than shown with an invented value.
|
| Fields NEPSE's live feed does not provide at all (marketCap, beta, isin,
| faceValue, sharesOutstanding, fiftyTwoWeekHigh/Low, averageVolume,
| volumeRatio, deliveryPercentage, industry) are explicitly set to null.
| Populating them requires a further join against getSecurityDetails() /
| getCompanies(), which is a separate, not-yet-implemented enrichment step.
| Sector IS sometimes present directly on the live record and is used when
| available; otherwise it stays null.
*/
export function normalizeQuote(raw: any): StockQuote | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const security =
    raw.security && typeof raw.security === 'object' ? raw.security : null;

  const company =
    security?.companyId && typeof security.companyId === 'object'
      ? security.companyId
      : null;

  const sectorMaster =
    company?.sectorMaster && typeof company.sectorMaster === 'object'
      ? company.sectorMaster
      : null;

  const symbol =
    toString(get(raw, ['symbol', 'securitySymbol', 'ticker', 'code'])) ||
    toString(get(security, ['symbol', 'securitySymbol', 'ticker', 'code'])) ||
    toString(get(company, ['companyShortName']));

  if (!symbol) {
    return null;
  }

  const name =
    toString(get(raw, ['securityName', 'name', 'companyName'])) ||
    toString(get(security, ['securityName', 'name'])) ||
    toString(get(company, ['companyName'])) ||
    symbol;

  const currentPrice = toNumber(
    get(raw, ['lastTradedPrice', 'ltp', 'lastPrice', 'closePrice', 'closingPrice'])
  );

  const previousClose = toNumber(
    get(raw, ['previousDayClosePrice', 'previousClose', 'previousClosingPrice'])
  );

  let dayChange = toNumber(get(raw, ['change', 'difference', 'priceChange']));

  let dayChangePercent = toNumber(
    get(raw, ['percentageChange', 'perChange', 'changePercent', 'percentChange'])
  );

  // If NEPSE doesn't provide the change directly, derive it — this is
  // arithmetic on real fetched numbers, not fabrication.
  if (dayChange === null && currentPrice !== null && previousClose !== null) {
    dayChange = currentPrice - previousClose;
  }

  if (
    dayChangePercent === null &&
    dayChange !== null &&
    previousClose !== null &&
    previousClose !== 0
  ) {
    dayChangePercent = (dayChange / previousClose) * 100;
  }

  const open = toNumber(get(raw, ['openPrice', 'open']));
  const high = toNumber(get(raw, ['highPrice', 'high', 'dayHigh']));
  const low = toNumber(get(raw, ['lowPrice', 'low', 'dayLow']));

  const volume = toNumber(
    get(raw, ['lastTradedVolume', 'totalTradedQuantity', 'volume', 'tradedVolume'])
  );

  const turnover = toNumber(get(raw, ['totalTradedValue', 'turnover', 'value']));

  const sector =
    toString(get(raw, ['sector', 'sectorName'])) ||
    toString(get(sectorMaster, ['sectorDescription'])) ||
    null;

  const fetchedAt =
    toString(get(raw, ['lastUpdatedDateTime', 'lastUpdatedTime', 'fetchedAt'])) ||
    new Date().toISOString();

  // Required fields for a usable quote. If any of these can't be parsed
  // from the source, we don't have a real quote to show — return null
  // rather than filling the gap with 0 or an invented number.
  if (
    currentPrice === null ||
    previousClose === null ||
    dayChange === null ||
    dayChangePercent === null ||
    open === null ||
    high === null ||
    low === null ||
    volume === null
  ) {
    return null;
  }

  return {
    symbol,
    exchange: 'NEPSE',
    name,

    currentPrice,
    dayChange,
    dayChangePercent,
    open,
    previousClose,
    dayHigh: high,
    dayLow: low,
    volume,
    turnover: turnover ?? 0,

    // Not available from the live feed today — see file header comment.
    isin: null,
    fiftyTwoWeekHigh: null,
    fiftyTwoWeekLow: null,
    averageVolume: null,
    volumeRatio: null,
    marketCap: null,
    freeFloatMarketCap: null,
    faceValue: null,
    sharesOutstanding: null,
    industry: null,
    beta: null,
    deliveryPercentage: null,

    sector,

    freshness: {
      timestamp: new Date().toISOString(),
      formattedTime: fetchedAt,
      source: 'NEPSE (live market feed)',
      status: 'LIVE',
      // Reflects that several StockQuote fields are known-unavailable from
      // this source, not a claim of full data completeness.
      completeness: 55,
      confidence: 'Medium'
    }
  };
}

/*
|--------------------------------------------------------------------------
| OHLCV NORMALIZER
|--------------------------------------------------------------------------
*/

export function normalizeOHLCV(raw: any): OHLCV | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const date = get(raw, [
    'businessDate',
    'business_date',
    'date',
    'tradeDate',
    'time',
    'timestamp'
  ]);

  const open = toNumber(get(raw, ['openPrice', 'open']));
  const high = toNumber(get(raw, ['highPrice', 'high']));
  const low = toNumber(get(raw, ['lowPrice', 'low']));
  const close = toNumber(
    get(raw, ['closePrice', 'close', 'lastTradedPrice'])
  );
  const volume = toNumber(
    get(raw, ['totalTradedQuantity', 'lastTradedVolume', 'volume', 'tradedVolume'])
  );

  if (!date || open === null || high === null || low === null || close === null) {
    return null;
  }

  if (!DataValidator.validOHLC(open, high, low, close)) {
    return null;
  }

  return {
    time: String(date),
    open,
    high,
    low,
    close,
    volume: volume ?? 0
  };
}
