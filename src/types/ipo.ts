export type IPOStatus = 'UPCOMING' | 'OPEN' | 'CLOSED' | 'LISTED';

export interface IPOSubscriptionBreakdown {
  // NEPSE IPO allotment categories (not Indian QIB/NII/Retail):
  generalPublic: number; // e.g. 8.5x subscribed
  mutualFund: number;
  foreignEmploymentQuota: number; // Non-Resident Nepali (NRN) / foreign employment quota
  employee?: number;
  overall: number;
  lastUpdated: string;
}

export interface IPOItem {
  id: string;
  companyName: string;
  symbol: string;
  status: IPOStatus;
  openDate: string;
  closeDate: string;
  listingDate: string;
  priceBandMin: number;
  priceBandMax: number;
  lotSize: number;
  minInvestment: number;
  issueSizeCrores: number;
  freshIssueCrores: number;
  ofsCrores: number;
  exchange: 'NEPSE';
  subscription: IPOSubscriptionBreakdown;
  issuePrice?: number;
  listingPrice?: number;
  currentPrice?: number;
  listingGainPercent?: number;
  currentGainPercent?: number;
  ipoResearchScore: number; // 0-100
  businessSummary: string;
  strengths: string[];
  risks: string[];
  valuationNote: string;
  useOfProceeds: string;
}
