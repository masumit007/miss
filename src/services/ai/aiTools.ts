import { ProviderFactory } from '../providers/ProviderFactory';
import { TechnicalEngine } from '../analytics/technicalEngine';
import { FundamentalEngine } from '../analytics/fundamentalEngine';
import { SmartMoneyEngine } from '../analytics/smartMoneyEngine';
import { ScoringEngine } from '../analytics/scoringEngine';

export class AITools {
  public static async getStockQuote(symbol: string) {
    const provider = ProviderFactory.getProvider();
    const quote = await provider.getQuote(symbol);
    if (!quote) return { error: `Stock symbol ${symbol} not found in database.` };
    return {
      symbol: quote.symbol,
      name: quote.name,
      exchange: quote.exchange,
      price: quote.currentPrice,
      dayChange: quote.dayChange,
      dayChangePercent: quote.dayChangePercent,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      marketCapCrores: quote.marketCap,
      sector: quote.sector,
      beta: quote.beta,
      deliveryPercentage: quote.deliveryPercentage,
      lastUpdated: quote.freshness.formattedTime
    };
  }

  public static async getFundamentals(symbol: string) {
    const provider = ProviderFactory.getProvider();
    const quote = await provider.getQuote(symbol);
    if (!quote) return { error: `Stock symbol ${symbol} not found.` };
    const history = await provider.getQuarterlyResults(symbol);
    const fund = FundamentalEngine.performFullAnalysis(quote, [], null);
    if (!fund) {
      return {
        symbol: quote.symbol,
        error: 'Fundamental data unavailable — no filed financial statements are integrated for this stock yet.',
        quarterlyResultsOnFile: history.length
      };
    }
    return {
      symbol: quote.symbol,
      roe: fund.profitability.roe,
      roce: fund.profitability.roce,
      roa: fund.profitability.roa,
      operatingMargin: fund.profitability.operatingMargin,
      netMargin: fund.profitability.netMargin,
      revenueYoY: fund.growth.revenueYoY,
      netProfitYoY: fund.growth.netProfitYoY,
      pe: fund.valuation.pe,
      peg: fund.valuation.peg,
      pb: fund.valuation.pb,
      debtToEquity: fund.balanceSheet.debtToEquity,
      currentRatio: fund.balanceSheet.currentRatio,
      freeCashFlowCrores: fund.balanceSheet.freeCashFlowCrores,
      piotroskiScore: `${fund.piotroski.score}/9`,
      buffettScore: `${fund.buffett.buffettQualityScore}/100`,
      canslimScore: `${fund.canslim.totalScore}/100`,
      grahamVerdict: fund.graham.classification,
      peterLynchCategory: fund.peterLynch.category
    };
  }

  public static async getTechnicals(symbol: string) {
    const provider = ProviderFactory.getProvider();
    const quote = await provider.getQuote(symbol);
    if (!quote) return { error: `Stock symbol ${symbol} not found.` };
    const candles = await provider.getHistoricalCandles(symbol);
    const tech = TechnicalEngine.performFullAnalysis(quote, candles);
    return {
      symbol: quote.symbol,
      overallSignal: tech.overallTechnicalSignal,
      technicalScore: tech.overallTechnicalScore,
      trend: tech.trendSummary,
      rsi14: tech.rsi.value,
      rsiStatus: tech.rsi.classification,
      macdStatus: tech.macd.crossoverStatus,
      adx: tech.adx.adx,
      adxTrend: tech.adx.trendStrength,
      sma50: tech.movingAverages.sma50.value,
      sma200: tech.movingAverages.sma200.value,
      goldenCross: tech.movingAverages.crossSignals.goldenCrossDetected,
      support1: tech.supportResistance.support1,
      resistance1: tech.supportResistance.resistance1,
      breakoutStatus: tech.breakout.confidenceLabel
    };
  }

  public static async getOwnership(symbol: string) {
    const provider = ProviderFactory.getProvider();
    const quote = await provider.getQuote(symbol);
    if (!quote) return { error: `Stock symbol ${symbol} not found.` };
    const sh = await provider.getShareholdingPattern(symbol);
    const deals = await provider.getBulkBlockDeals(symbol);
    const sm = SmartMoneyEngine.performAnalysis(quote, sh, deals);
    if (!sm) {
      return {
        symbol: quote.symbol,
        error: 'Ownership data unavailable — no real shareholding disclosures are integrated for this stock yet.'
      };
    }
    return {
      symbol: quote.symbol,
      classification: sm.smartMoneyClassification,
      score: sm.score,
      promoterHolding: sm.latestPromoterHolding,
      promoterPledged: sm.latestPromoterPledged,
      foreignHolding: sm.latestForeignHolding,
      institutionalHolding: sm.latestInstitutionalHolding,
      foreignChangeQoQ: sm.foreignChangeQoQ,
      institutionalChangeQoQ: sm.institutionalChangeQoQ,
      evidence: sm.evidence
    };
  }

  public static async getNews(symbol: string) {
    const provider = ProviderFactory.getProvider();
    const news = await provider.getStockNews(symbol);
    return news.map(n => ({
      title: n.title,
      source: n.source,
      sentiment: n.sentiment,
      eventType: n.eventType,
      publishedAt: n.publishedTimeFormatted
    }));
  }

  public static async getMacro() {
    const provider = ProviderFactory.getProvider();
    const indicators = await provider.getMacroIndicators();
    return indicators.map(i => ({
      name: i.name,
      value: i.currentValue,
      impact: i.impactOnEquities,
      source: i.source
    }));
  }
}
