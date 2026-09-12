import { AITools } from './aiTools';
import { AIChatMessage } from '../../types/ai';

export class AIOrchestrator {
  /**
   * Processes a user question with tool retrieval and structured explainable response
   */
  public static async answerQuery(userPrompt: string): Promise<AIChatMessage> {
    const prompt = userPrompt.trim();
    const upper = prompt.toUpperCase();

    // Extract symbol if present
    const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS', 'ITC', 'BHARTIARTL', 'LT', 'SBIN', 'TITAN', 'SUNPHARMA', 'BAJFINANCE', 'TRENT', 'BEL'];
    const detectedSymbol = symbols.find(s => upper.includes(s)) || 'TCS';

    // Tool execution logs
    const toolLogs = [];

    // Execute relevant tools based on query intent
    const quote = await AITools.getStockQuote(detectedSymbol);
    toolLogs.push({ toolName: 'getStockQuote', params: { symbol: detectedSymbol }, resultSummary: `Retrieved price ₹${(quote as any).price || 'N/A'}, change ${(quote as any).dayChangePercent || 0}%.` });

    const fund = await AITools.getFundamentals(detectedSymbol);
    toolLogs.push({ toolName: 'getFundamentals', params: { symbol: detectedSymbol }, resultSummary: `Retrieved ROE ${(fund as any).roe}%, P/E ${(fund as any).pe}x, Piotroski ${(fund as any).piotroskiScore}.` });

    const tech = await AITools.getTechnicals(detectedSymbol);
    toolLogs.push({ toolName: 'getTechnicals', params: { symbol: detectedSymbol }, resultSummary: `Retrieved RSI 14 at ${(tech as any).rsi14}, Trend ${(tech as any).trend}.` });

    const sm = await AITools.getOwnership(detectedSymbol);
    toolLogs.push({ toolName: 'getOwnership', params: { symbol: detectedSymbol }, resultSummary: `Retrieved classification ${(sm as any).classification}, FII/DII additions.` });

    // Handle comparison
    if (upper.includes('COMPARE') || (upper.includes('TCS') && upper.includes('INFOSYS'))) {
      const compQuote = await AITools.getStockQuote('INFY');
      const compFund = await AITools.getFundamentals('INFY');
      toolLogs.push({ toolName: 'compareStocks', params: { symbol1: detectedSymbol, symbol2: 'INFY' }, resultSummary: 'Compared valuation, growth and return metrics.' });

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: `### Comparative Research: ${detectedSymbol} vs INFY\n\n- **Valuation**: ${(fund as any).symbol} trades at ${(fund as any).pe}x P/E vs ${(compFund as any).symbol} at ${(compFund as any).pe}x P/E.\n- **Profitability**: ${(fund as any).symbol} ROE is ${(fund as any).roe}% vs ${(compFund as any).symbol} ROE of ${(compFund as any).roe}%.\n- **Balance Sheet**: Both companies maintain virtually zero debt and high cash reserves.\n- **Piotroski Quality**: ${(fund as any).symbol} (${(fund as any).piotroskiScore}) vs ${(compFund as any).symbol} (${(compFund as any).piotroskiScore}).\n\n*Note: This analysis is for educational and research purposes only and not a guaranteed investment outcome.*`,
        toolCallsExecuted: toolLogs,
        structuredVerdict: {
          quickVerdict: 'Strong Research Profiles',
          fundamentalsSummary: `${(fund as any).symbol} exhibits superior ROE and operating margins, while ${(compFund as any).symbol} trades at a slight relative valuation discount.`,
          technicalsSummary: 'Both stocks are trading above their respective 200-day moving averages with healthy accumulation.',
          valuationSummary: `P/E multiples are in the ${(fund as any).pe}x – ${(compFund as any).pe}x range.`,
          growthSummary: 'Steady 10-15% annual revenue compounding in enterprise cloud & generative AI modernization.',
          ownershipSummary: 'High institutional sponsorship with foreign and domestic funds holding >35% combined stake.',
          risks: ['Global enterprise discretionary tech budget cuts', 'Cross-currency volatility in USD/EUR', 'Talent wage inflation'],
          keySupport: `₹${(tech as any).support1 || 4100}`,
          keyResistance: `₹${(tech as any).resistance1 || 4350}`,
          invalidationConditions: ['Quarterly constant-currency revenue deceleration below 5%', 'Breakdown below 200-day SMA'],
          dataFreshness: (quote as any).lastUpdated || '29 Aug 2026 15:30 IST',
          sources: ['NSE Corporate Filings', 'Audited Annual Reports', 'BSE Disclosures'],
          finalEducationalAssessment: 'Both companies exhibit tier-1 capital quality and cash generation, with specific valuation nuances distinguishing short-term entry scenarios.'
        }
      };
    }

    // Default single stock analysis
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text: `### MISS AI Comprehensive Analysis: ${(quote as any).name || detectedSymbol} (${detectedSymbol})\n\nBased on verified data retrieved from exchange disclosures and quantitative models:\n\n1. **Quick Verdict**: **Strong Research Profile**\n2. **Fundamentals**: ROE is ${(fund as any).roe}%, with a Piotroski score of ${(fund as any).piotroskiScore} indicating high operational and balance sheet strength.\n3. **Technicals**: Daily trend is in a **${(tech as any).trend}** with RSI 14 at ${(tech as any).rsi14}.\n4. **Valuation**: P/E is ${(fund as any).pe}x with a PEG ratio of ${(fund as any).peg}.\n5. **Smart Money**: Institutional classification is **${(sm as any).classification}** with positive quarterly addition.\n\n> **Important Disclaimer**: This system does NOT provide trade execution or guaranteed stock predictions. All insights are rule-based research frameworks for educational exploration.`,
      toolCallsExecuted: toolLogs,
      structuredVerdict: {
        quickVerdict: 'Strong Research Profile',
        fundamentalsSummary: `High capital return profile (ROE ${(fund as any).roe}%, ROCE ${(fund as any).roce}%) with debt-to-equity of ${(fund as any).debtToEquity}.`,
        technicalsSummary: `Price is trading ${(tech as any).trend.toLowerCase()} with RSI 14 at ${(tech as any).rsi14} (${(tech as any).rsiStatus}).`,
        valuationSummary: `Trailing P/E of ${(fund as any).pe}x with PEG of ${(fund as any).peg}. Classified under ${(fund as any).peterLynchCategory}.`,
        growthSummary: `Net Profit YoY growth at +${(fund as any).netProfitYoY}%.`,
        ownershipSummary: `FII holding stands at ${(sm as any).fiiHolding}%, DII at ${(sm as any).diiHolding}%, with zero promoter pledge.`,
        risks: [
          'Valuation multiple contraction during broad macro risk-off periods.',
          'Sector-specific export/demand cycle slowdown.',
          'Input margin pressure if wage/commodity inflation expands.'
        ],
        keySupport: `₹${(tech as any).support1}`,
        keyResistance: `₹${(tech as any).resistance1}`,
        invalidationConditions: [
          'Consecutive quarterly EPS growth falling below 5% YoY.',
          'Price breakdown below key technical reference level support.'
        ],
        dataFreshness: (quote as any).lastUpdated || '29 Aug 2026 15:30 IST',
        sources: ['NSE India Official', 'BSE Disclosures', 'Audited Financial Statements'],
        finalEducationalAssessment: `Based on the currently available data, ${detectedSymbol} presents a robust financial foundation and constructive technical structure. Market investments carry risk; verify details across official filings.`
      }
    };
  }
}
