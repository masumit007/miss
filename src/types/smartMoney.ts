import { BulkBlockDeal, ShareholdingPattern } from './stock';

export interface SmartMoneyAnalysis {
  symbol: string;
  shareholding: ShareholdingPattern[];
  latestPromoterHolding: number;
  latestPromoterPledged: number;
  latestFiiHolding: number;
  latestDiiHolding: number;
  latestPublicHolding: number;
  fiiChangeQoQ: number;
  diiChangeQoQ: number;
  promoterChangeQoQ: number;
  recentDeals: BulkBlockDeal[];
  deliveryAnalysis: {
    deliveryPercentage: number;
    deliveryVolume: number;
    totalVolume: number;
    deliveryTrend: 'Increasing Delivery' | 'Decreasing Delivery' | 'Stable';
    interpretation: string;
  };
  smartMoneyClassification: 'Accumulation' | 'Distribution' | 'Neutral' | 'Mixed Institutional Signals';
  score: number; // 0 to 100
  evidence: string[];
  disclaimer: string;
}
