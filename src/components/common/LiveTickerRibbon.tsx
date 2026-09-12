import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../services/api/client';
import { StockQuote } from '../../types/stock';
import { MarketIndex } from '../../types/market';
import { TrendingUp, TrendingDown, Zap, Activity } from 'lucide-react';

interface LiveTickerRibbonProps {
  onSelectStock?: (symbol: string) => void;
  onNavigate?: (page: string) => void;
}

export const LiveTickerRibbon: React.FC<LiveTickerRibbonProps> = ({ onSelectStock, onNavigate }) => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [topStocks, setTopStocks] = useState<StockQuote[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchTickerData() {
      try {
        const overview = await ApiClient.getMarketOverview();
        const all = await ApiClient.getAllStocks();
        if (isMounted) {
          setIndices(overview.primaryIndices);
          // Sort by highest absolute percentage change or volume
          const sorted = [...all].sort((a, b) => Math.abs(b.dayChangePercent) - Math.abs(a.dayChangePercent));
          setTopStocks(sorted.slice(0, 16));
        }
      } catch (err) {
        console.error('Failed to load live ticker data:', err);
      }
    }
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-[#060910] border-b border-white/10 overflow-hidden select-none py-1.5 px-2 relative z-30 font-mono text-[11px]">
      <div className="flex items-center">
        {/* Left Live Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md font-bold shrink-0 mr-3 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="tracking-wider">NEPSE LIVE</span>
        </div>

        {/* Scrolling Strip */}
        <div className="overflow-x-auto no-scrollbar flex items-center gap-6 whitespace-nowrap scroll-smooth">
          {/* Market Indices */}
          {indices.map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div
                key={idx.symbol}
                onClick={() => onNavigate && onNavigate('markets')}
                className="inline-flex items-center gap-2 px-2 py-0.5 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-slate-300 font-bold">{idx.symbol}:</span>
                <span className="text-white font-extrabold">
                  {idx.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-flex items-center gap-0.5 font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {isPos ? '+' : ''}{idx.percentChange}%
                </span>
              </div>
            );
          })}

          <span className="text-white/20">|</span>

          {/* Top Moving Stocks */}
          {topStocks.map((s) => {
            const isPos = s.dayChange >= 0;
            return (
              <div
                key={s.symbol}
                onClick={() => onSelectStock && onSelectStock(s.symbol)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-cyan-500/10 hover:border-cyan-500/20 border border-transparent transition-all cursor-pointer group"
              >
                <span className="text-cyan-400 font-bold group-hover:text-cyan-300">{s.symbol}</span>
                <span className="text-white font-semibold">Rs. {s.currentPrice}</span>
                <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPos ? '+' : ''}{s.dayChangePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
