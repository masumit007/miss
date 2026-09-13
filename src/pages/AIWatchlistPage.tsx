import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { ScreenerResultItem } from '../types/screeners';
import { GlassCard } from '../components/common/GlassCard';
import { SignalBadge } from '../components/common/SignalBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Sparkles, ArrowRight, TrendingUp, Anchor, Coins, ShieldAlert, Award } from 'lucide-react';

export const AIWatchlistPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [activeCategory, setActiveCategory] = useState<string>('bullish');
  const [items, setItems] = useState<ScreenerResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'bullish', label: 'AI Bullish Watch', icon: TrendingUp, preset: 'breakout', desc: 'Stocks with strong technical and institutional momentum' },
    { id: 'support', label: 'Support & Oversold Watch', icon: Anchor, preset: 'support_rebound', desc: 'Stocks testing multi-month support floors' },
    { id: 'smart_money', label: 'Smart Money Watch', icon: Coins, preset: 'smart_money_accumulation', desc: 'Sustained foreign + domestic institutional accumulation' },
    { id: 'value', label: 'Value & Quality Watch', icon: Award, preset: 'piotroski_high', desc: 'High Piotroski F-score and low valuation multiples' }
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const cat = categories.find(c => c.id === activeCategory);
      const res = await ApiClient.runScreener(cat?.preset as any || 'breakout');
      setItems(res);
      setLoading(false);
    }
    load();
  }, [activeCategory]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" /> MISS Watch
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous AI-evaluated watchlists categorized dynamically by quantitative evidence.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Category Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map((c) => {
          const Icon = c.icon;
          const isActive = activeCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-500/10' : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <div className="font-bold text-xs font-mono">{c.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Items list */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            {categories.find(c => c.id === activeCategory)?.label} ({items.length} Securities)
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">Evaluating criteria...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.quote.symbol}
                onClick={() => onSelectStock(item.quote.symbol)}
                className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white font-mono text-sm">{item.quote.symbol}</span>
                    <span className="text-xs text-slate-400 block line-clamp-1">{item.quote.name}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-sm font-bold text-white block">Rs. {item.quote.currentPrice}</span>
                    <span className={`text-xs ${item.quote.dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.quote.dayChange >= 0 ? '+' : ''}{item.quote.dayChangePercent}%
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5 text-[11px] text-slate-300">
                  <strong className="text-cyan-300 block mb-0.5">Why it entered this watchlist:</strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    {item.matchedCriteria.slice(0, 2).map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <SignalBadge signal={item.score.quickVerdict} size="sm" />
                  <span className="text-cyan-400 flex items-center gap-0.5 text-[11px]">
                    Analyze Stock <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
