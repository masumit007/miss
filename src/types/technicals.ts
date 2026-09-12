export type TechnicalSignalType = 
  | 'BULLISH' 
  | 'BEARISH' 
  | 'NEUTRAL' 
  | 'OVERBOUGHT' 
  | 'NEAR_OVERBOUGHT' 
  | 'OVERSOLD' 
  | 'NEAR_OVERSOLD' 
  | 'BREAKOUT' 
  | 'BREAKDOWN' 
  | 'AT_SUPPORT' 
  | 'NEAR_SUPPORT' 
  | 'AT_RESISTANCE' 
  | 'NEAR_RESISTANCE' 
  | 'ACCUMULATION' 
  | 'DISTRIBUTION';

export interface MovingAveragePoint {
  period: number;
  value: number;
  priceVsMa: 'Above' | 'Below';
  trend: 'Rising' | 'Falling' | 'Flat';
  distancePercent: number;
}

export interface MovingAveragesData {
  sma20: MovingAveragePoint;
  sma50: MovingAveragePoint;
  sma100: MovingAveragePoint;
  sma200: MovingAveragePoint;
  ema20: MovingAveragePoint;
  ema50: MovingAveragePoint;
  ema100: MovingAveragePoint;
  ema200: MovingAveragePoint;
  crossSignals: {
    goldenCrossDetected: boolean;
    deathCrossDetected: boolean;
    recentCrossType?: 'Golden Cross' | 'Death Cross' | 'None';
    crossDate?: string;
    details: string;
  };
}

export interface RsiData {
  period: number;
  value: number;
  classification: 'OVERBOUGHT' | 'NEAR_OVERBOUGHT' | 'NEUTRAL' | 'NEAR_OVERSOLD' | 'OVERSOLD';
  signal: 'Bearish/Caution' | 'Caution/Extended' | 'Neutral' | 'Bullish/Reversal Opportunity' | 'Oversold Opportunity';
  explanation: string;
  history: number[];
}

export interface MacdData {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  macdLine: number;
  signalLine: number;
  histogram: number;
  crossoverStatus: 'Bullish Crossover' | 'Bearish Crossover' | 'Neutral';
  zeroLineStatus: 'Above Zero' | 'Below Zero';
  histogramTrend: 'Increasing' | 'Decreasing';
  divergence: 'Bullish Divergence' | 'Bearish Divergence' | 'None';
  explanation: string;
}

export interface BollingerBandsData {
  middle: number;
  upper: number;
  lower: number;
  bandwidth: number;
  percentB: number;
  isSqueeze: boolean;
  isExpansion: boolean;
  bandTouch: 'Upper Touch' | 'Lower Touch' | 'Inside Bands';
  explanation: string;
}

export interface AdxData {
  period: number;
  adx: number;
  plusDI: number;
  minusDI: number;
  trendStrength: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  trendDirection: 'Bullish Dominance' | 'Bearish Dominance' | 'Consolidation';
  explanation: string;
}

export interface StochasticData {
  k: number;
  d: number;
  status: 'OVERBOUGHT' | 'OVERSOLD' | 'NEUTRAL';
  crossover: 'Bullish Crossover' | 'Bearish Crossover' | 'None';
  explanation: string;
}

export interface CandlestickPattern {
  name: string;
  type: 'Bullish' | 'Bearish' | 'Neutral';
  date: string;
  significance: 'High' | 'Medium' | 'Low';
  trendContext: string;
  srContext: string;
  confirmationStatus: 'Confirmed' | 'Unconfirmed' | 'Awaiting Next Candle';
  interpretation: string;
}

export interface ChartPattern {
  name: string;
  stage: 'Forming' | 'Testing Breakout Level' | 'Confirmed Breakout' | 'Invalidated';
  potentialBreakoutLevel: number;
  potentialInvalidationLevel: number;
  volumeConfirmation: 'Strong Volume' | 'Average Volume' | 'Weak Volume';
  explanation: string;
}

export interface SupportResistanceLevels {
  support1: number;
  support2: number;
  support3: number;
  resistance1: number;
  resistance2: number;
  resistance3: number;
  distanceToSupport1Percent: number;
  distanceToResistance1Percent: number;
  fibonacciLevels: {
    fib236: number;
    fib382: number;
    fib500: number;
    fib618: number;
    fib786: number;
  };
  signal: 'AT_SUPPORT' | 'NEAR_SUPPORT' | 'AT_RESISTANCE' | 'NEAR_RESISTANCE' | 'MID_RANGE';
  riskRewardScenario: {
    potentialUpsideToR1: number; // %
    potentialDownsideToS1: number; // %
    riskRewardRatio: number;
    disclaimer: string;
  };
}

export interface BreakoutAnalysis {
  isBreakout: boolean;
  isBreakdown: boolean;
  type: 'Resistance Breakout' | '52W High Breakout' | 'Range Breakout' | 'Support Breakdown' | '52W Low Breakdown' | 'None';
  confidenceScore: number; // 0 to 100
  confidenceLabel: 'Strong Technical Setup' | 'Moderate Setup' | 'Speculative / Weak' | 'None';
  confirmationFactors: {
    priceAboveResistance: boolean;
    volumeExpansion: boolean;
    relativeVolumeMultiplier: number;
    rsiConfirmation: boolean;
    macdConfirmation: boolean;
    adxConfirmation: boolean;
  };
  explanation: string;
}

export interface FullTechnicalAnalysis {
  symbol: string;
  currentPrice: number;
  overallTechnicalSignal: TechnicalSignalType;
  overallTechnicalScore: number; // 0 to 100
  trendSummary: 'Strong Uptrend' | 'Mild Uptrend' | 'Sideways / Consolidation' | 'Mild Downtrend' | 'Strong Downtrend';
  momentumSummary: string;
  rsi: RsiData;
  macd: MacdData;
  movingAverages: MovingAveragesData;
  bollingerBands: BollingerBandsData;
  adx: AdxData;
  stochastic: StochasticData;
  rateOfChange: { roc14: number; status: string; explanation: string };
  onBalanceVolume: { obvTrend: 'Accumulation' | 'Distribution' | 'Neutral'; divergence: string };
  vwap: { vwap: number; priceVsVwap: 'Above VWAP' | 'Below VWAP'; intradayBias: 'Bullish' | 'Bearish' | 'Neutral' };
  atr: { atr14: number; volatilityCategory: 'Low Volatility' | 'Moderate' | 'High Volatility'; informationalStopLevel: number };
  supportResistance: SupportResistanceLevels;
  breakout: BreakoutAnalysis;
  candlestickPatterns: CandlestickPattern[];
  chartPatterns: ChartPattern[];
}
