export type AlertTriggerType = 
  | 'PRICE_CROSS_ABOVE'
  | 'PRICE_CROSS_BELOW'
  | 'RSI_OVERBOUGHT'
  | 'RSI_OVERSOLD'
  | 'MACD_BULLISH_CROSS'
  | 'MACD_BEARISH_CROSS'
  | 'GOLDEN_CROSS'
  | 'DEATH_CROSS'
  | 'RESISTANCE_BREAKOUT'
  | 'SUPPORT_BREAKDOWN'
  | 'VOLUME_SPIKE'
  | 'HIGH_DELIVERY_SPIKE'
  | 'NEWS_HIGH_SENTIMENT'
  | 'IPO_SUBSCRIPTION_CROSS';

export interface AlertRule {
  id: string;
  symbol: string;
  triggerType: AlertTriggerType;
  thresholdValue?: number;
  message: string;
  createdAt: string;
  status: 'ACTIVE' | 'TRIGGERED' | 'DISABLED';
  lastTriggeredAt?: string;
}
