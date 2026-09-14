import React, { useState, useEffect, useMemo } from 'react';
import { ApiClient } from '../services/api/client';
import { IPOItem } from '../types/ipo';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { 
  Layers, 
  Sparkles, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  Filter, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Users,
  Award
} from 'lucide-react';

export const IPOPage: React.FC = () => {
  const [ipos, setIpos] = useState<IPOItem[]>([]);
  const [activeType, setActiveType] = useState<'ALL' | 'IPO' | 'RIGHT' | 'DEBENTURE' | 'MUTUAL_FUND'>('ALL');
  const [activeStatus, setActiveStatus] = useState<'ALL' | 'OPEN' | 'UPCOMING' | 'CLOSED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiClient.getIPOs();
        setIpos(data);
      } catch (e) {
        console.error('Failed to load IPO data:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredIPOs = useMemo(() => {
    return ipos.filter((ipo) => {
      const matchesStatus = activeStatus === 'ALL' || ipo.status === activeStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || ipo.companyName.toLowerCase().includes(q) || ipo.symbol.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [ipos, activeStatus, searchQuery]);

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#0e1626]/90 to-[#080b11]/90 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> IPO / Rights / Debenture Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono tracking-tight">
            Nepal Stock Exchange (NEPSE) IPO Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Tracks upcoming, active, and book-building IPOs, right shares, debentures, and mutual funds on <strong className="text-white">NEPSE</strong>. MISS shows this data only when a real, verified source is connected — see the note below if the list is empty.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* MeroShare / CDSC Official Allotment Verification — MISS does not
          have a real, legitimate connection to CDSC's allotment system, so
          it never simulates or predicts a result. Users are sent to the
          actual official tool instead. */}
      <GlassCard className="p-5 sm:p-6 space-y-4 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white font-mono">
                IPO Allotment Result Checker
              </h3>
              <p className="text-[11px] text-slate-400">
                MISS is not connected to CDSC's allotment system — verify your result on the official site below.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
            NOT AVAILABLE IN MISS
          </span>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60 text-xs font-mono text-slate-300 leading-relaxed">
          MISS does not have a verified, legitimate connection to CDSC's allotment lottery system, so it cannot check or predict your allotment result. Please verify directly through the official source:
        </div>

        <a
          href="https://meroshare.cdsc.com.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md"
        >
          Check on Official CDSC MeroShare <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </GlassCard>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type & Status Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            {(['ALL', 'IPO', 'RIGHT', 'DEBENTURE'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeType === t
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'All Issues' : t === 'IPO' ? 'Equity IPO' : t === 'RIGHT' ? 'Right Shares' : 'Debentures'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/10">
            {(['ALL', 'OPEN', 'UPCOMING', 'CLOSED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeStatus === s
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IPO company..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* IPO Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 font-mono text-xs">
          Loading IPO data...
        </div>
      ) : filteredIPOs.length === 0 ? (
        <div className="py-16 text-center text-slate-500 font-mono text-xs max-w-md mx-auto">
          {ipos.length === 0
            ? 'No real IPO/rights/debenture data source is connected yet — NOT IMPLEMENTABLE WITH CURRENT VERIFIED SOURCES. This list will populate once a legitimate SEBON/NEPSE primary-market source is integrated.'
            : 'No IPOs found matching current filter criteria.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIPOs.map((ipo) => {
            const isOpen = ipo.status === 'OPEN';
            const isUpcoming = ipo.status === 'UPCOMING';
            return (
              <GlassCard
                key={ipo.id}
                className="p-5 space-y-4 hover:border-cyan-500/30 transition-all flex flex-col justify-between shadow-xl group"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="font-extrabold text-cyan-300 font-mono text-base block group-hover:text-cyan-200 transition-colors">
                        {ipo.symbol}
                      </span>
                      <h3 className="font-bold text-white text-xs mt-0.5 line-clamp-1">{ipo.companyName}</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider ${
                      isOpen
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                        : isUpcoming
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ipo.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    <span>Exchange: <strong className="text-cyan-300">NEPSE</strong></span> • <span>Price Band: <strong className="text-white">Rs. {ipo.priceBandMin} - {ipo.priceBandMax}</strong></span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Issue Price:</span>
                    <strong className="text-white">Rs. {ipo.issuePrice || ipo.priceBandMax} / sh</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Issue Size:</span>
                    <strong className="text-emerald-400">Rs. {ipo.issueSizeCrores} Cr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lot Size (Min Units):</span>
                    <strong className="text-slate-200">{ipo.lotSize || 10} Kitta</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subscription Period:</span>
                    <strong className="text-cyan-300">{ipo.openDate} – {ipo.closeDate}</strong>
                  </div>
                  {ipo.subscription.overall > 0 && (
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-slate-400">Subscription Level:</span>
                      <strong className="text-emerald-400">{ipo.subscription.overall}x Overbooked</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">MISS AI Score:</span>
                    <strong className="text-cyan-300">{ipo.ipoResearchScore}/100</strong>
                  </div>
                </div>

                {/* Business summary */}
                <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <span className="font-bold text-slate-300 block">Summary:</span>
                  <p className="line-clamp-2 leading-relaxed">{ipo.businessSummary}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
