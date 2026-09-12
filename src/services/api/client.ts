const API_URL = (
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001'
).replace(/\/$/, '');

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
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
        ...(options?.headers || {}),
      },
    });

    let payload: any;

    try {
      payload = await response.json();
    } catch {
      throw new Error(
        `Invalid API response (${response.status})`
      );
    }

    if (!response.ok) {
      throw new Error(
        payload?.error ||
        `API request failed: ${response.status}`
      );
    }

    return payload;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(
        `API request timed out: ${path}`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export class ApiClient {
  static async getMarketOverview() {
    const response = await request<any>(
      '/api/market/overview'
    );

    return response.data;
  }

  static async getMarketStatus() {
    return request<any>(
      '/api/market/status'
    );
  }

  static async getAllStocks() {
    const response = await request<any>(
      '/api/stocks'
    );

    return response.data;
  }

  static async searchStocks(query: string) {
    const response = await request<any>(
      `/api/stocks/search?q=${encodeURIComponent(query)}`
    );

    return response.data;
  }

  static async getStockDetails(symbol: string) {
    const response = await request<any>(
      `/api/stocks/${encodeURIComponent(
        symbol.toUpperCase()
      )}`
    );

    return response.data;
  }

  static async getChart(
    symbol: string,
    timeframe = '1D'
  ) {
    const response = await request<any>(
      `/api/stocks/${encodeURIComponent(
        symbol.toUpperCase()
      )}/chart?tf=${encodeURIComponent(timeframe)}`
    );

    return response.data;
  }

  static async getIPOs() {
    const response = await request<any>(
      '/api/ipo'
    );

    return response.data;
  }

  static async getNews(category?: string) {
    const query = category
      ? `?category=${encodeURIComponent(category)}`
      : '';

    const response = await request<any>(
      `/api/news${query}`
    );

    return response.data;
  }

  static async askAI(message: string) {
    const response = await request<any>(
      '/api/ai/chat',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
        }),
      }
    );

    return response.data;
  }

  static async runAiScreener(query: string) {
    const response = await request<any>(
      '/api/screeners/ai-query',
      {
        method: 'POST',
        body: JSON.stringify({
          query,
        }),
      }
    );

    return response.data;
  }
}