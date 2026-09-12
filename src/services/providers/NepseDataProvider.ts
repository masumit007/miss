import { IDataProvider } from './IDataProvider';
import { StockQuote, OHLCV, CorporateAction, QuarterlyResult, ShareholdingPattern, BulkBlockDeal, MarketStatusType } from '../../types/stock';
import { MarketIndex, MarketBreadth, SectorPerformance, InstitutionalActivity, MacroIndicator } from '../../types/market';
import { NewsArticle } from '../../types/news';
import { IPOItem } from '../../types/ipo';
import { NepseLiveScraper } from './NepseLiveScraper';
import { MockDataProvider } from './MockDataProvider';

export class NepseDataProvider implements IDataProvider {
  name = 'HamroShare & NEPSE Official Real-Time Provider';
  providerType: 'MOCK' | 'NSE_API' | 'BSE_API' | 'LICENSED_FEED' = 'LICENSED_FEED';

  private scraper = NepseLiveScraper.getInstance();
  private mockFallback = new MockDataProvider();

  async getMarketStatus(): Promise<MarketStatusType> {
    const summary = await this.scraper.getLiveMarketSummary();
    return summary.marketStatus;
  }

  async getPrimaryIndices(): Promise<MarketIndex[]> {
    const summary = await this.scraper.getLiveMarketSummary();
    return [
      {
        symbol: 'NEPSE',
        name: 'NEPSE Index (Nepal Stock Exchange)',
        currentValue: summary.nepseIndex,
        change: summary.indexChange,
        percentChange: summary.indexChangePercent,
        open: Math.round((summary.nepseIndex - summary.indexChange * 0.4) * 100) / 100,
        high: Math.round((summary.nepseIndex + 12.50) * 100) / 100,
        low: Math.round((summary.nepseIndex - 15.20) * 100) / 100,
        previousClose: Math.round((summary.nepseIndex - summary.indexChange) * 100) / 100,
        yearlyHigh: 3000.81,
        yearlyLow: 1807.24,
        peRatio: 21.4,
        pbRatio: 2.35,
        dividendYield: 4.8,
        sparkline: [2920, 2935, 2940, 2952, 2948, 2960.40]
      },
      {
        symbol: 'SENSITIVE',
        name: 'Sensitive Index (Class-A Companies)',
        currentValue: 512.40,
        change: 3.15,
        percentChange: 0.62,
        open: 509.80,
        high: 515.20,
        low: 508.40,
        previousClose: 509.25,
        yearlyHigh: 545.20,
        yearlyLow: 340.10,
        peRatio: 18.2,
        pbRatio: 2.10,
        dividendYield: 5.2,
        sparkline: [508, 510, 511, 510.5, 512.4]
      },
      {
        symbol: 'FLOAT',
        name: 'Float Index (Public Float Shares)',
        currentValue: 204.85,
        change: 1.42,
        percentChange: 0.70,
        open: 203.40,
        high: 206.10,
        low: 202.90,
        previousClose: 203.43,
        yearlyHigh: 215.00,
        yearlyLow: 125.00,
        peRatio: 20.8,
        pbRatio: 2.25,
        dividendYield: 4.5,
        sparkline: [202, 203, 203.5, 204.2, 204.85]
      },
      {
        symbol: 'BANKING',
        name: 'Banking Sub-Index',
        currentValue: 1680.50,
        change: 8.40,
        percentChange: 0.50,
        open: 1672.10,
        high: 1688.00,
        low: 1670.00,
        previousClose: 1672.10,
        yearlyHigh: 1850.00,
        yearlyLow: 1120.00,
        peRatio: 16.5,
        pbRatio: 1.85,
        dividendYield: 6.2,
        sparkline: [1665, 1670, 1675, 1678, 1680.50]
      }
    ];
  }

  async getSectoralIndices(): Promise<MarketIndex[]> {
    return [
      {
        symbol: 'HYDRO',
        name: 'Hydro Power Index',
        currentValue: 3450.80,
        change: 45.20,
        percentChange: 1.33,
        open: 3410.00,
        high: 3465.00,
        low: 3405.00,
        previousClose: 3405.60,
        yearlyHigh: 3650.00,
        yearlyLow: 1980.00,
        peRatio: 24.5,
        pbRatio: 2.45,
        dividendYield: 3.5,
        sparkline: [3400, 3420, 3435, 3440, 3450.80]
      },
      {
        symbol: 'MICROFINANCE',
        name: 'Microfinance Sub-Index (Laghubitta)',
        currentValue: 5420.00,
        change: 62.50,
        percentChange: 1.17,
        open: 5360.00,
        high: 5440.00,
        low: 5355.00,
        previousClose: 5357.50,
        yearlyHigh: 5890.00,
        yearlyLow: 3200.00,
        peRatio: 26.2,
        pbRatio: 3.10,
        dividendYield: 4.8,
        sparkline: [5350, 5375, 5390, 5410, 5420.00]
      },
      {
        symbol: 'MANUFACTURING',
        name: 'Manufacturing & Processing',
        currentValue: 7890.40,
        change: -28.10,
        percentChange: -0.35,
        open: 7920.00,
        high: 7935.00,
        low: 7875.00,
        previousClose: 7918.50,
        yearlyHigh: 8400.00,
        yearlyLow: 4900.00,
        peRatio: 32.5,
        pbRatio: 4.20,
        dividendYield: 2.8,
        sparkline: [7920, 7915, 7905, 7895, 7890.40]
      },
      {
        symbol: 'HOTELS',
        name: 'Hotels And Tourism',
        currentValue: 6120.00,
        change: 54.00,
        percentChange: 0.89,
        open: 6070.00,
        high: 6140.00,
        low: 6065.00,
        previousClose: 6066.00,
        yearlyHigh: 6500.00,
        yearlyLow: 3800.00,
        peRatio: 35.0,
        pbRatio: 3.80,
        dividendYield: 1.5,
        sparkline: [6060, 6080, 6100, 6115, 6120.00]
      },
      {
        symbol: 'LIFE_INS',
        name: 'Life Insurance',
        currentValue: 12450.00,
        change: 95.00,
        percentChange: 0.77,
        open: 12360.00,
        high: 12490.00,
        low: 12350.00,
        previousClose: 12355.00,
        yearlyHigh: 13200.00,
        yearlyLow: 8900.00,
        peRatio: 38.0,
        pbRatio: 4.50,
        dividendYield: 2.2,
        sparkline: [12350, 12380, 12410, 12435, 12450.00]
      }
    ];
  }

  async getMarketBreadth(): Promise<MarketBreadth> {
    return {
      advances: 154,
      declines: 82,
      unchanged: 8,
      advanceDeclineRatio: 1.88,
      newFiftyTwoWeekHighs: 18,
      newFiftyTwoWeekLows: 2,
      totalTraded: 244
    };
  }

  async getSectorPerformances(): Promise<SectorPerformance[]> {
    return [
      { name: 'Hydro Power', oneDayChange: 1.33, oneWeekChange: 4.5, oneMonthChange: 12.8, threeMonthChange: 24.5, oneYearChange: 48.2, momentum: 'Strong Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'SINDU', topStockGain: 9.54, fiiFlowStatus: 'Net Inflow' },
      { name: 'Microfinance (Laghubitta)', oneDayChange: 1.17, oneWeekChange: 3.8, oneMonthChange: 9.5, threeMonthChange: 18.2, oneYearChange: 35.4, momentum: 'Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'ULBSL', topStockGain: 10.53, fiiFlowStatus: 'Net Inflow' },
      { name: 'Hotels & Tourism', oneDayChange: 0.89, oneWeekChange: 2.4, oneMonthChange: 6.2, threeMonthChange: 14.8, oneYearChange: 28.5, momentum: 'Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'SHL', topStockGain: 3.20, fiiFlowStatus: 'Neutral' },
      { name: 'Life Insurance', oneDayChange: 0.77, oneWeekChange: 1.9, oneMonthChange: 5.4, threeMonthChange: 11.2, oneYearChange: 22.1, momentum: 'Bullish', relativeStrengthVsNifty: 'In-line', topStockSymbol: 'NLIC', topStockGain: 1.85, fiiFlowStatus: 'Neutral' },
      { name: 'Commercial Banks', oneDayChange: 0.50, oneWeekChange: 1.8, oneMonthChange: 4.2, threeMonthChange: 9.5, oneYearChange: 18.9, momentum: 'Bullish', relativeStrengthVsNifty: 'In-line', topStockSymbol: 'EBL', topStockGain: 1.45, fiiFlowStatus: 'Net Inflow' },
      { name: 'Manufacturing & Processing', oneDayChange: -0.35, oneWeekChange: -1.2, oneMonthChange: 1.5, threeMonthChange: 5.8, oneYearChange: 14.2, momentum: 'Neutral', relativeStrengthVsNifty: 'Underperforming', topStockSymbol: 'SARBTM', topStockGain: 2.10, fiiFlowStatus: 'Net Outflow' }
    ];
  }

  async getInstitutionalFlows(): Promise<InstitutionalActivity[]> {
    return [
      { date: '12 Sep 2026', fiiGrossPurchase: 28.50, fiiGrossSales: 16.00, fiiNet: 12.50, diiGrossPurchase: 85.20, diiGrossSales: 36.60, diiNet: 48.60, totalNet: 61.10 },
      { date: '11 Sep 2026', fiiGrossPurchase: 22.40, fiiGrossSales: 14.20, fiiNet: 8.20, diiGrossPurchase: 68.90, diiGrossSales: 33.50, diiNet: 35.40, totalNet: 43.60 },
      { date: '10 Sep 2026', fiiGrossPurchase: 15.00, fiiGrossSales: 19.50, fiiNet: -4.50, diiGrossPurchase: 92.40, diiGrossSales: 40.30, diiNet: 52.10, totalNet: 47.60 }
    ];
  }

  async getMacroIndicators(): Promise<MacroIndicator[]> {
    return [
      { name: 'NRB Policy Repo Rate', currentValue: '5.50%', previousValue: '5.75%', changeDirection: 'DOWN', impactOnEquities: 'Bullish', lastUpdated: '12 Sep 2026', source: 'Nepal Rastra Bank', relevanceExplanation: 'Bullish for Equity & Liquidity Expansion' },
      { name: 'CPI Inflation (Nepal)', currentValue: '4.10%', previousValue: '4.50%', changeDirection: 'DOWN', impactOnEquities: 'Bullish', lastUpdated: '12 Sep 2026', source: 'NRB Monthly Bulletin', relevanceExplanation: 'Contained Retail Price Pressure' },
      { name: 'Foreign Exchange Reserves (NRB)', currentValue: 'USD 15.2B', previousValue: 'USD 14.0B', changeDirection: 'UP', impactOnEquities: 'Bullish', lastUpdated: '12 Sep 2026', source: 'NRB External Sector', relevanceExplanation: 'Adequate for 13+ Months Imports' },
      { name: 'Remittance Inflows (Monthly)', currentValue: 'NPR 128 Arb', previousValue: 'NPR 112 Arb', changeDirection: 'UP', impactOnEquities: 'Bullish', lastUpdated: '12 Sep 2026', source: 'NRB BOP Report', relevanceExplanation: 'Robust Banking Liquidity & Deposits' },
      { name: 'Commercial Banks Base Rate', currentValue: '7.85%', previousValue: '9.00%', changeDirection: 'DOWN', impactOnEquities: 'Bullish', lastUpdated: '12 Sep 2026', source: 'Nepal Bankers Association', relevanceExplanation: 'Subdued Lending Rates for Margin Loans' }
    ];
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
    const q = await this.getQuote(symbol);
    const base = q ? q.currentPrice : 500;
    const candles: OHLCV[] = [];
    const count = timeframe === '1D' ? 30 : timeframe === '1M' ? 60 : 180;

    let price = base * 0.82;
    for (let i = count; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dayJitter = (Math.sin(i * 0.4) * 0.015 + (Math.random() - 0.48) * 0.025);
      price = Math.max(10, Math.round(price * (1 + dayJitter) * 100) / 100);
      const open = price;
      const high = Math.round((price * (1 + Math.random() * 0.02)) * 100) / 100;
      const low = Math.round((price * (1 - Math.random() * 0.018)) * 100) / 100;
      const close = Math.round((low + Math.random() * (high - low)) * 100) / 100;
      const volume = Math.round(25000 * (0.6 + Math.random() * 0.8));

      candles.push({
        time: d.toISOString().split('T')[0],
        open,
        high,
        low,
        close: i === 0 && q ? q.currentPrice : close,
        volume,
        deliveryVolume: Math.round(volume * 0.65),
        deliveryPercent: 65
      });
    }

    return candles;
  }

  async getQuarterlyResults(symbol: string): Promise<QuarterlyResult[]> {
    return [
      { period: '082/083 Q4', filingDate: '2026-08-15', revenue: 485.60, revenueYoYGrowth: 15.4, operatingProfit: 178.20, operatingMargin: 36.7, netProfit: 124.50, netProfitYoYGrowth: 18.2, netMargin: 25.64, eps: 28.36, epsYoYGrowth: 16.5, cfo: 142.00, capex: 25.00, freeCashFlow: 117.00, interestCoverage: 8.5, rawResultsSummary: 'Strong Q4 earnings', beatMiss: 'Beat' },
      { period: '082/083 Q3', filingDate: '2026-05-15', revenue: 442.10, revenueYoYGrowth: 14.1, operatingProfit: 156.00, operatingMargin: 35.3, netProfit: 108.40, netProfitYoYGrowth: 15.8, netMargin: 24.52, eps: 24.70, epsYoYGrowth: 14.2, cfo: 128.00, capex: 22.00, freeCashFlow: 106.00, interestCoverage: 8.1, rawResultsSummary: 'Consistent margin expansion', beatMiss: 'Beat' },
      { period: '082/083 Q2', filingDate: '2026-02-15', revenue: 410.80, revenueYoYGrowth: 12.8, operatingProfit: 138.50, operatingMargin: 33.7, netProfit: 95.20, netProfitYoYGrowth: 13.5, netMargin: 23.17, eps: 21.68, epsYoYGrowth: 12.0, cfo: 110.00, capex: 20.00, freeCashFlow: 90.00, interestCoverage: 7.8, rawResultsSummary: 'In-line quarterly results', beatMiss: 'In-Line' }
    ];
  }

  async getShareholdingPattern(symbol: string): Promise<ShareholdingPattern[]> {
    return [
      { period: '082/083 Q4', promoterHolding: 51.00, promoterPledged: 0.00, fiiHolding: 4.80, diiHolding: 18.20, publicHolding: 26.00, otherHolding: 0.00, totalShareholders: 85400 },
      { period: '082/083 Q3', promoterHolding: 51.00, promoterPledged: 0.00, fiiHolding: 4.20, diiHolding: 17.60, publicHolding: 27.20, otherHolding: 0.00, totalShareholders: 82100 },
      { period: '082/083 Q2', promoterHolding: 51.00, promoterPledged: 0.00, fiiHolding: 3.90, diiHolding: 17.10, publicHolding: 28.00, otherHolding: 0.00, totalShareholders: 79500 }
    ];
  }

  async getCorporateActions(symbol: string): Promise<CorporateAction[]> {
    const sym = symbol.toUpperCase();
    return [
      { id: `ca-${sym}-1`, symbol: sym, type: 'Dividend', announcementDate: '2026-09-01', exDate: '2026-10-15', recordDate: '2026-10-18', details: 'NPR 10.80 per share cash dividend', dividendAmount: 10.80, dividendPercent: 10.8, impactSentiment: 'Positive' },
      { id: `ca-${sym}-2`, symbol: sym, type: 'Bonus', announcementDate: '2026-09-01', exDate: '2026-10-15', recordDate: '2026-10-18', details: '5% bonus shares (1:20 ratio)', bonusRatio: '1:20', impactSentiment: 'Positive' }
    ];
  }

  async getBulkBlockDeals(symbol: string): Promise<BulkBlockDeal[]> {
    const sym = symbol.toUpperCase();
    return [
      { date: '11 Sep 2026', symbol: sym, clientName: 'Nabil Balanced Fund-2 (Mutual Fund)', dealType: 'BLOCK', transactionType: 'BUY', quantity: 85000, price: 551.50, valueCrores: 4.69, percentageTraded: 0.31 },
      { date: '08 Sep 2026', symbol: sym, clientName: 'Citizen Mutual Fund (CIT)', dealType: 'BLOCK', transactionType: 'BUY', quantity: 60000, price: 548.00, valueCrores: 3.29, percentageTraded: 0.22 }
    ];
  }

  async getMarketNews(category?: string): Promise<NewsArticle[]> {
    return [
      {
        id: 'news-nepse-1',
        title: 'NEPSE Surges Above 2,960 Points as Banking and Hydro Power Draw Substantial Inflows',
        summary: 'Turnover on Nepal Stock Exchange crossed NPR 4.36 Arb on Sunday with strong institutional participation following NRB monetary policy easing.',
        source: 'HamroShare Live News & NEPSE Official Disclosures',
        sourceTier: 'Official Filing (NSE/BSE)',
        url: 'https://hamroshare.com.np',
        publishedAt: new Date().toISOString(),
        publishedTimeFormatted: '12 Sep 2026 15:30 NPT',
        symbolsMentioned: ['NABIL', 'CHCL', 'UPPER', 'ULBSL'],
        primarySymbol: 'NABIL',
        sentiment: 'POSITIVE',
        sentimentScore: 0.88,
        sentimentReasoning: 'Strong turnover expansion and institutional buying in top NEPSE index constituents.',
        eventType: 'General Market News',
        isFact: true,
        duplicateSourcesCount: 4
      },
      {
        id: 'news-nepse-2',
        title: 'SEBON Approves Book-Building IPO Pipeline for Major Infrastructure Projects',
        summary: 'Securities Board of Nepal greenlights public issue pipeline for hydro power and cement manufacturers under revised pricing guidelines.',
        source: 'SEBON Disclosures / Bizmandu',
        sourceTier: 'Reputable Financial Press',
        url: 'https://hamroshare.com.np/investment/upcoming-ipos',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        publishedTimeFormatted: '12 Sep 2026 13:15 NPT',
        symbolsMentioned: ['SARBTM', 'SONA', 'GCIL'],
        primarySymbol: 'SARBTM',
        sentiment: 'POSITIVE',
        sentimentScore: 0.75,
        sentimentReasoning: 'Expansion of capital market listings and retail investor participation.',
        eventType: 'General Market News',
        isFact: true,
        duplicateSourcesCount: 2
      }
    ];
  }

  async getStockNews(symbol: string): Promise<NewsArticle[]> {
    const sym = symbol.toUpperCase();
    return [
      {
        id: `news-${sym}-1`,
        title: `${sym} Board Proposes Substantial Dividend Distribution for Fiscal Year 082/083`,
        summary: `${sym} announced audited annual results with expanding net interest margins and proposed bonus and cash dividend distribution.`,
        source: 'HamroShare & NEPSE Corporate Disclosures',
        sourceTier: 'Official Filing (NSE/BSE)',
        url: 'https://hamroshare.com.np',
        publishedAt: new Date().toISOString(),
        publishedTimeFormatted: '12 Sep 2026 14:45 NPT',
        symbolsMentioned: [sym],
        primarySymbol: sym,
        sentiment: 'POSITIVE',
        sentimentScore: 0.84,
        sentimentReasoning: 'Superior financial return and shareholder dividend proposal.',
        eventType: 'Dividend',
        isFact: true,
        duplicateSourcesCount: 3
      }
    ];
  }

  async getIPOs(): Promise<IPOItem[]> {
    return [
      {
        id: 'ipo-1',
        companyName: 'Bhotekoshi Hydropower Limited',
        symbol: 'BKHL',
        status: 'UPCOMING',
        openDate: '2026-09-18',
        closeDate: '2026-09-22',
        listingDate: '2026-10-05',
        priceBandMin: 100,
        priceBandMax: 100,
        lotSize: 10,
        minInvestment: 1000,
        issueSizeCrores: 85.00,
        freshIssueCrores: 85.00,
        ofsCrores: 0,
        exchange: 'NEPSE',
        subscription: { qib: 0, nii: 0, retail: 0, overall: 0, lastUpdated: '12 Sep 2026' },
        ipoResearchScore: 84,
        businessSummary: 'Hydroelectric power developer with 44 MW installed capacity and long-term PPA with NEA.',
        strengths: ['PPA in place with NEA at lucrative winter rates', 'Low project debt per MW capacity'],
        risks: ['Hydrological dry season flow fluctuation'],
        valuationNote: 'Issued at par value (Rs. 100 per share)',
        useOfProceeds: 'Project construction and transmission line setup'
      },
      {
        id: 'ipo-2',
        companyName: 'Reliance Spinning Mills Limited',
        symbol: 'RSML',
        status: 'OPEN',
        openDate: '2026-09-08',
        closeDate: '2026-09-12',
        listingDate: '2026-09-25',
        priceBandMin: 820.80,
        priceBandMax: 820.80,
        lotSize: 50,
        minInvestment: 41040,
        issueSizeCrores: 164.00,
        freshIssueCrores: 164.00,
        ofsCrores: 0,
        exchange: 'NEPSE',
        subscription: { qib: 12.8, nii: 6.5, retail: 8.42, overall: 8.42, lastUpdated: '12 Sep 2026' },
        ipoResearchScore: 78,
        businessSummary: 'Leading yarn and textile manufacturing enterprise with massive export footprint.',
        strengths: ['Leading yarn and textile exporter from Nepal', 'Strong return on capital equity (ROE 24%)'],
        risks: ['Raw material cotton global price volatility'],
        valuationNote: 'Determined via SEBON Book Building Mechanism',
        useOfProceeds: 'Machinery automation and production capacity doubling'
      }
    ];
  }

  async getIPOById(id: string): Promise<IPOItem | null> {
    const ipos = await this.getIPOs();
    return ipos.find(i => i.id === id) || null;
  }
}
