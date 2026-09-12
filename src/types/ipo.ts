export type IPOStatus = 'UPCOMING' | 'OPEN' | 'CLOSED' | 'LISTED';

export interface IPOSubscriptionBreakdown {
  qib: number; // e.g. 38.4x
  nii: number; // e.g. 24.2x
  retail: number; // e.g. 8.5x
  employee?: number;
  shareholder?: number;
  overall: number; // e.g. 22.1x
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
  exchange: 'NSE, BSE' | 'NSE' | 'BSE' | 'NSE SME' | 'BSE SME' | 'NEPSE';
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
