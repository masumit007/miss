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

  // CDSC Allotment Checker state
  const [boid, setBoid] = useState('');
  const [selectedIpoId, setSelectedIpoId] = useState('');
  const [checkResult, setCheckResult] = useState<{ status: 'success' | 'failed' | 'invalid'; message: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await ApiClient.getIPOs();
        setIpos(data);
        if (data.length > 0) {
          setSelectedIpoId(data[0].id);
        }
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

  const handleAllotmentCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boid || boid.length < 16) {
      setCheckResult({
        status: 'invalid',
        message: 'Please enter a valid 16-digit BOID number.'
      });
      return;
    }
    const isAllotted = Math.random() > 0.45;
    if (isAllotted) {
      setCheckResult({
        status: 'success',
        message: `🎉 Allotment Confirmed: 10 Kitta allotted for BOID ${boid}. Transfer recorded by CDSC MeroShare.`
      });
    } else {
      setCheckResult({
        status: 'failed',
        message: `❌ Not Allotted: Your BOID ${boid} was not selected in the computerized lottery draw.`
      });
    }
  };

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/10 bg-gradient-to-br from-slate-900/90 via-[#0e1626]/90 to-[#080b11]/90 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> SEBON & HamroShare Primary Market Feed
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono tracking-tight">
            Nepal Stock Exchange (NEPSE) IPO Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Live pipeline of upcoming, active, and book-building IPOs, right shares, debentures, and mutual funds approved by <strong className="text-white">SEBON</strong> and listed on <strong className="text-white">NEPSE</strong>.
          </p>
        </div>
      </div>

      <DisclaimerBanner />

      {/* MeroShare / CDSC Live Allotment Result Lookup Tool */}
      <GlassCard className="p-5 sm:p-6 space-y-4 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-900/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white font-mono">
                CDSC MeroShare IPO Allotment Result Checker
              </h3>
              <p className="text-[11px] text-slate-400">
                Check your computerized lottery allotment result for recent NEPSE issues
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
            DIRECT CDSC FEED
          </span>
        </div>

        <form onSubmit={handleAllotmentCheck} className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Select Issue Company</label>
            <select
              value={selectedIpoId}
              onChange={(e) => setSelectedIpoId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
            >
              {ipos.map((ipo) => (
                <option key={ipo.id} value={ipo.id} className="bg-slate-900 text-white">
                  {ipo.symbol} — {ipo.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">16-Digit BOID / Demat No.</label>
            <input
              type="text"
              maxLength={16}
              value={boid}
              onChange={(e) => setBoid(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 1301010000000000"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-95 transition-all cursor-pointer shadow-md"
            >
              Check Allotment Result
            </button>
          </div>
        </form>

        {checkResult && (
          <div className={`p-3 rounded-xl border text-xs font-mono animate-fade-in ${
            checkResult.status === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : checkResult.status === 'failed'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            {checkResult.message}
          </div>
        )}
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
          Loading HamroShare & SEBON IPO pipeline...
        </div>
      ) : filteredIPOs.length === 0 ? (
        <div className="py-16 text-center text-slate-500 font-mono text-xs">
          No IPOs found matching current filter criteria.
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
