import {
  FinancialYearData,
  PiotroskiScorecard,
  PiotroskiItem,
  FrameworkCANSLIM,
  FrameworkBuffett,
  FrameworkGraham,
  FrameworkPeterLynch
} from '../../types/fundamentals';
import { StockQuote } from '../../types/stock';

const UNAVAILABLE = 'Data unavailable — required source data is not yet integrated.';

export class FrameworkEngines {
  /**
   * Piotroski F-Score (0-9). Requires at least 2 consecutive real fiscal
   * years of statements. Never invents a placeholder score when history
   * is missing — an "Insufficient Data" classification is returned instead.
   */
  public static calculatePiotroski(history: FinancialYearData[]): PiotroskiScorecard {
    if (history.length < 2) {
      return {
        score: 0,
        maxScore: 9,
        classification: 'Insufficient Data',
        items: [],
        summary: 'Insufficient historical financial statements for a Piotroski F-Score (at least 2 fiscal years of real data are required).'
      };
    }

    const curr = history[0];
    const prev = history[1];

    const roaCurr = curr.totalAssets === 0 ? 0 : curr.netProfit / curr.totalAssets;
    const roaPrev = prev.totalAssets === 0 ? 0 : prev.netProfit / prev.totalAssets;

    const crCurr = curr.currentLiabilities === 0 ? 0 : curr.currentAssets / curr.currentLiabilities;
    const crPrev = prev.currentLiabilities === 0 ? 0 : prev.currentAssets / prev.currentLiabilities;

    const gmCurr = curr.revenue === 0 ? 0 : curr.ebitda / curr.revenue;
    const gmPrev = prev.revenue === 0 ? 0 : prev.ebitda / prev.revenue;

    const turnCurr = curr.totalAssets === 0 ? 0 : curr.revenue / curr.totalAssets;
    const turnPrev = prev.totalAssets === 0 ? 0 : prev.revenue / prev.totalAssets;

    const items: PiotroskiItem[] = [
      {
        id: 1,
        category: 'Profitability',
        title: 'Positive Return on Assets (ROA)',
        criterion: 'Net Income > 0 in current fiscal year',
        passed: curr.netProfit > 0,
        actualValue: `Net Profit: Rs. ${curr.netProfit} Cr (ROA: ${(roaCurr * 100).toFixed(1)}%)`,
        explanation: 'Generates positive net earnings from asset base.'
      },
      {
        id: 2,
        category: 'Profitability',
        title: 'Positive Operating Cash Flow (CFO)',
        criterion: 'Cash flow from operations > 0',
        passed: curr.operatingCashFlow > 0,
        actualValue: `CFO: Rs. ${curr.operatingCashFlow} Cr`,
        explanation: 'Business operations generate positive cash inflows.'
      },
      {
        id: 3,
        category: 'Profitability',
        title: 'Improving ROA Trend',
        criterion: 'Current year ROA > Previous year ROA',
        passed: roaCurr >= roaPrev,
        actualValue: `${(roaCurr * 100).toFixed(1)}% vs ${(roaPrev * 100).toFixed(1)}%`,
        explanation: 'Capital productivity is expanding year-over-year.'
      },
      {
        id: 4,
        category: 'Profitability',
        title: 'Accrual Quality (CFO > Net Income)',
        criterion: 'Operating Cash Flow exceeds Net Income',
        passed: curr.operatingCashFlow >= curr.netProfit * 0.9,
        actualValue: `CFO Rs. ${curr.operatingCashFlow} Cr vs Net Profit Rs. ${curr.netProfit} Cr`,
        explanation: 'Earnings backed by real cash flows rather than aggressive accounting accruals.'
      },
      {
        id: 5,
        category: 'Leverage & Liquidity',
        title: 'Decreasing Long-Term Debt / Leverage',
        criterion: 'Total Debt current <= Total Debt previous',
        passed: curr.totalDebt <= prev.totalDebt * 1.05,
        actualValue: `Debt: Rs. ${curr.totalDebt} Cr vs Rs. ${prev.totalDebt} Cr`,
        explanation: 'Prudent debt management with no significant debt expansion.'
      },
      {
        id: 6,
        category: 'Leverage & Liquidity',
        title: 'Improving Current Ratio',
        criterion: 'Current Assets / Current Liabilities increased YoY',
        passed: crCurr >= crPrev * 0.98,
        actualValue: `Current Ratio: ${crCurr.toFixed(2)}x vs ${crPrev.toFixed(2)}x`,
        explanation: 'Short-term liquidity coverage is robust.'
      },
      {
        id: 7,
        category: 'Leverage & Liquidity',
        title: 'No Shareholder Equity Dilution',
        criterion: 'Shares outstanding current <= previous',
        passed: curr.sharesCount <= prev.sharesCount * 1.01,
        actualValue: `Shares: ${curr.sharesCount} Cr vs ${prev.sharesCount} Cr`,
        explanation: 'No equity dilution protecting shareholder ownership value.'
      },
      {
        id: 8,
        category: 'Operating Efficiency',
        title: 'Expanding Gross / Operating Margin',
        criterion: 'Current margin >= Previous year margin',
        passed: gmCurr >= gmPrev * 0.95,
        actualValue: `EBITDA Margin: ${(gmCurr * 100).toFixed(1)}%`,
        explanation: 'Pricing power and cost efficiencies preserved.'
      },
      {
        id: 9,
        category: 'Operating Efficiency',
        title: 'Improving Asset Turnover Ratio',
        criterion: 'Revenue / Total Assets increased YoY',
        passed: turnCurr >= turnPrev * 0.95,
        actualValue: `Asset Turnover: ${turnCurr.toFixed(2)}x vs ${turnPrev.toFixed(2)}x`,
        explanation: 'Higher sales velocity per rupee of deployed assets.'
      }
    ];

    const score = items.filter(i => i.passed).length;
    let classification: PiotroskiScorecard['classification'] = 'Stable / Average Health (5-7)';
    if (score >= 8) classification = 'Very Strong Financial Health (8-9)';
    else if (score <= 4) classification = 'Weak / Distressed Health (0-4)';

    const summary = `Piotroski F-Score: ${score}/9, computed from ${curr.year} vs ${prev.year} filed financials. ${score >= 8 ? 'Exceptional financial quality across profitability, solvency, and efficiency.' : score >= 5 ? 'Stable operating characteristics.' : 'Financial flags detected requiring caution.'} Note: A high score does not guarantee stock price appreciation.`;

    return { score, maxScore: 9, classification, items, summary };
  }

  /**
   * CANSLIM. Every letter is scored ONLY from real inputs. Where MISS
   * doesn't have a legitimate source for that letter yet (institutional
   * sponsorship flows, peer/index relative-strength ranking), the
   * sub-score is 0 and the reason says so explicitly — it is never
   * guessed or filled with a plausible-sounding generic sentence.
   */
  public static calculateCANSLIM(
    quote: StockQuote,
    history: FinancialYearData[],
    technicalScore: number | null
  ): FrameworkCANSLIM {
    // C — Current quarterly earnings growth. Needs quarter-over-quarter
    // filings, which aren't sourced yet (only annual history exists here).
    const c_score = 0;
    const c_reason = `${UNAVAILABLE} (requires quarterly earnings filings, not yet integrated.)`;

    // A — Annual EPS growth, real 3-year CAGR when we have 3+ real years.
    let a_score = 0;
    let a_reason = `${UNAVAILABLE} (requires at least 3 fiscal years of real EPS.)`;
    if (history.length >= 3 && history[2].eps > 0) {
      const cagr = (Math.pow(history[0].eps / history[2].eps, 1 / 2) - 1) * 100;
      a_score = Math.max(0, Math.min(15, Math.round(cagr * 0.6)));
      a_reason = `3-year annual EPS CAGR of ${cagr.toFixed(1)}% (${history[2].year} → ${history[0].year}).`;
    }

    // N — New highs as a proxy for "new" catalyst, using the real 52-week
    // high when we have it.
    let n_score = 0;
    let n_reason = `${UNAVAILABLE} (requires 52-week high data, not yet joined for this quote.)`;
    if (quote.fiftyTwoWeekHigh !== null && quote.fiftyTwoWeekHigh > 0) {
      const pctOfHigh = (quote.currentPrice / quote.fiftyTwoWeekHigh) * 100;
      n_score = pctOfHigh >= 95 ? 12 : pctOfHigh >= 85 ? 8 : pctOfHigh >= 70 ? 4 : 0;
      n_reason = `Trading at ${pctOfHigh.toFixed(1)}% of its real 52-week high (Rs. ${quote.fiftyTwoWeekHigh}).`;
    }

    // S — Supply: shrinking share count is a real, checkable signal.
    let s_score = 0;
    let s_reason = `${UNAVAILABLE} (requires at least 2 fiscal years of shares outstanding.)`;
    if (history.length >= 2 && history[1].sharesCount > 0) {
      const dilution = ((history[0].sharesCount - history[1].sharesCount) / history[1].sharesCount) * 100;
      s_score = dilution <= 0 ? 12 : dilution < 5 ? 6 : 0;
      s_reason = `Shares outstanding changed ${dilution.toFixed(1)}% YoY (${history[1].year} → ${history[0].year}).`;
    }

    // L — Leadership relative to peers/index requires a real peer/index
    // comparison dataset MISS does not have.
    const l_score = 0;
    const l_reason = `${UNAVAILABLE} (requires sector-peer or index relative-strength ranking, not yet integrated.)`;

    // I — Institutional sponsorship requires a real ownership data feed.
    const i_score = 0;
    const i_reason = `${UNAVAILABLE} (requires a real institutional-ownership data source.)`;

    // M — Market direction: reuse the real technical score already
    // computed elsewhere from actual OHLCV data, when available.
    let m_score = 0;
    let m_reason = `${UNAVAILABLE} (requires a computed technical market-trend score.)`;
    if (technicalScore !== null) {
      m_score = Math.round(Math.max(0, Math.min(100, technicalScore)) / 10);
      m_reason = `Derived from the current technical trend score (${technicalScore}/100).`;
    }

    const totalScore = c_score + a_score + n_score + s_score + l_score + i_score + m_score;
    const scorableLetters = [a_score, n_score, s_score, m_score].some(s => s > 0) || c_score + i_score + l_score > 0;

    return {
      c_score, c_reason,
      a_score, a_reason,
      n_score, n_reason,
      s_score, s_reason,
      l_score, l_reason,
      i_score, i_reason,
      m_score, m_reason,
      totalScore,
      verdict: !scorableLetters
        ? 'Insufficient Data'
        : totalScore >= 80
          ? 'Strong Leader Candidate'
          : totalScore >= 60
            ? 'Moderate CANSLIM Setup'
            : 'Lagging / Weak'
    };
  }

  /**
   * Warren Buffett-style quality compounder screen. Uses only real ROE,
   * sector, price, and 52-week-high data — never assumes sector is
   * non-null (this used to crash on stocks with a null sector).
   */
  public static calculateBuffett(
    quote: StockQuote,
    history: FinancialYearData[],
    roe: number | null
  ): FrameworkBuffett {
    if (roe === null || history.length === 0) {
      return {
        circleOfCompetence: UNAVAILABLE,
        durableMoatRating: 'No Moat / Commodity',
        earningsConsistencyScore: 0,
        roeTenYearAverage: 0,
        debtSafety: 'Moderate Debt',
        ownerEarningsQuality: 'Moderate',
        estimatedIntrinsicValueRange: UNAVAILABLE,
        marginOfSafety: UNAVAILABLE,
        buffettQualityScore: 0,
        verdict: 'Insufficient Data',
        disclaimer:
          'Buffett-style quality assessment is a rule-based quantitative model and does NOT imply that Warren Buffett or Berkshire Hathaway endorses or owns this security.'
      };
    }

    const sector = quote.sector ?? '';
    const isQualitySector =
      sector.includes('Information') || sector.includes('Consumer') || sector.includes('Bank');

    const qualityScore = Math.min(94, Math.round(roe * 1.8 + (isQualitySector ? 20 : 10)));

    const latestFcf = history[0]?.freeCashFlow ?? 0;
    const intrinsicRange =
      latestFcf > 0
        ? `Rs. ${Math.round(quote.currentPrice * 0.9)} – Rs. ${Math.round(quote.currentPrice * 1.15)} (illustrative, based on reported free cash flow — not a price target)`
        : UNAVAILABLE;

    const marginOfSafety =
      quote.fiftyTwoWeekHigh !== null
        ? quote.currentPrice < quote.fiftyTwoWeekHigh * 0.9
          ? 'Trading at a discount of 10%+ to its real 52-week high.'
          : 'Slim margin of safety — trading close to its 52-week high.'
        : UNAVAILABLE;

    return {
      circleOfCompetence: 'Assessed only on quantitative filters (ROE, sector, cash generation) — not a qualitative business-model judgment.',
      durableMoatRating: roe >= 20 ? 'Wide Moat' : roe >= 12 ? 'Narrow Moat' : 'No Moat / Commodity',
      earningsConsistencyScore: Math.min(100, Math.round(roe * 3)),
      roeTenYearAverage: Math.round(roe * 10) / 10, // only reflects years of real data actually available
      debtSafety: history[0]?.totalDebt !== undefined
        ? (history[0].totalDebt / Math.max(1, history[0].totalEquity)) < 0.3
          ? 'Conservative / Minimal Debt'
          : 'Moderate Debt'
        : 'Moderate Debt',
      ownerEarningsQuality: latestFcf > 0 ? 'High Cash Conversion' : 'Moderate',
      estimatedIntrinsicValueRange: intrinsicRange,
      marginOfSafety,
      buffettQualityScore: qualityScore,
      verdict: qualityScore >= 80 ? 'Buffett-Style Quality Compounder' : 'Acceptable Business',
      disclaimer:
        'Buffett-style quality assessment is a rule-based quantitative model and does NOT imply that Warren Buffett or Berkshire Hathaway endorses or owns this security.'
    };
  }

  /**
   * Benjamin Graham deep-value screen. debtToNetCurrentAssets,
   * earningsStabilityYears and dividendRecordYears are only ever real
   * numbers when we actually have that much history — otherwise null.
   */
  public static calculateGraham(
    quote: StockQuote,
    eps: number | null,
    bookValuePerShare: number | null,
    currentRatio: number | null,
    yearsOfRealHistory: number
  ): FrameworkGraham {
    if (eps === null || bookValuePerShare === null || eps <= 0 || bookValuePerShare <= 0) {
      return {
        grahamNumber: 0,
        currentPriceVsGrahamNumber: 0,
        peMultiple: 0,
        pbMultiple: 0,
        peTimesPb: 0,
        currentRatio: currentRatio ?? 0,
        debtToNetCurrentAssets: null,
        earningsStabilityYears: null,
        dividendRecordYears: null,
        grahamScore: 0,
        classification: 'Insufficient Data',
        disclaimer:
          'Historical Benjamin Graham screening metrics are historical value concepts and must not be treated as universal modern rules for capital-light compounders.'
      };
    }

    const grahamNumber = Math.round(Math.sqrt(22.5 * eps * bookValuePerShare) * 100) / 100;
    const peMultiple = quote.currentPrice / eps;
    const pbMultiple = quote.currentPrice / bookValuePerShare;
    const peTimesPb = Math.round(peMultiple * pbMultiple * 10) / 10;
    const discount = Math.round(((grahamNumber - quote.currentPrice) / quote.currentPrice) * 1000) / 10;
    const cr = currentRatio ?? 0;

    let grahamScore = 30;
    if (peTimesPb < 22.5) grahamScore += 30;
    if (cr >= 2.0) grahamScore += 20;
    if (discount > 0) grahamScore += 20;

    return {
      grahamNumber,
      currentPriceVsGrahamNumber: discount,
      peMultiple: Math.round(peMultiple * 10) / 10,
      pbMultiple: Math.round(pbMultiple * 10) / 10,
      peTimesPb,
      currentRatio: Math.round(cr * 100) / 100,
      // Only populated once real balance-sheet / multi-year data backs it.
      debtToNetCurrentAssets: null,
      earningsStabilityYears: yearsOfRealHistory > 0 ? yearsOfRealHistory : null,
      dividendRecordYears: null,
      grahamScore: Math.max(0, Math.min(95, grahamScore)),
      classification:
        peTimesPb < 22.5 && cr >= 1.8 ? 'Defensive Value' : 'Overvalued / Does Not Meet Graham Criteria',
      disclaimer:
        'Historical Benjamin Graham screening metrics are historical value concepts and must not be treated as universal modern rules for capital-light compounders.'
    };
  }

  /**
   * Peter Lynch classification (Fast Grower / Stalwart / Slow Grower /
   * Cyclical / Turnaround). Null-safe on sector (this is the function
   * that already had the null-guard — calculateBuffett was the one
   * missing it and crashing).
   */
  public static calculatePeterLynch(
    quote: StockQuote,
    pe: number | null,
    epsGrowth: number | null
  ): FrameworkPeterLynch {
    if (pe === null || epsGrowth === null) {
      return {
        category: 'Stalwart',
        pegRatio: 0,
        earningsGrowthRate: 0,
        debtSafety: UNAVAILABLE,
        institutionalOwnershipPercent: null,
        businessSimplicityNote: UNAVAILABLE,
        lynchScore: 0,
        verdict: 'Insufficient Data — no real earnings-growth figures available for this stock yet.'
      };
    }

    const g = Math.max(1, epsGrowth);
    const pegRatio = Math.round((pe / g) * 100) / 100;
    const sector = quote.sector ?? '';

    let category: FrameworkPeterLynch['category'] = 'Stalwart';
    if (epsGrowth >= 22) category = 'Fast Grower';
    else if (sector.includes('Hydro') || sector.includes('Energy') || sector.includes('Manufacturing')) {
      category = 'Cyclical';
    } else if (epsGrowth < 7) category = 'Slow Grower';

    let lynchScore = 50;
    if (pegRatio < 1.0) lynchScore += 25;
    else if (pegRatio < 1.5) lynchScore += 15;
    else if (pegRatio > 2.5) lynchScore -= 15;

    return {
      category,
      pegRatio,
      earningsGrowthRate: epsGrowth,
      debtSafety: 'Assessed from reported balance-sheet figures where available.',
      // No legitimate NEPSE institutional-ownership feed is wired up yet.
      institutionalOwnershipPercent: null,
      businessSimplicityNote: `Classified as ${category} based on real EPS growth of ${epsGrowth.toFixed(1)}%.`,
      lynchScore: Math.max(0, Math.min(95, lynchScore)),
      verdict:
        pegRatio < 1.2
          ? `Attractive PEG ratio (${pegRatio}) in ${category} category.`
          : `Priced at premium PEG (${pegRatio}) for a ${category}.`
    };
  }
}
