import { describe, it, expect } from 'vitest';
import { ScreenerEngine } from '../services/analytics/screenerEngine';
import { NepseDataProvider } from '../services/providers/NepseDataProvider';

describe('ScreenerEngine Presets & AI Query Translation (NEPSE)', () => {
  const provider = new NepseDataProvider();

  it('runs preset screeners across NEPSE stock universe', async () => {
    const breakouts = await ScreenerEngine.runScreener(provider, 'breakout');
    expect(Array.isArray(breakouts)).toBe(true);

    const piotroski = await ScreenerEngine.runScreener(provider, 'piotroski_high');
    expect(Array.isArray(piotroski)).toBe(true);
  });

  it('parses natural language AI query into structured filter rules for NEPSE', () => {
    const parsed = ScreenerEngine.parseNaturalLanguageQuery('Find commercial banks and hydro power with ROE above 18% and low debt');
    expect(parsed.rules.some(r => r.field === 'roe')).toBe(true);
    expect(parsed.rules.some(r => r.field === 'debtToEquity')).toBe(true);
  });
});
