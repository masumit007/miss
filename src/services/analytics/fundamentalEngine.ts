import { StockQuote } from '../../types/stock';
import { FinancialYearData, FullFundamentalAnalysis } from '../../types/fundamentals';
import { FrameworkEngines } from './frameworkEngines';

export class FundamentalEngine {
  /**
   * Builds full fundamental analysis from REAL filed financial statements.
   *
   * `history` must come from an actual source (company disclosures / NEPSE
   * filings via IDataProvider.getQuarterlyResults, etc.) — most recent
   * year first. This function performs arithmetic on whatever real years
   * are supplied; it never synthesizes financials from market cap or any
   * other proxy.
   *
   * Returns null when there isn't enough real data to say anything
   * meaningful (currently: whenever `history` is empty, since MISS
   * doesn't yet have a wired-up NEPSE company-financials source). Callers
   * must render "Fundamental data unavailable" rather than a blank/zeroed
   * dashboard when this returns null.
   */
  public static performFullAnalysis(
    quote: StockQuote,
    history: FinancialYearData[],
    technicalScore: number | null = null
  ): FullFundamentalAnalysis | null {
    if (history.length === 0) {
      return null;
    }

    const sector = String(quote.sector ?? '');
    const isFinancialSector = sector.includes('Bank') || sector.includes('Finance') || sector.includes('Insurance');

    const currentYear = history[0];
    const prevYear: FinancialYearData | undefined = history[1];
    const y3Year: FinancialYearData | undefined = history[2];

    // Ratios computed only from the real current year.
    const roe = currentYear.totalEquity > 0 ? Math.round((currentYear.netProfit / currentYear.totalEquity) * 1000) / 10 : null;
    const capitalEmployed = currentYear.totalAssets - currentYear.currentLiabilities;
    const roce = capitalEmployed > 0 ? Math.round((currentYear.operatingProfit / capitalEmployed) * 1000) / 10 : null;
    const roa = currentYear.totalAssets > 0 ? Math.round((currentYear.netProfit / currentYear.totalAssets) * 1000) / 10 : null;

    const opMargin = currentYear.revenue > 0 ? Math.round((currentYear.operatingProfit / currentYear.revenue) * 1000) / 10 : null;
    const netMargin = currentYear.revenue > 0 ? Math.round((currentYear.netProfit / currentYear.revenue) * 1000) / 10 : null;
    const grossMargin = currentYear.revenue > 0 ? Math.round((currentYear.ebitda / currentYear.revenue) * 1000) / 10 : null;

    // Growth requires a prior real year — null if we only have one year.
    const revYoY = prevYear && prevYear.revenue > 0 ? Math.round(((currentYear.revenue - prevYear.revenue) / prevYear.revenue) * 1000) / 10 : null;
    const profitYoY = prevYear && prevYear.netProfit > 0 ? Math.round(((currentYear.netProfit - prevYear.netProfit) / prevYear.netProfit) * 1000) / 10 : null;
    const rev3YrCAGR = y3Year && y3Year.revenue > 0 ? Math.round((Math.pow(currentYear.revenue / y3Year.revenue, 1 / 2) - 1) * 1000) / 10 : null;
    const profit3YrCAGR = y3Year && y3Year.netProfit > 0 ? Math.round((Math.pow(currentYear.netProfit / y3Year.netProfit, 1 / 2) - 1) * 1000) / 10 : null;

    // Valuation requires real EPS and current price.
    const eps = currentYear.eps > 0 ? currentYear.eps : null;
    const pe = eps !== null ? Math.round((quote.currentPrice / eps) * 10) / 10 : null;
    const peg = pe !== null && profitYoY !== null && profitYoY !== 0 ? Math.round((pe / Math.abs(profitYoY)) * 100) / 100 : null;
    const bookValuePerShare = currentYear.sharesCount > 0 ? currentYear.totalEquity / currentYear.sharesCount : null;
    const pb = bookValuePerShare !== null && bookValuePerShare > 0 ? Math.round((quote.currentPrice / bookValuePerShare) * 100) / 100 : null;
    const evToEbitda = currentYear.ebitda > 0 && quote.marketCap !== null
      ? Math.round(((quote.marketCap + currentYear.totalDebt - currentYear.cashAndInvestments) / currentYear.ebitda) * 10) / 10
      : null;
    const ps = currentYear.revenue > 0 && quote.marketCap !== null ? Math.round((quote.marketCap / currentYear.revenue) * 100) / 100 : null;
    const pcf = currentYear.operatingCashFlow > 0 && quote.marketCap !== null ? Math.round((quote.marketCap / currentYear.operatingCashFlow) * 10) / 10 : null;
    const dividendYield = currentYear.dividendPerShare > 0 ? Math.round((currentYear.dividendPerShare / quote.currentPrice) * 1000) / 10 : null;

    // Balance sheet.
    const debtToEquity = currentYear.totalEquity > 0 ? Math.round((currentYear.totalDebt / currentYear.totalEquity) * 100) / 100 : null;
    const currentRatio = currentYear.currentLiabilities > 0 ? Math.round((currentYear.currentAssets / currentYear.currentLiabilities) * 100) / 100 : null;
    const quickRatio = currentYear.currentLiabilities > 0 ? Math.round(((currentYear.currentAssets - currentYear.inventory) / currentYear.currentLiabilities) * 100) / 100 : null;
    const netDebt = currentYear.totalDebt - currentYear.cashAndInvestments;
    const fcfYield = quote.marketCap !== null && quote.marketCap > 0 ? Math.round((currentYear.freeCashFlow / quote.marketCap) * 1000) / 10 : null;

    const piotroski = FrameworkEngines.calculatePiotroski(history);
    const canslim = FrameworkEngines.calculateCANSLIM(quote, history, technicalScore);
    const buffett = FrameworkEngines.calculateBuffett(quote, history, roe);
    const graham = FrameworkEngines.calculateGraham(quote, eps, bookValuePerShare, currentRatio, history.length);
    const peterLynch = FrameworkEngines.calculatePeterLynch(quote, pe, profitYoY);

    const valuationVerdict: FullFundamentalAnalysis['valuation']['valuationVerdict'] =
      pe === null
        ? 'Fair Valuation'
        : pe < 20 && (peg === null || peg < 1.3)
          ? 'Potentially Low / Undervalued'
          : pe > 40 || (peg !== null && peg > 2.5)
            ? 'Elevated / Expensive'
            : 'Fair Valuation';

    const notAvailable = (label: string) => `${label}: Data unavailable — insufficient real financial data.`;

    return {
      symbol: quote.symbol,
      sector: quote.sector ?? 'Unclassified',
      industry: quote.industry ?? 'Unclassified',
      isFinancialSector,
      profitability: {
        roe: roe ?? 0,
        roce: roce ?? 0,
        roa: roa ?? 0,
        operatingMargin: opMargin ?? 0,
        netMargin: netMargin ?? 0,
        grossMargin: grossMargin ?? 0,
        roe3YrAvg: 0, // requires 3 real years of equity/profit — not synthesized
        roe5YrAvg: 0,
        profitabilityScore: roe !== null && opMargin !== null ? Math.min(95, Math.max(0, Math.round(roe * 2.2 + opMargin * 1.2))) : 0,
        sectorComparison: roe !== null
          ? `ROE is ${roe}% based on ${currentYear.year} filed financials.`
          : notAvailable('Sector comparison')
      },
      growth: {
        revenueYoY: revYoY ?? 0,
        revenue3YrCAGR: rev3YrCAGR ?? 0,
        revenue5YrCAGR: 0,
        netProfitYoY: profitYoY ?? 0,
        netProfit3YrCAGR: profit3YrCAGR ?? 0,
        netProfit5YrCAGR: 0,
        epsYoY: profitYoY ?? 0,
        eps3YrCAGR: profit3YrCAGR ?? 0,
        growthScore: profitYoY !== null && revYoY !== null ? Math.min(95, Math.max(0, Math.round(profitYoY * 2.5 + revYoY * 1.5))) : 0,
        growthTrajectory: profitYoY === null ? 'Contracting' : profitYoY > 15 ? 'Accelerating' : profitYoY > 8 ? 'Steady Growth' : profitYoY >= 0 ? 'Decelerating' : 'Contracting'
      },
      valuation: {
        pe: pe ?? 0,
        forwardPe: undefined,
        peg: peg ?? 0,
        pb: pb ?? 0,
        evToEbitda: evToEbitda ?? 0,
        priceToSales: ps ?? 0,
        priceToCashFlow: pcf ?? 0,
        dividendYield: dividendYield ?? 0,
        sectorMedianPe: 0, // requires a real sector-peer dataset — not synthesized
        historical5YrPe: 0,
        valuationScore: peg !== null ? (peg < 1.5 ? 78 : 55) : 0,
        valuationVerdict,
        explanation: pe !== null
          ? `Trailing P/E is ${pe}x${peg !== null ? ` with PEG of ${peg}` : ''}, based on ${currentYear.year} filed EPS. ${valuationVerdict}. Never consider a stock purely cheap based on P/E without evaluating growth and asset quality.`
          : notAvailable('Valuation')
      },
      balanceSheet: {
        totalDebtCrores: currentYear.totalDebt,
        debtToEquity: debtToEquity ?? 0,
        interestCoverage: 0, // requires real interest-expense line item — not synthesized
        currentRatio: currentRatio ?? 0,
        quickRatio: quickRatio ?? 0,
        cashAndEquivalentsCrores: currentYear.cashAndInvestments,
        netDebtCrores: netDebt,
        freeCashFlowCrores: currentYear.freeCashFlow,
        fcfYield: fcfYield ?? 0,
        cashConversionCycleDays: 0,
        leverageCategory: debtToEquity === null ? 'Moderate Leverage' : debtToEquity < 0.3 ? 'Low Leverage (Healthy)' : debtToEquity < 0.8 ? 'Moderate Leverage' : 'High Leverage (Caution)',
        solvencyScore: debtToEquity === null ? 0 : debtToEquity < 0.3 ? 85 : debtToEquity < 0.8 ? 65 : 40
      },
      earningsQuality: {
        cfoToNetProfitRatio: currentYear.netProfit !== 0 ? Math.round((currentYear.operatingCashFlow / currentYear.netProfit) * 100) / 100 : 0,
        accrualStatus: currentYear.netProfit > 0 && currentYear.operatingCashFlow >= currentYear.netProfit * 0.9 ? 'Healthy Cash Conversion' : 'Accrual Heavy / Divergence Detected',
        exceptionalItemsNotes: `Based on ${currentYear.year} filed figures — no adjustment made for one-off items unless separately disclosed.`,
        flag: currentYear.netProfit > 0 && currentYear.operatingCashFlow >= currentYear.netProfit * 0.9
          ? 'Operating cash flow is consistent with reported net earnings.'
          : 'Operating cash flow diverges from reported net earnings — worth further review.'
      },
      piotroski,
      canslim,
      buffett,
      graham,
      peterLynch,
      historicalYears: history
    };
  }
}
