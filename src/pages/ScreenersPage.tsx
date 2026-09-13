import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { ScreenerPresetType, ScreenerResultItem, CustomScreenerConfig } from '../types/screeners';
import { GlassCard } from '../components/common/GlassCard';
import { SignalBadge } from '../components/common/SignalBadge';
import { FreshnessBadge } from '../components/common/FreshnessBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  Filter, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Award, 
  Coins, 
  DollarSign, 
  Search, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const ScreenersPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [activePreset, setActivePreset] = useState<ScreenerPresetType>('breakout');
  const [results, setResults] = useState<ScreenerResultItem[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const presets: { id: ScreenerPresetType; name: string; desc: string; icon: any }[] = [
    { id: 'breakout', name: 'NEPSE Resistance Breakouts', desc: 'Stocks breaking through key multi-week resistance levels with volume surge', icon: Zap },
    { id: 'support_rebound', name: 'Support Rebound Candidates', desc: 'High-quality stocks testing major historical support or Fibonacci retracements', icon: TrendingUp },
    { id: 'smart_money_accumulation', name: 'Mutual Fund Accumulation', desc: 'Continuous institutional accumulation with high delivery percentage', icon: Coins },
    { id: 'piotroski_high', name: 'Piotroski High Quality (8-9)', desc: 'Companies passing strict profitability, operating efficiency, and solvency criteria', icon: Award },
    { id: 'low_debt_growth', name: 'Low Debt Hydro & Growth', desc: 'Debt-to-Equity < 0.4 and consistent quarterly revenue expansion', icon: ShieldCheck },
    { id: 'oversold_reversal', name: 'Oversold RSI Mean Reversion', desc: 'RSI 14 <= 35 near structural support with bullish reversal potential', icon: Filter },
    { id: 'high_dividend', name: 'High Dividend Yield (NEPSE)', desc: 'Companies with sustainable dividend track records above 5% yield', icon: DollarSign },
    { id: 'buffett_compounders', name: 'Buffett Quality Moat', desc: 'Durable economic moats, consistent 10-Yr ROE, and conservative leverage', icon: Award },
    { id: 'canslim_leaders', name: 'CANSLIM Growth Leaders', desc: 'High quarterly EPS growth, leadership status, and institutional sponsorship', icon: Zap },
    { id: 'value_gems', name: 'Graham Deep Value Gems', desc: 'Trading below or near Graham Number with attractive PEG multiples', icon: DollarSign }
  ];

  useEffect(() => {
    async function execute() {
      setLoading(true);
      const res = await ApiClient.runScreener(activePreset);
      setResults(res);
      setLoading(false);
    }
    execute();
  }, [activePreset]);

  const handleAiScreenerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    const res = await ApiClient.runAiScreener(aiQuery);
    setResults(res);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Filter className="w-6 h-6 text-cyan-400" /> MISS NEPSE Screeners
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time quantitative screening across 504+ Nepal Stock Exchange equities, banking ratios, hydro capacity, and Graham metrics.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* AI Natural Language Screener Input */}
      <GlassCard className="p-4 sm:p-5 space-y-3 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-500/30">
        <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI Natural Language Screener</span>
        </div>
        <form onSubmit={handleAiScreenerSubmit} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="e.g. Find commercial banks and hydro companies with ROE above 18% and low debt..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
          />
          <button
            type="submit"
            disabled={isAiLoading}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
          >
            {isAiLoading ? 'Parsing...' : 'Execute Filter'}
          </button>
        </form>
      </GlassCard>

      {/* Preset Screener Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {presets.map((p) => {
          const Icon = p.icon;
          const isActive = activePreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePreset(p.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Screener Results Table in NPR */}
      <GlassCard className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Matching Securities ({results.length} Stocks)
            </h2>
            <p className="text-xs text-slate-400">
              {presets.find(p => p.id === activePreset)?.desc}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">Running quantitative filters...</div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">No stocks currently match all strict filter conditions.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Price (NPR)</th>
                  <th className="p-3">Day Change</th>
                  <th className="p-3">RSI 14</th>
                  <th className="p-3">ROE %</th>
                  <th className="p-3">P/E</th>
                  <th className="p-3">Piotroski</th>
                  <th className="p-3">Research Score</th>
                  <th className="p-3">Matched Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((r) => (
                  <tr 
                    key={r.quote.symbol} 
                    onClick={() => onSelectStock(r.quote.symbol)}
                    className="hover:bg-slate-900/60 cursor-pointer"
                  >
                    <td className="p-3">
                      <span className="font-bold text-cyan-300 block">{r.quote.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-sans block line-clamp-1">{r.quote.name}</span>
                    </td>
                    <td className="p-3 font-bold text-white">Rs. {r.quote.currentPrice}</td>
                    <td className={`p-3 font-bold ${r.quote.dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {r.quote.dayChange >= 0 ? '+' : ''}{r.quote.dayChangePercent}%
                    </td>
                    <td className="p-3">{r.technicals.rsi.value}</td>
                    <td className="p-3 font-bold text-emerald-400">{r.fundamentals ? `${r.fundamentals.profitability.roe}%` : 'N/A'}</td>
                    <td className="p-3">{r.fundamentals ? `${r.fundamentals.valuation.pe}x` : 'N/A'}</td>
                    <td className="p-3 font-bold text-cyan-300">{r.fundamentals ? `${r.fundamentals.piotroski.score}/9` : 'N/A'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                        {r.score.overallScore}/100
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs truncate">
                      {r.matchedCriteria[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
