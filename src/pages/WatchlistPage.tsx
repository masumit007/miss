import React, { useState, useEffect } from 'react';
import { WatchlistStore, WatchlistGroup } from '../services/storage/watchlistStore';
import { ApiClient } from '../services/api/client';
import { StockQuote } from '../types/stock';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Bookmark, Plus, Trash2, ArrowRight } from 'lucide-react';

export const WatchlistPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [watchlists, setWatchlists] = useState<WatchlistGroup[]>([]);
  const [activeListId, setActiveListId] = useState<string>('');
  const [stockQuotes, setStockQuotes] = useState<Record<string, StockQuote>>({});
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  useEffect(() => {
    loadWatchlists();
  }, []);

  const loadWatchlists = async () => {
    const lists = WatchlistStore.getWatchlists();
    setWatchlists(lists);
    if (lists.length > 0 && !activeListId) {
      setActiveListId(lists[0].id);
    }
    const all = await ApiClient.getAllStocks();
    const map: Record<string, StockQuote> = {};
    all.forEach(s => { map[s.symbol] = s; });
    setStockQuotes(map);
  };

  const currentList = watchlists.find(l => l.id === activeListId) || watchlists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const created = WatchlistStore.createWatchlist(newListName.trim());
    setNewListName('');
    setIsCreatingList(false);
    loadWatchlists();
    setActiveListId(created.id);
  };

  const handleRemoveStock = (symbol: string) => {
    if (currentList) {
      WatchlistStore.removeStockFromWatchlist(currentList.id, symbol);
      loadWatchlists();
    }
  };

  const handleDeleteList = (id: string) => {
    if (watchlists.length <= 1) return;
    WatchlistStore.deleteWatchlist(id);
    loadWatchlists();
    setActiveListId(watchlists[0].id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-cyan-400" /> NEPSE Watchlists
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalized Nepal stock watchlists with real-time quote updates, technical alerts, and export capability.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingList(!isCreatingList)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Watchlist</span>
        </button>
      </div>

      <DisclaimerBanner />

      {/* New List Form Modal/Inline */}
      {isCreatingList && (
        <GlassCard className="space-y-3">
          <span className="text-xs font-bold text-slate-200 font-mono">Create New Watchlist</span>
          <form onSubmit={handleCreateList} className="flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Watchlist Name (e.g. Hydro Power Growth, Commercial Banks)..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono"
            >
              Save List
            </button>
          </form>
        </GlassCard>
      )}

      {/* Watchlist Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {watchlists.map((list) => {
          const isActive = list.id === activeListId;
          return (
            <button
              key={list.id}
              onClick={() => setActiveListId(list.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <span>{list.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-slate-950 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                {list.symbols.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Watchlist Content */}
      {currentList && (
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-bold text-white font-mono">{currentList.name}</h2>
              <span className="text-xs text-slate-400">{currentList.symbols.length} Securities Monitored</span>
            </div>

            {watchlists.length > 1 && (
              <button
                onClick={() => handleDeleteList(currentList.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer font-mono"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete List</span>
              </button>
            )}
          </div>

          {currentList.symbols.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-mono">
              Your watchlist is empty. Add NEPSE stocks using the "+ Add to Watchlist" button on any stock page.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="p-3">Symbol</th>
                    <th className="p-3">Current Price (NPR)</th>
                    <th className="p-3">Day Change</th>
                    <th className="p-3">52W High / Low</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {currentList.symbols.map((sym) => {
                    const q = stockQuotes[sym];
                    if (!q) return null;
                    const isPos = q.dayChange >= 0;
                    return (
                      <tr key={sym} className="hover:bg-slate-900/60">
                        <td className="p-3">
                          <button 
                            onClick={() => onSelectStock(sym)} 
                            className="text-left font-bold text-cyan-300 hover:underline"
                          >
                            {q.symbol}
                            <span className="text-[10px] text-slate-400 font-sans block">{q.name}</span>
                          </button>
                        </td>
                        <td className="p-3 font-bold text-white">Rs. {q.currentPrice}</td>
                        <td className={`p-3 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPos ? '+' : ''}{q.dayChange.toFixed(2)} ({isPos ? '+' : ''}{q.dayChangePercent}%)
                        </td>
                        <td className="p-3 text-slate-400">
                          Rs. {q.fiftyTwoWeekHigh} / {q.fiftyTwoWeekLow}
                        </td>
                        <td className="p-3 text-slate-300 font-sans">{q.sector}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onSelectStock(sym)}
                              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5"
                            >
                              Analyze <ArrowRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveStock(sym)}
                              className="text-slate-500 hover:text-rose-400"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
