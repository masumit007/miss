import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { ScreenerResultItem } from '../types/screeners';
import { GlassCard } from '../components/common/GlassCard';
import { SignalBadge } from '../components/common/SignalBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Activity, Zap, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export const TechnicalsPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [items, setItems] = useState<ScreenerResultItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'breakout' | 'oversold' | 'golden_cross'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await ApiClient.runScreener(activeFilter === 'all' ? 'breakout' : (activeFilter as any));
      setItems(res);
      setLoading(false);
    }
    load();
  }, [activeFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" /> MISS NEPSE Technicals
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated indicator scanning across RSI, MACD, Moving Averages, Support/Resistance levels, and Breakouts for Nepal equities.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeFilter === 'all' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            All Technicals
          </button>
          <button
            onClick={() => setActiveFilter('breakout')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeFilter === 'breakout' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Breakouts
          </button>
          <button
            onClick={() => setActiveFilter('oversold')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeFilter === 'oversold' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Oversold (RSI &lt; 35)
          </button>
          <button
            onClick={() => setActiveFilter('golden_cross')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeFilter === 'golden_cross' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Golden Cross
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      <GlassCard className="overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">Scanning NEPSE technical indicators...</div>
        ) : (
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-3">Symbol</th>
                <th className="p-3">Price (NPR)</th>
                <th className="p-3">RSI 14</th>
                <th className="p-3">MACD Status</th>
                <th className="p-3">SMA 50 / 200</th>
                <th className="p-3">ADX 14</th>
                <th className="p-3">Key Support</th>
                <th className="p-3">Key Resistance</th>
                <th className="p-3">Signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((it) => (
                <tr 
                  key={it.quote.symbol}
                  onClick={() => onSelectStock(it.quote.symbol)}
                  className="hover:bg-slate-900/60 cursor-pointer"
                >
                  <td className="p-3">
                    <span className="font-bold text-cyan-300 block">{it.quote.symbol}</span>
                    <span className="text-[10px] text-slate-400 font-sans block line-clamp-1">{it.quote.name}</span>
                  </td>
                  <td className="p-3 font-bold text-white">Rs. {it.quote.currentPrice}</td>
                  <td className="p-3">
                    <span className={`font-bold ${it.technicals.rsi.value >= 70 ? 'text-amber-400' : it.technicals.rsi.value <= 35 ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {it.technicals.rsi.value}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{it.technicals.rsi.classification}</span>
                  </td>
                  <td className="p-3">
                    <span className="text-white block">{it.technicals.macd.crossoverStatus}</span>
                    <span className="text-[10px] text-slate-400 block">{it.technicals.macd.zeroLineStatus}</span>
                  </td>
                  <td className="p-3 text-slate-300">
                    Rs. {it.technicals.movingAverages.sma50.value} / {it.technicals.movingAverages.sma200.value}
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-white block">{it.technicals.adx.adx}</span>
                    <span className="text-[10px] text-slate-400 block">{it.technicals.adx.trendStrength}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-400">Rs. {it.technicals.supportResistance.support1}</td>
                  <td className="p-3 font-bold text-rose-400">Rs. {it.technicals.supportResistance.resistance1}</td>
                  <td className="p-3">
                    <SignalBadge signal={it.technicals.overallTechnicalSignal} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
};
