export interface WatchlistGroup {
  id: string;
  name: string;
  isAiGenerated: boolean;
  symbols: string[];
}

const STORAGE_KEY = 'miss_watchlists_v1';

const DEFAULT_WATCHLISTS: WatchlistGroup[] = [
  {
    id: 'wl-default',
    name: 'My Watchlist',
    isAiGenerated: false,
    symbols: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS']
  },
  {
    id: 'wl-longterm',
    name: 'Long Term Quality',
    isAiGenerated: false,
    symbols: ['TCS', 'ITC', 'TITAN', 'SUNPHARMA', 'LT']
  },
  {
    id: 'wl-breakouts',
    name: 'Breakout Watch',
    isAiGenerated: true,
    symbols: ['TRENT', 'BEL', 'TATAMOTORS', 'BHARTIARTL']
  },
  {
    id: 'wl-support',
    name: 'Support & Oversold Watch',
    isAiGenerated: true,
    symbols: ['HDFCBANK', 'TITAN', 'ITC']
  }
];

export class WatchlistStore {
  public static getWatchlists(): WatchlistGroup[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_WATCHLISTS;
  }

  public static saveWatchlists(lists: WatchlistGroup[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (e) {
      console.error(e);
    }
  }

  public static addStockToWatchlist(watchlistId: string, symbol: string): void {
    const lists = this.getWatchlists();
    const target = lists.find(l => l.id === watchlistId) || lists[0];
    if (target && !target.symbols.includes(symbol)) {
      target.symbols.push(symbol);
      this.saveWatchlists(lists);
    }
  }

  public static removeStockFromWatchlist(watchlistId: string, symbol: string): void {
    const lists = this.getWatchlists();
    const target = lists.find(l => l.id === watchlistId);
    if (target) {
      target.symbols = target.symbols.filter(s => s !== symbol);
      this.saveWatchlists(lists);
    }
  }

  public static createWatchlist(name: string): WatchlistGroup {
    const lists = this.getWatchlists();
    const newList: WatchlistGroup = {
      id: `wl-${Date.now()}`,
      name,
      isAiGenerated: false,
      symbols: []
    };
    lists.push(newList);
    this.saveWatchlists(lists);
    return newList;
  }

  public static deleteWatchlist(watchlistId: string): void {
    const lists = this.getWatchlists().filter(l => l.id !== watchlistId);
    this.saveWatchlists(lists);
  }
}
