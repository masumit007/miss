import { AlertRule } from '../../types/alerts';

const STORAGE_KEY = 'miss_alerts_v1';

const DEFAULT_ALERTS: AlertRule[] = [
  {
    id: 'alt-1',
    symbol: 'TCS',
    triggerType: 'PRICE_CROSS_ABOVE',
    thresholdValue: 4250,
    message: 'TCS crosses above Rs. 4,250 resistance zone.',
    createdAt: '2026-08-28T10:00:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'alt-2',
    symbol: 'HDFCBANK',
    triggerType: 'RSI_OVERSOLD',
    thresholdValue: 35,
    message: 'HDFC Bank RSI 14 drops below 35.0 (Near Oversold).',
    createdAt: '2026-08-27T14:30:00Z',
    status: 'ACTIVE'
  },
  {
    id: 'alt-3',
    symbol: 'TATAMOTORS',
    triggerType: 'RESISTANCE_BREAKOUT',
    thresholdValue: 1050,
    message: 'Tata Motors confirms resistance breakout with 1.5x volume expansion.',
    createdAt: '2026-08-29T09:15:00Z',
    status: 'TRIGGERED',
    lastTriggeredAt: '29 Aug 2026 14:10 IST'
  }
];

export class AlertStore {
  public static getAlerts(): AlertRule[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ALERTS;
  }

  public static saveAlerts(alerts: AlertRule[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.error(e);
    }
  }

  public static createAlert(alert: Omit<AlertRule, 'id' | 'createdAt' | 'status'>): AlertRule {
    const list = this.getAlerts();
    const newAlert: AlertRule = {
      ...alert,
      id: `alt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };
    list.unshift(newAlert);
    this.saveAlerts(list);
    return newAlert;
  }

  public static toggleAlert(id: string): void {
    const list = this.getAlerts();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = item.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
      this.saveAlerts(list);
    }
  }

  public static deleteAlert(id: string): void {
    const list = this.getAlerts().filter(a => a.id !== id);
    this.saveAlerts(list);
  }
}
