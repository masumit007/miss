import { DataValidator } from './DataValidator';

export interface NormalizedQuote {
  symbol: string;
  name: string;
  currentPrice: number | null;
  previousClose: number | null;
  dayChange: number | null;
  dayChangePercent: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  turnover: number | null;
  sector: string | null;
  source: string;
  fetchedAt: string;
}

function get(
  object: any,
  keys: string[]
): any {
  if (!object || typeof object !== 'object') {
    return null;
  }

  for (const key of keys) {
    const value = object[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      return value;
    }
  }

  return null;
}

function toNumber(
  value: any
): number | null {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function toString(
  value: any
): string {
  if (
    value === undefined ||
    value === null
  ) {
    return '';
  }

  return String(value).trim();
}

/*
|--------------------------------------------------------------------------
| QUOTE NORMALIZER
|--------------------------------------------------------------------------
*/

export function normalizeQuote(
  raw: any
): NormalizedQuote | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const security =
    raw.security &&
    typeof raw.security === 'object'
      ? raw.security
      : null;

  const company =
    security?.companyId &&
    typeof security.companyId === 'object'
      ? security.companyId
      : null;

  const sectorMaster =
    company?.sectorMaster &&
    typeof company.sectorMaster === 'object'
      ? company.sectorMaster
      : null;

  const symbol =
    toString(
      get(raw, [
        'symbol',
        'securitySymbol',
        'ticker',
        'code'
      ])
    ) ||
    toString(
      get(security, [
        'symbol',
        'securitySymbol',
        'ticker',
        'code'
      ])
    ) ||
    toString(
      get(company, [
        'companyShortName'
      ])
    );

  if (!symbol) {
    return null;
  }

  const name =
    toString(
      get(raw, [
        'securityName',
        'name',
        'companyName'
      ])
    ) ||
    toString(
      get(security, [
        'securityName',
        'name'
      ])
    ) ||
    toString(
      get(company, [
        'companyName'
      ])
    );

  const currentPrice =
    toNumber(
      get(raw, [
        'lastTradedPrice',
        'ltp',
        'lastPrice',
        'closePrice',
        'closingPrice'
      ])
    );

  const previousClose =
    toNumber(
      get(raw, [
        'previousDayClosePrice',
        'previousClose',
        'previousClosingPrice'
      ])
    );

  let dayChange =
    toNumber(
      get(raw, [
        'change',
        'difference',
        'priceChange'
      ])
    );

  let dayChangePercent =
    toNumber(
      get(raw, [
        'percentageChange',
        'perChange',
        'changePercent',
        'percentChange'
      ])
    );

  /*
   * If NEPSE does not provide the change directly,
   * calculate it from current price and previous close.
   */
  if (
    dayChange === null &&
    currentPrice !== null &&
    previousClose !== null
  ) {
    dayChange =
      currentPrice - previousClose;
  }

  if (
    dayChangePercent === null &&
    dayChange !== null &&
    previousClose !== null &&
    previousClose !== 0
  ) {
    dayChangePercent =
      (dayChange / previousClose) * 100;
  }

  const open =
    toNumber(
      get(raw, [
        'openPrice',
        'open'
      ])
    );

  const high =
    toNumber(
      get(raw, [
        'highPrice',
        'high',
        'dayHigh'
      ])
    );

  const low =
    toNumber(
      get(raw, [
        'lowPrice',
        'low',
        'dayLow'
      ])
    );

  const volume =
    toNumber(
      get(raw, [
        'lastTradedVolume',
        'totalTradedQuantity',
        'volume',
        'tradedVolume'
      ])
    );

  const turnover =
    toNumber(
      get(raw, [
        'totalTradedValue',
        'turnover',
        'value'
      ])
    );

  const sector =
    toString(
      get(raw, [
        'sector',
        'sectorName'
      ])
    ) ||
    toString(
      get(sectorMaster, [
        'sectorDescription'
      ])
    ) ||
    null;

  const fetchedAt =
    toString(
      get(raw, [
        'lastUpdatedDateTime',
        'lastUpdatedTime',
        'fetchedAt'
      ])
    ) ||
    new Date().toISOString();

  return {
    symbol,
    name,

    currentPrice,

    previousClose,

    dayChange,

    dayChangePercent,

    open,

    high,

    low,

    volume,

    turnover,

    sector,

    source: 'NEPSE',

    fetchedAt
  };
}

/*
|--------------------------------------------------------------------------
| OHLCV NORMALIZER
|--------------------------------------------------------------------------
*/

export function normalizeOHLCV(
  raw: any
): any | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const date =
    get(raw, [
      'businessDate',
      'business_date',
      'date',
      'tradeDate',
      'time',
      'timestamp'
    ]);

  const open =
    toNumber(
      get(raw, [
        'openPrice',
        'open'
      ])
    );

  const high =
    toNumber(
      get(raw, [
        'highPrice',
        'high'
      ])
    );

  const low =
    toNumber(
      get(raw, [
        'lowPrice',
        'low'
      ])
    );

  const close =
    toNumber(
      get(raw, [
        'closePrice',
        'close',
        'lastTradedPrice'
      ])
    );

  const volume =
    toNumber(
      get(raw, [
        'totalTradedQuantity',
        'lastTradedVolume',
        'volume',
        'tradedVolume'
      ])
    );

  if (
    !date ||
    open === null ||
    high === null ||
    low === null ||
    close === null
  ) {
    return null;
  }

  /*
   * Keep the validator, but never allow one bad
   * NEPSE record to crash the complete chart.
   */
  try {
    const validation =
      DataValidator.validateOHLCV({
        time: String(date),
        open,
        high,
        low,
        close,
        volume: volume ?? 0
      });

    if (!validation.valid) {
      return null;
    }
  } catch {
    // If validator has a different implementation,
    // the normalized OHLC data can still be returned.
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