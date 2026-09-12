import React, { useState, useMemo } from 'react';
import { StockQuote } from '../../types/stock';
import { GlassCard } from '../common/GlassCard';
import { TrendingUp, TrendingDown, DollarSign, Activity, Flame, ChevronRight, Award } from 'lucide-react';

interface TopMoversTabsProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
  onNavigate?: (page: string, params?: any) => void;
}

type TabType = 'gainers' | 'losers' | 'turnover' | 'volume' | 'highs';

export const TopMoversTabs: React.FC<TopMoversTabsProps> = ({ stocks, onSelectStock, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('gainers');

  const { gainers, losers, topTurnover, topVolume, nearHighs } = useMemo(() => {
    const sortedByChange = [...stocks].sort((a, b) => b.dayChangePercent - a.dayChangePercent);
    const gainersList = sortedByChange.filter((s) => s.dayChangePercent > 0).slice(0, 10);
    const losersList = [...stocks].sort((a, b) => a.dayChangePercent - b.dayChangePercent).filter((s) => s.dayChangePercent < 0).slice(0, 10);
    const turnoverList = [...stocks].sort((a, b) => ((b.currentPrice * b.volume) - (a.currentPrice * a.volume))).slice(0, 10);
    const volumeList = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 10);
    const highsList = [...stocks].filter((s) => s.fiftyTwoWeekHigh > 0 && s.currentPrice >= s.fiftyTwoWeekHigh * 0.95).slice(0, 10);

    return {
      gainers: gainersList,
      losers: losersList,
      topTurnover: turnoverList,
      topVolume: volumeList,
      nearHighs: highsList
    };
  }, [stocks]);

  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'gainers': return gainers;
      case 'losers': return losers;
      case 'turnover': return topTurnover;
      case 'volume': return topVolume;
      case 'highs': return nearHighs;
    }
  }, [activeTab, gainers, losers, topTurnover, topVolume, nearHighs]);

  return (
    <GlassCard className="p-4 sm:p-6 space-y-4">
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white font-mono">
              NEPSE Market Leaders & Top Movers
            </h3>
            <p className="text-[11px] text-slate-400">
              Live continuous rankings across all 504+ listed equities
            </p>
          </div>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'gainers'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Top Gainers
          </button>

          <button
            onClick={() => setActiveTab('losers')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'losers'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" /> Top Losers
          </button>

          <button
            onClick={() => setActiveTab('turnover')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'turnover'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Top Turnover
          </button>

          <button
            onClick={() => setActiveTab('volume')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'volume'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" /> Most Active
          </button>

          <button
            onClick={() => setActiveTab('highs')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'highs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" /> 52W Highs
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/5">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Symbol & Company</th>
              <th className="py-2.5 px-3 text-right">LTP (NPR)</th>
              <th className="py-2.5 px-3 text-right">Day Change</th>
              <th className="py-2.5 px-3 text-right">Turnover (Rs. Cr)</th>
              <th className="py-2.5 px-3 text-right">Traded Shares</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentList.map((stock, idx) => {
              const isPos = stock.dayChange >= 0;
              const turnoverCr = ((stock.currentPrice * stock.volume) / 10000000).toFixed(2);
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock.symbol)}
                  className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 text-slate-500 font-bold">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-xs group-hover:text-cyan-400 transition-colors">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-white/5">
                        {stock.sector}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans block truncate max-w-xs">
                      {stock.name}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-extrabold text-white">
                    Rs. {stock.currentPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                      isPos 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isPos ? '+' : ''}{stock.dayChangePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 font-semibold">
                    Rs. {turnoverCr} Cr
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    {stock.volume.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock.symbol);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800/80 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 transition-all cursor-pointer"
                      title="Analyze Stock"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Link */}
      <div className="pt-2 flex items-center justify-between border-t border-white/5 text-[11px] text-slate-400">
        <span>Showing top 10 {activeTab} on Nepal Stock Exchange</span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('screeners')}
            className="text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            Launch All 15+ Screeners →
          </button>
        )}
      </div>
    </GlassCard>
  );
};
