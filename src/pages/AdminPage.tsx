import React, { useState } from 'react';
import { SettingsStore } from '../services/storage/settingsStore';
import { SystemConfiguration } from '../types/admin';
import { GlassCard } from '../components/common/GlassCard';
import { Settings, Save, Check } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [config, setConfig] = useState<SystemConfiguration>(SettingsStore.getSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SettingsStore.saveSettings(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" /> Platform Admin Panel (NEPSE)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure HamroShare scraper settings, scoring model weights, quantitative technical thresholds, and developer eSewa QR.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved Configuration!' : 'Save System Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scoring Engine Weights Configuration */}
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white font-mono">Multi-Factor Scoring Engine Weights (%)</h2>
            <span className="text-xs font-mono text-cyan-300">
              Total: {Object.values(config.scoringWeights).reduce((a, b) => a + b, 0)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">Fundamentals (%)</label>
              <input
                type="number"
                value={config.scoringWeights.fundamentals}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, fundamentals: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Technicals (%)</label>
              <input
                type="number"
                value={config.scoringWeights.technicals}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, technicals: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Growth & Quality (%)</label>
              <input
                type="number"
                value={config.scoringWeights.growth}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, growth: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Valuation (%)</label>
              <input
                type="number"
                value={config.scoringWeights.valuation}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, valuation: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Smart Money (%)</label>
              <input
                type="number"
                value={config.scoringWeights.smartMoney}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, smartMoney: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Risk Profile (%)</label>
              <input
                type="number"
                value={config.scoringWeights.risk}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, risk: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">News / Sentiment (%)</label>
              <input
                type="number"
                value={config.scoringWeights.newsSentiment}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, newsSentiment: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Macro / Sector (%)</label>
              <input
                type="number"
                value={config.scoringWeights.macroSector}
                onChange={(e) => setConfig({ ...config, scoringWeights: { ...config.scoringWeights, macroSector: parseInt(e.target.value) || 0 } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
          </div>
        </GlassCard>

        {/* Developer Contribution Settings */}
        <GlassCard className="space-y-4">
          <h2 className="text-sm font-bold text-white font-mono border-b border-white/10 pb-3">
            Developer Contribution eSewa Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-mono">eSewa Mobile ID</label>
              <input
                type="text"
                value={config.developerContribution.upiId}
                onChange={(e) => setConfig({ ...config, developerContribution: { ...config.developerContribution, upiId: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-mono">Account Holder Name</label>
              <input
                type="text"
                value={config.developerContribution.accountHolderName}
                onChange={(e) => setConfig({ ...config, developerContribution: { ...config.developerContribution, accountHolderName: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none font-mono"
              />
            </div>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};
