import { SystemConfiguration } from '../../types/admin';

const STORAGE_KEY = 'miss_nepse_settings_v1';

export const DEFAULT_SETTINGS: SystemConfiguration = {
  maintenanceMode: false,
  activeMarketDataProvider: 'NepseDataProvider',
  enableLiveFallback: true,
  technicalThresholds: {
    rsiOverbought: 70,
    rsiOversold: 30,
    adxStrongTrend: 25,
    stochasticOverbought: 80,
    stochasticOversold: 20,
    breakoutVolumeMultiplier: 1.25,
    supportProximityPercent: 3.5,
    resistanceProximityPercent: 3.5
  },
  scoringWeights: {
    fundamentals: 25,
    technicals: 20,
    growth: 15,
    valuation: 15,
    smartMoney: 10,
    risk: 5,
    newsSentiment: 5,
    macroSector: 5
  },
  developerContribution: {
    enabled: true,
    headerText: 'Support the Developer (Built by Sumit)',
    descriptionText: 'If MISS NEPSE aids your market intelligence and stock screening on the Nepal Stock Exchange, you can optionally contribute to the ongoing server hosting, data scraping pipelines, and AI engineering of this platform.',
    upiId: '9841199810',
    accountHolderName: 'Sumit Kumar Mahato',
    qrImageUrl: '/esewa_qr.jpg',
    developerNote: 'Contributions are completely voluntary and do NOT alter stock rankings, scores, or analytical objectivity.'
  }
};

// `localStorage` only exists in the browser. This module is also imported
// server-side (src/server/server.ts, running on Node/Vercel), where
// `localStorage` is undefined and would throw a ReferenceError on every
// access. Detect the environment once and fall back to a module-level
// in-memory object on the server, so settings actually persist for the
// lifetime of the running instance instead of silently no-op'ing.
const hasBrowserStorage =
  typeof globalThis !== 'undefined' &&
  typeof (globalThis as any).localStorage !== 'undefined';

let memoryStore: string | null = null;

function readRaw(): string | null {
  if (hasBrowserStorage) {
    return (globalThis as any).localStorage.getItem(STORAGE_KEY);
  }
  return memoryStore;
}

function writeRaw(value: string): void {
  if (hasBrowserStorage) {
    (globalThis as any).localStorage.setItem(STORAGE_KEY, value);
    return;
  }
  memoryStore = value;
}

export class SettingsStore {
  public static getSettings(): SystemConfiguration {
    try {
      const data = readRaw();
      if (data) {
        const parsed = JSON.parse(data);
        parsed.developerContribution.upiId = '9841199810';
        parsed.developerContribution.accountHolderName = 'Sumit Kumar Mahato';
        parsed.developerContribution.qrImageUrl = '/esewa_qr.jpg';
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: SystemConfiguration): void {
    try {
      writeRaw(JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }

  public static updateScoringWeights(weights: Partial<SystemConfiguration['scoringWeights']>): void {
    const current = this.getSettings();
    current.scoringWeights = { ...current.scoringWeights, ...weights };
    this.saveSettings(current);
  }

  public static updateTechnicalThresholds(thresholds: Partial<SystemConfiguration['technicalThresholds']>): void {
    const current = this.getSettings();
    current.technicalThresholds = { ...current.technicalThresholds, ...thresholds };
    this.saveSettings(current);
  }

  public static updateContributionConfig(config: Partial<SystemConfiguration['developerContribution']>): void {
    const current = this.getSettings();
    current.developerContribution = { ...current.developerContribution, ...config };
    this.saveSettings(current);
  }
}
