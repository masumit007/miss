import React, { useEffect, useState } from 'react';
import { ApiClient } from '../services/api/client';
import { MarketIndex, MarketBreadth, SectorPerformance, InstitutionalActivity, MacroIndicator } from '../types/market';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Layers, 
  DollarSign, 
  Globe,
  PieChart,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const MarketsPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [primaryIndices, setPrimaryIndices] = useState<MarketIndex[]>([]);
  const [sectoralIndices, setSectoralIndices] = useState<MarketIndex[]>([]);
  const [breadth, setBreadth] = useState<MarketBreadth | null>(null);
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [institutionalFlows, setInstitutionalFlows] = useState<InstitutionalActivity[]>([]);
  const [macro, setMacro] = useState<MacroIndicator[]>([]);
  const [activeTab, setActiveTab] = useState<'indices' | 'sectors' | 'institutional' | 'macro'>('indices');

  useEffect(() => {
    async function load() {
      try {
        const overview = await ApiClient.getMarketOverview();
        setPrimaryIndices(overview.primaryIndices);
        setSectoralIndices(overview.sectoralIndices);
        setBreadth(overview.breadth);
        setSectors(overview.sectors);
        setInstitutionalFlows(overview.recentInstitutionalFlows);
        setMacro(overview.macro);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" /> Nepal Stock Exchange (NEPSE) Markets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time NEPSE benchmarks, 13 sectoral sub-indices, market breadth ratios, and NRB macroeconomic indicators.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Market Breadth & Total Turnover Summary */}
      {breadth && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <GlassCard className="p-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              NEPSE Market Breadth (Advances vs. Declines)
            </span>
            <div className="flex items-center justify-between font-mono">
              <span className="text-emerald-400 font-black text-lg">{breadth.advances} Advances</span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400 font-black text-lg">{breadth.declines} Declines</span>
            </div>
            <div className="w-full bg-rose-500/20 rounded-full h-2 overflow-hidden flex">
              <div 
                className="bg-emerald-400 h-full transition-all rounded-full" 
                style={{ width: `${(breadth.advances / ((breadth.advances + breadth.declines) || 1)) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Advance/Decline Ratio: <strong className="text-slate-200">{breadth.advanceDeclineRatio}x</strong></span>
              <span><strong className="text-emerald-400">{breadth.newFiftyTwoWeekHighs}</strong> 52W Highs</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              Total Today's Market Turnover
            </span>
            <div className="text-2xl font-black text-white font-mono">NPR 4.36 Arb</div>
            <p className="text-[11px] text-slate-400 leading-tight">
              1.21 Crore shares traded across 244 securities on Nepal Stock Exchange today.
            </p>
          </GlassCard>

          <GlassCard className="p-4 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              NRB Monetary Policy Stance
            </span>
            <div className="text-lg font-bold text-slate-400 font-mono">Data unavailable</div>
            <p className="text-[11px] text-slate-400 leading-tight">
              No Nepal Rastra Bank monetary data feed is integrated yet.
            </p>
          </GlassCard>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar font-mono text-xs">
        {[
          { id: 'indices', label: 'Primary Indices', icon: BarChart3 },
          { id: 'sectors', label: '13 Sector Heatmap', icon: Layers },
          { id: 'institutional', label: 'Mutual Fund & Flows', icon: DollarSign },
          { id: 'macro', label: 'NRB Macro & Rates', icon: Globe }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Indices Overview */}
      {activeTab === 'indices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {primaryIndices.map((idx) => {
              const isPos = idx.change >= 0;
              return (
                <GlassCard key={idx.symbol} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 font-mono">{idx.symbol}</span>
                    <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isPos ? '+' : ''}{idx.percentChange}%
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-white font-mono">{idx.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-slate-400 truncate">{idx.name}</div>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>52W: {idx.yearlyLow} - {idx.yearlyHigh}</span>
                    <span className="text-cyan-400">P/E: {idx.peRatio}x</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Sectoral Sub-Indices Table */}
          <GlassCard className="p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> NEPSE Sectoral Sub-Indices Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                    <th className="p-3">Sector</th>
                    <th className="p-3 text-right">Current Level</th>
                    <th className="p-3 text-right">Day Change</th>
                    <th className="p-3 text-center">52W High / Low</th>
                    <th className="p-3 text-right">P/E Multiple</th>
                    <th className="p-3 text-center">Market Stance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sectoralIndices.map((sec) => (
                    <tr key={sec.symbol} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-white">{sec.name}</td>
                      <td className="p-3 text-right font-black text-cyan-300">{sec.currentValue.toFixed(2)}</td>
                      <td className={`p-3 text-right font-bold ${sec.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sec.change >= 0 ? '+' : ''}{sec.change.toFixed(2)} ({sec.change >= 0 ? '+' : ''}{sec.percentChange}%)
                      </td>
                      <td className="p-3 text-center text-slate-400">{sec.yearlyLow} — {sec.yearlyHigh}</td>
                      <td className="p-3 text-right text-white font-semibold">{sec.peRatio}x</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sec.percentChange >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-950 text-rose-400 border border-rose-500/30'}`}>
                          {sec.percentChange >= 0 ? 'BULLISH' : 'CORRECTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab 2: Sectors Heatmap */}
      {activeTab === 'sectors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((s) => {
            const isPos = (s.oneDayChange ?? 0) >= 0;
            return (
              <GlassCard key={s.name} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-mono">{s.name}</span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    {s.oneDayChange !== null ? `${isPos ? '+' : ''}${s.oneDayChange}%` : 'N/A'}
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isPos ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(s.oneDayChange ?? 0) * 20 + 20)}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Leading Stock:</span> 
                    <span 
                      onClick={() => s.topStockSymbol && onSelectStock(s.topStockSymbol)}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                    >
                      {s.topStockSymbol ? `${s.topStockSymbol} (+${s.topStockGain}%)` : 'N/A'} <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="flex justify-between"><span className="text-slate-400">Momentum:</span> <span className="text-cyan-300">{s.momentum}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Relative Stance:</span> <span className="text-slate-200">{s.relativeStrengthVsNepse}</span></div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Tab 3: Institutional Activity */}
      {activeTab === 'institutional' && (
        <GlassCard className="p-4 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Mutual Fund & Institutional Turnover Breakdown (Rs. Crores)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 bg-slate-950/40">
                  <th className="p-3">Date</th>
                  <th className="p-3">Foreign Gross / Net</th>
                  <th className="p-3">Domestic Inst. Gross / Net</th>
                  <th className="p-3">Total Net Institutional Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {institutionalFlows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3 font-bold text-white">{row.date}</td>
                    <td className={`p-3 font-bold ${row.foreignNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.foreignNet >= 0 ? '+' : ''}Rs. {row.foreignNet} Cr
                    </td>
                    <td className={`p-3 font-bold ${row.institutionalNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.institutionalNet >= 0 ? '+' : ''}Rs. {row.institutionalNet} Cr
                    </td>
                    <td className="p-3 font-black text-cyan-300">Rs. {row.totalNet} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 4: NRB Macro */}
      {activeTab === 'macro' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {macro.map((m, idx) => (
              <GlassCard key={idx} className="p-4 space-y-2">
                <span className="text-xs font-bold text-slate-400 font-mono block">{m.name}</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-white font-mono">{m.currentValue}</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">{m.changeDirection}</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed border-t border-white/5 pt-2 flex justify-between font-mono">
                  <span>Previous: {m.previousValue}</span>
                  <span className="text-cyan-400">{m.source}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {m.relevanceExplanation}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
