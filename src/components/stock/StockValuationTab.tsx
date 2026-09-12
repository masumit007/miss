import React from 'react';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { DollarSign, BookOpen, ShieldCheck } from 'lucide-react';

export const StockValuationTab: React.FC<{ fundamentals: FullFundamentalAnalysis }> = ({ fundamentals }) => {
  return (
    <div className="space-y-6">
      {/* Primary Valuation Metrics Grid in NPR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Price to Earnings (P/E)" value={`${fundamentals.valuation.pe}x`} subValue="Historical Median: 21.5x" highlight />
        <MetricCard label="PEG Ratio" value={fundamentals.valuation.peg} subValue="Earnings Growth Adjusted" />
        <MetricCard label="Price to Book (P/B)" value={`${fundamentals.valuation.pb}x`} subValue="Net Asset Value" />
        <MetricCard label="Dividend Yield" value={`${fundamentals.valuation.dividendYield}%`} subValue="Annual Distribution" />
      </div>

      <GlassCard className="space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 border-b border-white/10 pb-3">
          <BookOpen className="w-4 h-4 text-cyan-400" /> Historical Valuation Multiples & Graham Number
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-mono">Graham Number (Fair Value)</span>
            <span className="text-lg font-bold font-mono text-cyan-300">Rs. {fundamentals.graham.grahamNumber}</span>
            <span className="text-[11px] text-slate-400 block">√(22.5 × EPS × BVPS)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-mono">P/E × P/B Multiple</span>
            <span className="text-lg font-bold font-mono text-white">{fundamentals.graham.peTimesPb}</span>
            <span className="text-[11px] text-emerald-400 block">{fundamentals.graham.peTimesPb < 22.5 ? 'Attractive (< 22.5)' : 'Premium Valuation'}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-slate-400 block font-mono">Enterprise Value / EBITDA</span>
            <span className="text-lg font-bold font-mono text-white">{fundamentals.valuation.evToEbitda}x</span>
            <span className="text-[11px] text-slate-400 block">Operating Cash Proxy</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
