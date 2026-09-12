import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { StockQuote } from '../types/stock';
import { FullTechnicalAnalysis } from '../types/technicals';
import { FullFundamentalAnalysis } from '../types/fundamentals';
import { SmartMoneyAnalysis } from '../types/smartMoney';
import { MultiFactorScore } from '../types/scoring';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Layers, Plus, X, ArrowRight, Sparkles } from 'lucide-react';

export const ComparePage: React.FC<{ initialSymbol?: string; onSelectStock: (symbol: string) => void }> = ({
  initialSymbol = 'NABIL',
  onSelectStock
}) => {
  const [symbols, setSymbols] = useState<string[]>([initialSymbol, 'GBIME', 'CHCL']);
  const [stocksData, setStocksData] = useState<Record<string, {
    quote: StockQuote;
    technicals: FullTechnicalAnalysis;
    fundamentals: FullFundamentalAnalysis;
    smartMoney: SmartMoneyAnalysis;
    score: MultiFactorScore;
  }>>({});
  const [searchSymbol, setSearchSymbol] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStocks();
  }, [symbols]);

  const loadAllStocks = async () => {
    setLoading(true);
    const dataMap: typeof stocksData = {};
    for (const sym of symbols) {
      const res = await ApiClient.getStockDetails(sym);
      if (res) dataMap[sym] = res;
    }
    setStocksData(dataMap);
    setLoading(false);
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = searchSymbol.toUpperCase().trim();
    if (sym && !symbols.includes(sym) && symbols.length < 5) {
      setSymbols([...symbols, sym]);
      setSearchSymbol('');
    }
  };

  const handleRemoveStock = (sym: string) => {
    if (symbols.length > 1) {
      setSymbols(symbols.filter(s => s !== sym));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" /> Peer Comparison Radar (NEPSE)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Side-by-side multi-dimensional comparative matrix across Valuation, Graham Number, ROE, Piotroski score, and Technicals.
          </p>
        </div>

        {/* Add Stock Input */}
        {symbols.length < 5 && (
          <form onSubmit={handleAddStock} className="flex gap-2">
            <input
              type="text"
              value={searchSymbol}
              onChange={(e) => setSearchSymbol(e.target.value)}
              placeholder="Add symbol (e.g. UPPER)..."
              className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer"
            >
              + Add
            </button>
          </form>
        )}
      </div>

      <DisclaimerBanner />

      {loading ? (
        <div className="py-12 text-center text-slate-400 font-mono text-xs">Computing comparative matrices...</div>
      ) : (
        <GlassCard className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="p-3 w-48">Metric / Dimension</th>
                {symbols.map((sym) => {
                  const s = stocksData[sym];
                  return (
                    <th key={sym} className="p-3 min-w-40 text-center">
                      <div className="flex items-center justify-between gap-1">
                        <button
                          onClick={() => onSelectStock(sym)}
                          className="font-bold text-cyan-300 hover:underline text-sm"
                        >
                          {sym}
                        </button>
                        {symbols.length > 1 && (
                          <button
                            onClick={() => handleRemoveStock(sym)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-sans block text-left line-clamp-1">
                        {s?.quote.name}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="p-3 font-semibold text-slate-300">Last Traded Price (NPR)</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center font-bold text-white">
                    Rs. {stocksData[sym]?.quote.currentPrice}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Sector</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center text-slate-300 font-sans">
                    {stocksData[sym]?.quote.sector}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Market Cap</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center font-bold text-cyan-300">
                    Rs. {((stocksData[sym]?.quote.marketCap || 0) / 100).toFixed(2)} Arb
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">P/E Multiple</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center font-bold text-white">
                    {stocksData[sym]?.fundamentals.valuation.pe}x
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Graham Number</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center font-bold text-emerald-400">
                    Rs. {stocksData[sym]?.fundamentals.graham.grahamNumber}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Return on Equity (ROE)</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center font-bold text-emerald-400">
                    {stocksData[sym]?.fundamentals.profitability.roe}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Piotroski Score</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center font-bold text-cyan-300">
                    {stocksData[sym]?.fundamentals.piotroski.score}/9
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">RSI 14 Momentum</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center">
                    {stocksData[sym]?.technicals.rsi.value} ({stocksData[sym]?.technicals.rsi.classification})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Overall Research Score</td>
                {symbols.map(sym => (
                  <td key={sym} className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                      {stocksData[sym]?.score.overallScore}/100
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
};
