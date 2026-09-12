import { describe, it, expect } from 'vitest';
import { ScoringEngine } from '../services/analytics/scoringEngine';
import { TechnicalEngine } from '../services/analytics/technicalEngine';
import { FundamentalEngine } from '../services/analytics/fundamentalEngine';
import { SmartMoneyEngine } from '../services/analytics/smartMoneyEngine';
import { NepseDataProvider } from '../services/providers/NepseDataProvider';

describe('ScoringEngine Multi-Factor Calibration (NEPSE)', () => {
  const provider = new NepseDataProvider();

  it('computes 0-100 score with full explainability drivers for NEPSE stocks', async () => {
    const quote = await provider.getQuote('NABIL');
    const candles = await provider.getHistoricalCandles('NABIL');
    const shareholding = await provider.getShareholdingPattern('NABIL');
    const deals = await provider.getBulkBlockDeals('NABIL');

    const tech = TechnicalEngine.performFullAnalysis(quote!, candles);
    const fund = FundamentalEngine.performFullAnalysis(quote!);
    const sm = SmartMoneyEngine.performAnalysis(quote!, shareholding, deals);

    const score = ScoringEngine.calculateScore(quote!, tech, fund, sm);

    expect(score.overallScore).toBeGreaterThanOrEqual(0);
    expect(score.overallScore).toBeLessThanOrEqual(100);
    expect(score.whyItScoredHigh.length).toBeGreaterThan(0);
    expect(score.whatCouldGoWrong.length).toBeGreaterThan(0);
  });
});
