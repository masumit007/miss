import React from 'react';
import { FullTechnicalAnalysis } from '../../types/technicals';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { SignalBadge } from '../common/SignalBadge';
import { Activity, Zap, Compass, Layers, ShieldAlert, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StockTechnicalsTab: React.FC<{ technicals: FullTechnicalAnalysis }> = ({ technicals }) => {
  return (
    <div className="space-y-6">
      {/* Top Indicator Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="RSI 14" value={technicals.rsi.value} subValue={technicals.rsi.classification} highlight />
        <MetricCard label="MACD Histogram" value={technicals.macd.histogram} subValue={technicals.macd.crossoverStatus} />
        <MetricCard label="ADX 14 Trend" value={technicals.adx.adx} subValue={technicals.adx.trendStrength} />
        <MetricCard label="Technical Score" value={`${technicals.overallTechnicalScore}/100`} subValue={technicals.trendSummary} />
      </div>

      {/* Moving Averages Grid */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" /> Moving Average Matrix (SMA & EMA)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Golden Cross: {technicals.movingAverages.crossSignals.goldenCrossDetected ? 'Active (Bullish)' : 'Inactive'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <span className="text-xs text-slate-400 block font-mono">SMA 20</span>
            <span className="text-base font-bold font-mono text-white">Rs. {technicals.movingAverages.sma20.value}</span>
            <span className="text-[11px] block text-emerald-400">{technicals.movingAverages.sma20.priceVsMa}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <span className="text-xs text-slate-400 block font-mono">SMA 50</span>
            <span className="text-base font-bold font-mono text-white">Rs. {technicals.movingAverages.sma50.value}</span>
            <span className="text-[11px] block text-emerald-400">{technicals.movingAverages.sma50.priceVsMa}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <span className="text-xs text-slate-400 block font-mono">SMA 100</span>
            <span className="text-base font-bold font-mono text-white">Rs. {technicals.movingAverages.sma100.value}</span>
            <span className="text-[11px] block text-emerald-400">{technicals.movingAverages.sma100.priceVsMa}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <span className="text-xs text-slate-400 block font-mono">SMA 200 (Macro)</span>
            <span className="text-base font-bold font-mono text-white">Rs. {technicals.movingAverages.sma200.value}</span>
            <span className="text-[11px] block text-emerald-400">{technicals.movingAverages.sma200.priceVsMa}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 bg-slate-900/30 p-3 rounded-xl border border-white/5">
          {technicals.movingAverages.crossSignals.details}
        </p>
      </GlassCard>

      {/* Support & Resistance + Breakouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support & Resistance */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Key Technical Reference Levels
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-2 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20">
              <span className="font-bold text-rose-400 font-mono block">RESISTANCE LEVELS</span>
              <div className="flex justify-between font-mono"><span>R1:</span> <strong className="text-white">Rs. {technicals.supportResistance.resistance1}</strong></div>
              <div className="flex justify-between font-mono"><span>R2:</span> <strong className="text-white">Rs. {technicals.supportResistance.resistance2}</strong></div>
              <div className="flex justify-between font-mono"><span>R3:</span> <strong className="text-white">Rs. {technicals.supportResistance.resistance3}</strong></div>
            </div>

            <div className="space-y-2 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
              <span className="font-bold text-emerald-400 font-mono block">SUPPORT LEVELS</span>
              <div className="flex justify-between font-mono"><span>S1:</span> <strong className="text-white">Rs. {technicals.supportResistance.support1}</strong></div>
              <div className="flex justify-between font-mono"><span>S2:</span> <strong className="text-white">Rs. {technicals.supportResistance.support2}</strong></div>
              <div className="flex justify-between font-mono"><span>S3:</span> <strong className="text-white">Rs. {technicals.supportResistance.support3}</strong></div>
            </div>
          </div>

          {/* Fibonacci Retracements */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-xs font-semibold text-slate-300 font-mono">Fibonacci Swing Levels:</span>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-mono">
              <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">23.6%: Rs. {technicals.supportResistance.fibonacciLevels.fib236}</div>
              <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">38.2%: Rs. {technicals.supportResistance.fibonacciLevels.fib382}</div>
              <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">50.0%: Rs. {technicals.supportResistance.fibonacciLevels.fib500}</div>
              <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">61.8%: Rs. {technicals.supportResistance.fibonacciLevels.fib618}</div>
              <div className="p-1.5 rounded bg-slate-900/60 border border-white/5">78.6%: Rs. {technicals.supportResistance.fibonacciLevels.fib786}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 text-[11px] text-slate-400">
            <strong>Risk/Reward Scenario:</strong> Potential upside to R1: +{technicals.supportResistance.riskRewardScenario.potentialUpsideToR1}% • Downside to S1: -{technicals.supportResistance.riskRewardScenario.potentialDownsideToS1}%. ({technicals.supportResistance.riskRewardScenario.disclaimer})
          </div>
        </GlassCard>

        {/* Breakout & Pattern Detection */}
        <GlassCard className="space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" /> Breakout & Pattern Scanner
          </h3>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 font-mono">Breakout Status:</span>
              <SignalBadge signal={technicals.breakout.confidenceLabel} size="sm" />
            </div>
            <p className="text-xs text-slate-300">{technicals.breakout.explanation}</p>
          </div>

          {/* Candlestick patterns */}
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block mb-2">
              Detected Candlestick Patterns
            </span>
            {technicals.candlestickPatterns.length === 0 ? (
              <p className="text-xs text-slate-500">No high-significance reversal candlestick detected on latest session.</p>
            ) : (
              <div className="space-y-2">
                {technicals.candlestickPatterns.map((pat, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{pat.name}</span>
                      <SignalBadge signal={pat.type.toUpperCase()} size="sm" />
                    </div>
                    <p className="text-slate-400 text-[11px]">{pat.interpretation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
