/// <reference types="vite/client" />

import { StockQuote, OHLCV } from '../../types/stock';
import { MarketOverviewData } from '../../types/market';
import { NewsArticle } from '../../types/news';
import { IPOItem } from '../../types/ipo';
import { ScreenerResultItem } from '../../types/screeners';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();

  // Never allow the UI to wait forever.
  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    let payload: any;

    try {
      payload = await response.json();
    } catch {
      throw new Error(`Invalid API response (${response.status})`);
    }

    if (!response.ok) {
      throw new Error(payload?.error || `API request failed: ${response.status}`);
    }

    return payload;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`API request timed out: ${path}`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export class ApiClient {
  static async getMarketOverview(): Promise<MarketOverviewData> {
    const response = await request<{ data: MarketOverviewData }>('/api/market/overview');
    return response.data;
  }

  static async getMarketStatus() {
    return request<{ isOpen: string; asOf: string }>('/api/market/status');
  }

  static async getAllStocks(): Promise<StockQuote[]> {
    const response = await request<{ data: StockQuote[] }>('/api/stocks');
    return response.data;
  }

  static async searchStocks(query: string): Promise<StockQuote[]> {
    const response = await request<{ data: StockQuote[] }>(
      `/api/stocks/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  static async getStockDetails(symbol: string) {
    const response = await request<{ data: any }>(
      `/api/stocks/${encodeURIComponent(symbol.toUpperCase())}`
    );
    return response.data;
  }

  static async getChart(symbol: string, timeframe = '1D'): Promise<OHLCV[]> {
    const response = await request<{ data: OHLCV[] }>(
      `/api/stocks/${encodeURIComponent(symbol.toUpperCase())}/chart?tf=${encodeURIComponent(timeframe)}`
    );
    return response.data;
  }

  static async generateReport(symbol: string) {
    const response = await request<{ data: any }>(
      `/api/stocks/${encodeURIComponent(symbol.toUpperCase())}/report`
    );
    return response.data;
  }

  static async getIPOs(): Promise<IPOItem[]> {
    const response = await request<{ data: IPOItem[] }>('/api/ipo');
    return response.data;
  }

  static async getNews(category?: string): Promise<NewsArticle[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await request<{ data: NewsArticle[] }>(`/api/news${query}`);
    return response.data;
  }

  /** Alias kept for pages written against the older method name. */
  static async getMarketNews(category?: string): Promise<NewsArticle[]> {
    return this.getNews(category);
  }

  static async askAI(message: string): Promise<any> {
    const response = await request<{ data: any }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    return response.data;
  }

  /** Alias kept for pages written against the older method name. */
  static async sendAIMessage(message: string) {
    return this.askAI(message);
  }

  static async runAiScreener(query: string): Promise<ScreenerResultItem[]> {
    const response = await request<{ data: ScreenerResultItem[] }>('/api/screeners/ai-query', {
      method: 'POST',
      body: JSON.stringify({ query })
    });
    return response.data;
  }

  /** Runs a named preset screener via GET /api/screeners/:preset. */
  static async runScreener(preset: string): Promise<ScreenerResultItem[]> {
    const response = await request<{ data: ScreenerResultItem[] }>(
      `/api/screeners/${encodeURIComponent(preset)}`
    );
    return response.data;
  }
}
