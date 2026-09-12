import React from 'react';
import { StockQuote } from '../../types/stock';
import { MultiFactorScore } from '../../types/scoring';
import { FreshnessBadge } from '../common/FreshnessBadge';
import { 
  Bookmark, 
  BookmarkCheck, 
  Bell, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  FileText,
  Activity,
  Award,
  ShieldCheck
} from 'lucide-react';

interface StockHeaderProps {
  quote: StockQuote;
  score: MultiFactorScore;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onCompare: () => void;
  onAnalyzeWithAI: () => void;
  onSetAlert: () => void;
  onGenerateReport: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({
  quote,
  score,
  isInWatchlist,
  onToggleWatchlist,
  onCompare,
  onAnalyzeWithAI,
  onSetAlert,
  onGenerateReport
}) => {
  const isPositive = quote.dayChange >= 0;

  // 52W Range Progress
  const low52 = quote.fiftyTwoWeekLow || (quote.currentPrice * 0.7);
  const high52 = quote.fiftyTwoWeekHigh || (quote.currentPrice * 1.3);
  const rangePct = Math.max(0, Math.min(100, ((quote.currentPrice - low52) / (high52 - low52 || 1)) * 100));

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Metadata Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-cyan-400 font-bold">NEPSE</span>
          <span>/</span>
          <span className="text-slate-300">{quote.sector}</span>
          <span>/</span>
          <span className="text-white font-extrabold">{quote.symbol}</span>
        </div>

        <FreshnessBadge
          status={quote.freshness.status}
          timestamp={quote.freshness.formattedTime}
          source={quote.freshness.source}
          showDetails
        />
      </div>

      {/* Main Stock Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/95 via-[#0e1626]/90 to-[#080b11]/95 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: isPositive ? '#10b981' : '#f43f5e' }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Info: Name, Symbol, Sector, ISIN */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {quote.symbol}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold">
                NEPSE LISTED
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-semibold">
                {quote.sector}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-200">{quote.name}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
              <span>ISIN: <strong className="text-slate-300">{quote.isin}</strong></span>
              <span>•</span>
              <span>Face Value: <strong className="text-slate-300">Rs. {quote.faceValue}</strong></span>
              <span>•</span>
              <span>Market Cap: <strong className="text-emerald-400">Rs. {quote.marketCap} Cr</strong></span>
            </div>
          </div>

          {/* Center: 52-Week Range Mini Visualizer */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 space-y-1.5 font-mono text-xs w-full lg:w-64">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>52W Low: <strong className="text-slate-200">Rs. {low52}</strong></span>
              <span>52W High: <strong className="text-slate-200">Rs. {high52}</strong></span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden relative">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all" 
                style={{ width: `${rangePct}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 text-right">
              {rangePct.toFixed(0)}% of 52W range
            </div>
          </div>

          {/* Right: Live Price in NPR & Day Change */}
          <div className="flex flex-col lg:items-end space-y-1 font-mono">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Rs. {quote.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>

            <div className={`flex items-center gap-1.5 text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{quote.dayChange.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{quote.dayChangePercent.toFixed(2)}%)</span>
              <span className="text-xs text-slate-400 ml-1">Today</span>
            </div>

            <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-3">
              <span>Day Range: <strong className="text-slate-200">Rs. {quote.dayLow} - {quote.dayHigh}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Watchlist Toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
              isInWatchlist
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
            }`}
          >
            {isInWatchlist ? <BookmarkCheck className="w-4 h-4 text-cyan-400" /> : <Bookmark className="w-4 h-4" />}
            <span>{isInWatchlist ? 'In Watchlist' : '+ Add to Watchlist'}</span>
          </button>

          {/* Set Alert */}
          <button
            onClick={onSetAlert}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Set Alert</span>
          </button>

          {/* Compare Peers */}
          <button
            onClick={onCompare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Compare Peers</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Generate Research Report */}
          <button
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Research Report</span>
          </button>

          {/* Analyze with AI */}
          <button
            onClick={onAnalyzeWithAI}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-mono font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask MISS AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
