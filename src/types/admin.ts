export interface SystemConfiguration {
  maintenanceMode: boolean;
  activeMarketDataProvider: 'MockDataProvider' | 'NepseDataProvider' | 'Licensed_Vendor_Feed';
  enableLiveFallback: boolean;
  technicalThresholds: {
    rsiOverbought: number;
    rsiOversold: number;
    adxStrongTrend: number;
    stochasticOverbought: number;
    stochasticOversold: number;
    breakoutVolumeMultiplier: number;
    supportProximityPercent: number;
    resistanceProximityPercent: number;
  };
  scoringWeights: {
    fundamentals: number; // 25
    technicals: number; // 20
    growth: number; // 15
    valuation: number; // 15
    smartMoney: number; // 10
    risk: number; // 5
    newsSentiment: number; // 5
    macroSector: number; // 5
  };
  developerContribution: {
    enabled: boolean;
    headerText: string;
    descriptionText: string;
    upiId: string;
    accountHolderName: string;
    qrImageUrl: string;
    developerNote: string;
  };
}
