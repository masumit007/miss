import { describe, it, expect } from 'vitest';
import { FrameworkEngines } from '../services/analytics/frameworkEngines';
import { FundamentalEngine } from '../services/analytics/fundamentalEngine';
import { NepseDataProvider } from '../services/providers/NepseDataProvider';
import { FinancialYearData } from '../types/fundamentals';

describe('FundamentalEngine & Classical Frameworks (NEPSE)', () => {
  const provider = new NepseDataProvider();

  it('evaluates all 9 criteria of Piotroski F-Score', () => {
    const history: FinancialYearData[] = [
      {
        year: 'FY082',
        revenue: 1000,
        ebitda: 300,
        operatingProfit: 250,
        netProfit: 180,
        eps: 18,
        operatingCashFlow: 210,
        capex: 40,
        freeCashFlow: 170,
        totalAssets: 1500,
        totalEquity: 1000,
        totalDebt: 100,
        cashAndInvestments: 300,
        currentAssets: 500,
        currentLiabilities: 200,
        inventory: 50,
        receivables: 60,
        payables: 50,
        sharesCount: 10,
        dividendPerShare: 5
      },
      {
        year: 'FY081',
        revenue: 850,
        ebitda: 240,
        operatingProfit: 200,
        netProfit: 140,
        eps: 14,
        operatingCashFlow: 160,
        capex: 35,
        freeCashFlow: 125,
        totalAssets: 1400,
        totalEquity: 900,
        totalDebt: 150,
        cashAndInvestments: 200,
        currentAssets: 420,
        currentLiabilities: 190,
        inventory: 48,
        receivables: 55,
        payables: 45,
        sharesCount: 10,
        dividendPerShare: 4
      }
    ];

    const result = FrameworkEngines.calculatePiotroski(history);
    expect(result.score).toBeGreaterThanOrEqual(8);
    expect(result.items.length).toBe(9);
  });

  it('calculates Benjamin Graham Number in NPR safely', async () => {
    const quote = await provider.getQuote('NABIL');
    const graham = FrameworkEngines.calculateGraham(quote!, 28.36, 247.28, 2.23);
    expect(graham.grahamNumber).toBeGreaterThan(0);
    expect(graham.peTimesPb).toBeGreaterThan(0);
  });

  it('performs full fundamental analysis with sector adjustments', async () => {
    const quote = await provider.getQuote('NABIL');
    const fund = FundamentalEngine.performFullAnalysis(quote!);
    expect(fund.isFinancialSector).toBe(true);
    expect(fund.profitability.roe).toBeGreaterThan(0);
    expect(fund.valuation.pe).toBeGreaterThan(0);
  });
});
