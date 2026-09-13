import React from 'react';
import { StockQuote } from '../../types/stock';
import { FullTechnicalAnalysis } from '../../types/technicals';
import { FullFundamentalAnalysis } from '../../types/fundamentals';
import { MultiFactorScore } from '../../types/scoring';
import { MetricCard } from '../common/MetricCard';
import { GlassCard } from '../common/GlassCard';
import { SignalBadge } from '../common/SignalBadge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';

interface StockOverviewTabProps {
  quote: StockQuote;
  technicals: FullTechnicalAnalysis;
  fundamentals: FullFundamentalAnalysis;
  score: MultiFactorScore;
}

export const StockOverviewTab: React.FC<StockOverviewTabProps> = ({
  quote,
  technicals,
  fundamentals,
  score
}) => {
  const subfactorsList = [
    score.subfactors.fundamentals,
    score.subfactors.technicals,
    score.subfactors.growth,
    score.subfactors.valuation,
    score.subfactors.smartMoney,
    score.subfactors.risk,
    score.subfactors.newsSentiment,
    score.subfactors.macroSector
  ];

  return (
    <div className="space-y-6">
      {/* 8 Primary Financial & Quantitative Metrics in NPR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Market Capitalization" value={quote.marketCap !== null ? `Rs. ${(quote.marketCap / 100).toFixed(2)} Arb` : 'N/A'} subValue={quote.sector ?? 'Sector unclassified'} highlight />
        <MetricCard label="P/E Multiple" value={`${fundamentals.valuation.pe}x`} subValue="Trailing 12M" />
        <MetricCard label="Piotroski F-Score" value={`${fundamentals.piotroski.score}/9`} subValue={fundamentals.piotroski.classification.split(' (')[0]} />
        <MetricCard label="Graham Value" value={`Rs. ${fundamentals.graham.grahamNumber}`} subValue={`P/E×P/B: ${fundamentals.graham.peTimesPb}`} />
        <MetricCard label="Return on Equity (ROE)" value={`${fundamentals.profitability.roe}%`} subValue={`ROCE: ${fundamentals.profitability.roce}%`} />
        <MetricCard label="Delivery Volume %" value={quote.deliveryPercentage !== null && quote.deliveryPercentage !== undefined ? `${quote.deliveryPercentage}%` : 'N/A'} subValue="Positional Absorption" />
        <MetricCard label="RSI 14 Momentum" value={`${technicals.rsi.value}`} subValue={technicals.rsi.classification} />
        <MetricCard label="Technical Stance" value={technicals.overallTechnicalSignal} subValue={`ADX: ${technicals.adx.adx} (${technicals.adx.trendStrength})`} />
      </div>

      {/* Multi-Factor Research Score Card (0–100) */}
      <GlassCard className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-mono">
                MISS NEPSE Research Score (0–100)
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              Quantitative synthesis across 8 independent analytical pillars normalized against Nepalese equity benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-3xl font-black text-cyan-300 font-mono">
                {score.overallScore}<span className="text-sm font-normal text-slate-400">/100</span>
              </div>
              <SignalBadge signal={score.quickVerdict} size="sm" />
            </div>
          </div>
        </div>

        {/* 8 Sub-factor Decomposition */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subfactorsList.map((f) => (
            <div key={f.name} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">{f.name}</span>
                <span className="font-bold text-white">{f.score}/100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${f.score >= 75 ? 'bg-cyan-400' : f.score >= 50 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  style={{ width: `${f.score}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">Weight: {Math.round(f.weight * 100)}%</span>
            </div>
          ))}
        </div>

        {/* Transparent Qualitative Drivers & Risk Disclaimers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Why it Scored High */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Why It Scored High:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {score.whyItScoredHigh.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Could Go Wrong */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> What Could Go Wrong / Key Risks:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {score.whatCouldGoWrong.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
