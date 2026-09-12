import React from 'react';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { Check, X, ShieldCheck, Award, BookOpen, UserCheck, Zap } from 'lucide-react';

export const StockFundamentalsTab: React.FC<{ fundamentals: FullFundamentalAnalysis }> = ({ fundamentals }) => {
  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Return on Equity (ROE)" value={`${fundamentals.profitability.roe}%`} subValue="3Yr Avg: 22.4%" highlight />
        <MetricCard label="ROCE" value={`${fundamentals.profitability.roce}%`} subValue="Capital Efficiency" />
        <MetricCard label="Debt to Equity" value={fundamentals.balanceSheet.debtToEquity} subValue={fundamentals.balanceSheet.leverageCategory} />
        <MetricCard label="Piotroski F-Score" value={`${fundamentals.piotroski.score}/9`} subValue="Financial Strength" />
      </div>

      {/* Piotroski 9-Point Checklist */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Piotroski F-Score (9-Point Quality Checklist)</h3>
              <p className="text-xs text-slate-400">Systematic evaluation of Profitability, Leverage, Liquidity, and Operating Efficiency</p>
            </div>
          </div>
          <span className="text-lg font-bold font-mono text-cyan-300">{fundamentals.piotroski.score}/9</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {fundamentals.piotroski.items.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 rounded-xl border ${item.passed ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-rose-950/20 border-rose-500/20'} flex items-start gap-2.5`}
            >
              <div className={`mt-0.5 p-1 rounded-full ${item.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {item.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-semibold text-slate-200 block">{item.title}</span>
                <span className="text-[11px] text-slate-400 block font-mono">{item.actualValue}</span>
                <span className="text-[10px] text-slate-500 block">{item.explanation}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Classic Frameworks Grid: CANSLIM, Buffett, Graham, Lynch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warren Buffett Framework */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
              <Award className="w-4 h-4" /> Warren Buffett Quality Framework
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold">{fundamentals.buffett.buffettQualityScore}/100</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between"><span className="text-slate-400">Economic Moat:</span> <strong className="text-white">{fundamentals.buffett.durableMoatRating}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">10-Yr Avg ROE:</span> <strong className="text-white">{fundamentals.buffett.roeTenYearAverage}%</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Debt Safety:</span> <strong className="text-emerald-400">{fundamentals.buffett.debtSafety}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Intrinsic Value Band:</span> <strong className="text-cyan-300 font-mono">{fundamentals.buffett.estimatedIntrinsicValueRange}</strong></div>
          </div>

          <p className="text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-white/5 leading-relaxed">
            {fundamentals.buffett.disclaimer}
          </p>
        </GlassCard>

        {/* CANSLIM Framework */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4" /> CANSLIM Growth Framework
            </h3>
            <span className="text-xs font-mono text-cyan-400 font-bold">{fundamentals.canslim.totalScore}/100</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between"><span className="text-slate-400">C (Current EPS):</span> <strong className="text-white">{fundamentals.canslim.c_score}/15</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">A (Annual CAGR):</span> <strong className="text-white">{fundamentals.canslim.a_score}/15</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">L (Leader status):</span> <strong className="text-white">{fundamentals.canslim.l_score}/15</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">I (Institutional backing):</span> <strong className="text-white">{fundamentals.canslim.i_score}/15</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Verdict:</span> <strong className="text-emerald-400">{fundamentals.canslim.verdict}</strong></div>
          </div>
        </GlassCard>

        {/* Benjamin Graham Deep Value */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold text-slate-200 font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Benjamin Graham Framework
            </h3>
            <span className="text-xs font-mono text-cyan-300 font-bold">{fundamentals.graham.grahamScore}/100</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 font-mono">
            <div className="flex justify-between"><span className="text-slate-400">Graham Number:</span> <strong className="text-white">₹{fundamentals.graham.grahamNumber}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">P/E × P/B Multiple:</span> <strong className="text-white">{fundamentals.graham.peTimesPb} (Max 22.5)</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Current Ratio:</span> <strong className="text-white">{fundamentals.graham.currentRatio}x (Min 2.0x)</strong></div>
          </div>
        </GlassCard>

        {/* Peter Lynch Framework */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3 className="text-sm font-bold text-purple-300 font-mono flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Peter Lynch Growth Engine
            </h3>
            <span className="text-xs font-mono text-purple-400 font-bold">{fundamentals.peterLynch.lynchScore}/100</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between"><span className="text-slate-400">Category:</span> <strong className="text-cyan-300">{fundamentals.peterLynch.category}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">PEG Ratio:</span> <strong className="text-white font-mono">{fundamentals.peterLynch.pegRatio}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Earnings Growth:</span> <strong className="text-emerald-400">+{fundamentals.peterLynch.earningsGrowthRate}%</strong></div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
