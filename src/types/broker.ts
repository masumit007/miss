/**
 * Broker-level floorsheet analytics. Built ONLY from real NEPSE floorsheet
 * transactions (buyer/seller broker, quantity, rate, amount, time) —
 * broker identity is real and public (NEPSE publishes broker numbers/names
 * on every floorsheet trade), but this is never a proxy for an individual
 * investor's identity, and no client names are ever invented or implied.
 */
export interface BrokerNetActivity {
  brokerId: string;
  brokerName: string;
  buyQuantity: number;
  buyValueNpr: number;
  sellQuantity: number;
  sellValueNpr: number;
  netQuantity: number;
  netValueNpr: number;
  transactionCount: number;
}

export interface LargeTransaction {
  symbol: string;
  buyerBrokerId: string;
  buyerBrokerName: string;
  sellerBrokerId: string;
  sellerBrokerName: string;
  quantity: number;
  rate: number;
  amountNpr: number;
  tradeTime: string;
  businessDate: string;
}

export interface FloorsheetAnalysis {
  symbol: string;
  /** Number of real floorsheet rows actually pulled and analyzed (bounded — see engine). */
  transactionsAnalyzed: number;
  totalQuantity: number;
  totalValueNpr: number;
  brokerActivity: BrokerNetActivity[];
  /** Share of total traded value held by the top 3 most active brokers — a real concentration measure, not a "smart money" claim. */
  top3BrokerConcentrationPercent: number;
  largeTransactions: LargeTransaction[];
  /** A directional read on broker positioning from real net buy/sell values — explicitly NOT "accumulation" or investor-identity language. */
  signal: 'Broker Buying Pressure' | 'Broker Selling Pressure' | 'Balanced' | 'Insufficient Data';
  source: string;
  retrievedAt: string;
}
