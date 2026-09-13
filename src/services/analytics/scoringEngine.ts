import { StockQuote } from '../../types/stock';
import { FullTechnicalAnalysis } from '../../types/technicals';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { SmartMoneyAnalysis } from '../../types/smartMoney';
import { MultiFactorScore, ScoreSubfactor } from '../../types/scoring';

export class ScoringEngine {
  /**
   * Calculates a 0-100 explainable multi-factor score.
   *
   * `fundamentals` and `smartMoney` may be null when MISS genuinely has no
   * real data for that stock yet (no filed financials / no ownership
   * source). When that happens, this engine excludes that subfactor from
   * the weighted total (redistributing its weight across the remaining
   * available subfactors) instead of inventing a score for it. News
   * sentiment and macro/sector tailwind are NOT scored at all right now —
   * MISS has no real sentiment-aggregation or macro-correlation model
   * wired up, so those subfactors are always reported as unavailable
   * rather than filled with a plausible-looking constant.
   */
  public static calculateScore(
    quote: StockQuote,
    technicals: FullTechnicalAnalysis | null,
    fundamentals: FullFundamentalAnalysis | null,
    smartMoney: SmartMoneyAnalysis | null,
    customWeights?: {
      fundamentals?: number;
      technicals?: number;
      growth?: number;
      valuation?: number;
      smartMoney?: number;
      risk?: number;
    }
  ): MultiFactorScore {
    const baseWeights = {
      fundamentals: customWeights?.fundamentals ?? 0.3,
      technicals: customWeights?.technicals ?? 0.25,
      growth: customWeights?.growth ?? 0.2,
      valuation: customWeights?.valuation ?? 0.15,
      smartMoney: customWeights?.smartMoney ?? 0.05,
      risk: customWeights?.risk ?? 0.05
    };

    const missingTopLevel: string[] = [];
    if (!fundamentals) missingTopLevel.push('Filed financial statements are not yet integrated for this stock.');
    if (!smartMoney) missingTopLevel.push('No real ownership/shareholding data source is wired up yet.');
    if (!technicals) missingTopLevel.push('Not enough historical price data to compute technicals.');

    const buildSub = (
      name: string,
      weight: number,
      score: number | null,
      pos: string[],
      neg: string[],
      missing: string[]
    ): ScoreSubfactor => ({
      name,
      weight,
      score: score ?? 0,
      weightedScore: score !== null ? Math.round(score * weight * 100) / 100 : 0,
      confidence: score !== null ? 'High' : 'Low',
      positiveFactors: score !== null ? pos : [],
      negativeFactors: score !== null ? neg : [],
      missingFactors: score !== null ? missing : [...missing, 'Data unavailable — excluded from the overall score.']
    });

    const fundRaw = fundamentals?.profitability.profitabilityScore ?? null;
    const techRaw = technicals?.overallTechnicalScore ?? null;
    const growthRaw = fundamentals?.growth.growthScore ?? null;
    const valRaw = fundamentals?.valuation.valuationScore ?? null;
    const smRaw = smartMoney?.score ?? null;
    const riskRaw =
      quote.beta !== null && fundamentals
        ? Math.max(0, Math.min(95, Math.round(100 - (quote.beta * 25 + (fundamentals.balanceSheet.debtToEquity > 1 ? 25 : 5)))))
        : null;

    const subfactors: MultiFactorScore['subfactors'] = {
      fundamentals: buildSub(
        'Fundamentals & Capital Return',
        baseWeights.fundamentals,
        fundRaw,
        fundamentals ? [
          `ROE at ${fundamentals.profitability.roe}% based on filed financials.`,
          `Piotroski F-Score is ${fundamentals.piotroski.score}/9.`
        ] : [],
        fundamentals && fundamentals.profitability.roe < 12 ? ['ROE is below a typical healthy threshold.'] : [],
        []
      ),
      technicals: buildSub(
        'Technical Trend & Momentum',
        baseWeights.technicals,
        techRaw,
        technicals ? [technicals.trendSummary, `RSI 14 at ${technicals.rsi.value}.`] : [],
        technicals && technicals.rsi.value > 70 ? ['RSI is in overbought territory, suggesting short-term consolidation risk.'] : [],
        []
      ),
      growth: buildSub(
        'Growth & Quality compounding',
        baseWeights.growth,
        growthRaw,
        fundamentals ? [
          `Revenue YoY growth at ${fundamentals.growth.revenueYoY}%.`,
          `Net Profit YoY growth at ${fundamentals.growth.netProfitYoY}%.`
        ] : [],
        fundamentals?.growth.growthTrajectory === 'Decelerating' || fundamentals?.growth.growthTrajectory === 'Contracting'
          ? ['Growth momentum is decelerating or contracting based on the latest filed year.']
          : [],
        []
      ),
      valuation: buildSub(
        'Valuation & Margin of Safety',
        baseWeights.valuation,
        valRaw,
        fundamentals ? [`PEG Ratio at ${fundamentals.valuation.peg}.`] : [],
        fundamentals && fundamentals.valuation.pe > 35 ? [`Trailing P/E multiple (${fundamentals.valuation.pe}x) is elevated.`] : [],
        []
      ),
      smartMoney: buildSub(
        'Ownership & Smart Money Flows',
        baseWeights.smartMoney,
        smRaw,
        smartMoney ? [
          `Combined institutional change of ${(smartMoney.foreignChangeQoQ + smartMoney.institutionalChangeQoQ).toFixed(2)}% QoQ.`,
          `Promoter pledge is ${smartMoney.latestPromoterPledged}%.`
        ] : [],
        smartMoney && smartMoney.foreignChangeQoQ < 0 ? ['Foreign investors reduced exposure slightly in the last quarter.'] : [],
        []
      ),
      risk: buildSub(
        'Risk & Volatility Profile',
        baseWeights.risk,
        riskRaw,
        quote.beta !== null ? [`Beta of ${quote.beta} reflects benchmark sensitivity.`] : [],
        fundamentals && fundamentals.balanceSheet.debtToEquity > 0.8 ? ['Moderate-to-high debt-to-equity leverage requires monitoring.'] : [],
        quote.beta === null ? ['Beta not yet available for this stock.'] : []
      ),
      newsSentiment: buildSub(
        'News & Regulatory Sentiment',
        0,
        null,
        [],
        [],
        ['No real news-sentiment aggregation model is wired up yet — this subfactor is not scored.']
      ),
      macroSector: buildSub(
        'Macroeconomic & Sector Tailwind',
        0,
        null,
        [],
        [],
        ['No real macro/sector correlation model is wired up yet — this subfactor is not scored.']
      )
    };

    // Redistribute weight across only the subfactors we actually scored,
    // rather than silently treating a missing one as a zero contribution
    // against its full nominal weight.
    const scored = Object.values(subfactors).filter(s => s.confidence === 'High');
    const totalAvailableWeight = scored.reduce((sum, s) => sum + s.weight, 0);

    const overallScore =
      totalAvailableWeight > 0
        ? Math.round(scored.reduce((sum, s) => sum + s.score * s.weight, 0) / totalAvailableWeight)
        : 0;

    const dataCompletenessPercent = Math.round(
      (Object.values(subfactors).filter(s => s.confidence === 'High').length / Object.values(subfactors).length) * 100
    );

    let ratingCategory: MultiFactorScore['ratingCategory'] = 'Moderate / Mixed (50-69)';
    let quickVerdict: MultiFactorScore['quickVerdict'] = 'Mixed';

    if (totalAvailableWeight === 0) {
      ratingCategory = 'Poor / High Risk (0-29)';
      quickVerdict = 'Insufficient Data';
    } else if (overallScore >= 85) {
      ratingCategory = 'Outstanding Research Profile (85-100)';
      quickVerdict = 'Strong Research Profile';
    } else if (overallScore >= 70) {
      ratingCategory = 'Strong Profile (70-84)';
      quickVerdict = 'Strong Research Profile';
    } else if (overallScore >= 50) {
      ratingCategory = 'Moderate / Mixed (50-69)';
      quickVerdict = 'Mixed';
    } else if (overallScore >= 30) {
      ratingCategory = 'Weak / Cautionary (30-49)';
      quickVerdict = 'Caution';
    } else {
      ratingCategory = 'Poor / High Risk (0-29)';
      quickVerdict = 'Weak Research Profile';
    }

    const whyItScoredHigh: string[] = [];
    if (fundamentals && fundamentals.profitability.roe >= 15) {
      whyItScoredHigh.push(`Healthy profitability with ROE of ${fundamentals.profitability.roe}% on filed financials.`);
    }
    if (fundamentals && fundamentals.balanceSheet.debtToEquity < 0.5) {
      whyItScoredHigh.push('Conservative balance sheet leverage based on filed figures.');
    }
    if (technicals && technicals.overallTechnicalScore >= 60) {
      whyItScoredHigh.push(technicals.trendSummary);
    }
    if (whyItScoredHigh.length === 0) {
      whyItScoredHigh.push('Not enough real, available data to identify clear positive drivers yet.');
    }

    const whatCouldGoWrong: string[] = [
      'Unexpected macroeconomic headwinds (interest rate changes, remittance slowdown, or currency movements).',
      'Company-specific developments not yet reflected in the data MISS currently has access to.'
    ];
    if (fundamentals && fundamentals.valuation.pe > 30) {
      whatCouldGoWrong.push('Valuation multiple de-rating if growth decelerates.');
    }

    const keyRisks: string[] = [];
    if (fundamentals) keyRisks.push(`Valuation sensitivity: trading at ${fundamentals.valuation.pe}x P/E.`);
    if (quote.beta !== null) keyRisks.push(`Beta risk: historical market sensitivity index is ${quote.beta}.`);
    if (keyRisks.length === 0) keyRisks.push('Insufficient data to characterize specific key risks yet.');

    const dataGaps = [...missingTopLevel];
    if (dataGaps.length === 0) dataGaps.push('No known data gaps for this analysis.');

    const valuationConcerns = fundamentals
      ? fundamentals.valuation.pe > 30
        ? [`P/E multiple (${fundamentals.valuation.pe}x) is on the higher side.`, 'Requires sustained earnings growth to justify the current multiple.']
        : ['Valuation appears reasonable based on filed earnings.']
      : ['Valuation cannot be assessed — no filed financials available yet.'];

    const technicalConcerns = technicals
      ? technicals.rsi.value > 68
        ? ['RSI is approaching or in overbought territory; a pullback toward short-term moving-average support is a normal technical possibility.']
        : ['No acute negative divergences on the daily timeframe.']
      : ['Technical picture cannot be assessed — insufficient historical price data.'];

    return {
      symbol: quote.symbol,
      overallScore,
      ratingCategory,
      quickVerdict,
      subfactors,
      whyItScoredHigh,
      whatCouldGoWrong,
      keyRisks,
      dataGaps,
      valuationConcerns,
      technicalConcerns,
      dataCompletenessPercent,
      lastCalculated: new Date().toISOString()
    };
  }
}
