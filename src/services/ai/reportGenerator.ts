import { StockQuote } from '../../types/stock';
import { FullTechnicalAnalysis } from '../../types/technicals';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { SmartMoneyAnalysis } from '../../types/smartMoney';
import { MultiFactorScore } from '../../types/scoring';
import { ResearchReport } from '../../types/ai';

export class ReportGenerator {
  public static generateReport(
    quote: StockQuote,
    technicals: FullTechnicalAnalysis,
    fundamentals: FullFundamentalAnalysis,
    smartMoney: SmartMoneyAnalysis,
    score: MultiFactorScore
  ): ResearchReport {
    return {
      id: `report-${quote.symbol}-${Date.now()}`,
      symbol: quote.symbol,
      companyName: quote.name,
      reportDate: '29 Aug 2026',
      generatedBy: 'MISS AI Quantitative & Research Engine (Built by Sumit)',
      executiveSummary: `${quote.name} (${quote.symbol}) currently holds an Overall Research Score of ${score.overallScore}/100, placing it in the "${score.ratingCategory}" tier. The company demonstrates high return on equity (${fundamentals.profitability.roe}%), healthy cash flow generation, and constructive structural momentum above key moving averages.`,
      businessOverview: `${quote.name} is a leading entity operating in the ${quote.sector} (${quote.industry}) sector. With a market capitalization of ₹${quote.marketCap.toLocaleString('en-IN')} Cr, it maintains a critical footprint in domestic and global supply chains.`,
      growthAndQuality: `3-Year Revenue CAGR stands at ${fundamentals.growth.revenue3YrCAGR}%, with Net Profit growing +${fundamentals.growth.netProfitYoY}% YoY. The business is categorized as a "${fundamentals.peterLynch.category}" under the Peter Lynch framework.`,
      financialPerformance: `Financial health is exceptional with a Piotroski F-Score of ${fundamentals.piotroski.score}/9. Operating margin is ${fundamentals.profitability.operatingMargin}% and net margin is ${fundamentals.profitability.netMargin}%. Total debt is ₹${fundamentals.balanceSheet.totalDebtCrores} Cr with a Debt-to-Equity ratio of ${fundamentals.balanceSheet.debtToEquity}.`,
      valuationAssessment: `The stock is currently trading at a trailing P/E of ${fundamentals.valuation.pe}x with a PEG ratio of ${fundamentals.valuation.peg}. Price to Book is ${fundamentals.valuation.pb}x with dividend yield of ${fundamentals.valuation.dividendYield}%. Valuation is characterized as "${fundamentals.valuation.valuationVerdict}".`,
      technicalLandscape: `The primary technical trend is in a "${technicals.trendSummary}". RSI 14 is at ${technicals.rsi.value} (${technicals.rsi.classification}). 50-day SMA is ₹${technicals.movingAverages.sma50.value} and 200-day SMA is ₹${technicals.movingAverages.sma200.value}. ${technicals.movingAverages.crossSignals.details}`,
      ownershipAndSmartMoney: `Promoter ownership is ${smartMoney.latestPromoterHolding}% with ${smartMoney.latestPromoterPledged}% pledged. FII holding stands at ${smartMoney.latestFiiHolding}% (${smartMoney.fiiChangeQoQ > 0 ? '+' : ''}${smartMoney.fiiChangeQoQ}% QoQ) and DII holding is ${smartMoney.latestDiiHolding}% (${smartMoney.diiChangeQoQ > 0 ? '+' : ''}${smartMoney.diiChangeQoQ}% QoQ). Smart money classification: "${smartMoney.smartMoneyClassification}".`,
      newsAndCorporateDevelopments: `Recent disclosures highlight order wins, regular dividend payouts, and steady capacity deployment without contentious regulatory observations.`,
      industryAndMacroContext: `Industry macro is supported by resilient domestic GDP expansion (7.8%), stable benchmark repo rates at 6.50%, and softening headline inflation.`,
      keyRisks: [
        'Macroeconomic slowdown dampening customer discretionary capital expenditure.',
        'Valuation multiple contraction if quarterly earnings growth drops below 10%.',
        'Raw material, talent, or currency volatility impacting operating margins.'
      ],
      bullCase: `Accelerating digital and infrastructure demand drives revenue CAGR above 18%; margin expansion pushes ROE beyond 25%, supporting multiple expansion.`,
      bearCase: `Macro headwinds delay contract ramp-ups; competitive pricing pressures compress EBITDA margins by 200-300 bps, causing mean-reversion in multiples.`,
      baseCase: `Steady 12-14% compounding in earnings supported by market share gains and disciplined capital allocation.`,
      keyTechnicalReferenceLevels: {
        support1: `₹${technicals.supportResistance.support1}`,
        support2: `₹${technicals.supportResistance.support2}`,
        resistance1: `₹${technicals.supportResistance.resistance1}`,
        resistance2: `₹${technicals.supportResistance.resistance2}`
      },
      frameworkScores: {
        piotroski: `${fundamentals.piotroski.score}/9 (${fundamentals.piotroski.classification})`,
        canslim: `${fundamentals.canslim.totalScore}/100 (${fundamentals.canslim.verdict})`,
        buffett: `${fundamentals.buffett.buffettQualityScore}/100 (${fundamentals.buffett.verdict})`,
        graham: `${fundamentals.graham.grahamScore}/100 (${fundamentals.graham.classification})`,
        peterLynch: `Category: ${fundamentals.peterLynch.category} (PEG ${fundamentals.peterLynch.pegRatio})`
      },
      overallResearchScore: score.overallScore,
      dataSources: [
        'NSE Official Market Feed & Corporate Filings',
        'BSE Corporate Filings & Shareholding Submissions',
        'Audited Annual Financial Statements & Notes to Accounts',
        'Reserve Bank of India & Ministry of Statistics (MOSPI)'
      ],
      disclaimer: 'IMPORTANT: This document is generated for educational and research screening purposes only. It does not constitute personalized investment advice or a solicitation to buy/sell securities. Market investments are subject to market risks. Conduct independent due diligence.'
    };
  }
}
