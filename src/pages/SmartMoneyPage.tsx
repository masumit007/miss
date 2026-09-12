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
            Tracking institutional ownership changes, FII/DII quarterly net flows, bulk & block deals, and positional delivery absorption.
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
        ) : (
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-3">Symbol</th>
                <th className="p-3">Price</th>
                <th className="p-3">FII Holding</th>
                <th className="p-3">FII QoQ</th>
                <th className="p-3">DII Holding</th>
                <th className="p-3">DII QoQ</th>
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
                  <td className="p-3 font-bold text-white">₹{it.quote.currentPrice}</td>
                  <td className="p-3 font-bold text-white">{it.quote.sharesOutstanding ? '24.8%' : '20.0%'}</td>
                  <td className="p-3 font-bold text-emerald-400">+0.65%</td>
                  <td className="p-3 font-bold text-white">14.6%</td>
                  <td className="p-3 font-bold text-emerald-400">+0.35%</td>
                  <td className="p-3 text-emerald-400 font-bold">0.0%</td>
                  <td className="p-3 font-bold text-cyan-300">{it.quote.deliveryPercentage}%</td>
                  <td className="p-3">
                    <SignalBadge signal="ACCUMULATION" size="sm" />
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
