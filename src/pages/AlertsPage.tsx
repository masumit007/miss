import React, { useState, useEffect } from 'react';
import { AlertStore } from '../services/storage/alertStore';
import { AlertRule, AlertTriggerType } from '../types/alerts';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Bell, Plus, Trash2, Power } from 'lucide-react';

export const AlertsPage: React.FC<{ symbol?: string }> = ({ symbol = 'NABIL' }) => {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [alertSymbol, setAlertSymbol] = useState(symbol);
  const [triggerType, setTriggerType] = useState<AlertTriggerType>('PRICE_CROSS_ABOVE');
  const [threshold, setThreshold] = useState('580');
  const [message, setMessage] = useState('Notify when price crosses resistance level');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    setAlerts(AlertStore.getAlerts());
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    AlertStore.createAlert({
      symbol: alertSymbol.toUpperCase(),
      triggerType,
      thresholdValue: parseFloat(threshold) || undefined,
      message
    });
    setIsCreating(false);
    loadAlerts();
  };

  const handleToggle = (id: string) => {
    AlertStore.toggleAlert(id);
    loadAlerts();
  };

  const handleDelete = (id: string) => {
    AlertStore.deleteAlert(id);
    loadAlerts();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" /> MISS NEPSE Alerts Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Informational research alerts for price crossovers, breakout confirmations, RSI overbought/oversold, and corporate dividend filings.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Alert</span>
        </button>
      </div>

      <DisclaimerBanner />

      {/* Creation Modal / Inline */}
      {isCreating && (
        <GlassCard className="space-y-4">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Create Informational Alert</span>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Symbol</label>
              <input
                type="text"
                value={alertSymbol}
                onChange={(e) => setAlertSymbol(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Trigger Condition</label>
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              >
                <option value="PRICE_CROSS_ABOVE">Price Crosses Above</option>
                <option value="PRICE_CROSS_BELOW">Price Crosses Below</option>
                <option value="RSI_OVERBOUGHT">RSI Overbought (&gt;70)</option>
                <option value="RSI_OVERSOLD">RSI Oversold (&lt;30)</option>
                <option value="RESISTANCE_BREAKOUT">Resistance Breakout Detected</option>
                <option value="SUPPORT_BREAKDOWN">Support Breakdown Detected</option>
                <option value="GOLDEN_CROSS">Golden Cross (50 &gt; 200 SMA)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Threshold / Level (Rs.)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Alert Message</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono"
              >
                Save Alert Rule
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Alerts List */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Active & Triggered Alerts ({alerts.length})
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Informational Only • No Trades Executed</span>
        </div>

        {alerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm font-mono">
            No active alerts configured.
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-sm">{alt.symbol}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${alt.status === 'TRIGGERED' ? 'bg-amber-500/20 text-amber-300' : alt.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {alt.status}
                    </span>
                    {alt.thresholdValue && (
                      <span className="font-mono text-slate-400">Level: Rs. {alt.thresholdValue}</span>
                    )}
                  </div>
                  <p className="text-slate-300">{alt.message}</p>
                  {alt.lastTriggeredAt && (
                    <span className="text-[11px] text-amber-400 block font-mono">Triggered on: {alt.lastTriggeredAt}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(alt.id)}
                    className={`p-2 rounded-lg border transition-colors ${alt.status === 'ACTIVE' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-white/10 text-slate-400'}`}
                    title="Toggle Alert Status"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(alt.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
