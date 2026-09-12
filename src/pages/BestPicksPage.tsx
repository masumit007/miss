import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { ScreenerResultItem } from '../types/screeners';
import { GlassCard } from '../components/common/GlassCard';
import { SignalBadge } from '../components/common/SignalBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Award, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const BestPicksPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [picks, setPicks] = useState<ScreenerResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'fundamental' | 'technical' | 'smart_money'>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await ApiClient.runScreener('piotroski_high');
      setPicks(res);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">MISS Picks</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
              Multi-Factor Ranked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explainable quantitative research picks ranked by multi-factor scores. Not guaranteed buy recommendations.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Ranked Picks List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs">Computing multi-factor rankings...</div>
      ) : picks.length === 0 ? (
        <GlassCard className="py-12 text-center text-slate-400">
          NO STRONG MATCH FOUND. MISS strictly adheres to multi-factor criteria and avoids fabricating picks.
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {picks.slice(0, 6).map((item, idx) => (
            <GlassCard key={item.quote.symbol} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-extrabold font-mono flex items-center justify-center text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-base">{item.quote.symbol}</span>
                      <span className="text-xs text-slate-400">({item.quote.name})</span>
                      <SignalBadge signal={item.score.quickVerdict} size="sm" />
                    </div>
                    <span className="text-xs text-slate-400">{item.quote.sector} • ISIN: {item.quote.isin}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono text-lg font-bold text-white block">₹{item.quote.currentPrice}</span>
                    <span className={`text-xs font-mono font-bold ${item.quote.dayChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.quote.dayChange >= 0 ? '+' : ''}{item.quote.dayChangePercent}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Research Score</span>
                    <span className="text-xl font-extrabold font-mono text-cyan-300">{item.score.overallScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Drivers & Risk Rationale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/15 border border-emerald-500/15 space-y-1">
                  <span className="font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Quantitative Strengths:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {item.score.whyItScoredHigh.slice(0, 2).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/15 space-y-1">
                  <span className="font-bold text-rose-400 font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Key Concerns & Downside Scenarios:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {item.score.whatCouldGoWrong.slice(0, 2).map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onSelectStock(item.quote.symbol)}
                  className="flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span>Open Dedicated Stock Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
