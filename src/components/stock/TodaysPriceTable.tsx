import React, { useState, useMemo } from 'react';
import { StockQuote } from '../../types/stock';
import { GlassCard } from '../common/GlassCard';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface TodaysPriceTableProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
}

export const TodaysPriceTable: React.FC<TodaysPriceTableProps> = ({ stocks, onSelectStock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume' | 'pe' | 'turnover'>('turnover');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map((s) => s.sector))).filter(Boolean);
    return ['All', ...list];
  }, [stocks]);

  const filteredAndSortedStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        return matchesSector && matchesSearch;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'symbol') diff = a.symbol.localeCompare(b.symbol);
        else if (sortBy === 'price') diff = a.currentPrice - b.currentPrice;
        else if (sortBy === 'change') diff = a.dayChangePercent - b.dayChangePercent;
        else if (sortBy === 'volume') diff = a.volume - b.volume;
        else if (sortBy === 'pe') diff = (a.beta || 0) - (b.beta || 0);
        else {
          // default turnover
          diff = (a.currentPrice * a.volume) - (b.currentPrice * b.volume);
        }
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [stocks, selectedSector, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedStocks.length / itemsPerPage) || 1;
  const paginatedStocks = filteredAndSortedStocks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <GlassCard className="p-4 sm:p-6 space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-base sm:text-lg font-extrabold text-white font-mono">
              Today's Live Prices & Market Floor
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time live prices, 52-week ranges, and valuation across all 504+ listed NEPSE securities
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Filter by symbol, bank, hydro, microfinance..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-white/15 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>
      </div>

      {/* Sector Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-mono">
        <span className="text-slate-500 flex items-center gap-1 mr-1 text-[11px]">
          <Filter className="w-3 h-3" /> Sector:
        </span>
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => {
              setSelectedSector(sec);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all cursor-pointer font-semibold ${
              selectedSector === sec
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Live Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/5 bg-slate-950/40">
              <th className="py-2.5 px-3 cursor-pointer select-none" onClick={() => toggleSort('symbol')}>
                <div className="flex items-center gap-1">
                  Symbol {sortBy === 'symbol' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                </div>
              </th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => toggleSort('price')}>
                <div className="flex items-center justify-end gap-1">
                  LTP (NPR) {sortBy === 'price' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right cursor-pointer select-none" onClick={() => toggleSort('change')}>
                <div className="flex items-center justify-end gap-1">
                  Change % {sortBy === 'change' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell">52-Week Range</th>
              <th className="py-2.5 px-3 text-right cursor-pointer select-none hidden sm:table-cell" onClick={() => toggleSort('volume')}>
                <div className="flex items-center justify-end gap-1">
                  Volume {sortBy === 'volume' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right hidden lg:table-cell">Turnover (Rs. Cr)</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedStocks.map((stock) => {
              const isPos = stock.dayChange >= 0;
              const turnoverCr = ((stock.currentPrice * stock.volume) / 10000000).toFixed(2);
              
              // 52W range progress
              const low = stock.fiftyTwoWeekLow || (stock.currentPrice * 0.7);
              const high = stock.fiftyTwoWeekHigh || (stock.currentPrice * 1.3);
              const rangePct = Math.max(0, Math.min(100, ((stock.currentPrice - low) / (high - low || 1)) * 100));

              return (
                <tr
                  key={stock.symbol}
                  onClick={() => onSelectStock(stock.symbol)}
                  className="hover:bg-cyan-500/5 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-white text-xs group-hover:text-cyan-400 transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans truncate max-w-[200px]">
                      {stock.name}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-white/5">
                      {stock.sector}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-black text-white">
                    Rs. {stock.currentPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg font-bold text-[11px] ${
                      isPos
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isPos ? '+' : ''}{stock.dayChangePercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 hidden md:table-cell">
                    <div className="w-32 mx-auto space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>{low}</span>
                        <span>{high}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${rangePct}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 hidden sm:table-cell">
                    {stock.volume.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400 font-medium hidden lg:table-cell">
                    Rs. {turnoverCr} Cr
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStock(stock.symbol);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> Analyze
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
        <div>
          Showing {paginatedStocks.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} -{' '}
          {Math.min(page * itemsPerPage, filteredAndSortedStocks.length)} of {filteredAndSortedStocks.length} listed securities
        </div>

        <div className="flex items-center gap-2 self-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-white font-bold">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors cursor-pointer text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
