import { IDataProvider } from './IDataProvider';
import { StockQuote, OHLCV, CorporateAction, QuarterlyResult, ShareholdingPattern, BulkBlockDeal, MarketStatusType } from '../../types/stock';
import { MarketIndex, MarketBreadth, SectorPerformance, InstitutionalActivity, MacroIndicator } from '../../types/market';
import { NewsArticle } from '../../types/news';
import { IPOItem } from '../../types/ipo';

export class MockDataProvider implements IDataProvider {
  name = 'MISS High-Fidelity Indian Equities Mock Provider';
  providerType: 'MOCK' = 'MOCK';

  private mockStocks: StockQuote[] = [
    {
      symbol: 'RELIANCE',
      exchange: 'NSE',
      bseCode: '500325',
      isin: 'INE002A01018',
      name: 'Reliance Industries Limited',
      currentPrice: 2984.50,
      dayChange: 32.40,
      dayChangePercent: 1.10,
      open: 2958.00,
      previousClose: 2952.10,
      dayHigh: 2998.00,
      dayLow: 2951.00,
      fiftyTwoWeekHigh: 3217.90,
      fiftyTwoWeekLow: 2220.30,
      volume: 6420100,
      averageVolume: 5120000,
      volumeRatio: 1.25,
      marketCap: 2018450, // Rs Crores
      freeFloatMarketCap: 989040,
      faceValue: 10,
      sharesOutstanding: 676.5,
      sector: 'Energy & Petrochemicals',
      industry: 'Refineries / Telecom / Retail',
      beta: 1.05,
      deliveryPercentage: 58.4,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 98,
        confidence: 'High'
      }
    },
    {
      symbol: 'TCS',
      exchange: 'NSE',
      bseCode: '532540',
      isin: 'INE467B01029',
      name: 'Tata Consultancy Services Limited',
      currentPrice: 4215.80,
      dayChange: 48.60,
      dayChangePercent: 1.17,
      open: 4170.00,
      previousClose: 4167.20,
      dayHigh: 4230.00,
      dayLow: 4165.00,
      fiftyTwoWeekHigh: 4592.25,
      fiftyTwoWeekLow: 3313.00,
      volume: 2180400,
      averageVolume: 1850000,
      volumeRatio: 1.18,
      marketCap: 1525600,
      freeFloatMarketCap: 427168,
      faceValue: 1,
      sharesOutstanding: 361.8,
      sector: 'Information Technology',
      industry: 'IT Services & Consulting',
      beta: 0.78,
      deliveryPercentage: 66.2,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 99,
        confidence: 'High'
      }
    },
    {
      symbol: 'HDFCBANK',
      exchange: 'NSE',
      bseCode: '500180',
      isin: 'INE040A01034',
      name: 'HDFC Bank Limited',
      currentPrice: 1678.30,
      dayChange: -12.40,
      dayChangePercent: -0.73,
      open: 1690.00,
      previousClose: 1690.70,
      dayHigh: 1695.50,
      dayLow: 1672.00,
      fiftyTwoWeekHigh: 1794.00,
      fiftyTwoWeekLow: 1363.55,
      volume: 14820000,
      averageVolume: 12400000,
      volumeRatio: 1.19,
      marketCap: 1276400,
      freeFloatMarketCap: 1276400,
      faceValue: 1,
      sharesOutstanding: 760.5,
      sector: 'Financial Services',
      industry: 'Private Sector Bank',
      beta: 1.12,
      deliveryPercentage: 61.8,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 97,
        confidence: 'High'
      }
    },
    {
      symbol: 'INFY',
      exchange: 'NSE',
      bseCode: '500209',
      isin: 'INE009A01021',
      name: 'Infosys Limited',
      currentPrice: 1845.20,
      dayChange: 26.80,
      dayChangePercent: 1.47,
      open: 1820.00,
      previousClose: 1818.40,
      dayHigh: 1852.00,
      dayLow: 1816.00,
      fiftyTwoWeekHigh: 1991.45,
      fiftyTwoWeekLow: 1358.35,
      volume: 5890000,
      averageVolume: 4950000,
      volumeRatio: 1.19,
      marketCap: 768900,
      freeFloatMarketCap: 653565,
      faceValue: 5,
      sharesOutstanding: 416.7,
      sector: 'Information Technology',
      industry: 'IT Services & Software',
      beta: 0.92,
      deliveryPercentage: 64.5,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 99,
        confidence: 'High'
      }
    },
    {
      symbol: 'ICICIBANK',
      exchange: 'NSE',
      bseCode: '532174',
      isin: 'INE090A01021',
      name: 'ICICI Bank Limited',
      currentPrice: 1242.60,
      dayChange: 14.80,
      dayChangePercent: 1.21,
      open: 1230.00,
      previousClose: 1227.80,
      dayHigh: 1248.00,
      dayLow: 1228.00,
      fiftyTwoWeekHigh: 1310.00,
      fiftyTwoWeekLow: 912.00,
      volume: 9140000,
      averageVolume: 8200000,
      volumeRatio: 1.11,
      marketCap: 874500,
      freeFloatMarketCap: 874500,
      faceValue: 2,
      sharesOutstanding: 703.7,
      sector: 'Financial Services',
      industry: 'Private Sector Bank',
      beta: 1.08,
      deliveryPercentage: 59.2,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 98,
        confidence: 'High'
      }
    },
    {
      symbol: 'TATAMOTORS',
      exchange: 'NSE',
      bseCode: '500570',
      isin: 'INE155A01022',
      name: 'Tata Motors Limited',
      currentPrice: 1048.90,
      dayChange: 21.40,
      dayChangePercent: 2.08,
      open: 1030.00,
      previousClose: 1027.50,
      dayHigh: 1054.00,
      dayLow: 1028.50,
      fiftyTwoWeekHigh: 1179.05,
      fiftyTwoWeekLow: 593.50,
      volume: 8720000,
      averageVolume: 7100000,
      volumeRatio: 1.23,
      marketCap: 387600,
      freeFloatMarketCap: 210079,
      faceValue: 2,
      sharesOutstanding: 368.1,
      sector: 'Automobile',
      industry: 'Commercial & Passenger Vehicles / EV',
      beta: 1.34,
      deliveryPercentage: 44.8,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 96,
        confidence: 'High'
      }
    },
    {
      symbol: 'ITC',
      exchange: 'NSE',
      bseCode: '500875',
      isin: 'INE154A01025',
      name: 'ITC Limited',
      currentPrice: 486.30,
      dayChange: 3.20,
      dayChangePercent: 0.66,
      open: 484.00,
      previousClose: 483.10,
      dayHigh: 489.00,
      dayLow: 483.00,
      fiftyTwoWeekHigh: 528.55,
      fiftyTwoWeekLow: 399.30,
      volume: 11200000,
      averageVolume: 10500000,
      volumeRatio: 1.07,
      marketCap: 607800,
      freeFloatMarketCap: 607800,
      faceValue: 1,
      sharesOutstanding: 1249.8,
      sector: 'Fast Moving Consumer Goods (FMCG)',
      industry: 'Diversified FMCG / Hotels / Paper',
      beta: 0.65,
      deliveryPercentage: 72.4,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 99,
        confidence: 'High'
      }
    },
    {
      symbol: 'BHARTIARTL',
      exchange: 'NSE',
      bseCode: '532454',
      isin: 'INE397D01024',
      name: 'Bharti Airtel Limited',
      currentPrice: 1612.40,
      dayChange: 24.10,
      dayChangePercent: 1.52,
      open: 1590.00,
      previousClose: 1588.30,
      dayHigh: 1618.00,
      dayLow: 1585.00,
      fiftyTwoWeekHigh: 1712.00,
      fiftyTwoWeekLow: 846.00,
      volume: 4950000,
      averageVolume: 4200000,
      volumeRatio: 1.18,
      marketCap: 918700,
      freeFloatMarketCap: 422602,
      faceValue: 5,
      sharesOutstanding: 569.7,
      sector: 'Telecommunication',
      industry: 'Telecom Services & Digital',
      beta: 0.88,
      deliveryPercentage: 68.3,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 97,
        confidence: 'High'
      }
    },
    {
      symbol: 'LT',
      exchange: 'NSE',
      bseCode: '500510',
      isin: 'INE018A01030',
      name: 'Larsen & Toubro Limited',
      currentPrice: 3680.00,
      dayChange: -18.50,
      dayChangePercent: -0.50,
      open: 3700.00,
      previousClose: 3698.50,
      dayHigh: 3720.00,
      dayLow: 3665.00,
      fiftyTwoWeekHigh: 3948.60,
      fiftyTwoWeekLow: 2852.00,
      volume: 1940000,
      averageVolume: 1700000,
      volumeRatio: 1.14,
      marketCap: 506200,
      freeFloatMarketCap: 506200,
      faceValue: 2,
      sharesOutstanding: 137.5,
      sector: 'Capital Goods & Infrastructure',
      industry: 'Heavy Engineering & Construction',
      beta: 1.15,
      deliveryPercentage: 54.1,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 98,
        confidence: 'High'
      }
    },
    {
      symbol: 'SBIN',
      exchange: 'NSE',
      bseCode: '500112',
      isin: 'INE062A01020',
      name: 'State Bank of India',
      currentPrice: 814.20,
      dayChange: 8.70,
      dayChangePercent: 1.08,
      open: 808.00,
      previousClose: 805.50,
      dayHigh: 819.00,
      dayLow: 806.00,
      fiftyTwoWeekHigh: 912.10,
      fiftyTwoWeekLow: 555.25,
      volume: 16400000,
      averageVolume: 14200000,
      volumeRatio: 1.15,
      marketCap: 726800,
      freeFloatMarketCap: 308890,
      faceValue: 1,
      sharesOutstanding: 892.5,
      sector: 'Financial Services',
      industry: 'Public Sector Bank',
      beta: 1.25,
      deliveryPercentage: 47.9,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 98,
        confidence: 'High'
      }
    },
    {
      symbol: 'TITAN',
      exchange: 'NSE',
      bseCode: '500114',
      isin: 'INE280A01028',
      name: 'Titan Company Limited',
      currentPrice: 3540.00,
      dayChange: -35.20,
      dayChangePercent: -0.98,
      open: 3580.00,
      previousClose: 3575.20,
      dayHigh: 3590.00,
      dayLow: 3520.00,
      fiftyTwoWeekHigh: 3886.95,
      fiftyTwoWeekLow: 2925.00,
      volume: 1100000,
      averageVolume: 980000,
      volumeRatio: 1.12,
      marketCap: 314200,
      freeFloatMarketCap: 147988,
      faceValue: 1,
      sharesOutstanding: 88.8,
      sector: 'Consumer Discretionary',
      industry: 'Gems, Jewellery & Watches',
      beta: 0.95,
      deliveryPercentage: 62.1,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 97,
        confidence: 'High'
      }
    },
    {
      symbol: 'SUNPHARMA',
      exchange: 'NSE',
      bseCode: '524715',
      isin: 'INE044A01036',
      name: 'Sun Pharmaceutical Industries Limited',
      currentPrice: 1789.50,
      dayChange: 28.40,
      dayChangePercent: 1.61,
      open: 1765.00,
      previousClose: 1761.10,
      dayHigh: 1795.00,
      dayLow: 1762.00,
      fiftyTwoWeekHigh: 1898.00,
      fiftyTwoWeekLow: 1102.00,
      volume: 2450000,
      averageVolume: 2100000,
      volumeRatio: 1.17,
      marketCap: 429400,
      freeFloatMarketCap: 195377,
      faceValue: 1,
      sharesOutstanding: 239.9,
      sector: 'Healthcare & Pharmaceuticals',
      industry: 'Specialty Pharmaceuticals & Generics',
      beta: 0.58,
      deliveryPercentage: 71.3,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 99,
        confidence: 'High'
      }
    },
    {
      symbol: 'BAJFINANCE',
      exchange: 'NSE',
      bseCode: '500034',
      isin: 'INE296A01024',
      name: 'Bajaj Finance Limited',
      currentPrice: 7280.00,
      dayChange: 110.50,
      dayChangePercent: 1.54,
      open: 7190.00,
      previousClose: 7169.50,
      dayHigh: 7320.00,
      dayLow: 7175.00,
      fiftyTwoWeekHigh: 8192.00,
      fiftyTwoWeekLow: 6350.00,
      volume: 1350000,
      averageVolume: 1100000,
      volumeRatio: 1.23,
      marketCap: 450400,
      freeFloatMarketCap: 202680,
      faceValue: 2,
      sharesOutstanding: 61.8,
      sector: 'Financial Services',
      industry: 'Non-Banking Financial Company (NBFC)',
      beta: 1.28,
      deliveryPercentage: 52.8,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 98,
        confidence: 'High'
      }
    },
    {
      symbol: 'TRENT',
      exchange: 'NSE',
      bseCode: '500251',
      isin: 'INE849A01020',
      name: 'Trent Limited',
      currentPrice: 7120.00,
      dayChange: 245.00,
      dayChangePercent: 3.56,
      open: 6900.00,
      previousClose: 6875.00,
      dayHigh: 7180.00,
      dayLow: 6890.00,
      fiftyTwoWeekHigh: 7420.00,
      fiftyTwoWeekLow: 1980.00,
      volume: 1890000,
      averageVolume: 1200000,
      volumeRatio: 1.58,
      marketCap: 253100,
      freeFloatMarketCap: 160000,
      faceValue: 1,
      sharesOutstanding: 35.5,
      sector: 'Consumer Discretionary',
      industry: 'Retail & Fast Fashion (Zudio / Westside)',
      beta: 1.18,
      deliveryPercentage: 55.4,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 96,
        confidence: 'High'
      }
    },
    {
      symbol: 'BEL',
      exchange: 'NSE',
      bseCode: '500049',
      isin: 'INE263A01024',
      name: 'Bharat Electronics Limited',
      currentPrice: 304.50,
      dayChange: 6.80,
      dayChangePercent: 2.28,
      open: 298.00,
      previousClose: 297.70,
      dayHigh: 306.00,
      dayLow: 297.00,
      fiftyTwoWeekHigh: 340.50,
      fiftyTwoWeekLow: 128.00,
      volume: 22400000,
      averageVolume: 17500000,
      volumeRatio: 1.28,
      marketCap: 222600,
      freeFloatMarketCap: 109074,
      faceValue: 1,
      sharesOutstanding: 730.9,
      sector: 'Capital Goods & Aerospace',
      industry: 'Defense Electronics & Radar Systems',
      beta: 1.12,
      deliveryPercentage: 49.6,
      freshness: {
        timestamp: new Date().toISOString(),
        formattedTime: '29 Aug 2026 15:30:00 IST',
        source: 'Approved Market Data Provider (Demo Feed)',
        status: 'DEMO DATA',
        completeness: 97,
        confidence: 'High'
      }
    }
  ];

  private mockIndices: MarketIndex[] = [
    {
      symbol: 'NIFTY 50',
      name: 'NIFTY 50',
      currentValue: 25145.80,
      change: 184.20,
      percentChange: 0.74,
      high: 25198.50,
      low: 24985.10,
      open: 25010.00,
      previousClose: 24961.60,
      yearlyHigh: 26277.35,
      yearlyLow: 18837.85,
      peRatio: 22.4,
      pbRatio: 3.95,
      dividendYield: 1.22,
      sparkline: [24960, 25010, 25050, 25030, 25090, 25120, 25145.8]
    },
    {
      symbol: 'SENSEX',
      name: 'BSE SENSEX',
      currentValue: 82365.77,
      change: 620.40,
      percentChange: 0.76,
      high: 82510.20,
      low: 81820.00,
      open: 81910.00,
      previousClose: 81745.37,
      yearlyHigh: 85978.25,
      yearlyLow: 63183.70,
      peRatio: 23.1,
      pbRatio: 4.10,
      dividendYield: 1.15,
      sparkline: [81750, 81900, 82050, 82180, 82250, 82365.77]
    },
    {
      symbol: 'BANKNIFTY',
      name: 'NIFTY BANK',
      currentValue: 52180.40,
      change: 310.20,
      percentChange: 0.60,
      high: 52340.00,
      low: 51910.00,
      open: 51950.00,
      previousClose: 51870.20,
      yearlyHigh: 54467.35,
      yearlyLow: 42105.40,
      peRatio: 16.2,
      pbRatio: 2.65,
      dividendYield: 0.88,
      sparkline: [51870, 51950, 52020, 52100, 52180.4]
    },
    {
      symbol: 'NIFTYIT',
      name: 'NIFTY IT',
      currentValue: 42890.10,
      change: 645.80,
      percentChange: 1.53,
      high: 43050.00,
      low: 42310.00,
      open: 42350.00,
      previousClose: 42244.30,
      yearlyHigh: 44250.00,
      yearlyLow: 30800.00,
      peRatio: 31.8,
      pbRatio: 8.40,
      dividendYield: 1.95,
      sparkline: [42240, 42400, 42650, 42780, 42890.1]
    },
    {
      symbol: 'NIFTYMIDCAP100',
      name: 'NIFTY MIDCAP 100',
      currentValue: 59340.60,
      change: 580.40,
      percentChange: 0.99,
      high: 59480.00,
      low: 58850.00,
      open: 58900.00,
      previousClose: 58760.20,
      yearlyHigh: 60925.00,
      yearlyLow: 38200.00,
      peRatio: 33.5,
      pbRatio: 4.85,
      dividendYield: 0.92,
      sparkline: [58760, 58900, 59100, 59250, 59340.6]
    },
    {
      symbol: 'NIFTYSMALLCAP100',
      name: 'NIFTY SMALLCAP 100',
      currentValue: 19120.30,
      change: 215.10,
      percentChange: 1.14,
      high: 19180.00,
      low: 18920.00,
      open: 18950.00,
      previousClose: 18905.20,
      yearlyHigh: 19600.00,
      yearlyLow: 12100.00,
      peRatio: 28.4,
      pbRatio: 3.90,
      dividendYield: 0.81,
      sparkline: [18900, 18980, 19050, 19120.3]
    }
  ];

  async getMarketStatus(): Promise<MarketStatusType> {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const istMinutes = (utcHours * 60 + utcMinutes + 330) % 1440;
    
    // NSE Market timing: Pre-open 09:00 - 09:15 (540 to 555), Regular 09:15 - 15:30 (555 to 930), Post-market 15:40 - 16:00
    const day = now.getUTCDay();
    if (day === 0 || day === 6) {
      return 'CLOSED';
    }
    if (istMinutes >= 540 && istMinutes < 555) return 'PRE-OPEN';
    if (istMinutes >= 555 && istMinutes <= 930) return 'OPEN';
    if (istMinutes > 930 && istMinutes <= 960) return 'POST-MARKET';
    return 'CLOSED';
  }

  async getPrimaryIndices(): Promise<MarketIndex[]> {
    return this.mockIndices;
  }

  async getSectoralIndices(): Promise<MarketIndex[]> {
    return [
      { symbol: 'NIFTY AUTO', name: 'NIFTY AUTO', currentValue: 25890, change: 320, percentChange: 1.25, high: 26000, low: 25600, open: 25650, previousClose: 25570, yearlyHigh: 26500, yearlyLow: 16000, sparkline: [25570, 25700, 25890] },
      { symbol: 'NIFTY PHARMA', name: 'NIFTY PHARMA', currentValue: 23140, change: 290, percentChange: 1.27, high: 23250, low: 22900, open: 22920, previousClose: 22850, yearlyHigh: 23800, yearlyLow: 14800, sparkline: [22850, 23000, 23140] },
      { symbol: 'NIFTY FMCG', name: 'NIFTY FMCG', currentValue: 63820, change: 180, percentChange: 0.28, high: 64100, low: 63600, open: 63700, previousClose: 63640, yearlyHigh: 66400, yearlyLow: 50800, sparkline: [63640, 63750, 63820] },
      { symbol: 'NIFTY ENERGY', name: 'NIFTY ENERGY', currentValue: 41200, change: 390, percentChange: 0.96, high: 41400, low: 40850, open: 40900, previousClose: 40810, yearlyHigh: 43200, yearlyLow: 26500, sparkline: [40810, 41000, 41200] },
      { symbol: 'NIFTY METAL', name: 'NIFTY METAL', currentValue: 9450, change: -45, percentChange: -0.47, high: 9540, low: 9410, open: 9510, previousClose: 9495, yearlyHigh: 10100, yearlyLow: 6400, sparkline: [9495, 9460, 9450] },
      { symbol: 'NIFTY REALTY', name: 'NIFTY REALTY', currentValue: 1045, change: 18.5, percentChange: 1.80, high: 1052, low: 1028, open: 1030, previousClose: 1026.5, yearlyHigh: 1120, yearlyLow: 550, sparkline: [1026, 1035, 1045] }
    ];
  }

  async getMarketBreadth(): Promise<MarketBreadth> {
    return {
      advances: 1642,
      declines: 984,
      unchanged: 86,
      advanceDeclineRatio: 1.67,
      newFiftyTwoWeekHighs: 184,
      newFiftyTwoWeekLows: 12,
      totalTraded: 2712
    };
  }

  async getSectorPerformances(): Promise<SectorPerformance[]> {
    return [
      { name: 'Information Technology', oneDayChange: 1.53, oneWeekChange: 3.42, oneMonthChange: 6.80, threeMonthChange: 14.2, oneYearChange: 34.5, momentum: 'Strong Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'TCS', topStockGain: 1.17, fiiFlowStatus: 'Net Inflow' },
      { name: 'Automobile & EV', oneDayChange: 1.25, oneWeekChange: 2.10, oneMonthChange: 4.50, threeMonthChange: 9.8, oneYearChange: 52.1, momentum: 'Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'TATAMOTORS', topStockGain: 2.08, fiiFlowStatus: 'Net Inflow' },
      { name: 'Healthcare & Pharma', oneDayChange: 1.27, oneWeekChange: 1.85, oneMonthChange: 5.20, threeMonthChange: 11.4, oneYearChange: 44.2, momentum: 'Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'SUNPHARMA', topStockGain: 1.61, fiiFlowStatus: 'Net Inflow' },
      { name: 'Energy & Oil/Gas', oneDayChange: 0.96, oneWeekChange: 0.80, oneMonthChange: 2.10, threeMonthChange: 5.4, oneYearChange: 28.9, momentum: 'Neutral', relativeStrengthVsNifty: 'In-line', topStockSymbol: 'RELIANCE', topStockGain: 1.10, fiiFlowStatus: 'Neutral' },
      { name: 'Private Banking', oneDayChange: 0.60, oneWeekChange: -0.40, oneMonthChange: 1.10, threeMonthChange: 4.1, oneYearChange: 18.5, momentum: 'Neutral', relativeStrengthVsNifty: 'Underperforming', topStockSymbol: 'ICICIBANK', topStockGain: 1.21, fiiFlowStatus: 'Neutral' },
      { name: 'FMCG', oneDayChange: 0.28, oneWeekChange: 0.15, oneMonthChange: -1.20, threeMonthChange: 2.8, oneYearChange: 12.4, momentum: 'Neutral', relativeStrengthVsNifty: 'Underperforming', topStockSymbol: 'ITC', topStockGain: 0.66, fiiFlowStatus: 'Net Outflow' },
      { name: 'Metals & Mining', oneDayChange: -0.47, oneWeekChange: -1.90, oneMonthChange: -3.40, threeMonthChange: 1.2, oneYearChange: 22.8, momentum: 'Bearish', relativeStrengthVsNifty: 'Underperforming', topStockSymbol: 'TATASTEEL', topStockGain: -0.47, fiiFlowStatus: 'Net Outflow' },
      { name: 'Realty & Construction', oneDayChange: 1.80, oneWeekChange: 3.80, oneMonthChange: 8.90, threeMonthChange: 18.5, oneYearChange: 68.4, momentum: 'Strong Bullish', relativeStrengthVsNifty: 'Outperforming', topStockSymbol: 'DLF', topStockGain: 2.15, fiiFlowStatus: 'Net Inflow' }
    ];
  }

  async getInstitutionalFlows(): Promise<InstitutionalActivity[]> {
    return [
      { date: '29 Aug 2026', fiiGrossPurchase: 14250.4, fiiGrossSales: 12410.2, fiiNet: 1840.2, diiGrossPurchase: 11100.8, diiGrossSales: 9480.0, diiNet: 1620.8, totalNet: 3461.0 },
      { date: '28 Aug 2026', fiiGrossPurchase: 12890.0, fiiGrossSales: 11950.0, fiiNet: 940.0, diiGrossPurchase: 9800.0, diiGrossSales: 8650.0, diiNet: 1150.0, totalNet: 2090.0 },
      { date: '27 Aug 2026', fiiGrossPurchase: 11400.0, fiiGrossSales: 12100.0, fiiNet: -700.0, diiGrossPurchase: 10400.0, diiGrossSales: 8900.0, diiNet: 1500.0, totalNet: 800.0 },
      { date: '26 Aug 2026', fiiGrossPurchase: 13800.0, fiiGrossSales: 11200.0, fiiNet: 2600.0, diiGrossPurchase: 9200.0, diiGrossSales: 9400.0, diiNet: -200.0, totalNet: 2400.0 },
      { date: '25 Aug 2026', fiiGrossPurchase: 10900.0, fiiGrossSales: 10100.0, fiiNet: 800.0, diiGrossPurchase: 8700.0, diiGrossSales: 7900.0, diiNet: 800.0, totalNet: 1600.0 }
    ];
  }

  async getMacroIndicators(): Promise<MacroIndicator[]> {
    return [
      { name: 'RBI Repo Rate', currentValue: '6.50%', previousValue: '6.50%', changeDirection: 'NEUTRAL', impactOnEquities: 'Neutral', lastUpdated: 'RBI MPC Aug 2026', source: 'Reserve Bank of India', relevanceExplanation: 'Benchmark interest rate affecting borrowing costs and banking net interest margins.' },
      { name: 'India CPI Inflation', currentValue: '4.25%', previousValue: '4.75%', changeDirection: 'DOWN', impactOnEquities: 'Bullish', lastUpdated: 'MOSPI Jul 2026', source: 'MOSPI', relevanceExplanation: 'Moderating inflation supports consumer purchasing power and increases room for rate pauses/cuts.' },
      { name: 'Brent Crude Oil', currentValue: '$76.80 / bbl', previousValue: '$79.40 / bbl', changeDirection: 'DOWN', impactOnEquities: 'Bullish', lastUpdated: 'Today', source: 'Global Commodity Feed', relevanceExplanation: 'Lower oil reduces India import bill, supports INR, and expands refining and marketing margins.' },
      { name: 'USD / INR', currentValue: '₹83.65', previousValue: '₹83.75', changeDirection: 'DOWN', impactOnEquities: 'Bullish', lastUpdated: 'Today', source: 'Forex Interbank', relevanceExplanation: 'Stable/stronger rupee attracts FII equity inflows while being manageable for exporters.' },
      { name: 'India GDP Growth (Q1)', currentValue: '7.8% YoY', previousValue: '7.4% YoY', changeDirection: 'UP', impactOnEquities: 'Bullish', lastUpdated: 'MOSPI Official', source: 'Govt of India', relevanceExplanation: 'Strong domestic macroeconomic expansion drives industrial and corporate earnings.' }
    ];
  }

  async searchStocks(query: string): Promise<StockQuote[]> {
    const q = query.trim().toUpperCase();
    if (!q) return this.mockStocks.slice(0, 8);
    return this.mockStocks.filter(s => 
      s.symbol.toUpperCase().includes(q) ||
      s.name.toUpperCase().includes(q) ||
      (s.bseCode && s.bseCode.includes(q)) ||
      s.isin.toUpperCase().includes(q) ||
      s.sector.toUpperCase().includes(q) ||
      s.industry.toUpperCase().includes(q)
    );
  }

  async getAllStocks(): Promise<StockQuote[]> {
    return this.mockStocks;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    const s = this.mockStocks.find(item => item.symbol.toUpperCase() === symbol.toUpperCase());
    return s || null;
  }

  async getHistoricalCandles(symbol: string, _timeframe = '1D'): Promise<OHLCV[]> {
    const quote = await this.getQuote(symbol);
    const basePrice = quote ? quote.currentPrice : 2000;
    const candles: OHLCV[] = [];
    const days = 120;
    let current = basePrice * 0.78;
    const now = new Date();

    for (let i = days; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      if (isWeekend) continue;

      // Realistic stochastic walk with trend bias towards basePrice
      const trendPull = (basePrice - current) * 0.04;
      const noise = (Math.sin(i * 0.4) * 0.015 + (Math.random() - 0.48) * 0.03) * current;
      const dayChange = trendPull + noise;
      const open = Math.round((current) * 100) / 100;
      const close = Math.round((open + dayChange) * 100) / 100;
      const high = Math.round((Math.max(open, close) + Math.random() * 0.012 * open) * 100) / 100;
      const low = Math.round((Math.min(open, close) - Math.random() * 0.012 * open) * 100) / 100;
      const volume = Math.round((quote?.averageVolume || 3000000) * (0.7 + Math.random() * 0.8));
      const deliveryVolume = Math.round(volume * (0.45 + Math.random() * 0.25));
      const deliveryPercent = Math.round((deliveryVolume / volume) * 1000) / 10;
      const vwap = Math.round(((open + high + low + close) / 4) * 100) / 100;

      candles.push({
        time: d.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume,
        deliveryVolume,
        deliveryPercent,
        vwap
      });
      current = close;
    }
    return candles;
  }

  async getQuarterlyResults(symbol: string): Promise<QuarterlyResult[]> {
    return [
      { period: 'Q1 FY27', filingDate: '2026-07-15', revenue: 64500, revenueYoYGrowth: 14.8, operatingProfit: 16800, operatingMargin: 26.0, netProfit: 12450, netProfitYoYGrowth: 16.4, netMargin: 19.3, eps: 34.4, epsYoYGrowth: 15.2, cfo: 14200, capex: 1800, freeCashFlow: 12400, interestCoverage: 32.5, rawResultsSummary: 'Strong order inflows in enterprise digitization and resilient margins.', beatMiss: 'Beat' },
      { period: 'Q4 FY26', filingDate: '2026-04-18', revenue: 62500, revenueYoYGrowth: 12.5, operatingProfit: 16100, operatingMargin: 25.8, netProfit: 11960, netProfitYoYGrowth: 14.1, netMargin: 19.1, eps: 33.1, epsYoYGrowth: 13.5, cfo: 13800, capex: 1750, freeCashFlow: 12050, interestCoverage: 31.0, rawResultsSummary: 'Broad-based growth across North America and European banking accounts.', beatMiss: 'In-Line' },
      { period: 'Q3 FY26', filingDate: '2026-01-14', revenue: 61200, revenueYoYGrowth: 10.2, operatingProfit: 15600, operatingMargin: 25.5, netProfit: 11630, netProfitYoYGrowth: 11.8, netMargin: 19.0, eps: 32.1, epsYoYGrowth: 10.8, cfo: 13100, capex: 1600, freeCashFlow: 11500, interestCoverage: 29.8, rawResultsSummary: 'Seasonal furloughs and discretionary tech budget reprioritizations.', beatMiss: 'Miss' },
      { period: 'Q2 FY26', filingDate: '2025-10-12', revenue: 60100, revenueYoYGrowth: 11.4, operatingProfit: 15300, operatingMargin: 25.5, netProfit: 11460, netProfitYoYGrowth: 13.2, netMargin: 19.1, eps: 31.7, epsYoYGrowth: 12.4, cfo: 12900, capex: 1550, freeCashFlow: 11350, interestCoverage: 30.2, rawResultsSummary: 'Major generative AI and cloud transformation contract ramp-ups.', beatMiss: 'Beat' },
      { period: 'Q1 FY26', filingDate: '2025-07-16', revenue: 58580, revenueYoYGrowth: 9.8, operatingProfit: 14800, operatingMargin: 25.3, netProfit: 11120, netProfitYoYGrowth: 10.5, netMargin: 19.0, eps: 30.7, epsYoYGrowth: 9.5, cfo: 12500, capex: 1500, freeCashFlow: 11000, interestCoverage: 28.5, rawResultsSummary: 'Steady cost optimization and utilization gains.', beatMiss: 'Beat' }
    ];
  }

  async getShareholdingPattern(symbol: string): Promise<ShareholdingPattern[]> {
    return [
      { period: 'Jun 2026', promoterHolding: 52.4, promoterPledged: 0.0, fiiHolding: 24.8, diiHolding: 14.6, publicHolding: 7.2, otherHolding: 1.0 },
      { period: 'Mar 2026', promoterHolding: 52.4, promoterPledged: 0.0, fiiHolding: 24.15, diiHolding: 14.25, publicHolding: 8.2, otherHolding: 1.0 },
      { period: 'Dec 2025', promoterHolding: 52.4, promoterPledged: 0.0, fiiHolding: 23.75, diiHolding: 13.75, publicHolding: 9.1, otherHolding: 1.0 },
      { period: 'Sep 2025', promoterHolding: 52.4, promoterPledged: 0.0, fiiHolding: 23.95, diiHolding: 12.95, publicHolding: 9.7, otherHolding: 1.0 }
    ];
  }

  async getCorporateActions(symbol: string): Promise<CorporateAction[]> {
    return [
      { id: 'ca-1', symbol, type: 'Dividend', announcementDate: '15 Jul 2026', recordDate: '02 Aug 2026', exDate: '01 Aug 2026', details: 'Interim Dividend of Rs. 28.00 per equity share', dividendAmount: 28.00, impactSentiment: 'Positive' },
      { id: 'ca-2', symbol, type: 'Results', announcementDate: '10 Jul 2026', details: 'Board approval of Unaudited Financial Results for Q1 FY27', impactSentiment: 'Neutral' },
      { id: 'ca-3', symbol, type: 'Dividend', announcementDate: '12 Apr 2026', recordDate: '24 May 2026', exDate: '23 May 2026', details: 'Final Dividend of Rs. 35.00 per share', dividendAmount: 35.00, impactSentiment: 'Positive' },
      { id: 'ca-4', symbol, type: 'Buyback', announcementDate: '14 Oct 2025', details: 'Completed share buyback of 4,09,63,855 shares at Rs. 4,150 per share', impactSentiment: 'Positive' }
    ];
  }

  async getBulkBlockDeals(symbol: string): Promise<BulkBlockDeal[]> {
    return [
      { date: '28 Aug 2026', symbol, dealType: 'BLOCK', clientName: 'Government Pension Fund Global (Norges)', transactionType: 'BUY', quantity: 1250000, price: 4205.00, valueCrores: 525.6 },
      { date: '20 Aug 2026', symbol, dealType: 'BULK', clientName: 'SBI Mutual Fund Equity Opportunities', transactionType: 'BUY', quantity: 850000, price: 4180.00, valueCrores: 355.3 },
      { date: '12 Aug 2026', symbol, dealType: 'BLOCK', clientName: 'Societe Generale Asia Fund', transactionType: 'SELL', quantity: 900000, price: 4165.00, valueCrores: 374.85 }
    ];
  }

  async getMarketNews(category?: string): Promise<NewsArticle[]> {
    const allNews: NewsArticle[] = [
      {
        id: 'news-1',
        title: 'TCS Secures Multi-Billion Dollar European Cloud & Digital Transformation Mega-Deal',
        summary: 'Tata Consultancy Services announced a multi-year strategic partnership to modernize digital infrastructure, expanding cloud AI migration for a premier continental banking group.',
        source: 'NSE Corporate Disclosure (Official Filing)',
        sourceTier: 'Official Filing (NSE/BSE)',
        url: 'https://www.nseindia.com',
        publishedAt: '2026-08-29T09:45:00Z',
        publishedTimeFormatted: '29 Aug 2026 15:15 IST',
        symbolsMentioned: ['TCS'],
        primarySymbol: 'TCS',
        sentiment: 'POSITIVE',
        sentimentScore: 0.85,
        sentimentReasoning: 'Significant long-term revenue visibility and validation of enterprise demand.',
        eventType: 'Contract / Order Win',
        isFact: true,
        duplicateSourcesCount: 4
      },
      {
        id: 'news-2',
        title: 'Tata Motors EV Division Crosses Record Monthly Deliveries as Fleet Demand Surges',
        summary: 'Tata Motors registered a 28% YoY increase in passenger electric vehicle sales driven by new long-range battery models and nationwide fast-charging infrastructure rollout.',
        source: 'LiveMint / Bloomberg India',
        sourceTier: 'Reputable Financial Press',
        url: 'https://www.livemint.com',
        publishedAt: '2026-08-29T08:15:00Z',
        publishedTimeFormatted: '29 Aug 2026 13:45 IST',
        symbolsMentioned: ['TATAMOTORS'],
        primarySymbol: 'TATAMOTORS',
        sentiment: 'POSITIVE',
        sentimentScore: 0.72,
        sentimentReasoning: 'Strong consumer demand and margin expansion in electric commercial and passenger vehicles.',
        eventType: 'Capacity Expansion',
        isFact: false,
        duplicateSourcesCount: 3
      },
      {
        id: 'news-3',
        title: 'RBI Keeps Repo Rate Unchanged at 6.50%, Reaffirms Commitment to 4% Inflation Target',
        summary: 'Monetary Policy Committee voted unanimously to maintain benchmark rates, citing resilient domestic GDP growth of 7.8% and softening food inflation.',
        source: 'RBI Official Bulletin',
        sourceTier: 'Official Filing (NSE/BSE)',
        url: 'https://www.rbi.org.in',
        publishedAt: '2026-08-28T10:00:00Z',
        publishedTimeFormatted: '28 Aug 2026 15:30 IST',
        symbolsMentioned: ['HDFCBANK', 'ICICIBANK', 'SBIN'],
        sentiment: 'POSITIVE',
        sentimentScore: 0.60,
        sentimentReasoning: 'Macroeconomic stability provides confidence to financial institutions and credit expansion.',
        eventType: 'General Market News',
        isFact: true,
        duplicateSourcesCount: 8
      },
      {
        id: 'news-4',
        title: 'Reliance Retail Expands Tier-2 & Tier-3 Presence with 250 New High-Efficiency Store Openings',
        summary: 'Reliance Retail announced accelerated omni-channel integration, targeting rapid market share consolidation in fast-moving grocery and lifestyle consumer retail.',
        source: 'Economic Times',
        sourceTier: 'Reputable Financial Press',
        url: 'https://economictimes.indiatimes.com',
        publishedAt: '2026-08-28T06:30:00Z',
        publishedTimeFormatted: '28 Aug 2026 12:00 IST',
        symbolsMentioned: ['RELIANCE'],
        primarySymbol: 'RELIANCE',
        sentiment: 'POSITIVE',
        sentimentScore: 0.68,
        sentimentReasoning: 'Continued non-cyclical retail revenue growth and market dominance.',
        eventType: 'Capacity Expansion',
        isFact: false,
        duplicateSourcesCount: 2
      },
      {
        id: 'news-5',
        title: 'US FDA Concludes Inspection at Sun Pharma Halol Facility with Zero Critical Observations',
        summary: 'Sun Pharmaceutical Industries confirmed receipt of the Establishment Inspection Report (EIR) indicating Voluntary Action Indicated (VAI) status with clean compliance clearance.',
        source: 'BSE Announcement (Official Regulatory Disclosures)',
        sourceTier: 'Official Filing (NSE/BSE)',
        url: 'https://www.bseindia.com',
        publishedAt: '2026-08-27T11:20:00Z',
        publishedTimeFormatted: '27 Aug 2026 16:50 IST',
        symbolsMentioned: ['SUNPHARMA'],
        primarySymbol: 'SUNPHARMA',
        sentiment: 'POSITIVE',
        sentimentScore: 0.90,
        sentimentReasoning: 'Eliminates regulatory uncertainty for key export pipeline and US specialty portfolio.',
        eventType: 'Regulatory Action',
        isFact: true,
        duplicateSourcesCount: 5
      }
    ];

    if (category) {
      if (category === 'POSITIVE') return allNews.filter(n => n.sentiment === 'POSITIVE');
      if (category === 'NEGATIVE') return allNews.filter(n => n.sentiment === 'NEGATIVE');
    }
    return allNews;
  }

  async getStockNews(symbol: string): Promise<NewsArticle[]> {
    const all = await this.getMarketNews();
    const sym = symbol.toUpperCase();
    return all.filter(n => n.symbolsMentioned.includes(sym) || n.primarySymbol === sym);
  }

  async getIPOs(): Promise<IPOItem[]> {
    return [
      {
        id: 'ipo-1',
        companyName: 'Waaree Energies Limited',
        symbol: 'WAAREE',
        status: 'LISTED',
        openDate: '21 Oct 2024',
        closeDate: '23 Oct 2024',
        listingDate: '28 Oct 2024',
        priceBandMin: 1427,
        priceBandMax: 1503,
        lotSize: 9,
        minInvestment: 13527,
        issueSizeCrores: 4321,
        freshIssueCrores: 3600,
        ofsCrores: 721,
        exchange: 'NSE, BSE',
        subscription: {
          qib: 215.0,
          nii: 65.2,
          retail: 11.2,
          overall: 79.4,
          lastUpdated: '23 Oct 2024 17:00 IST'
        },
        issuePrice: 1503,
        listingPrice: 2550,
        currentPrice: 2890,
        listingGainPercent: 69.6,
        currentGainPercent: 92.2,
        ipoResearchScore: 86,
        businessSummary: 'India largest solar PV module manufacturer with aggregate installed capacity of 12 GW and strong export footprint to the US market.',
        strengths: ['Market leader in solar module manufacturing', 'Strong order book exceeding ₹20,000 Cr', 'Substantial backward integration into solar cells'],
        risks: ['Sensitivity to US trade policies and tariffs', 'Raw material (polysilicon/wafer) price volatility', 'Intense domestic competition from conglomerates'],
        valuationNote: 'P/E at upper band of ~32x based on annualized earnings, attractive compared to global solar peers.',
        useOfProceeds: 'Establishment of 6 GW ingot-wafer-solar cell and PV module manufacturing facility in Odisha.'
      },
      {
        id: 'ipo-2',
        companyName: 'Hyundai Motor India Limited',
        symbol: 'HYUNDAI',
        status: 'LISTED',
        openDate: '15 Oct 2024',
        closeDate: '17 Oct 2024',
        listingDate: '22 Oct 2024',
        priceBandMin: 1865,
        priceBandMax: 1960,
        lotSize: 7,
        minInvestment: 13720,
        issueSizeCrores: 27870,
        freshIssueCrores: 0,
        ofsCrores: 27870,
        exchange: 'NSE, BSE',
        subscription: {
          qib: 6.97,
          nii: 0.60,
          retail: 0.50,
          overall: 2.37,
          lastUpdated: '17 Oct 2024 17:00 IST'
        },
        issuePrice: 1960,
        listingPrice: 1931,
        currentPrice: 1840,
        listingGainPercent: -1.48,
        currentGainPercent: -6.12,
        ipoResearchScore: 74,
        businessSummary: 'Second largest passenger vehicle OEM in India with ~15% market share, renowned for premium SUV models (Creta, Venue) and exports.',
        strengths: ['Strong brand loyalty and premium product positioning', 'High return on capital (ROE > 28%)', 'Proven global engineering platform'],
        risks: ['100% Offer for Sale (zero proceeds to company)', 'High royalty payout to Korean parent', 'Intense competitive pressure from Maruti and Tata Motors in EVs'],
        valuationNote: 'Valued at ~26x FY24 P/E, which leaves limited near-term discount given 100% OFS structure.',
        useOfProceeds: 'Complete OFS by Promoter (Hyundai Motor Company Korea).'
      },
      {
        id: 'ipo-3',
        companyName: 'Swiggy Limited',
        symbol: 'SWIGGY',
        status: 'LISTED',
        openDate: '06 Nov 2024',
        closeDate: '08 Nov 2024',
        listingDate: '13 Nov 2024',
        priceBandMin: 371,
        priceBandMax: 390,
        lotSize: 38,
        minInvestment: 14820,
        issueSizeCrores: 11327,
        freshIssueCrores: 4499,
        ofsCrores: 6828,
        exchange: 'NSE, BSE',
        subscription: {
          qib: 6.02,
          nii: 0.41,
          retail: 1.14,
          overall: 3.59,
          lastUpdated: '08 Nov 2024 17:00 IST'
        },
        issuePrice: 390,
        listingPrice: 420,
        currentPrice: 462,
        listingGainPercent: 7.69,
        currentGainPercent: 18.46,
        ipoResearchScore: 78,
        businessSummary: 'Leading consumer tech platform operating in online food delivery, quick commerce (Instamart), and out-of-home dining discovery across India.',
        strengths: ['Duopoly market structure in high-frequency food delivery', 'Rapid GMV expansion in Quick Commerce (Instamart)', 'High network density in top 15 metros'],
        risks: ['Quick commerce segment remains cash burn intensive', 'Aggressive competition from Zomato (Blinkit) and Zepto', 'Take-rate headwinds from restaurant partner pushback'],
        valuationNote: 'Valued at ~6.5x EV/Sales, representing a slight discount to listed peer Zomato.',
        useOfProceeds: 'Investment in Quick Commerce dark stores infrastructure, cloud technology, and marketing.'
      },
      {
        id: 'ipo-4',
        companyName: 'NTPC Green Energy Limited',
        symbol: 'NTPCGREEN',
        status: 'CLOSED',
        openDate: '19 Nov 2024',
        closeDate: '22 Nov 2024',
        listingDate: '27 Nov 2024',
        priceBandMin: 102,
        priceBandMax: 108,
        lotSize: 138,
        minInvestment: 14904,
        issueSizeCrores: 10000,
        freshIssueCrores: 10000,
        ofsCrores: 0,
        exchange: 'NSE, BSE',
        subscription: {
          qib: 3.8,
          nii: 0.9,
          retail: 3.2,
          overall: 2.55,
          lastUpdated: '22 Nov 2024 17:00 IST'
        },
        ipoResearchScore: 82,
        businessSummary: 'Renewable energy arm of India largest power utility NTPC, focusing on utility-scale solar, wind, green hydrogen, and storage projects.',
        strengths: ['Backed by Maharatna parent NTPC with lowest cost of capital', 'Operational pipeline expanding from 3.5 GW to 19 GW by FY27', 'Guaranteed PPAs with sovereign state distribution discoms'],
        risks: ['Execution delays in land acquisition and transmission connectivity', 'Grid curtailment and receivable delays from state discoms', 'Moderate equity return on utility tariff caps'],
        valuationNote: 'Attractive pricing for a 100% fresh issue dedicated to debt reduction and capacity build.',
        useOfProceeds: 'Repayment of subsidiary debt (₹7,500 Cr) and general corporate expansion.'
      },
      {
        id: 'ipo-5',
        companyName: 'Ather Energy Limited',
        symbol: 'ATHER',
        status: 'UPCOMING',
        openDate: '15 Sep 2026',
        closeDate: '18 Sep 2026',
        listingDate: '24 Sep 2026',
        priceBandMin: 320,
        priceBandMax: 345,
        lotSize: 42,
        minInvestment: 14490,
        issueSizeCrores: 4500,
        freshIssueCrores: 3100,
        ofsCrores: 1400,
        exchange: 'NSE, BSE',
        subscription: {
          qib: 0,
          nii: 0,
          retail: 0,
          overall: 0,
          lastUpdated: 'Awaiting Bidding Opening'
        },
        ipoResearchScore: 81,
        businessSummary: 'Pioneer Indian smart electric two-wheeler OEM known for performance scooters (450X, Rizta) and proprietary Ather Grid charging ecosystem.',
        strengths: ['Superior software integration and vehicle reliability', 'Rapidly growing family scooter segment with Rizta platform', 'Strong backing from Hero MotoCorp and global sovereign funds'],
        risks: ['Government FAME/EMPS subsidy reduction impact on margins', 'Ongoing operating EBITDA losses', 'Price war from incumbent 2W makers (Bajaj, TVS)'],
        valuationNote: 'Priced at forward EV/Sales of ~4.2x, demanding rapid scale-up towards unit EBITDA breakeven.',
        useOfProceeds: 'New mega manufacturing plant in Maharashtra, R&D for next-gen battery packs, and charging grid expansion.'
      }
    ];
  }

  async getIPOById(id: string): Promise<IPOItem | null> {
    const list = await this.getIPOs();
    return list.find(item => item.id === id || item.symbol.toUpperCase() === id.toUpperCase()) || null;
  }
}
