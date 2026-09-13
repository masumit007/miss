import React from 'react';
import { SmartMoneyAnalysis } from '../../types/smartMoney';
import { GlassCard } from '../common/GlassCard';
import { MetricCard } from '../common/MetricCard';
import { SignalBadge } from '../common/SignalBadge';
import { Coins } from 'lucide-react';

export const StockSmartMoneyTab: React.FC<{ smartMoney: SmartMoneyAnalysis }> = ({ smartMoney }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Smart Money Classification" value={smartMoney.smartMoneyClassification} highlight />
        <MetricCard label="Foreign Investor Holding" value={`${smartMoney.latestForeignHolding}%`} change={smartMoney.foreignChangeQoQ} changeLabel="QoQ" />
        <MetricCard label="Domestic Institutional Holding" value={`${smartMoney.latestInstitutionalHolding}%`} change={smartMoney.institutionalChangeQoQ} changeLabel="QoQ" />
        <MetricCard label="Promoter Pledged" value={`${smartMoney.latestPromoterPledged}%`} subValue="Zero Pledge Risk" />
      </div>

      {/* Evidence & Institutional Activity */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Coins className="w-4 h-4 text-cyan-400" /> Institutional Accumulation Signals
          </h3>
          <SignalBadge signal={smartMoney.smartMoneyClassification} size="sm" />
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          {smartMoney.evidence.map((ev, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-slate-900/50 p-3 rounded-xl border border-white/5">
              <span className="text-cyan-400 font-bold">•</span>
              <span>{ev}</span>
            </li>
          ))}
        </ul>

        {/* Recent Bulk / Block Deals */}
        <div className="pt-3 border-t border-white/10">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block mb-2">
            Recent Significant Bulk & Block Transactions
          </span>
          <div className="space-y-2">
            {smartMoney.recentDeals.map((deal, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-white font-mono">{deal.clientName}</span>
                  <span className="text-slate-400 block text-[11px]">Date: {deal.date} • Type: {deal.dealType}</span>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold ${deal.transactionType === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {deal.transactionType} Rs. {deal.valueCrores} Cr
                  </span>
                  <span className="text-slate-400 block text-[11px] font-mono">@ Rs. {deal.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
