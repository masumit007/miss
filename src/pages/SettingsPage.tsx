import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { SlidersHorizontal, Moon, Sun, Monitor, Bell, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [defaultExchange, setDefaultExchange] = useState('NSE');
  const [defaultTimeframe, setDefaultTimeframe] = useState('1M');

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-cyan-400" /> Platform Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your default financial dashboard view, charts, and notification display settings.
        </p>
      </div>

      <GlassCard className="space-y-5">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-200 font-mono block">Visual Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer ${
                theme === 'dark' ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-900 text-slate-400 border-white/10'
              }`}
            >
              <Moon className="w-4 h-4 text-cyan-400" />
              <span>Dark Liquid Glass (Recommended)</span>
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer ${
                theme === 'light' ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-900 text-slate-400 border-white/10'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light High Contrast</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-white/10">
          <label className="text-xs font-bold text-slate-200 font-mono block">Default Primary Exchange</label>
          <div className="flex gap-3">
            {['NSE', 'BSE'].map((ex) => (
              <button
                key={ex}
                onClick={() => setDefaultExchange(ex)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border cursor-pointer ${
                  defaultExchange === ex ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-white/10">
          <label className="text-xs font-bold text-slate-200 font-mono block">Default Chart Timeframe</label>
          <div className="flex flex-wrap gap-2 font-mono">
            {['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setDefaultTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                  defaultTimeframe === tf ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-900 text-slate-400 border-white/10'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
