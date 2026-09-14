import React from 'react';
import { FloorsheetAnalysis } from '../../types/broker';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { Landmark } from 'lucide-react';

export const StockBrokerTab: React.FC<{ floorsheet: FloorsheetAnalysis | null }> = ({ floorsheet }) => {
  if (!floorsheet || floorsheet.transactionsAnalyzed === 0) {
    return (
      <GlassCard className="py-12 text-center space-y-2">
        <p className="text-slate-400 font-mono text-xs max-w-md mx-auto">
          Broker/floorsheet data unavailable from configured sources.
        </p>
        <p className="text-slate-500 font-mono text-[10px] max-w-md mx-auto">
          This reflects the real NEPSE floorsheet — if there were no recent trades in the analyzed window, or the source didn't return data, MISS shows this honestly rather than inventing broker activity.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Signal" value={floorsheet.signal} highlight />
        <MetricCard label="Transactions Analyzed" value={`${floorsheet.transactionsAnalyzed}`} subValue="Real floorsheet rows" />
        <MetricCard label="Total Value" value={`Rs. ${(floorsheet.totalValueNpr / 10000000).toFixed(2)} Cr`} />
        <MetricCard label="Top-3 Broker Concentration" value={`${floorsheet.top3BrokerConcentrationPercent}%`} />
      </div>

      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Landmark className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Broker Net Activity (Real Floorsheet)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-2">Broker</th>
                <th className="p-2">Buy Value</th>
                <th className="p-2">Sell Value</th>
                <th className="p-2">Net Value</th>
                <th className="p-2">Transactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {floorsheet.brokerActivity.slice(0, 15).map((b) => (
                <tr key={b.brokerId || b.brokerName}>
                  <td className="p-2 text-white font-bold">{b.brokerName}</td>
                  <td className="p-2 text-emerald-400">Rs. {(b.buyValueNpr / 100000).toFixed(1)}L</td>
                  <td className="p-2 text-rose-400">Rs. {(b.sellValueNpr / 100000).toFixed(1)}L</td>
                  <td className={`p-2 font-bold ${b.netValueNpr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.netValueNpr >= 0 ? '+' : ''}Rs. {(b.netValueNpr / 100000).toFixed(1)}L
                  </td>
                  <td className="p-2 text-slate-300">{b.transactionCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {floorsheet.largeTransactions.length > 0 && (
        <GlassCard className="space-y-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Large Transactions (Rs. 5 Lakh+)
          </h3>
          <div className="space-y-2">
            {floorsheet.largeTransactions.slice(0, 10).map((t, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-white font-bold">{t.buyerBrokerName}</span>
                  <span className="text-slate-500"> ← </span>
                  <span className="text-white font-bold">{t.sellerBrokerName}</span>
                  <span className="text-slate-400 block text-[11px]">{t.businessDate} {t.tradeTime}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-cyan-300">Rs. {(t.amountNpr / 100000).toFixed(1)}L</span>
                  <span className="text-slate-400 block text-[11px]">{t.quantity} @ Rs. {t.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <p className="text-[10px] text-slate-500 font-mono text-center">
        Broker identity is public NEPSE floorsheet data — this is broker-level activity, not individual investor identity.
      </p>
    </div>
  );
};
