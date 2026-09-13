import { StockQuote } from '../../types/stock';
import { FullTechnicalAnalysis } from '../../types/technicals';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { SmartMoneyAnalysis } from '../../types/smartMoney';
import { MultiFactorScore } from '../../types/scoring';
import { ResearchReport } from '../../types/ai';

const UNAVAILABLE = 'Data unavailable — not yet integrated as a real source for MISS.';

export class ReportGenerator {
  /**
   * Builds a research report strictly from the real technicals/fundamentals
   * /smartMoney/score objects passed in. `fundamentals` and `smartMoney`
   * may be null — MISS does not fabricate a business narrative, bull/bear
   * case, or macro backdrop when the underlying real data isn't there;
   * every such section says so explicitly instead.
   */
  public static generateReport(
    quote: StockQuote,
    technicals: FullTechnicalAnalysis | null,
    fundamentals: FullFundamentalAnalysis | null,
    smartMoney: SmartMoneyAnalysis | null,
    score: MultiFactorScore
  ): ResearchReport {
    const reportDate = new Date().toISOString().slice(0, 10);

    const dataSources = ['NEPSE live market feed (@rumess/nepse-api)'];
    if (fundamentals) dataSources.push('Filed company financial statements');
    if (smartMoney) dataSources.push('Filed shareholding disclosures');
    if (dataSources.length === 1) {
      dataSources.push('No filed-financials or ownership source is integrated yet — this report is price/technicals-only.');
    }

    return {
      id: `report-${quote.symbol}-${Date.now()}`,
      symbol: quote.symbol,
      companyName: quote.name,
      reportDate,
      generatedBy: 'MISS AI Quantitative & Research Engine',
      executiveSummary: `${quote.name} (${quote.symbol}) currently holds an Overall Research Score of ${score.overallScore}/100 ("${score.ratingCategory}"), computed only from the data currently available (${score.dataCompletenessPercent}% of scoring subfactors had real data).${fundamentals ? ` Filed-financials ROE is ${fundamentals.profitability.roe}%.` : ` ${UNAVAILABLE} for fundamentals.`}`,
      businessOverview: `${quote.name} trades on NEPSE under symbol ${quote.symbol}${quote.sector ? ` in the ${quote.sector} sector` : ''}. ${quote.marketCap !== null ? `Market capitalization is Rs. ${quote.marketCap.toLocaleString('en-NP')} Cr.` : `Market capitalization: ${UNAVAILABLE}`}`,
      growthAndQuality: fundamentals
        ? `Revenue YoY growth is ${fundamentals.growth.revenueYoY}%, with Net Profit growth of ${fundamentals.growth.netProfitYoY}% YoY. Classified as "${fundamentals.peterLynch.category}" under the Peter Lynch framework.`
        : UNAVAILABLE,
      financialPerformance: fundamentals
        ? `Piotroski F-Score is ${fundamentals.piotroski.score}/9. Operating margin is ${fundamentals.profitability.operatingMargin}% and net margin is ${fundamentals.profitability.netMargin}%. Total debt is Rs. ${fundamentals.balanceSheet.totalDebtCrores} Cr with a debt-to-equity ratio of ${fundamentals.balanceSheet.debtToEquity}.`
        : UNAVAILABLE,
      valuationAssessment: fundamentals
        ? `Trailing P/E is ${fundamentals.valuation.pe}x with a PEG ratio of ${fundamentals.valuation.peg}. Price-to-book is ${fundamentals.valuation.pb}x with dividend yield of ${fundamentals.valuation.dividendYield}%. Valuation is characterized as "${fundamentals.valuation.valuationVerdict}".`
        : UNAVAILABLE,
      technicalLandscape: technicals
        ? `Primary technical trend is "${technicals.trendSummary}". RSI 14 is at ${technicals.rsi.value} (${technicals.rsi.classification}). 50-day SMA is Rs. ${technicals.movingAverages.sma50.value} and 200-day SMA is Rs. ${technicals.movingAverages.sma200.value}. ${technicals.movingAverages.crossSignals.details}`
        : UNAVAILABLE,
      ownershipAndSmartMoney: smartMoney
        ? `Promoter ownership is ${smartMoney.latestPromoterHolding}% with ${smartMoney.latestPromoterPledged}% pledged. Foreign investor holding stands at ${smartMoney.latestForeignHolding}% (${smartMoney.foreignChangeQoQ > 0 ? '+' : ''}${smartMoney.foreignChangeQoQ}% QoQ) and domestic institutional holding is ${smartMoney.latestInstitutionalHolding}% (${smartMoney.institutionalChangeQoQ > 0 ? '+' : ''}${smartMoney.institutionalChangeQoQ}% QoQ). Classification: "${smartMoney.smartMoneyClassification}".`
        : `${UNAVAILABLE} No real shareholding disclosure history is integrated for this stock yet.`,
      newsAndCorporateDevelopments: UNAVAILABLE + ' No structured NEPSE news/disclosure feed is integrated yet.',
      industryAndMacroContext: UNAVAILABLE + ' No Nepal Rastra Bank / macro data feed is integrated yet.',
      keyRisks: fundamentals
        ? [
            'Valuation multiple contraction if earnings growth decelerates.',
            'Sector-specific demand or regulatory shifts.',
            'General NEPSE market and liquidity risk.'
          ]
        : ['Insufficient real data to characterize specific financial risks — general NEPSE market risk applies.'],
      bullCase: fundamentals ? 'Not modeled — MISS does not generate speculative bull-case narratives without a real multi-year forecast basis.' : UNAVAILABLE,
      bearCase: fundamentals ? 'Not modeled — MISS does not generate speculative bear-case narratives without a real multi-year forecast basis.' : UNAVAILABLE,
      baseCase: fundamentals ? 'Not modeled — MISS does not generate speculative base-case narratives without a real multi-year forecast basis.' : UNAVAILABLE,
      keyTechnicalReferenceLevels: {
        support1: technicals ? `Rs. ${technicals.supportResistance.support1}` : UNAVAILABLE,
        support2: technicals ? `Rs. ${technicals.supportResistance.support2}` : UNAVAILABLE,
        resistance1: technicals ? `Rs. ${technicals.supportResistance.resistance1}` : UNAVAILABLE,
        resistance2: technicals ? `Rs. ${technicals.supportResistance.resistance2}` : UNAVAILABLE
      },
      frameworkScores: {
        piotroski: fundamentals ? `${fundamentals.piotroski.score}/9 (${fundamentals.piotroski.classification})` : UNAVAILABLE,
        canslim: fundamentals ? `${fundamentals.canslim.totalScore}/100 (${fundamentals.canslim.verdict})` : UNAVAILABLE,
        buffett: fundamentals ? `${fundamentals.buffett.buffettQualityScore}/100 (${fundamentals.buffett.verdict})` : UNAVAILABLE,
        graham: fundamentals ? `${fundamentals.graham.grahamScore}/100 (${fundamentals.graham.classification})` : UNAVAILABLE,
        peterLynch: fundamentals ? `Category: ${fundamentals.peterLynch.category} (PEG ${fundamentals.peterLynch.pegRatio})` : UNAVAILABLE
      },
      overallResearchScore: score.overallScore,
      dataSources,
      disclaimer: 'IMPORTANT: This document is generated for educational and research screening purposes only. It does not constitute personalized investment advice or a solicitation to buy/sell securities. Sections marked "Data unavailable" reflect real gaps in MISS\'s current NEPSE data sourcing and are never estimated or invented. Conduct independent due diligence and verify against official NEPSE/SEBON/company disclosures.'
    };
  }
}
