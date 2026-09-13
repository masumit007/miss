import { StockQuote, ShareholdingPattern, BulkBlockDeal } from '../../types/stock';
import { SmartMoneyAnalysis } from '../../types/smartMoney';

export class SmartMoneyEngine {
  /**
   * Builds an ownership/"smart money" analysis from REAL shareholding
   * disclosures. Returns null when there's no real shareholding history
   * for this stock — MISS does not have a legitimate NEPSE ownership data
   * source wired up yet, so `shareholding` will currently always be empty
   * and this will always return null. That's the honest answer: no
   * generic fallback percentages are ever substituted for a real filing.
   */
  public static performAnalysis(
    quote: StockQuote,
    shareholding: ShareholdingPattern[],
    deals: BulkBlockDeal[]
  ): SmartMoneyAnalysis | null {
    if (shareholding.length === 0) {
      return null;
    }

    const latest = shareholding[0];
    const prev = shareholding[1] ?? latest;

    const foreignChangeQoQ = Math.round((latest.foreignHolding - prev.foreignHolding) * 100) / 100;
    const institutionalChangeQoQ = Math.round((latest.institutionalHolding - prev.institutionalHolding) * 100) / 100;
    const promoterChangeQoQ = Math.round((latest.promoterHolding - prev.promoterHolding) * 100) / 100;

    // Delivery percentage: only used if the source actually reported one.
    const deliveryPercent = quote.deliveryPercentage ?? null;
    const isHighDelivery = deliveryPercent !== null && deliveryPercent >= 55.0;
    const isInstiAccumulating = (foreignChangeQoQ + institutionalChangeQoQ) >= 0.2;
    const isPledgeLow = latest.promoterPledged < 5.0;

    let smartMoneyClassification: SmartMoneyAnalysis['smartMoneyClassification'] = 'Neutral';
    let score = 50;
    const evidence: string[] = [];

    if (isInstiAccumulating && isHighDelivery && isPledgeLow) {
      smartMoneyClassification = 'Accumulation';
      score = 85;
      evidence.push('Combined domestic + foreign institutional stake increased in latest reported quarter.');
      evidence.push(`High delivery percentage (${deliveryPercent}%) indicating positional delivery absorption.`);
      evidence.push(`Zero/minimal promoter pledging (${latest.promoterPledged}%), eliminating pledge liquidation risk.`);
    } else if (foreignChangeQoQ < -1.0 && institutionalChangeQoQ < -0.5) {
      smartMoneyClassification = 'Distribution';
      score = 30;
      evidence.push(`Institutional stakeholders reduced position by ${(foreignChangeQoQ + institutionalChangeQoQ).toFixed(2)}% QoQ.`);
    } else {
      smartMoneyClassification = 'Mixed Institutional Signals';
      score = 55;
      evidence.push(`Domestic institutional stake is at ${latest.institutionalHolding}% as of ${latest.period}.`);
      if (deliveryPercent !== null) {
        evidence.push(`Delivery percentage is at ${deliveryPercent}%.`);
      }
    }

    if (deals.length > 0) {
      const netBuyDeals = deals.filter(d => d.transactionType === 'BUY');
      if (netBuyDeals.length > 0) {
        evidence.push(`Recent block deal indicates buying interest from ${netBuyDeals[0].clientName} (Rs. ${netBuyDeals[0].valueCrores} Cr).`);
      }
    }

    return {
      symbol: quote.symbol,
      shareholding,
      latestPromoterHolding: latest.promoterHolding,
      latestPromoterPledged: latest.promoterPledged,
      latestForeignHolding: latest.foreignHolding,
      latestInstitutionalHolding: latest.institutionalHolding,
      latestPublicHolding: latest.publicHolding,
      foreignChangeQoQ,
      institutionalChangeQoQ,
      promoterChangeQoQ,
      recentDeals: deals,
      deliveryAnalysis: {
        deliveryPercentage: deliveryPercent ?? 0,
        deliveryVolume: deliveryPercent !== null ? Math.round(quote.volume * (deliveryPercent / 100)) : 0,
        totalVolume: quote.volume,
        deliveryTrend: deliveryPercent === null ? 'Stable' : isHighDelivery ? 'Increasing Delivery' : 'Stable',
        interpretation: deliveryPercent !== null
          ? 'Positional retail and mutual fund absorption'
          : 'Data unavailable — delivery percentage not sourced for this stock.'
      },
      smartMoneyClassification,
      score,
      evidence,
      disclaimer: 'Institutional ownership and delivery absorption figures are drawn only from real filed shareholding disclosures — this analysis is unavailable for stocks without a real filing history.'
    };
  }
}
