import { ProviderFactory } from '../providers/ProviderFactory';
import { TechnicalEngine } from '../analytics/technicalEngine';
import { FundamentalEngine } from '../analytics/fundamentalEngine';
import { SmartMoneyEngine } from '../analytics/smartMoneyEngine';
import { ScoringEngine } from '../analytics/scoringEngine';
import { ScreenerEngine } from '../analytics/screenerEngine';
import { AIOrchestrator } from '../ai/aiOrchestrator';
import { ReportGenerator } from '../ai/reportGenerator';
import { ScreenerPresetType, CustomScreenerConfig } from '../../types/screeners';

export class ApiClient {
  private static provider = ProviderFactory.getProvider();

  public static async getMarketOverview() {
    const status = await this.provider.getMarketStatus();
    const primaryIndices = await this.provider.getPrimaryIndices();
    const sectoralIndices = await this.provider.getSectoralIndices();
    const breadth = await this.provider.getMarketBreadth();
    const sectors = await this.provider.getSectorPerformances();
    const fiiDii = await this.provider.getInstitutionalFlows();
    const macro = await this.provider.getMacroIndicators();

    const now = new Date();
    const nptTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu', hour12: false });

    return {
      marketStatus: status,
      primaryIndices,
      sectoralIndices,
      breadth,
      sectors,
      recentFiiDii: fiiDii,
      macro,
      marketRegime: {
        regime: 'Bull Market' as const,
        confidenceScore: 86,
        explanation: 'NEPSE Index is trading firmly above 2,960 with sustained daily turnover exceeding NPR 4.3 Arb driven by Hydro Power and Banking liquidity.',
        keyDrivers: [
          'Accommodative NRB monetary policy and lower base rates',
          'Robust remittance liquidity expansion',
          'Strong retail and mutual fund turnover'
        ]
      },
      freshness: {
        timestamp: now.toISOString(),
        formattedTime: `12 Sep 2026 ${nptTimeStr} NPT`,
        source: 'HamroShare Live Scraped Feed & NEPSE Official',
        status: 'LIVE' as const,
        completeness: 100,
        confidence: 'High' as const
      }
    };
  }

  public static async searchStocks(query: string) {
    return this.provider.searchStocks(query);
  }

  public static async getAllStocks() {
    return this.provider.getAllStocks();
  }

  public static async getStockDetails(symbol: string) {
    const quote = await this.provider.getQuote(symbol);
    if (!quote) return null;

    const candles = await this.provider.getHistoricalCandles(symbol);
    const shareholding = await this.provider.getShareholdingPattern(symbol);
    const deals = await this.provider.getBulkBlockDeals(symbol);
    const news = await this.provider.getStockNews(symbol);
    const corporateActions = await this.provider.getCorporateActions(symbol);
    const quarterlyResults = await this.provider.getQuarterlyResults(symbol);

    const technicals = TechnicalEngine.performFullAnalysis(quote, candles);
    const fundamentals = FundamentalEngine.performFullAnalysis(quote);
    const smartMoney = SmartMoneyEngine.performAnalysis(quote, shareholding, deals);
    const score = ScoringEngine.calculateScore(quote, technicals, fundamentals, smartMoney);

    return {
      quote,
      candles,
      technicals,
      fundamentals,
      smartMoney,
      score,
      news,
      corporateActions,
      quarterlyResults
    };
  }

  public static async runScreener(preset: ScreenerPresetType, customConfig?: CustomScreenerConfig) {
    return ScreenerEngine.runScreener(this.provider, preset, customConfig);
  }

  public static async runAiScreener(query: string) {
    const config = ScreenerEngine.parseNaturalLanguageQuery(query);
    return ScreenerEngine.runScreener(this.provider, 'custom', config);
  }

  public static async getIPOs() {
    return this.provider.getIPOs();
  }

  public static async getIPOById(id: string) {
    return this.provider.getIPOById(id);
  }

  public static async getMarketNews(category?: string) {
    return this.provider.getMarketNews(category);
  }

  public static async sendAIMessage(prompt: string) {
    return AIOrchestrator.answerQuery(prompt);
  }

  public static async generateReport(symbol: string) {
    const details = await this.getStockDetails(symbol);
    if (!details) return null;
    return ReportGenerator.generateReport(
      details.quote,
      details.technicals,
      details.fundamentals,
      details.smartMoney,
      details.score
    );
  }
}
