import { AlertRule } from '../../types/alerts';

const STORAGE_KEY = 'miss_alerts_v1';

const DEFAULT_ALERTS: AlertRule[] = [];

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
