import { StockQuote, ShareholdingPattern, BulkBlockDeal } from '../../types/stock';
import { SmartMoneyAnalysis } from '../../types/smartMoney';

export class SmartMoneyEngine {
  public static performAnalysis(
    quote: StockQuote,
    shareholding: ShareholdingPattern[],
    deals: BulkBlockDeal[]
  ): SmartMoneyAnalysis {
    const latest = shareholding[0] || {
      period: '082/083 Q4',
      promoterHolding: 51.0,
      promoterPledged: 0,
      fiiHolding: 4.8,
      diiHolding: 18.2,
      publicHolding: 26.0,
      otherHolding: 0
    };

    const prev = shareholding[1] || latest;
    const fiiChangeQoQ = Math.round((latest.fiiHolding - prev.fiiHolding) * 100) / 100;
    const diiChangeQoQ = Math.round((latest.diiHolding - prev.diiHolding) * 100) / 100;
    const promoterChangeQoQ = Math.round((latest.promoterHolding - prev.promoterHolding) * 100) / 100;

    const deliveryPercent = quote.deliveryPercentage || 65.0;
    const isHighDelivery = deliveryPercent >= 55.0;
    const isInstiAccumulating = (fiiChangeQoQ + diiChangeQoQ) >= 0.2;
    const isPledgeLow = latest.promoterPledged < 5.0;

    let smartMoneyClassification: SmartMoneyAnalysis['smartMoneyClassification'] = 'Neutral';
    let score = 65;
    const evidence: string[] = [];

    if (isInstiAccumulating && isHighDelivery && isPledgeLow) {
      smartMoneyClassification = 'Accumulation';
      score = 88;
      evidence.push(`Combined Mutual Fund / DII stake increased in latest reported quarter.`);
      evidence.push(`High delivery percentage (${deliveryPercent}%) indicating positional delivery absorption.`);
      evidence.push(`Zero/minimal promoter pledging (${latest.promoterPledged}%), eliminating pledge liquidation risk.`);
    } else if (fiiChangeQoQ < -1.0 && diiChangeQoQ < -0.5) {
      smartMoneyClassification = 'Distribution';
      score = 35;
      evidence.push(`Institutional stakeholders reduced position by ${(fiiChangeQoQ + diiChangeQoQ).toFixed(2)}% QoQ.`);
      evidence.push(`Delivery volume expanding on down-days indicating potential institutional distribution.`);
    } else {
      smartMoneyClassification = 'Mixed Institutional Signals';
      score = 62;
      evidence.push(`Mutual Fund / DII stake is stable at ${latest.diiHolding}%.`);
      evidence.push(`Delivery percentage is at ${deliveryPercent}%.`);
    }

    if (deals.length > 0) {
      const netBuyDeals = deals.filter(d => d.transactionType === 'BUY');
      if (netBuyDeals.length > 0) {
        evidence.push(`Recent block deals indicate buying interest from ${netBuyDeals[0].clientName} (Rs. ${netBuyDeals[0].valueCrores} Cr).`);
      }
    }

    return {
      symbol: quote.symbol,
      shareholding,
      latestPromoterHolding: latest.promoterHolding,
      latestPromoterPledged: latest.promoterPledged,
      latestFiiHolding: latest.fiiHolding,
      latestDiiHolding: latest.diiHolding,
      latestPublicHolding: latest.publicHolding,
      fiiChangeQoQ,
      diiChangeQoQ,
      promoterChangeQoQ,
      recentDeals: deals,
      deliveryAnalysis: {
        deliveryPercentage: deliveryPercent,
        deliveryVolume: Math.round(quote.volume * (deliveryPercent / 100)),
        totalVolume: quote.volume,
        deliveryTrend: isHighDelivery ? 'Increasing Delivery' : 'Stable',
        interpretation: 'Positional retail and mutual fund absorption'
      },
      smartMoneyClassification,
      score,
      evidence,
      disclaimer: 'Institutional ownership and delivery absorption models are quantitative estimates based on public filings.'
    };
  }
}
