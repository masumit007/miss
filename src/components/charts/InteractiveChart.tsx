import React, { useState } from 'react';
import { OHLCV } from '../../types/stock';
import { TradingViewWidget } from './TradingViewWidget';
import { Layers, BarChart2, Eye, EyeOff, Sparkles } from 'lucide-react';

interface InteractiveChartProps {
  symbol: string;
  candles: OHLCV[];
  currentPrice: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ symbol, candles, currentPrice }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y'>('1M');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [useTradingView, setUseTradingView] = useState(false);
  const [showSma50, setShowSma50] = useState(true);
  const [showSma200, setShowSma200] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const timeframes: ('1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y')[] = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y'];

  // Slice candles based on timeframe
  let visibleCandles = candles;
  if (timeframe === '1D') visibleCandles = candles.slice(-1);
  else if (timeframe === '5D') visibleCandles = candles.slice(-5);
  else if (timeframe === '1M') visibleCandles = candles.slice(-22);
  else if (timeframe === '3M') visibleCandles = candles.slice(-66);
  else if (timeframe === '6M') visibleCandles = candles.slice(-130);
  else visibleCandles = candles;

  if (visibleCandles.length === 0) visibleCandles = candles;

  const closes = visibleCandles.map(c => c.close);
  const highs = visibleCandles.map(c => c.high);
  const lows = visibleCandles.map(c => c.low);
  const volumes = visibleCandles.map(c => c.volume);

  const maxPrice = Math.max(...highs, currentPrice);
  const minPrice = Math.min(...lows, currentPrice);
  const priceRange = maxPrice - minPrice || 1;
  const maxVol = Math.max(...volumes) || 1;

  const activeCandle = hoverIndex !== null && visibleCandles[hoverIndex] 
    ? visibleCandles[hoverIndex] 
    : visibleCandles[visibleCandles.length - 1];

  const svgWidth = 800;
  const svgHeight = 360;
  const chartHeight = 260;
  const volumeHeight = 70;
  const paddingX = 40;

  const getX = (idx: number) => paddingX + (idx / Math.max(1, visibleCandles.length - 1)) * (svgWidth - 2 * paddingX);
  const getY = (val: number) => chartHeight - ((val - minPrice) / priceRange) * (chartHeight - 40) - 20;
  const getVolY = (vol: number) => svgHeight - (vol / maxVol) * volumeHeight;

  // Simple Moving Average paths
  const sma50Points = visibleCandles.map((_, idx) => {
    if (idx < 5) return null;
    const slice = visibleCandles.slice(Math.max(0, idx - 10), idx + 1);
    const avg = slice.reduce((a, b) => a + b.close, 0) / slice.length;
    return `${getX(idx)},${getY(avg)}`;
  }).filter(Boolean);

  const sma200Points = visibleCandles.map((_, idx) => {
    if (idx < 10) return null;
    const slice = visibleCandles.slice(Math.max(0, idx - 20), idx + 1);
    const avg = slice.reduce((a, b) => a + b.close, 0) / slice.length;
    return `${getX(idx)},${getY(avg)}`;
  }).filter(Boolean);

  return (
    <div className="w-full bg-[#0d131f] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
      {/* Chart Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5">
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                timeframe === tf 
                  ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChartType(chartType === 'candle' ? 'line' : 'candle')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 font-medium transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{chartType === 'candle' ? 'Candlesticks' : 'Line Chart'}</span>
          </button>

          <button
            onClick={() => setUseTradingView(!useTradingView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              useTradingView ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{useTradingView ? 'Native Chart' : 'TradingView TV'}</span>
          </button>
        </div>
      </div>

      {useTradingView ? (
        <TradingViewWidget symbol={symbol} height={440} />
      ) : (
        <div>
          {/* Active Hover Data Banner */}
          {activeCandle && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 mb-2 px-2">
              <span className="text-slate-400 font-medium">Date: <strong className="text-white">{activeCandle.time}</strong></span>
              <span>O: <strong className="text-slate-200">₹{activeCandle.open}</strong></span>
              <span>H: <strong className="text-emerald-400">₹{activeCandle.high}</strong></span>
              <span>L: <strong className="text-rose-400">₹{activeCandle.low}</strong></span>
              <span>C: <strong className={activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-rose-400'}>₹{activeCandle.close}</strong></span>
              <span>Vol: <strong className="text-cyan-400">{activeCandle.volume.toLocaleString('en-IN')}</strong></span>
              {activeCandle.deliveryPercent && (
                <span>Delivery: <strong className="text-amber-300">{activeCandle.deliveryPercent}%</strong></span>
              )}
            </div>
          )}

          {/* SVG Canvas Chart */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto min-h-[300px] select-none"
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Horizontal Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const p = minPrice + pct * priceRange;
                const y = getY(p);
                return (
                  <g key={idx}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                    <text x={svgWidth - paddingX + 5} y={y + 3} fill="#64748b" fontSize="10" fontFamily="monospace">
                      ₹{Math.round(p)}
                    </text>
                  </g>
                );
              })}

              {/* Volume Bars */}
              {visibleCandles.map((c, idx) => {
                const x = getX(idx);
                const y = getVolY(c.volume);
                const h = svgHeight - y;
                const isBullish = c.close >= c.open;
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - 2.5}
                    y={y}
                    width={5}
                    height={Math.max(2, h)}
                    fill={isBullish ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}
                  />
                );
              })}

              {/* Candlesticks or Line */}
              {chartType === 'candle' ? (
                visibleCandles.map((c, idx) => {
                  const x = getX(idx);
                  const isBull = c.close >= c.open;
                  const openY = getY(c.open);
                  const closeY = getY(c.close);
                  const highY = getY(c.high);
                  const lowY = getY(c.low);
                  const bodyY = Math.min(openY, closeY);
                  const bodyHeight = Math.max(2, Math.abs(closeY - openY));
                  const color = isBull ? '#10b981' : '#f43f5e';

                  return (
                    <g 
                      key={`candle-${idx}`} 
                      onMouseEnter={() => setHoverIndex(idx)}
                      className="cursor-crosshair"
                    >
                      {/* Wick */}
                      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth={1.5} />
                      {/* Body */}
                      <rect 
                        x={x - 3.5} 
                        y={bodyY} 
                        width={7} 
                        height={bodyHeight} 
                        fill={color} 
                        rx={1}
                      />
                    </g>
                  );
                })
              ) : (
                <path
                  d={`M ${visibleCandles.map((c, idx) => `${getX(idx)},${getY(c.close)}`).join(' L ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />
              )}

              {/* SMA Overlays */}
              {showSma50 && sma50Points.length > 0 && (
                <path
                  d={`M ${sma50Points.join(' L ')}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {showSma200 && sma200Points.length > 0 && (
                <path
                  d={`M ${sma200Points.join(' L ')}`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>

          {/* Overlays Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/5 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
                <input 
                  type="checkbox" 
                  checked={showSma50} 
                  onChange={(e) => setShowSma50(e.target.checked)} 
                  className="rounded bg-slate-900 border-white/10 text-amber-500"
                />
                <span>SMA 50 (Yellow)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-purple-400">
                <input 
                  type="checkbox" 
                  checked={showSma200} 
                  onChange={(e) => setShowSma200(e.target.checked)} 
                  className="rounded bg-slate-900 border-white/10 text-purple-500"
                />
                <span>SMA 200 (Purple)</span>
              </label>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              Showing {visibleCandles.length} OHLCV Daily Sessions
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
