import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Building2, Layers, Newspaper, Sparkles, ArrowRight } from 'lucide-react';
import { StockQuote } from '../../types/stock';
import { ApiClient } from '../../services/api/client';
import { SignalBadge } from './SignalBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (symbol: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectStock }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockQuote[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(['TCS', 'RELIANCE', 'TATAMOTORS', 'HDFCBANK']);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      performSearch('');
    }
  }, [isOpen]);

  const performSearch = async (q: string) => {
    setQuery(q);
    const res = await ApiClient.searchStocks(q);
    setResults(res);
  };

  const handleSelect = (symbol: string) => {
    if (!recentSearches.includes(symbol)) {
      setRecentSearches([symbol, ...recentSearches.slice(0, 4)]);
    }
    onSelectStock(symbol);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1420] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => performSearch(e.target.value)}
            placeholder="Search NSE/BSE stocks, ISIN, BSE code, sector (e.g. RELIANCE, TCS, Bank)..."
            className="w-full bg-transparent px-3 py-1 text-slate-100 placeholder-slate-500 focus:outline-none text-sm sm:text-base font-medium"
          />
          {query && (
            <button onClick={() => performSearch('')} className="p-1 text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose} 
            className="ml-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-white/5"
          >
            ESC
          </button>
        </div>

        {/* Recent Searches Pills */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2.5 bg-slate-900/30 border-b border-white/5 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Recent:</span>
            {recentSearches.map(sym => (
              <button
                key={sym}
                onClick={() => handleSelect(sym)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-white/5 text-xs text-slate-300 font-mono transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/5">
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching stocks found for "{query}".
            </div>
          ) : (
            results.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleSelect(stock.symbol)}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm shrink-0">
                    {stock.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-mono text-sm group-hover:text-cyan-300 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/5">
                        {stock.exchange}
                      </span>
                      {stock.bseCode && (
                        <span className="text-xs text-slate-500 font-mono">BSE: {stock.bseCode}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{stock.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-0.5"><Building2 className="w-3 h-3 text-slate-400" /> {stock.sector}</span>
                      <span>•</span>
                      <span>ISIN: {stock.isin}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-slate-100 text-sm sm:text-base">
                    ₹{stock.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs font-mono font-medium ${stock.dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stock.dayChange >= 0 ? '+' : ''}{stock.dayChange.toFixed(2)} ({stock.dayChangePercent >= 0 ? '+' : ''}{stock.dayChangePercent}%)
                  </div>
                  <div className="mt-1 flex justify-end">
                    <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                      View Deep Analysis <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/70 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Global Search covering NSE & BSE Equities</span>
          <span className="font-mono">MISS Market Intelligence</span>
        </div>
      </div>
    </div>
  );
};
