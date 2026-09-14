import React, { useState, useMemo } from 'react';
import { MarketIndex, MarketBreadth } from '../../types/market';
import { TrendingUp, TrendingDown, Clock, Activity, BarChart2 } from 'lucide-react';

interface NepseIndexHeroChartProps {
  nepseIndex?: MarketIndex;
  subIndices?: MarketIndex[];
  breadth?: MarketBreadth | null;
  loading?: boolean;
  onNavigate?: (page: string) => void;
}

export const NepseIndexHeroChart: React.FC<NepseIndexHeroChartProps> = ({
  nepseIndex,
  breadth,
  loading = false,
  onNavigate
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const isPositive = (nepseIndex?.change ?? 0) >= 0;
  const strokeColor = isPositive ? '#34d399' : '#f43f5e';
  const fillColor = isPositive ? 'rgba(52, 211, 153, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  // Only ever plot a REAL sparkline series if the source provided one.
  // MISS never fabricates a synthetic price curve — when there's no real
  // series, the chart area shows an honest "no chart data" state instead.
  const chartPoints = nepseIndex?.sparkline ?? null;

  const svgWidth = 800;
  const svgHeight = 220;
  const padding = 20;

  const svgPoints = useMemo(() => {
    if (!chartPoints || chartPoints.length < 2) return [];
    const minVal = Math.min(...chartPoints);
    const maxVal = Math.max(...chartPoints);
    const range = maxVal - minVal || 1;
    return chartPoints.map((val, idx) => {
      const x = padding + (idx / (chartPoints.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((val - minVal) / range) * (svgHeight - padding * 2);
      return { x, y, val };
    });
  }, [chartPoints]);

  const pathD = svgPoints.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[idx - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaD = svgPoints.length
    ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${svgHeight} L ${svgPoints[0].x} ${svgHeight} Z`
    : '';

  const hoveredPoint = hoverIndex !== null && svgPoints[hoverIndex] ? svgPoints[hoverIndex] : null;

  const fmt = (n: number | null | undefined, opts?: Intl.NumberFormatOptions) =>
    n === null || n === undefined ? 'N/A' : n.toLocaleString('en-NP', opts);

  const fmtCrores = (npr: number | null | undefined) =>
    npr === null || npr === undefined ? 'N/A' : `Rs. ${(npr / 10000000).toFixed(2)} Cr`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b101d]/90 via-[#0e172a]/80 to-[#080d18]/95 border border-white/10 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: isPositive ? '#10b981' : '#f43f5e' }}
      />

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-cyan-400" /> NEPSE Benchmark Index
            </span>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" /> {nepseIndex ? 'NEPSE Market Feed' : loading ? 'Loading…' : 'Unavailable'}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-mono tracking-tight">
              {loading
                ? '—'
                : hoveredPoint
                ? hoveredPoint.val.toLocaleString('en-NP', { minimumFractionDigits: 2 })
                : nepseIndex
                ? nepseIndex.currentValue.toLocaleString('en-NP', { minimumFractionDigits: 2 })
                : 'N/A'}
            </h1>
            {nepseIndex && (
              <div className={`flex items-center gap-1 text-sm sm:text-base font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span>{isPositive ? '+' : ''}{nepseIndex.change}</span>
                <span>({isPositive ? '+' : ''}{nepseIndex.percentChange}%)</span>
              </div>
            )}
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('markets')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer self-start md:self-auto hidden sm:flex items-center gap-1.5"
          >
            <BarChart2 className="w-3.5 h-3.5" /> Full Markets
          </button>
        )}
      </div>

      {/* Chart area */}
      <div className="relative mt-4 h-52 sm:h-56 w-full">
        {svgPoints.length > 1 ? (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            onMouseLeave={() => setHoverIndex(null)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
              const idx = Math.round(ratio * (svgPoints.length - 1));
              setHoverIndex(idx);
            }}
          >
            <defs>
              <linearGradient id="heroAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
                <stop offset="70%" stopColor={strokeColor} stopOpacity="0.05" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            <path d={areaD} fill="url(#heroAreaGradient)" />
            <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {hoveredPoint && (
              <>
                <line x1={hoveredPoint.x} y1={padding} x2={hoveredPoint.x} y2={svgHeight - padding} stroke="rgba(255,255,255,0.4)" strokeDasharray="2 2" />
                <circle cx={hoveredPoint.x} cy={hoveredPoint.y} r="5" fill={strokeColor} stroke="#fff" strokeWidth="2" />
              </>
            )}
          </svg>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 font-mono text-xs text-center px-6">
            {loading
              ? 'Loading index data…'
              : nepseIndex
              ? 'Chart data unavailable — no real historical index series has been sourced for this index yet.'
              : 'NEPSE index data unavailable.'}
          </div>
        )}
      </div>

      {/* Key Market Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 font-mono">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Turnover</span>
          <span className="text-sm sm:text-base font-black text-white">{fmtCrores(breadth?.totalTurnoverNpr)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">Total Traded Shares</span>
          <span className="text-sm sm:text-base font-black text-cyan-300">{fmt(breadth?.totalVolume)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">Day Range</span>
          <span className="text-sm sm:text-base font-bold text-slate-200">
            {nepseIndex ? `${fmt(nepseIndex.low)} - ${fmt(nepseIndex.high)}` : 'N/A'}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
          <span className="text-[10px] text-slate-400 uppercase block font-bold">52W Range</span>
          <span className="text-sm sm:text-base font-bold text-slate-200">
            {nepseIndex ? `${fmt(nepseIndex.yearlyLow)} - ${fmt(nepseIndex.yearlyHigh)}` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
