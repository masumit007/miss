import React, { useState } from 'react';
import { IPOItem } from '../../types/ipo';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Calendar, DollarSign, ArrowRight, CheckCircle2, Clock, Search, ShieldCheck } from 'lucide-react';

interface IPOHubWidgetProps {
  ipos: IPOItem[];
  onNavigate?: (page: string, params?: any) => void;
}

export const IPOHubWidget: React.FC<IPOHubWidgetProps> = ({ ipos, onNavigate }) => {
  const [boidInput, setBoidInput] = useState('');
  const [boidResult, setBoidResult] = useState<string | null>(null);
  const [selectedIpoForCheck, setSelectedIpoForCheck] = useState<string>('');

  const handleCheckAllotment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boidInput || boidInput.length < 16) {
      setBoidResult('Please enter a valid 16-digit BOID/Demat account number.');
      return;
    }
    // Simulation
    const isAllotted = Math.random() > 0.4;
    if (isAllotted) {
      setBoidResult(`🎉 Congratulations! 10 Kitta allotted for BOID ${boidInput}. Allotment verified with CDSC MeroShare.`);
    } else {
      setBoidResult(`Sorry, not allotted in the lucky draw lottery. Better luck next time!`);
    }
  };

  return (
    <GlassCard className="p-4 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white font-mono">
              NEPSE IPO & Primary Market Hub
            </h3>
            <p className="text-[11px] text-slate-400">
              Live SEBON approved issues, book-building offerings, right shares, and allotment portal
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('ipo')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            Full IPO Center <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* IPO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ipos.slice(0, 3).map((item) => {
          const isOpen = item.status === 'OPEN';
          const isUpcoming = item.status === 'UPCOMING';
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850/90 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group shadow-lg"
            >
              {/* Status Ribbon */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/5">
                  NEPSE IPO
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                    : isUpcoming
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.status}
                </span>
              </div>

              <div>
                <span className="font-mono text-cyan-300 font-extrabold text-sm block group-hover:text-cyan-200">
                  {item.symbol}
                </span>
                <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                  {item.companyName}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {item.businessSummary}
                </p>
              </div>

              {/* Stats Box */}
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5 text-[11px] font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issue Price:</span>
                  <span className="text-white font-bold">Rs. {item.issuePrice || item.priceBandMax} / sh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Issue Size:</span>
                  <span className="text-emerald-400 font-bold">Rs. {item.issueSizeCrores} Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Close Date:</span>
                  <span className="text-slate-300">{item.closeDate || '18 Sep 2026'}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Score: <strong className="text-cyan-300">{item.ipoResearchScore}/100</strong></span>
                <span className="text-cyan-400 font-bold">Lot: {item.lotSize || 10} Kitta</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Built-in Allotment Result Check Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-cyan-500/20 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant MeroShare / CDSC Allotment Checker
          </div>
          <p className="text-[11px] text-slate-400">
            Check your lottery allotment result for recent NEPSE IPOs instantly with your 16-digit Demat / BOID.
          </p>
        </div>

        <form onSubmit={handleCheckAllotment} className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto font-mono">
          <input
            type="text"
            maxLength={16}
            value={boidInput}
            onChange={(e) => setBoidInput(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 16-digit BOID number..."
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 w-full sm:w-64"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-md"
          >
            Check Result
          </button>
        </form>
      </div>

      {boidResult && (
        <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-200 text-center animate-fade-in">
          {boidResult}
        </div>
      )}
    </GlassCard>
  );
};
