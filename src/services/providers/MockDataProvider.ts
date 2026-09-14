import { IDataProvider } from './IDataProvider';
import {
  StockQuote,
  OHLCV,
  CorporateAction,
  QuarterlyResult,
  ShareholdingPattern,
  BulkBlockDeal,
  MarketStatusType,
  DataFreshness
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

/*
|--------------------------------------------------------------------------
| MOCK / DEMO DATA PROVIDER
|--------------------------------------------------------------------------
| Every value here is invented for UI development and demos. It must NEVER
| be presented to a user as live NEPSE data — that's why every freshness
| object below carries status: 'DEMO DATA'. Symbols below correspond to
| real NEPSE-listed companies (by sector, for realism), but the prices,
| ratios, and news are illustrative placeholders, not real filings.
*/

function demoFreshness(): DataFreshness {
  return {
    timestamp: new Date().toISOString(),
    formattedTime: new Date().toLocaleString('en-NP'),
    source: 'MISS Demo Dataset',
    status: 'DEMO DATA',
    completeness: 100,
    confidence: 'Low'
  };
}

interface DemoSeed {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  prevClose: number;
  faceValue: number;
  sharesOutstanding: number; // in Crores of shares
}

const DEMO_SEEDS: DemoSeed[] = [
  { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Commercial Banks', industry: 'Banking', price: 985, prevClose: 972, faceValue: 100, sharesOutstanding: 0.3 },
  { symbol: 'GBIME', name: 'Global IME Bank Limited', sector: 'Commercial Banks', industry: 'Banking', price: 212, prevClose: 209, faceValue: 100, sharesOutstanding: 0.85 },
  { symbol: 'NLIC', name: 'Nepal Life Insurance Company Limited', sector: 'Life Insurance', industry: 'Insurance', price: 1145, prevClose: 1128, faceValue: 100, sharesOutstanding: 0.12 },
  { symbol: 'NICL', name: 'Nepal Insurance Company Limited', sector: 'Non-Life Insurance', industry: 'Insurance', price: 745, prevClose: 752, faceValue: 100, sharesOutstanding: 0.06 },
  { symbol: 'UPPER', name: 'Upper Tamakoshi Hydropower Limited', sector: 'Hydro Power', industry: 'Power Generation', price: 328, prevClose: 315, faceValue: 100, sharesOutstanding: 0.94 },
  { symbol: 'CHCL', name: 'Chilime Hydropower Company Limited', sector: 'Hydro Power', industry: 'Power Generation', price: 512, prevClose: 520, faceValue: 100, sharesOutstanding: 0.04 },
  { symbol: 'NTC', name: 'Nepal Telecom (Nepal Doorsanchar Company Limited)', sector: 'Trading', industry: 'Telecommunications', price: 890, prevClose: 885, faceValue: 100, sharesOutstanding: 0.68 },
  { symbol: 'NRIC', name: 'Nepal Reinsurance Company Limited', sector: 'Non-Life Insurance', industry: 'Reinsurance', price: 615, prevClose: 622, faceValue: 100, sharesOutstanding: 0.15 },
  { symbol: 'CBBL', name: 'Corporate Development Bank Limited', sector: 'Development Banks', industry: 'Banking', price: 320, prevClose: 311, faceValue: 100, sharesOutstanding: 0.03 },
  { symbol: 'MERO', name: 'Mero Microfinance Laghubitta Bittiya Sanstha Limited', sector: 'Microfinance', industry: 'Microfinance', price: 640, prevClose: 655, faceValue: 100, sharesOutstanding: 0.05 },
  { symbol: 'SHIVM', name: 'Shivam Cements Limited', sector: 'Manufacturing & Processing', industry: 'Cement', price: 445, prevClose: 438, faceValue: 100, sharesOutstanding: 0.14 },
  { symbol: 'CIT', name: 'Citizen Investment Trust', sector: 'Investment', industry: 'Investment', price: 3250, prevClose: 3190, faceValue: 100, sharesOutstanding: 0.08 }
];

function buildDemoQuote(seed: DemoSeed): StockQuote {
  const dayChange = Math.round((seed.price - seed.prevClose) * 100) / 100;
  const dayChangePercent = Math.round((dayChange / seed.prevClose) * 10000) / 100;

  return {
    symbol: seed.symbol,
    exchange: 'NEPSE',
    name: seed.name,
    currentPrice: seed.price,
    dayChange,
    dayChangePercent,
    open: seed.prevClose,
    previousClose: seed.prevClose,
    dayHigh: Math.round(Math.max(seed.price, seed.prevClose) * 1.01 * 100) / 100,
    dayLow: Math.round(Math.min(seed.price, seed.prevClose) * 0.99 * 100) / 100,
    volume: 25000,
    turnover: Math.round(seed.price * 25000),

    isin: `NP0${seed.symbol.padEnd(8, 'X').slice(0, 8)}1`,
    fiftyTwoWeekHigh: Math.round(seed.price * 1.35 * 100) / 100,
    fiftyTwoWeekLow: Math.round(seed.price * 0.65 * 100) / 100,
    averageVolume: 22000,
    volumeRatio: 1.1,
    marketCap: Math.round(seed.price * seed.sharesOutstanding * 10000000) / 10000000, // NPR Crores
    freeFloatMarketCap: null,
    faceValue: seed.faceValue,
    sharesOutstanding: seed.sharesOutstanding,
    sector: seed.sector,
    industry: seed.industry,
    beta: 0.9,
    deliveryPercentage: null,

    freshness: demoFreshness()
  };
}

export class MockDataProvider implements IDataProvider {
  name = 'MISS Demo Data Provider (NEPSE, illustrative only)';
  providerType: 'MOCK' = 'MOCK';

  private readonly stocks: StockQuote[] = DEMO_SEEDS.map(buildDemoQuote);

  private readonly indices: MarketIndex[] = [
    { symbol: 'NEPSE', name: 'NEPSE Index', currentValue: 2145.32, change: 12.4, percentChange: 0.58, high: 2150.1, low: 2130.2, open: 2132.9, previousClose: 2132.92, yearlyHigh: 2260.5, yearlyLow: 1850.3, sparkline: [2110, 2122, 2118, 2133, 2145] },
    { symbol: 'SENSITIVE', name: 'NEPSE Sensitive Index', currentValue: 452.1, change: 2.1, percentChange: 0.47, high: 453.4, low: 449.2, open: 450.0, previousClose: 450.0, yearlyHigh: 480.2, yearlyLow: 390.4, sparkline: [445, 448, 447, 450, 452] },
    { symbol: 'BANKING', name: 'NEPSE Banking Sub-index', currentValue: 1320.6, change: -4.2, percentChange: -0.32, high: 1330.0, low: 1315.0, open: 1324.8, previousClose: 1324.8, yearlyHigh: 1420.0, yearlyLow: 1180.0, sparkline: [1330, 1328, 1325, 1324, 1320] },
    { symbol: 'HYDRO', name: 'NEPSE Hydro Power Sub-index', currentValue: 2890.4, change: 45.6, percentChange: 1.6, high: 2905.0, low: 2840.0, open: 2844.8, previousClose: 2844.8, yearlyHigh: 3200.0, yearlyLow: 2200.0, sparkline: [2820, 2850, 2860, 2845, 2890] }
  ];

  async getMarketStatus(): Promise<MarketStatusType> {
    return 'CLOSED';
  }

  async getPrimaryIndices(): Promise<MarketIndex[]> {
    return this.indices.slice(0, 2);
  }

  async getSectoralIndices(): Promise<MarketIndex[]> {
    return this.indices.slice(2);
  }

  async getMarketBreadth(): Promise<MarketBreadth> {
    return {
      advances: 96,
      declines: 78,
      unchanged: 12,
      advanceDeclineRatio: 1.23,
      newFiftyTwoWeekHighs: 4,
      newFiftyTwoWeekLows: 2,
      totalTraded: 186,
      totalTurnoverNpr: 4360000000,
      totalVolume: 12100000
    };
  }

  async getSectorPerformances(): Promise<SectorPerformance[]> {
    return [
      {
        name: 'Hydro Power',
        oneDayChange: 1.6,
        oneWeekChange: 3.2,
        oneMonthChange: 8.4,
        threeMonthChange: 15.2,
        oneYearChange: 22.1,
        momentum: 'Bullish',
        relativeStrengthVsNepse: 'Outperforming',
        topStockSymbol: 'UPPER',
        topStockGain: 4.1
      },
      {
        name: 'Commercial Banks',
        oneDayChange: -0.3,
        oneWeekChange: 0.4,
        oneMonthChange: 2.1,
        threeMonthChange: -1.5,
        oneYearChange: 3.8,
        momentum: 'Neutral',
        relativeStrengthVsNepse: 'In-line',
        topStockSymbol: 'GBIME',
        topStockGain: 1.4
      }
    ];
  }

  async getInstitutionalFlows(): Promise<InstitutionalActivity[]> {
    return [];
  }

  async getMacroIndicators(): Promise<MacroIndicator[]> {
    return [
      {
        name: 'Nepal Rastra Bank Policy Rate',
        currentValue: '5.5%',
        previousValue: '6.0%',
        changeDirection: 'DOWN',
        impactOnEquities: 'Bullish',
        lastUpdated: 'Demo value',
        source: 'Illustrative (not sourced from NRB)',
        relevanceExplanation: 'Lower policy rates generally ease bank funding costs and can support equity valuations.'
      }
    ];
  }

  async searchStocks(query: string): Promise<StockQuote[]> {
    const q = query.trim().toUpperCase();
    if (!q) return this.stocks;
    return this.stocks.filter(
      s => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
    );
  }

  async getAllStocks(): Promise<StockQuote[]> {
    return this.stocks;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    return this.stocks.find(s => s.symbol === symbol.toUpperCase()) ?? null;
  }

  async getHistoricalCandles(symbol: string): Promise<OHLCV[]> {
    const quote = await this.getQuote(symbol);
    if (!quote) return [];

    const candles: OHLCV[] = [];
    let price = quote.currentPrice * 0.85;

    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const drift = (Math.sin(i / 7) + (Math.random() - 0.5)) * (price * 0.01);
      const open = price;
      const close = Math.max(1, price + drift);
      const high = Math.max(open, close) * 1.005;
      const low = Math.min(open, close) * 0.995;

      candles.push({
        time: date.toISOString().slice(0, 10),
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.round(15000 + Math.random() * 20000)
      });

      price = close;
    }

    return candles;
  }

  async getQuarterlyResults(_symbol: string): Promise<QuarterlyResult[]> {
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
    return {
      symbol: symbol.toUpperCase(),
      transactionsAnalyzed: 0,
      totalQuantity: 0,
      totalValueNpr: 0,
      brokerActivity: [],
      top3BrokerConcentrationPercent: 0,
      largeTransactions: [],
      signal: 'Insufficient Data',
      source: 'MISS Demo Dataset (not real floorsheet data)',
      retrievedAt: new Date().toISOString()
    };
  }

  async getMarketNews(_category?: string): Promise<NewsArticle[]> {
    return [
      {
        id: 'demo-news-1',
        title: '[DEMO] Sample headline for UI testing — Nabil Bank quarterly update',
        summary: 'This is placeholder demo news content used only for UI development. It is not a real news item.',
        source: 'MISS Demo Dataset',
        sourceTier: 'Industry Publication',
        url: '#',
        publishedAt: new Date().toISOString(),
        publishedTimeFormatted: 'Demo data — not a real timestamp',
        symbolsMentioned: ['NABIL'],
        primarySymbol: 'NABIL',
        sentiment: 'NEUTRAL',
        sentimentScore: 0,
        sentimentReasoning: 'Demo placeholder — no real sentiment analysis performed.',
        eventType: 'General Market News',
        isFact: false,
        duplicateSourcesCount: 0
      }
    ];
  }

  async getStockNews(symbol: string): Promise<NewsArticle[]> {
    const news = await this.getMarketNews();
    return news.filter(n => n.symbolsMentioned.includes(symbol.toUpperCase()));
  }

  async getIPOs(): Promise<IPOItem[]> {
    return [
      {
        id: 'demo-ipo-1',
        companyName: '[DEMO] Sample Hydropower Company Ltd.',
        symbol: 'DEMOH',
        status: 'UPCOMING',
        openDate: 'Demo data',
        closeDate: 'Demo data',
        listingDate: 'Demo data',
        priceBandMin: 100,
        priceBandMax: 100,
        lotSize: 10,
        minInvestment: 1000,
        issueSizeCrores: 10,
        freshIssueCrores: 10,
        ofsCrores: 0,
        exchange: 'NEPSE',
        subscription: {
          generalPublic: 0,
          mutualFund: 0,
          foreignEmploymentQuota: 0,
          overall: 0,
          lastUpdated: 'Demo data — no real subscription figures'
        },
        ipoResearchScore: 0,
        businessSummary: 'Placeholder demo IPO used only for UI development — not a real issue.',
        strengths: [],
        risks: [],
        valuationNote: 'Demo data — not a real valuation.',
        useOfProceeds: 'Demo data.'
      }
    ];
  }

  async getIPOById(id: string): Promise<IPOItem | null> {
    const ipos = await this.getIPOs();
    return ipos.find(i => i.id === id) ?? null;
  }
}
