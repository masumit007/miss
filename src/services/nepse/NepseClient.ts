import { Nepse, IndexIDEnum } from '@rumess/nepse-api';

export class NepseClient {
  private static instance: NepseClient;

  private readonly nepse: Nepse;

  private constructor() {
    this.nepse = new Nepse();

    // NEPSE currently has certificate issues.
    // The library documents this option.
    this.nepse.setTLSVerification(false);
  }

  public static getInstance(): NepseClient {
    if (!NepseClient.instance) {
      NepseClient.instance = new NepseClient();
    }

    return NepseClient.instance;
  }

  async getMarketStatus() {
    return this.nepse.getMarketStatus();
  }

  async getMarketSummary() {
    return this.nepse.getMarketSummary();
  }

  async getIndices() {
    return this.nepse.getNepseIndex();
  }

  async getSubIndices() {
    return this.nepse.getNepseSubIndices();
  }

  async getLiveMarket() {
    return this.nepse.getLiveMarket();
  }

  async getCompanies() {
    return this.nepse.getCompanyList();
  }

  async getSecurities() {
    return this.nepse.getSecurityList();
  }

  async getSecurityDetails(symbol: string) {
    return this.nepse.getSecurityDetails(symbol);
  }

  async getSecurityGraph(symbol: string) {
    return this.nepse.getSecurityDailyGraph(symbol);
  }

  async getPriceVolumeHistory(symbol: string) {
    return this.nepse.getSecurityPriceVolumeHistory(symbol);
  }

  async getTodayPriceVolume(options?: {
    page?: number;
    size?: number;
    businessDate?: string;
  }) {
    return this.nepse.getTodaysPriceVolumeHistory(options);
  }

  async getFloorsheet(options?: {
    page?: number;
    size?: number;
    symbol?: string;
    buyerBroker?: number;
    sellerBroker?: number;
  }) {
    return this.nepse.getFloorSheet(options);
  }

  async getGainers() {
    return this.nepse.getTopTenGainers();
  }

  async getLosers() {
    return this.nepse.getTopTenLosers();
  }

  async getTopTradeScrips() {
    return this.nepse.getTopTenTradeScrips();
  }

  async getTopTransactionScrips() {
    return this.nepse.getTopTenTransactionScrips();
  }

  async getTopTurnoverScrips() {
    return this.nepse.getTopTenTurnoverScrips();
  }

  async getMarketDepth(symbol: string) {
    return this.nepse.getMarketDepth(symbol);
  }

  async getNepseIndexGraph() {
    return this.nepse.getNepseIndexDailyGraph();
  }

  async getIndexGraph(indexId: IndexIDEnum) {
    return this.nepse.getIndexDailyGraph(indexId);
  }
}