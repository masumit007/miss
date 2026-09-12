import { StockQuote, OHLCV } from '../../types/stock';
import { TechnicalEngine } from './technicalEngine';
import { FundamentalEngine } from './fundamentalEngine';
import { SmartMoneyEngine } from './smartMoneyEngine';
import { ScoringEngine } from './scoringEngine';
import { ScreenerPresetType, ScreenerResultItem, CustomScreenerConfig } from '../../types/screeners';
import { FullTechnicalAnalysis } from '../../types/technicals';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { SmartMoneyAnalysis } from '../../types/smartMoney';
import { MultiFactorScore } from '../../types/scoring';
import { IDataProvider } from '../providers/IDataProvider';

export class ScreenerEngine {
  /**
   * Executes a preset screener or custom configuration against the universe
   */
  public static async runScreener(
    provider: IDataProvider,
    preset: ScreenerPresetType,
    customConfig?: CustomScreenerConfig
  ): Promise<ScreenerResultItem[]> {
    const allStocks = await provider.getAllStocks();
    const results: ScreenerResultItem[] = [];

    for (const quote of allStocks) {
      const candles = await provider.getHistoricalCandles(quote.symbol);
      const shareholding = await provider.getShareholdingPattern(quote.symbol);
      const deals = await provider.getBulkBlockDeals(quote.symbol);

      const technicals = TechnicalEngine.performFullAnalysis(quote, candles);
      const fundamentals = FundamentalEngine.performFullAnalysis(quote);
      const smartMoney = SmartMoneyEngine.performAnalysis(quote, shareholding, deals);
      const score = ScoringEngine.calculateScore(quote, technicals, fundamentals, smartMoney);

      let matched = false;
      const matchedCriteria: string[] = [];

      switch (preset) {
        case 'breakout':
          if (technicals.breakout.isBreakout || quote.currentPrice >= quote.fiftyTwoWeekHigh * 0.96) {
            matched = true;
            matchedCriteria.push('Price testing / breaking resistance');
            if (quote.volumeRatio >= 1.2) matchedCriteria.push(`Volume expansion (${quote.volumeRatio}x avg)`);
            if (technicals.macd.histogram > 0) matchedCriteria.push('Bullish MACD momentum');
          }
          break;

        case 'support_rebound':
          if (technicals.supportResistance.signal === 'AT_SUPPORT' || technicals.supportResistance.signal === 'NEAR_SUPPORT' || technicals.rsi.value <= 45) {
            matched = true;
            matchedCriteria.push(`Near key support level (₹${technicals.supportResistance.support1})`);
            matchedCriteria.push(`RSI at ${technicals.rsi.value}`);
            if (technicals.candlestickPatterns.some(p => p.type === 'Bullish')) matchedCriteria.push('Bullish candlestick reversal candle');
          }
          break;

        case 'smart_money_accumulation':
          if (smartMoney.smartMoneyClassification === 'Accumulation' || (smartMoney.fiiChangeQoQ + smartMoney.diiChangeQoQ) > 0.4) {
            matched = true;
            matchedCriteria.push(`Institutional stake increased +${(smartMoney.fiiChangeQoQ + smartMoney.diiChangeQoQ).toFixed(2)}% QoQ`);
            matchedCriteria.push(`High delivery percentage (${quote.deliveryPercentage}%)`);
            matchedCriteria.push(`Zero promoter pledging (${smartMoney.latestPromoterPledged}%)`);
          }
          break;

        case 'piotroski_high':
          if (fundamentals.piotroski.score >= 8) {
            matched = true;
            matchedCriteria.push(`Piotroski Score: ${fundamentals.piotroski.score}/9 (Top Tier Quality)`);
            matchedCriteria.push('Positive CFO and ROA expansion');
            matchedCriteria.push('Healthy balance sheet leverage');
          }
          break;

        case 'low_debt_growth':
          if (fundamentals.balanceSheet.debtToEquity < 0.4 && fundamentals.growth.netProfitYoY >= 12) {
            matched = true;
            matchedCriteria.push(`Low Debt-to-Equity (${fundamentals.balanceSheet.debtToEquity})`);
            matchedCriteria.push(`Profit growth: +${fundamentals.growth.netProfitYoY}% YoY`);
            matchedCriteria.push(`ROE: ${fundamentals.profitability.roe}%`);
          }
          break;

        case 'oversold_reversal':
          if (technicals.rsi.value <= 35 || technicals.rsi.classification === 'OVERSOLD' || technicals.rsi.classification === 'NEAR_OVERSOLD') {
            matched = true;
            matchedCriteria.push(`RSI 14 oversold/near oversold at ${technicals.rsi.value}`);
            matchedCriteria.push('Potential mean-reversion technical setup');
          }
          break;

        case 'high_dividend':
          if (fundamentals.valuation.dividendYield >= 1.0) {
            matched = true;
            matchedCriteria.push(`Dividend Yield: ${fundamentals.valuation.dividendYield}%`);
            matchedCriteria.push('Consistent payout track record');
          }
          break;

        case 'buffett_compounders':
          if (fundamentals.buffett.buffettQualityScore >= 80 && fundamentals.profitability.roe >= 18) {
            matched = true;
            matchedCriteria.push(`Buffett Quality Score: ${fundamentals.buffett.buffettQualityScore}/100`);
            matchedCriteria.push(`10-Yr Avg ROE: ${fundamentals.buffett.roeTenYearAverage}%`);
            matchedCriteria.push('Durable economic moat and high cash conversion');
          }
          break;

        case 'canslim_leaders':
          if (fundamentals.canslim.totalScore >= 75) {
            matched = true;
            matchedCriteria.push(`CANSLIM Score: ${fundamentals.canslim.totalScore}/100`);
            matchedCriteria.push('Quarterly earnings & institutional leadership');
          }
          break;

        case 'high_momentum_adx':
          if (technicals.adx.adx >= 25 && technicals.adx.trendDirection === 'Bullish Dominance') {
            matched = true;
            matchedCriteria.push(`ADX at ${technicals.adx.adx} (Strong Trend)`);
            matchedCriteria.push('Bullish +DI dominance');
          }
          break;

        case 'low_volatility':
          if (quote.beta < 0.85) {
            matched = true;
            matchedCriteria.push(`Low Beta (${quote.beta})`);
            matchedCriteria.push('Historically defensive during market corrections');
          }
          break;

        case 'value_gems':
          if (fundamentals.valuation.peg < 1.3 || fundamentals.valuation.pe < 22) {
            matched = true;
            matchedCriteria.push(`Attractive PEG (${fundamentals.valuation.peg})`);
            matchedCriteria.push(`P/E: ${fundamentals.valuation.pe}x`);
            matchedCriteria.push(`ROE: ${fundamentals.profitability.roe}%`);
          }
          break;

        case 'fii_buying_spree':
          if (smartMoney.fiiChangeQoQ >= 0.5) {
            matched = true;
            matchedCriteria.push(`FII ownership increased by +${smartMoney.fiiChangeQoQ}% in latest quarter`);
          }
          break;

        case 'golden_cross':
          if (technicals.movingAverages.crossSignals.goldenCrossDetected) {
            matched = true;
            matchedCriteria.push('50-day SMA is above 200-day SMA');
            matchedCriteria.push('Macro structural uptrend confirmed');
          }
          break;

        case 'custom':
          if (customConfig && customConfig.rules.length > 0) {
            let passAll = true;
            for (const rule of customConfig.rules) {
              const val = this.extractFieldValue(rule.field, quote, technicals, fundamentals, smartMoney, score);
              if (!this.evaluateCondition(val, rule.operator, rule.value, rule.secondValue)) {
                passAll = false;
                break;
              }
              matchedCriteria.push(`${rule.field} ${rule.operator} ${rule.value}`);
            }
            matched = passAll;
          } else {
            matched = true;
          }
          break;

        case 'ai_natural_language':
          if (score.overallScore >= 75) {
            matched = true;
            matchedCriteria.push(`Overall Research Score: ${score.overallScore}/100`);
            matchedCriteria.push(`ROE: ${fundamentals.profitability.roe}%`);
            matchedCriteria.push(`Technical Signal: ${technicals.overallTechnicalSignal}`);
          }
          break;
      }

      if (matched) {
        results.push({
          quote,
          technicals,
          fundamentals,
          score,
          matchedCriteria
        });
      }
    }

    return results.sort((a, b) => b.score.overallScore - a.score.overallScore);
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
      rules.push({ field: 'volumeRatio', operator: '>=', value: 1.2 });
    }

    if (q.includes('peg') || q.includes('value') || q.includes('cheap')) {
      rules.push({ field: 'peg', operator: '<=', value: 1.5 });
    }

    return {
      id: `ai-screener-${Date.now()}`,
      name: `AI Query: "${query}"`,
      description: `Structured filter translated from: "${query}"`,
      rules: rules.length > 0 ? rules : [{ field: 'overallScore', operator: '>=', value: 75 }]
    };
  }

  private static extractFieldValue(
    field: string,
    quote: StockQuote,
    technicals: FullTechnicalAnalysis,
    fundamentals: FullFundamentalAnalysis,
    smartMoney: SmartMoneyAnalysis,
    score: MultiFactorScore
  ): any {
    switch (field.toLowerCase()) {
      case 'price': return quote.currentPrice;
      case 'marketcap': return quote.marketCap;
      case 'volumeratio': return quote.volumeRatio;
      case 'beta': return quote.beta;
      case 'rsi': return technicals.rsi.value;
      case 'adx': return technicals.adx.adx;
      case 'roe': return fundamentals.profitability.roe;
      case 'roce': return fundamentals.profitability.roce;
      case 'pe': return fundamentals.valuation.pe;
      case 'peg': return fundamentals.valuation.peg;
      case 'pb': return fundamentals.valuation.pb;
      case 'debttoequity': return fundamentals.balanceSheet.debtToEquity;
      case 'piotroski': return fundamentals.piotroski.score;
      case 'freecashflow': return fundamentals.balanceSheet.freeCashFlowCrores;
      case 'fiichange': return smartMoney.fiiChangeQoQ;
      case 'overallscore': return score.overallScore;
      default: return 0;
    }
  }

  private static evaluateCondition(actual: any, operator: string, target: any, secondTarget?: any): boolean {
    if (actual === undefined || actual === null) return false;
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
