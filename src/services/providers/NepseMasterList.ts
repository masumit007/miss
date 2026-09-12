export interface NepseStockMaster {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  basePriceNPR: number;
  paidUpCapitalCrores: number;
  faceValueNPR: number;
  peRatio?: number;
  eps?: number;
  bookValueNPR?: number;
  grahamNumber?: number;
  dividendPercent?: number;
  bonusPercent?: number;
  beta: number;
}

export const NEPSE_MASTER_STOCKS: NepseStockMaster[] = [
  // Commercial Banks
  { symbol: 'NABIL', name: 'Nabil Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 552.00, paidUpCapitalCrores: 2705.70, faceValueNPR: 100, peRatio: 19.46, eps: 28.36, bookValueNPR: 247.28, grahamNumber: 397.23, dividendPercent: 10.8, bonusPercent: 5.0, beta: 0.88 },
  { symbol: 'GBIME', name: 'Global IME Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 238.50, paidUpCapitalCrores: 3612.80, faceValueNPR: 100, peRatio: 14.80, eps: 16.12, bookValueNPR: 172.40, grahamNumber: 250.10, dividendPercent: 8.5, bonusPercent: 3.0, beta: 0.95 },
  { symbol: 'NICA', name: 'NIC Asia Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 468.00, paidUpCapitalCrores: 1491.70, faceValueNPR: 100, peRatio: 16.20, eps: 28.88, bookValueNPR: 218.50, grahamNumber: 376.50, dividendPercent: 15.0, bonusPercent: 10.0, beta: 1.15 },
  { symbol: 'EBL', name: 'Everest Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 585.00, paidUpCapitalCrores: 1176.40, faceValueNPR: 100, peRatio: 18.10, eps: 32.30, bookValueNPR: 265.40, grahamNumber: 439.10, dividendPercent: 15.3, bonusPercent: 10.0, beta: 0.82 },
  { symbol: 'SCB', name: 'Standard Chartered Bank Nepal Ltd', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 615.00, paidUpCapitalCrores: 942.90, faceValueNPR: 100, peRatio: 18.50, eps: 33.20, bookValueNPR: 234.80, grahamNumber: 418.90, dividendPercent: 19.0, bonusPercent: 6.5, beta: 0.78 },
  { symbol: 'SANIMA', name: 'Sanima Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 308.00, paidUpCapitalCrores: 1358.10, faceValueNPR: 100, peRatio: 15.60, eps: 19.74, bookValueNPR: 168.20, grahamNumber: 273.40, dividendPercent: 9.0, bonusPercent: 5.0, beta: 0.92 },
  { symbol: 'ADBL', name: 'Agricultural Development Bank Ltd', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank (Govt)', basePriceNPR: 324.00, paidUpCapitalCrores: 1862.00, faceValueNPR: 100, peRatio: 16.80, eps: 19.28, bookValueNPR: 212.60, grahamNumber: 303.70, dividendPercent: 12.0, bonusPercent: 2.0, beta: 0.98 },
  { symbol: 'NBL', name: 'Nepal Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank (Pioneer)', basePriceNPR: 268.00, paidUpCapitalCrores: 1469.40, faceValueNPR: 100, peRatio: 17.50, eps: 15.30, bookValueNPR: 248.50, grahamNumber: 292.80, dividendPercent: 8.0, bonusPercent: 2.0, beta: 1.05 },
  { symbol: 'PRVU', name: 'Prabhu Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 185.00, paidUpCapitalCrores: 2354.20, faceValueNPR: 100, peRatio: 13.90, eps: 13.30, bookValueNPR: 156.40, grahamNumber: 216.30, dividendPercent: 6.5, bonusPercent: 0.0, beta: 1.10 },
  { symbol: 'KBL', name: 'Kumari Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 178.00, paidUpCapitalCrores: 2622.50, faceValueNPR: 100, peRatio: 14.20, eps: 12.50, bookValueNPR: 148.90, grahamNumber: 204.60, dividendPercent: 5.0, bonusPercent: 0.0, beta: 1.08 },
  { symbol: 'SBI', name: 'Nepal SBI Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 345.00, paidUpCapitalCrores: 1055.60, faceValueNPR: 100, peRatio: 16.40, eps: 21.00, bookValueNPR: 189.50, grahamNumber: 299.10, dividendPercent: 10.5, bonusPercent: 3.75, beta: 0.85 },
  { symbol: 'PCBL', name: 'Prime Commercial Bank Limited', sector: 'Commercial Banks', industry: 'A-Class Commercial Bank', basePriceNPR: 245.00, paidUpCapitalCrores: 1940.20, faceValueNPR: 100, peRatio: 13.80, eps: 17.75, bookValueNPR: 165.20, grahamNumber: 256.90, dividendPercent: 8.0, bonusPercent: 4.0, beta: 1.02 },

  // Hydro Power (Largest Sector on NEPSE)
  { symbol: 'CHCL', name: 'Chilime Hydro power Company Limited', sector: 'Hydro Power', industry: 'Hydroelectric Power Generation', basePriceNPR: 512.00, paidUpCapitalCrores: 798.50, faceValueNPR: 100, peRatio: 22.40, eps: 22.85, bookValueNPR: 182.40, grahamNumber: 306.10, dividendPercent: 15.0, bonusPercent: 10.0, beta: 1.05 },
  { symbol: 'UPPER', name: 'Upper Tamakoshi Hydropower Ltd', sector: 'Hydro Power', industry: '456 MW Mega Hydro Project', basePriceNPR: 248.00, paidUpCapitalCrores: 2118.00, faceValueNPR: 100, peRatio: 28.50, eps: 8.70, bookValueNPR: 115.40, grahamNumber: 150.30, dividendPercent: 0.0, bonusPercent: 0.0, beta: 1.45 },
  { symbol: 'SHPC', name: 'Sanima Mai Hydropower Limited', sector: 'Hydro Power', industry: 'Hydroelectric Power Generation', basePriceNPR: 368.00, paidUpCapitalCrores: 342.50, faceValueNPR: 100, peRatio: 20.80, eps: 17.69, bookValueNPR: 146.80, grahamNumber: 241.90, dividendPercent: 10.0, bonusPercent: 5.26, beta: 1.12 },
  { symbol: 'BPCL', name: 'Butwal Power Company Limited', sector: 'Hydro Power', industry: 'Hydroelectric Utility & Distribution', basePriceNPR: 395.00, paidUpCapitalCrores: 340.90, faceValueNPR: 100, peRatio: 24.50, eps: 16.12, bookValueNPR: 224.50, grahamNumber: 285.30, dividendPercent: 12.5, bonusPercent: 5.0, beta: 0.90 },
  { symbol: 'API', name: 'Api Power Company Limited', sector: 'Hydro Power', industry: 'Hydroelectric & Solar Energy', basePriceNPR: 282.00, paidUpCapitalCrores: 578.60, faceValueNPR: 100, peRatio: 21.00, eps: 13.40, bookValueNPR: 128.50, grahamNumber: 196.80, dividendPercent: 5.0, bonusPercent: 5.0, beta: 1.38 },
  { symbol: 'RADHI', name: 'Radhi Bidyut Company Limited', sector: 'Hydro Power', industry: 'Small Hydro Power Generation', basePriceNPR: 318.00, paidUpCapitalCrores: 178.50, faceValueNPR: 100, peRatio: 23.20, eps: 13.70, bookValueNPR: 135.20, grahamNumber: 204.20, dividendPercent: 8.0, bonusPercent: 4.75, beta: 1.25 },
  { symbol: 'HDHPC', name: 'Hydrosolutions / Himal Dolakha HP Co', sector: 'Hydro Power', industry: 'Hydro Power Development', basePriceNPR: 185.00, paidUpCapitalCrores: 247.50, faceValueNPR: 100, peRatio: 35.00, eps: 5.28, bookValueNPR: 108.40, grahamNumber: 113.40, dividendPercent: 0.0, bonusPercent: 0.0, beta: 1.40 },
  { symbol: 'AHL', name: 'Asian Hydropower Limited', sector: 'Hydro Power', industry: 'Hydroelectric Power', basePriceNPR: 485.00, paidUpCapitalCrores: 34.00, faceValueNPR: 100, peRatio: 32.00, eps: 15.15, bookValueNPR: 124.00, grahamNumber: 205.60, dividendPercent: 5.0, bonusPercent: 0.0, beta: 1.30 },
  { symbol: 'AHPC', name: 'Arun Valley Hydropower Dev Co Ltd', sector: 'Hydro Power', industry: 'Hydro Power Development', basePriceNPR: 215.00, paidUpCapitalCrores: 373.10, faceValueNPR: 100, peRatio: 26.50, eps: 8.11, bookValueNPR: 114.50, grahamNumber: 144.50, dividendPercent: 3.0, bonusPercent: 3.0, beta: 1.35 },
  { symbol: 'MEN', name: 'Mountain Energy Nepal Limited', sector: 'Hydro Power', industry: 'Hydro Power Infrastructure', basePriceNPR: 645.00, paidUpCapitalCrores: 196.80, faceValueNPR: 100, peRatio: 19.80, eps: 32.50, bookValueNPR: 168.90, grahamNumber: 351.40, dividendPercent: 10.5, bonusPercent: 10.5, beta: 1.18 },

  // Manufacturing & Processing
  { symbol: 'SHIVM', name: 'Shivam Cements Limited', sector: 'Manufacturing & Processing', industry: 'OPC & PPC Cement Production', basePriceNPR: 565.00, paidUpCapitalCrores: 502.70, faceValueNPR: 100, peRatio: 38.50, eps: 14.67, bookValueNPR: 198.50, grahamNumber: 256.00, dividendPercent: 15.0, bonusPercent: 14.25, beta: 1.35 },
  { symbol: 'HDL', name: 'Himalayan Distillery Limited', sector: 'Manufacturing & Processing', industry: 'Liquor, Spirits & Beverages', basePriceNPR: 1420.00, paidUpCapitalCrores: 267.30, faceValueNPR: 100, peRatio: 26.80, eps: 52.98, bookValueNPR: 215.40, grahamNumber: 506.70, dividendPercent: 25.0, bonusPercent: 10.0, beta: 1.10 },
  { symbol: 'UNL', name: 'Unilever Nepal Limited', sector: 'Manufacturing & Processing', industry: 'FMCG Consumer Goods Monopoly', basePriceNPR: 48500.00, paidUpCapitalCrores: 9.21, faceValueNPR: 100, peRatio: 36.50, eps: 1328.00, bookValueNPR: 4890.00, grahamNumber: 12090.00, dividendPercent: 1580.0, bonusPercent: 0.0, beta: 0.45 },
  { symbol: 'SONA', name: 'Sonapur Minerals and Oil Limited', sector: 'Manufacturing & Processing', industry: 'Cement Clinker & Minerals', basePriceNPR: 480.00, paidUpCapitalCrores: 307.50, faceValueNPR: 100, peRatio: 32.00, eps: 15.00, bookValueNPR: 174.00, grahamNumber: 242.30, dividendPercent: 0.0, bonusPercent: 0.0, beta: 1.45 },
  { symbol: 'SARBTM', name: 'Sarbottam Cement Limited', sector: 'Manufacturing & Processing', industry: 'Book Building Method Cement Producer', basePriceNPR: 845.00, paidUpCapitalCrores: 465.00, faceValueNPR: 100, peRatio: 29.50, eps: 28.64, bookValueNPR: 228.50, grahamNumber: 383.60, dividendPercent: 0.0, bonusPercent: 0.0, beta: 1.25 },
  { symbol: 'GCIL', name: 'Ghorahi Cement Industry Limited', sector: 'Manufacturing & Processing', industry: 'Integrated Clinker & Cement Plant', basePriceNPR: 512.00, paidUpCapitalCrores: 397.20, faceValueNPR: 100, peRatio: 34.00, eps: 15.05, bookValueNPR: 218.00, grahamNumber: 271.80, dividendPercent: 0.0, bonusPercent: 0.0, beta: 1.30 },

  // Microfinance (Laghubitta)
  { symbol: 'CBBL', name: 'Chhimek Laghubitta Bittiya Sanstha Ltd', sector: 'Microfinance', industry: 'National-Level Microfinance Bank', basePriceNPR: 1025.00, paidUpCapitalCrores: 297.70, faceValueNPR: 100, peRatio: 24.20, eps: 42.35, bookValueNPR: 289.40, grahamNumber: 525.20, dividendPercent: 15.0, bonusPercent: 5.0, beta: 0.95 },
  { symbol: 'SKBBL', name: 'Sana Kisan Bikas Laghubitta Sanstha', sector: 'Microfinance', industry: 'Small Farmers Wholesale Microfinance', basePriceNPR: 980.00, paidUpCapitalCrores: 386.40, faceValueNPR: 100, peRatio: 22.80, eps: 42.98, bookValueNPR: 345.80, grahamNumber: 577.80, dividendPercent: 15.0, bonusPercent: 14.25, beta: 0.90 },
  { symbol: 'DDBL', name: 'Deprosc Laghubitta Bittiya Sanstha', sector: 'Microfinance', industry: 'Microfinance Financial Institution', basePriceNPR: 745.00, paidUpCapitalCrores: 155.10, faceValueNPR: 100, peRatio: 21.50, eps: 34.65, bookValueNPR: 238.90, grahamNumber: 431.30, dividendPercent: 10.0, bonusPercent: 10.0, beta: 1.05 },
  { symbol: 'NUBL', name: 'Nirdhan Utthan Laghubitta Sanstha', sector: 'Microfinance', industry: 'Pioneer Microfinance Institution', basePriceNPR: 760.00, paidUpCapitalCrores: 261.20, faceValueNPR: 100, peRatio: 25.00, eps: 30.40, bookValueNPR: 214.20, grahamNumber: 382.70, dividendPercent: 12.0, bonusPercent: 0.0, beta: 1.02 },
  { symbol: 'ULBSL', name: 'Upakar Laghubitta Bittiya Sanstha', sector: 'Microfinance', industry: 'Regional Microfinance Bank', basePriceNPR: 2763.30, paidUpCapitalCrores: 10.60, faceValueNPR: 100, peRatio: 45.00, eps: 61.40, bookValueNPR: 384.50, grahamNumber: 728.40, dividendPercent: 65.0, bonusPercent: 61.75, beta: 1.65 },

  // Life & Non-Life Insurance
  { symbol: 'NLIC', name: 'Nepal Life Insurance Co. Ltd.', sector: 'Life Insurance', industry: 'Market Leader Life Insurance', basePriceNPR: 724.00, paidUpCapitalCrores: 820.80, faceValueNPR: 100, peRatio: 38.00, eps: 19.05, bookValueNPR: 165.40, grahamNumber: 266.20, dividendPercent: 21.05, bonusPercent: 0.0, beta: 1.10 },
  { symbol: 'LICN', name: 'Life Insurance Co. Nepal Ltd', sector: 'Life Insurance', industry: 'Joint Venture Life Insurance', basePriceNPR: 1045.00, paidUpCapitalCrores: 265.30, faceValueNPR: 100, peRatio: 48.00, eps: 21.77, bookValueNPR: 142.00, grahamNumber: 263.80, dividendPercent: 10.5, bonusPercent: 10.0, beta: 1.15 },
  { symbol: 'SICL', name: 'Shikhar Insurance Co. Ltd.', sector: 'Non-Life Insurance', industry: 'Pioneer General Insurance', basePriceNPR: 915.00, paidUpCapitalCrores: 265.50, faceValueNPR: 100, peRatio: 24.50, eps: 37.34, bookValueNPR: 218.40, grahamNumber: 428.10, dividendPercent: 16.84, bonusPercent: 16.0, beta: 1.05 },
  { symbol: 'NIL', name: 'Neco Insurance Co. Ltd.', sector: 'Non-Life Insurance', industry: 'General Non-Life Insurance', basePriceNPR: 875.00, paidUpCapitalCrores: 201.20, faceValueNPR: 100, peRatio: 22.00, eps: 39.77, bookValueNPR: 224.50, grahamNumber: 448.20, dividendPercent: 15.5, bonusPercent: 15.0, beta: 1.12 },

  // Others & Strategic Monopolies
  { symbol: 'NTC', name: 'Nepal Doorsanchar Company Limited (NTC)', sector: 'Others', industry: 'National Telecom Monopoly (Govt)', basePriceNPR: 924.00, paidUpCapitalCrores: 1800.00, faceValueNPR: 100, peRatio: 18.20, eps: 50.76, bookValueNPR: 495.20, grahamNumber: 752.40, dividendPercent: 40.0, bonusPercent: 0.0, beta: 0.72 },
  { symbol: 'CIT', name: 'Citizen Investment Trust', sector: 'Investment', industry: 'Statutory Capital Market Institution', basePriceNPR: 2480.00, paidUpCapitalCrores: 531.40, faceValueNPR: 100, peRatio: 36.00, eps: 68.88, bookValueNPR: 284.60, grahamNumber: 663.80, dividendPercent: 25.0, bonusPercent: 21.05, beta: 0.95 },
  { symbol: 'NRIC', name: 'Nepal Reinsurance Company Limited', sector: 'Others', industry: 'National Reinsurer Monopoly', basePriceNPR: 785.00, paidUpCapitalCrores: 1281.30, faceValueNPR: 100, peRatio: 32.50, eps: 24.15, bookValueNPR: 164.20, grahamNumber: 298.80, dividendPercent: 5.0, bonusPercent: 4.75, beta: 1.15 },
  { symbol: 'HATHY', name: 'Hathway Investment Nepal Limited', sector: 'Investment', industry: 'Private Equity & Capital Markets', basePriceNPR: 1350.00, paidUpCapitalCrores: 128.70, faceValueNPR: 50, peRatio: 42.00, eps: 32.14, bookValueNPR: 148.00, grahamNumber: 327.20, dividendPercent: 10.5, bonusPercent: 10.0, beta: 1.60 }
];
