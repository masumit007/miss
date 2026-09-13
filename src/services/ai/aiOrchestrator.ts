import { AITools } from './aiTools';
import { AIChatMessage } from '../../types/ai';

const NEPSE_SYMBOLS = [
  'NABIL', 'GBIME', 'NLIC', 'NICL', 'UPPER', 'CHCL', 'NTC', 'NRIC', 'CBBL', 'MERO', 'SHIVM', 'CIT'
];

function na(value: unknown, unit = ''): string {
  return value === null || value === undefined || (typeof value === 'object' && 'error' in (value as any))
    ? 'N/A — data unavailable'
    : `${value}${unit}`;
}

export class AIOrchestrator {
  /**
   * Processes a user question with real tool retrieval only. Every claim
   * in the response text is built from what the tools actually returned —
   * this function never asserts a finding, source, or price level that
   * wasn't part of a tool result. Where a tool result carries an `error`
   * field (fundamentals/ownership unavailable for that stock), the
   * response says so explicitly instead of filling in a plausible number.
   */
  public static async answerQuery(userPrompt: string): Promise<AIChatMessage> {
    const prompt = userPrompt.trim();
    const upper = prompt.toUpperCase();

    const detectedSymbol = NEPSE_SYMBOLS.find(s => upper.includes(s)) ?? NEPSE_SYMBOLS[0];

    const toolLogs: NonNullable<AIChatMessage['toolCallsExecuted']> = [];

    const quote: any = await AITools.getStockQuote(detectedSymbol);
    toolLogs.push({
      toolName: 'getStockQuote',
      params: { symbol: detectedSymbol },
      resultSummary: quote.error
        ? `No quote found for ${detectedSymbol}.`
        : `Retrieved live price Rs. ${quote.price}, change ${quote.dayChangePercent}%.`
    });

    const fund: any = await AITools.getFundamentals(detectedSymbol);
    toolLogs.push({
      toolName: 'getFundamentals',
      params: { symbol: detectedSymbol },
      resultSummary: fund.error ? fund.error : `Retrieved ROE ${fund.roe}%, P/E ${fund.pe}x, Piotroski ${fund.piotroskiScore}.`
    });

    const tech: any = await AITools.getTechnicals(detectedSymbol);
    toolLogs.push({
      toolName: 'getTechnicals',
      params: { symbol: detectedSymbol },
      resultSummary: tech.error ? tech.error : `Retrieved RSI 14 at ${tech.rsi14}, trend ${tech.trend}.`
    });

    const sm: any = await AITools.getOwnership(detectedSymbol);
    toolLogs.push({
      toolName: 'getOwnership',
      params: { symbol: detectedSymbol },
      resultSummary: sm.error ? sm.error : `Retrieved classification ${sm.classification}.`
    });

    const dataFreshness = quote.error ? 'Unavailable' : quote.lastUpdated ?? 'Unavailable';
    // Only claim the sources MISS actually queried for this response.
    const sources = ['NEPSE live market feed (@rumess/nepse-api)'];
    if (!fund.error) sources.push('Filed company financial statements');
    if (!sm.error) sources.push('Filed shareholding disclosures');

    const text = quote.error
      ? `I couldn't find a quote for "${detectedSymbol}" in the current NEPSE data. ${quote.error ?? ''}`
      : [
          `### MISS AI Analysis: ${quote.name ?? detectedSymbol} (${detectedSymbol})`,
          '',
          `Based only on data actually retrieved just now:`,
          '',
          `1. **Price**: Rs. ${na(quote.price)} (${na(quote.dayChangePercent, '%')} today).`,
          `2. **Fundamentals**: ${fund.error ? fund.error : `ROE is ${fund.roe}%, Piotroski F-Score ${fund.piotroskiScore}.`}`,
          `3. **Technicals**: ${tech.error ? tech.error : `Trend is **${tech.trend}**, RSI 14 at ${tech.rsi14}.`}`,
          `4. **Valuation**: ${fund.error ? fund.error : `P/E is ${fund.pe}x, PEG ${fund.peg}.`}`,
          `5. **Ownership**: ${sm.error ? sm.error : `Classification is **${sm.classification}**.`}`,
          '',
          `> This is a rule-based research summary, not investment advice or a guaranteed prediction. Fields marked unavailable reflect real gaps in MISS's current NEPSE data sourcing — they are never estimated.`
        ].join('\n');

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text,
      toolCallsExecuted: toolLogs,
      structuredVerdict: {
        quickVerdict: quote.error ? 'Insufficient Data' : fund.error && tech.error ? 'Insufficient Data' : 'See summary above',
        fundamentalsSummary: fund.error ?? `ROE ${na(fund.roe, '%')}, ROCE ${na(fund.roce, '%')}, debt-to-equity ${na(fund.debtToEquity)}.`,
        technicalsSummary: tech.error ?? `Trend ${na(tech.trend)}, RSI 14 at ${na(tech.rsi14)} (${na(tech.rsiStatus)}).`,
        valuationSummary: fund.error ?? `P/E ${na(fund.pe)}x, PEG ${na(fund.peg)}.`,
        growthSummary: fund.error ?? `Net profit YoY growth at ${na(fund.netProfitYoY, '%')}.`,
        ownershipSummary: sm.error ?? `Foreign holding ${na(sm.foreignHolding, '%')}, domestic institutional holding ${na(sm.institutionalHolding, '%')}.`,
        risks: fund.error && tech.error
          ? ['Not enough real data available yet to characterize specific risks for this stock.']
          : ['General market and macro risk applies to all NEPSE-listed equities.', 'This summary reflects only the data fields actually retrieved above.'],
        keySupport: tech.error ? 'N/A — data unavailable' : `Rs. ${na(tech.support1)}`,
        keyResistance: tech.error ? 'N/A — data unavailable' : `Rs. ${na(tech.resistance1)}`,
        invalidationConditions: tech.error
          ? ['Not enough real technical data to define invalidation levels.']
          : ['Price breakdown below the current key support level shown above.'],
        dataFreshness,
        sources,
        finalEducationalAssessment: `This assessment reflects only what MISS could retrieve for ${detectedSymbol} at this moment. Where a section says data is unavailable, verify against official NEPSE/company disclosures before acting.`
      }
    };
  }
}
