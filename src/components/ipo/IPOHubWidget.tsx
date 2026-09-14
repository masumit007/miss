import React from 'react';
import { IPOItem } from '../../types/ipo';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';

interface IPOHubWidgetProps {
  ipos: IPOItem[];
  onNavigate?: (page: string, params?: any) => void;
}

export const IPOHubWidget: React.FC<IPOHubWidgetProps> = ({ ipos, onNavigate }) => {
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
              Book-building offerings, right shares, and IPO tracking
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
      {ipos.length === 0 ? (
        <div className="py-8 text-center text-slate-500 font-mono text-[11px]">
          No real IPO data source is connected yet.
        </div>
      ) : (
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
                  <span className="text-slate-300">{item.closeDate || 'N/A'}</span>
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
      )}

      {/* Allotment check — MISS has no real CDSC connection, so it links
          out to the official tool rather than simulating a result. */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-purple-950/40 border border-cyan-500/20 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> IPO Allotment Result
          </div>
          <p className="text-[11px] text-slate-400">
            MISS isn't connected to CDSC's allotment system — check your result on the official site.
          </p>
        </div>

        <a
          href="https://meroshare.cdsc.com.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap shadow-md"
        >
          Check on CDSC MeroShare <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </GlassCard>
  );
};
