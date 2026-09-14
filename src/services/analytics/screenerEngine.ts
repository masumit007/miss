import { OHLCV } from '../../types/stock';
import { TechnicalEngine } from './technicalEngine';
import { FundamentalEngine } from './fundamentalEngine';
import { SmartMoneyEngine } from './smartMoneyEngine';
import { ScoringEngine } from './scoringEngine';
import { ScreenerPresetType, ScreenerResultItem, CustomScreenerConfig } from '../../types/screeners';
import { IDataProvider } from '../providers/IDataProvider';

export class ScreenerEngine {
  // Fetching full price history for the entire NEPSE universe one-by-one
  // against the real API is what caused this to time out — process in
  // bounded-concurrency batches instead of fully sequential or unbounded.
  private static readonly CONCURRENCY = 8;

  private static async mapWithConcurrency<T, R>(
    items: T[],
    limit: number,
    fn: (item: T) => Promise<R>
  ): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let cursor = 0;

    async function worker() {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await fn(items[index]);
      }
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));

    return results;
  }

  /**
   * Executes a preset screener or custom configuration against the
   * universe. Stocks with insufficient real data for the criteria being
   * screened are excluded from the results rather than matched on
   * fabricated/defaulted values — this mirrors "remove stocks with
   * insufficient critical data" rather than inventing a score for them.
   */
  public static async runScreener(
    provider: IDataProvider,
    preset: ScreenerPresetType,
    customConfig?: CustomScreenerConfig
  ): Promise<ScreenerResultItem[]> {
    const allStocks = await provider.getAllStocks();

    const perStock = await this.mapWithConcurrency(allStocks, this.CONCURRENCY, async quote => {
      const [candles, shareholding, deals] = await Promise.all([
        provider.getHistoricalCandles(quote.symbol),
        provider.getShareholdingPattern(quote.symbol),
        provider.getBulkBlockDeals(quote.symbol)
      ]);

      return this.evaluateStock(quote, candles, shareholding, deals, preset, customConfig);
    });

    return perStock
      .filter((r): r is ScreenerResultItem => r !== null)
      .sort((a, b) => b.score.overallScore - a.score.overallScore);
  }

  private static evaluateStock(
    quote: import('../../types/stock').StockQuote,
    candles: OHLCV[],
    shareholding: import('../../types/stock').ShareholdingPattern[],
    deals: import('../../types/stock').BulkBlockDeal[],
    preset: ScreenerPresetType,
    customConfig?: CustomScreenerConfig
  ): ScreenerResultItem | null {
      // Not enough real price history to compute technicals at all — skip.
      if (candles.length < 15) return null;

      const technicals = TechnicalEngine.performFullAnalysis(quote, candles);
      // FundamentalEngine currently needs real annual financial-statement
      // data (not wired up yet) — pass empty; it will honestly return null.
      const fundamentals = FundamentalEngine.performFullAnalysis(quote, [], technicals.overallTechnicalScore);
      const smartMoney = SmartMoneyEngine.performAnalysis(quote, shareholding, deals);
      const score = ScoringEngine.calculateScore(quote, technicals, fundamentals, smartMoney);

      let matched = false;
      const matchedCriteria: string[] = [];

      switch (preset) {

        case 'breakout':
          if (technicals.breakout.isBreakout || (quote.fiftyTwoWeekHigh !== null && quote.currentPrice >= quote.fiftyTwoWeekHigh * 0.96)) {
            matched = true;
            matchedCriteria.push('Price testing / breaking resistance');
            if ((quote.volumeRatio ?? 0) >= 1.2) matchedCriteria.push(`Volume expansion (${quote.volumeRatio}x avg)`);
            if (technicals.macd.histogram > 0) matchedCriteria.push('Bullish MACD momentum');
          }
          break;

        case 'support_rebound':
          if (technicals.supportResistance.signal === 'AT_SUPPORT' || technicals.supportResistance.signal === 'NEAR_SUPPORT' || technicals.rsi.value <= 45) {
            matched = true;
            matchedCriteria.push(`Near key support level (Rs. ${technicals.supportResistance.support1})`);
            matchedCriteria.push(`RSI at ${technicals.rsi.value}`);
            if (technicals.candlestickPatterns.some(p => p.type === 'Bullish')) matchedCriteria.push('Bullish candlestick reversal candle');
          }
          break;

        case 'smart_money_accumulation':
          if (smartMoney && (smartMoney.smartMoneyClassification === 'Accumulation' || (smartMoney.foreignChangeQoQ + smartMoney.institutionalChangeQoQ) > 0.4)) {
            matched = true;
            matchedCriteria.push(`Institutional stake increased +${(smartMoney.foreignChangeQoQ + smartMoney.institutionalChangeQoQ).toFixed(2)}% QoQ`);
            matchedCriteria.push(`Zero/low promoter pledging (${smartMoney.latestPromoterPledged}%)`);
          }
          break;

        case 'piotroski_high':
          if (fundamentals && fundamentals.piotroski.score >= 8) {
            matched = true;
            matchedCriteria.push(`Piotroski Score: ${fundamentals.piotroski.score}/9 (Top Tier Quality)`);
          }
          break;

        case 'low_debt_growth':
          if (fundamentals && fundamentals.balanceSheet.debtToEquity < 0.4 && fundamentals.growth.netProfitYoY >= 12) {
            matched = true;
            matchedCriteria.push(`Low Debt-to-Equity (${fundamentals.balanceSheet.debtToEquity})`);
            matchedCriteria.push(`Profit growth: +${fundamentals.growth.netProfitYoY}% YoY`);
          }
          break;

        case 'oversold_reversal':
          if (technicals.rsi.value <= 35 || technicals.rsi.classification === 'OVERSOLD' || technicals.rsi.classification === 'NEAR_OVERSOLD') {
            matched = true;
            matchedCriteria.push(`RSI 14 oversold/near oversold at ${technicals.rsi.value}`);
          }
          break;

        case 'high_dividend':
          if (fundamentals && fundamentals.valuation.dividendYield >= 1.0) {
            matched = true;
            matchedCriteria.push(`Dividend Yield: ${fundamentals.valuation.dividendYield}%`);
          }
          break;

        case 'buffett_compounders':
          if (fundamentals && fundamentals.buffett.buffettQualityScore >= 80 && fundamentals.profitability.roe >= 18) {
            matched = true;
            matchedCriteria.push(`Buffett Quality Score: ${fundamentals.buffett.buffettQualityScore}/100`);
          }
          break;

        case 'canslim_leaders':
          if (fundamentals && fundamentals.canslim.totalScore >= 75) {
            matched = true;
            matchedCriteria.push(`CANSLIM Score: ${fundamentals.canslim.totalScore}/100`);
          }
          break;

        case 'high_momentum_adx':
          if (technicals.adx.adx >= 25 && technicals.adx.trendDirection === 'Bullish Dominance') {
            matched = true;
            matchedCriteria.push(`ADX at ${technicals.adx.adx} (Strong Trend)`);
          }
          break;

        case 'low_volatility':
          if (quote.beta !== null && quote.beta < 0.85) {
            matched = true;
            matchedCriteria.push(`Low Beta (${quote.beta})`);
          }
          break;

        case 'value_gems':
          if (fundamentals && (fundamentals.valuation.peg < 1.3 || fundamentals.valuation.pe < 22)) {
            matched = true;
            matchedCriteria.push(`Attractive PEG (${fundamentals.valuation.peg})`);
            matchedCriteria.push(`P/E: ${fundamentals.valuation.pe}x`);
          }
          break;

        case 'foreign_buying_spree':
          if (smartMoney && smartMoney.foreignChangeQoQ >= 0.5) {
            matched = true;
            matchedCriteria.push(`Foreign ownership increased by +${smartMoney.foreignChangeQoQ}% in latest quarter`);
          }
          break;

        case 'golden_cross':
          if (technicals.movingAverages.crossSignals.goldenCrossDetected) {
            matched = true;
            matchedCriteria.push('50-day SMA is above 200-day SMA');
          }
          break;

        case 'custom':
          if (customConfig && customConfig.rules.length > 0) {
            let passAll = true;
            for (const rule of customConfig.rules) {
              const val = this.extractFieldValue(rule.field, quote, technicals, fundamentals, smartMoney, score);
              if (val === null || !this.evaluateCondition(val, rule.operator, rule.value, rule.secondValue)) {
                passAll = false;
                break;
              }
              matchedCriteria.push(`${rule.field} ${rule.operator} ${rule.value}`);
            }
            matched = passAll;
          }
          break;

        case 'ai_natural_language':
          if (score.overallScore >= 75) {
            matched = true;
            matchedCriteria.push(`Overall Research Score: ${score.overallScore}/100`);
            matchedCriteria.push(`Technical Signal: ${technicals.overallTechnicalSignal}`);
          }
          break;
      }

      // A stock that matched purely on real technicals is included even
      // when fundamentals are unavailable (a known, disclosed gap) — we
      // never fabricate a fundamentals object just to satisfy the shape;
      // callers must handle `fundamentals: null` in the result.
      return matched ? { quote, technicals, fundamentals, smartMoney, score, matchedCriteria } : null;
  }

  public static parseNaturalLanguageQuery(query: string): CustomScreenerConfig {
    const q = query.toLowerCase();
    const rules: CustomScreenerConfig['rules'] = [];

    if (q.includes('roe') || q.includes('profitable') || q.includes('return on equity')) {
      const match = q.match(/roe\s*(?:>|above|over|>=)?\s*(\d+)/i);
      const threshold = match ? parseInt(match[1], 10) : 15;
      rules.push({ field: 'roe', operator: '>=', value: threshold });
    }

    if (q.includes('low debt') || q.includes('debt free') || q.includes('no debt')) {
      rules.push({ field: 'debtToEquity', operator: '<=', value: 0.5 });
    }

    if (q.includes('support') || q.includes('near support')) {
      rules.push({ field: 'rsi', operator: '<=', value: 50 });
    }

    if (q.includes('fcf') || q.includes('cash flow') || q.includes('free cash flow')) {
      rules.push({ field: 'freeCashFlow', operator: '>', value: 0 });
    }

    if (q.includes('breakout') || q.includes('high volume')) {
      rules.push({ field: 'volumeratio', operator: '>=', value: 1.2 });
    }

    if (q.includes('peg') || q.includes('value') || q.includes('cheap')) {
      rules.push({ field: 'peg', operator: '<=', value: 1.5 });
    }

    return {
      id: `ai-screener-${Date.now()}`,
      name: `AI Query: "${query}"`,
      description: `Structured filter translated from: "${query}"`,
      rules: rules.length > 0 ? rules : [{ field: 'overallscore', operator: '>=', value: 75 }]
    };
  }

  private static extractFieldValue(
    field: string,
    quote: import('../../types/stock').StockQuote,
    technicals: import('../../types/technicals').FullTechnicalAnalysis,
    fundamentals: import('../../types/fundamentals').FullFundamentalAnalysis | null,
    smartMoney: import('../../types/smartMoney').SmartMoneyAnalysis | null,
    score: import('../../types/scoring').MultiFactorScore
  ): number | null {
    switch (field.toLowerCase()) {
      case 'price': return quote.currentPrice;
      case 'marketcap': return quote.marketCap;
      case 'volumeratio': return quote.volumeRatio;
      case 'beta': return quote.beta;
      case 'rsi': return technicals.rsi.value;
      case 'adx': return technicals.adx.adx;
      case 'roe': return fundamentals?.profitability.roe ?? null;
      case 'roce': return fundamentals?.profitability.roce ?? null;
      case 'pe': return fundamentals?.valuation.pe ?? null;
      case 'peg': return fundamentals?.valuation.peg ?? null;
      case 'pb': return fundamentals?.valuation.pb ?? null;
      case 'debttoequity': return fundamentals?.balanceSheet.debtToEquity ?? null;
      case 'piotroski': return fundamentals?.piotroski.score ?? null;
      case 'freecashflow': return fundamentals?.balanceSheet.freeCashFlowCrores ?? null;
      case 'foreignchange': return smartMoney?.foreignChangeQoQ ?? null;
      case 'overallscore': return score.overallScore;
      default: return null;
    }
  }

  private static evaluateCondition(actual: number, operator: string, target: any, secondTarget?: any): boolean {
    switch (operator) {
      case '>': return actual > target;
      case '>=': return actual >= target;
      case '<': return actual < target;
      case '<=': return actual <= target;
      case '==': return actual === target;
      case 'between': return actual >= target && actual <= (secondTarget ?? target);
      default: return true;
    }
  }
}
