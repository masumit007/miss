import { FloorsheetAnalysis, BrokerNetActivity, LargeTransaction } from '../../types/broker';

/**
 * Aggregates REAL NEPSE floorsheet rows into broker-level net buy/sell,
 * concentration, and large transactions. Never invents a client/investor
 * identity — only broker number/name, which NEPSE publishes on every
 * floorsheet trade.
 */
export class BrokerEngine {
  // A single floorsheet page can be large; we bound how many pages we
  // pull per request so this stays fast and never causes a Vercel
  // function timeout. This means "transactionsAnalyzed" may be a subset
  // of the full day's floorsheet for very liquid stocks — that's
  // disclosed in the result, not hidden.
  private static readonly MAX_PAGES = 3;
  private static readonly LARGE_TXN_THRESHOLD_NPR = 500000; // Rs. 5 Lakh+

  public static analyze(symbol: string, rows: any[]): FloorsheetAnalysis {
    if (rows.length === 0) {
      return {
        symbol,
        transactionsAnalyzed: 0,
        totalQuantity: 0,
        totalValueNpr: 0,
        brokerActivity: [],
        top3BrokerConcentrationPercent: 0,
        largeTransactions: [],
        signal: 'Insufficient Data',
        source: 'NEPSE floorsheet',
        retrievedAt: new Date().toISOString()
      };
    }

    const brokerMap = new Map<string, BrokerNetActivity>();
    let totalQuantity = 0;
    let totalValueNpr = 0;
    const largeTransactions: LargeTransaction[] = [];

    const getBroker = (id: string, name: string): BrokerNetActivity => {
      const key = id || name;
      if (!brokerMap.has(key)) {
        brokerMap.set(key, {
          brokerId: id,
          brokerName: name,
          buyQuantity: 0,
          buyValueNpr: 0,
          sellQuantity: 0,
          sellValueNpr: 0,
          netQuantity: 0,
          netValueNpr: 0,
          transactionCount: 0
        });
      }
      return brokerMap.get(key)!;
    };

    for (const row of rows) {
      const qty = Number(row.contractQuantity ?? 0);
      const rate = Number(row.contractRate ?? 0);
      const amount = Number(row.contractAmount ?? qty * rate);

      if (!Number.isFinite(qty) || !Number.isFinite(amount)) continue;

      totalQuantity += qty;
      totalValueNpr += amount;

      const buyerId = String(row.buyerMemberId ?? '');
      const buyerName = String(row.buyerBrokerName ?? `Broker ${buyerId}`);
      const sellerId = String(row.sellerMemberId ?? '');
      const sellerName = String(row.sellerBrokerName ?? `Broker ${sellerId}`);

      const buyer = getBroker(buyerId, buyerName);
      buyer.buyQuantity += qty;
      buyer.buyValueNpr += amount;
      buyer.transactionCount += 1;

      const seller = getBroker(sellerId, sellerName);
      seller.sellQuantity += qty;
      seller.sellValueNpr += amount;
      seller.transactionCount += 1;

      if (amount >= this.LARGE_TXN_THRESHOLD_NPR) {
        largeTransactions.push({
          symbol,
          buyerBrokerId: buyerId,
          buyerBrokerName: buyerName,
          sellerBrokerId: sellerId,
          sellerBrokerName: sellerName,
          quantity: qty,
          rate,
          amountNpr: Math.round(amount),
          tradeTime: String(row.tradeTime ?? ''),
          businessDate: String(row.businessDate ?? '')
        });
      }
    }

    for (const broker of brokerMap.values()) {
      broker.netQuantity = broker.buyQuantity - broker.sellQuantity;
      broker.netValueNpr = Math.round(broker.buyValueNpr - broker.sellValueNpr);
      broker.buyValueNpr = Math.round(broker.buyValueNpr);
      broker.sellValueNpr = Math.round(broker.sellValueNpr);
    }

    const brokerActivity = Array.from(brokerMap.values()).sort(
      (a, b) => (b.buyValueNpr + b.sellValueNpr) - (a.buyValueNpr + a.sellValueNpr)
    );

    const top3Value = brokerActivity.slice(0, 3).reduce((sum, b) => sum + b.buyValueNpr + b.sellValueNpr, 0);
    const top3BrokerConcentrationPercent = totalValueNpr > 0
      ? Math.round((top3Value / (totalValueNpr * 2)) * 1000) / 10
      : 0;

    const netBuyValue = brokerActivity.reduce((sum, b) => sum + Math.max(0, b.netValueNpr), 0);
    const netSellValue = brokerActivity.reduce((sum, b) => sum + Math.max(0, -b.netValueNpr), 0);
    const imbalance = netBuyValue + netSellValue > 0 ? (netBuyValue - netSellValue) / (netBuyValue + netSellValue) : 0;

    const signal: FloorsheetAnalysis['signal'] =
      rows.length < 5 ? 'Insufficient Data'
        : imbalance > 0.15 ? 'Broker Buying Pressure'
        : imbalance < -0.15 ? 'Broker Selling Pressure'
        : 'Balanced';

    largeTransactions.sort((a, b) => b.amountNpr - a.amountNpr);

    return {
      symbol,
      transactionsAnalyzed: rows.length,
      totalQuantity,
      totalValueNpr: Math.round(totalValueNpr),
      brokerActivity,
      top3BrokerConcentrationPercent,
      largeTransactions: largeTransactions.slice(0, 20),
      signal,
      source: 'NEPSE floorsheet',
      retrievedAt: new Date().toISOString()
    };
  }
}
