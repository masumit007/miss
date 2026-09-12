import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { BookOpen, Award, Activity, LineChart, Sparkles } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" /> NEPSE Quantitative Methodology & Formulas
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete mathematical formulas, indicator definitions, and framework scoring rules tailored for the Nepal Stock Exchange.
        </p>
      </div>

      {/* Section 1: Multi-Factor Scoring */}
      <GlassCard className="space-y-3">
        <h2 className="text-sm font-bold text-cyan-300 font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> 1. Multi-Factor Score Framework (0–100)
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The MISS NEPSE Research Score is calculated as an explainable linear combination of 8 quantitative subfactors:
        </p>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto">
          Score = 0.25*(Fundamentals) + 0.20*(Technicals) + 0.15*(Growth) + 0.15*(Valuation) + 0.10*(SmartMoney) + 0.05*(Risk) + 0.05*(News) + 0.05*(Macro)
        </div>
        <p className="text-xs text-slate-400">
          Each subfactor score is normalized on a 0-100 scale using Nepalese commercial bank, hydro power, and microfinance benchmarks.
        </p>
      </GlassCard>

      {/* Section 2: Technical Indicators */}
      <GlassCard className="space-y-4">
        <h2 className="text-sm font-bold text-emerald-400 font-mono flex items-center gap-2">
          <Activity className="w-4 h-4" /> 2. Technical Indicator Mathematics
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
            <strong className="text-white block font-mono">Relative Strength Index (RSI 14):</strong>
            <p>RSI = 100 - (100 / (1 + RS)), where RS = Average Gain / Average Loss over 14 daily candles.</p>
            <p className="text-[11px] text-slate-400">Classifications: &gt;=70 Overbought, &lt;=30 Oversold, 65-70 Near Overbought, 30-35 Near Oversold.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
            <strong className="text-white block font-mono">MACD (12, 26, 9):</strong>
            <p>MACD Line = EMA(12) - EMA(26). Signal Line = EMA(9) of MACD Line. Histogram = MACD Line - Signal Line.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
            <strong className="text-white block font-mono">Bollinger Bands (20, 2):</strong>
            <p>Middle Band = SMA(20). Upper Band = SMA(20) + 2*StdDev. Lower Band = SMA(20) - 2*StdDev. %B = (Price - Lower) / (Upper - Lower).</p>
          </div>
        </div>
      </GlassCard>

      {/* Section 3: Piotroski & Classic Frameworks */}
      <GlassCard className="space-y-4">
        <h2 className="text-sm font-bold text-amber-300 font-mono flex items-center gap-2">
          <Award className="w-4 h-4" /> 3. Piotroski F-Score & Classic Value Rules
        </h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
            <strong className="text-white block font-mono">Piotroski F-Score (9 Points):</strong>
            <p>1 pt for each: Positive ROA, Positive CFO, Improving ROA, CFO &gt; Net Income, Falling Debt, Improving Current Ratio, No Share Dilution, Expanding Gross Margin, Improving Asset Turnover.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
            <strong className="text-white block font-mono">Benjamin Graham Value Formula:</strong>
            <p>Graham Number = √(22.5 × EPS × Book Value Per Share in NPR). Filter: P/E × P/B &lt; 22.5.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
