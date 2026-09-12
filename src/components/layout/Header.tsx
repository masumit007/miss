import React, { useState, useEffect } from 'react';
import { Search, Bell, Sparkles, Menu, Activity, ShieldCheck } from 'lucide-react';
import { MarketStatusType } from '../../types/stock';
import { LiveTickerRibbon } from '../common/LiveTickerRibbon';

interface HeaderProps {
  marketStatus: MarketStatusType;
  onOpenSearch: () => void;
  onNavigate: (page: string, params?: any) => void;
  activePage: string;
  onToggleMobileMenu: () => void;
  onSelectStock?: (symbol: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  marketStatus,
  onOpenSearch,
  onNavigate,
  activePage,
  onToggleMobileMenu,
  onSelectStock
}) => {
  const [timeNPT, setTimeNPT] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeNPT(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isOpen = marketStatus === 'OPEN';

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Real-time Ticker Ribbon */}
      <LiveTickerRibbon onSelectStock={onSelectStock} onNavigate={onNavigate} />

      <header className="w-full backdrop-blur-xl bg-[#080b11]/90 border-b border-white/10 px-4 sm:px-6 py-2.5 transition-all">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-800 lg:hidden text-slate-300"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-400 to-emerald-400 flex items-center justify-center font-extrabold text-slate-950 font-mono shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white font-mono">MISS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                  NEPSE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Live HamroShare & NEPSE Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar Trigger */}
        <div className="flex-1 max-w-xl hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-white/10 text-slate-400 text-xs transition-all shadow-inner hover:border-cyan-500/30 group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="font-sans">Search 504+ NEPSE stocks (NABIL, UPPER, CHCL, ULBSL)...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Controls: Market Status, AI Assistant, Alerts */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 md:hidden"
            aria-label="Search Securities"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Market Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono">
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="font-bold text-slate-200">
              NEPSE: {isOpen ? 'OPEN' : 'CLOSED'}
            </span>
            <span className="text-[11px] text-slate-400">
              {timeNPT || '11:00'} NPT
            </span>
          </div>

          {/* AI Stock Analyst Shortcut */}
          <button
            onClick={() => onNavigate('ai_analyst')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
              activePage === 'ai_analyst'
                ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/25'
                : 'bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MISS AI</span>
          </button>

          {/* Alerts Shortcut */}
          <button
            onClick={() => onNavigate('alerts')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="View Alerts"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
      </header>
    </div>
  );
};
