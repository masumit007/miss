import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { ScreenerResultItem } from '../types/screeners';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { LineChart, Award, BookOpen, UserCheck, Zap, ShieldCheck } from 'lucide-react';

export const FundamentalsPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [items, setItems] = useState<ScreenerResultItem[]>([]);
  const [activeTab, setActiveTab] = useState<'piotroski' | 'buffett' | 'canslim' | 'graham'>('piotroski');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const presetMap = {
        piotroski: 'piotroski_high',
        buffett: 'buffett_compounders',
        canslim: 'canslim_leaders',
        graham: 'value_gems'
      } as const;
      const res = await ApiClient.runScreener(presetMap[activeTab] as any);
      setItems(res);
      setLoading(false);
    }
    load();
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <LineChart className="w-6 h-6 text-cyan-400" /> MISS NEPSE Fundamentals & Frameworks
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Systematic financial strength analysis applying Piotroski F-Score (0-9), Buffett Moat, CANSLIM, and Graham Value to Nepal equities.
          </p>
        </div>

        {/* Framework Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('piotroski')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === 'piotroski' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Piotroski (8-9)
          </button>
          <button
            onClick={() => setActiveTab('buffett')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === 'buffett' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Buffett Moat
          </button>
          <button
            onClick={() => setActiveTab('canslim')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === 'canslim' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            CANSLIM Leaders
          </button>
          <button
            onClick={() => setActiveTab('graham')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${activeTab === 'graham' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
          >
            Graham Value
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      <GlassCard className="overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">Computing framework evaluations...</div>
        ) : (
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-3">Symbol</th>
                <th className="p-3">Price (NPR)</th>
                <th className="p-3">ROE %</th>
                <th className="p-3">ROCE %</th>
                <th className="p-3">Debt/Equity</th>
                <th className="p-3">Operating Margin</th>
                <th className="p-3">P/E</th>
                <th className="p-3">PEG</th>
                <th className="p-3">Framework Score</th>
                <th className="p-3">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.filter((it): it is typeof it & { fundamentals: NonNullable<typeof it.fundamentals> } => it.fundamentals !== null).map((it) => (
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
                  <td className="p-3 font-bold text-emerald-400">{it.fundamentals.profitability.roe}%</td>
                  <td className="p-3">{it.fundamentals.profitability.roce}%</td>
                  <td className="p-3">{it.fundamentals.balanceSheet.debtToEquity}</td>
                  <td className="p-3">{it.fundamentals.profitability.operatingMargin}%</td>
                  <td className="p-3">{it.fundamentals.valuation.pe}x</td>
                  <td className="p-3">{it.fundamentals.valuation.peg}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-bold">
                      {activeTab === 'piotroski' ? `${it.fundamentals.piotroski.score}/9` : activeTab === 'buffett' ? `${it.fundamentals.buffett.buffettQualityScore}/100` : activeTab === 'canslim' ? `${it.fundamentals.canslim.totalScore}/100` : `${it.fundamentals.graham.grahamScore}/100`}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">
                    {activeTab === 'piotroski' ? it.fundamentals.piotroski.classification.split(' (')[0] : activeTab === 'buffett' ? it.fundamentals.buffett.verdict : activeTab === 'canslim' ? it.fundamentals.canslim.verdict : it.fundamentals.graham.classification}
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
