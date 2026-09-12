import React from 'react';
import { NewsArticle } from '../../types/news';
import { QuarterlyResult } from '../../types/stock';
import { GlassCard } from '../common/GlassCard';
import { Newspaper, TrendingUp } from 'lucide-react';

export const StockNewsTab: React.FC<{ news: NewsArticle[] }> = ({ news }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-cyan-400" /> Company News & Official Disclosures
      </h3>

      {news.length === 0 ? (
        <GlassCard className="py-10 text-center text-xs text-slate-400">
          No recent news filings found for this security.
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {news.map((n) => (
            <GlassCard key={n.id} className="space-y-2 hover:border-cyan-500/20 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-cyan-400 font-bold">{n.source}</span>
                <span className="text-slate-400">{n.publishedTimeFormatted}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-100">{n.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{n.summary}</p>
              {n.sentimentReasoning && (
                <div className="text-[11px] text-emerald-400 bg-emerald-950/20 p-2 rounded-lg border border-emerald-500/20">
                  AI Sentiment Analysis: {n.sentimentReasoning}
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export const StockResultsTab: React.FC<{ results: QuarterlyResult[] }> = ({ results }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-cyan-400" /> Quarterly Earnings Results (NFRS Audited)
      </h3>

      <GlassCard className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse font-mono">
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th className="p-3">Period</th>
              <th className="p-3">Revenue (Rs. Cr)</th>
              <th className="p-3">Operating Profit</th>
              <th className="p-3">Net Profit</th>
              <th className="p-3">EPS (NPR)</th>
              <th className="p-3">Net Margin</th>
              <th className="p-3">Consensus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60">
                <td className="p-3 font-bold text-cyan-300">{r.period}</td>
                <td className="p-3 font-bold text-white">Rs. {r.revenue}</td>
                <td className="p-3">Rs. {r.operatingProfit}</td>
                <td className="p-3 font-bold text-emerald-400">Rs. {r.netProfit}</td>
                <td className="p-3 font-bold text-white">Rs. {r.eps}</td>
                <td className="p-3">{r.netMargin}%</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.beatMiss === 'Beat' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'}`}>
                    {r.beatMiss}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};
