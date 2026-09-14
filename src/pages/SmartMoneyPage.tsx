import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { ScreenerResultItem } from '../types/screeners';
import { GlassCard } from '../components/common/GlassCard';
import { SignalBadge } from '../components/common/SignalBadge';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Coins, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';

export const SmartMoneyPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [items, setItems] = useState<ScreenerResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await ApiClient.runScreener('smart_money_accumulation');
      setItems(res);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Coins className="w-6 h-6 text-cyan-400" /> MISS Smart Money Radar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking institutional ownership changes, foreign & domestic institutional quarterly net flows, bulk & block deals, and positional delivery absorption.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      <GlassCard className="overflow-x-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Institutional Accumulation Candidates ({items.length} Securities)
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">Tracking institutional transactions...</div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            Smart Money data unavailable from configured sources.
            <div className="text-[10px] text-slate-500 mt-2 max-w-md mx-auto">
              MISS does not have a real NEPSE shareholding-disclosure source wired up yet, so institutional ownership figures cannot be shown. This is not a bug — real filed data is required before this page can display anything, and MISS never substitutes estimated or generic values.
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-3">Symbol</th>
                <th className="p-3">Price</th>
                <th className="p-3">Foreign Holding</th>
                <th className="p-3">Foreign QoQ</th>
                <th className="p-3">Domestic Inst. Holding</th>
                <th className="p-3">Domestic Inst. QoQ</th>
                <th className="p-3">Promoter Pledge</th>
                <th className="p-3">Delivery %</th>
                <th className="p-3">Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((it) => (
                <tr 
                  key={it.quote.symbol}
                  onClick={() => onSelectStock(it.quote.symbol)}
                  className="hover:bg-slate-900/60 cursor-pointer"
                >
                  <td className="p-3">
                    <span className="font-bold text-cyan-300 block">{it.quote.symbol}</span>
                    <span className="text-[10px] text-slate-400 font-sans block line-clamp-1">{it.quote.name}</span>
                  </td>
                  <td className="p-3 font-bold text-white">Rs. {it.quote.currentPrice}</td>
                  <td className="p-3 font-bold text-white">{it.smartMoney ? `${it.smartMoney.latestForeignHolding}%` : 'N/A'}</td>
                  <td className={`p-3 font-bold ${it.smartMoney && it.smartMoney.foreignChangeQoQ >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{it.smartMoney ? `${it.smartMoney.foreignChangeQoQ > 0 ? '+' : ''}${it.smartMoney.foreignChangeQoQ}%` : 'N/A'}</td>
                  <td className="p-3 font-bold text-white">{it.smartMoney ? `${it.smartMoney.latestInstitutionalHolding}%` : 'N/A'}</td>
                  <td className={`p-3 font-bold ${it.smartMoney && it.smartMoney.institutionalChangeQoQ >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{it.smartMoney ? `${it.smartMoney.institutionalChangeQoQ > 0 ? '+' : ''}${it.smartMoney.institutionalChangeQoQ}%` : 'N/A'}</td>
                  <td className="p-3 font-bold text-white">{it.smartMoney ? `${it.smartMoney.latestPromoterPledged}%` : 'N/A'}</td>
                  <td className="p-3 font-bold text-cyan-300">{it.quote.deliveryPercentage !== null && it.quote.deliveryPercentage !== undefined ? `${it.quote.deliveryPercentage}%` : 'N/A'}</td>
                  <td className="p-3">
                    {it.smartMoney ? <SignalBadge signal={it.smartMoney.smartMoneyClassification} size="sm" /> : <span className="text-slate-500">N/A</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
};
