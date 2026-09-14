import React, { useEffect, useState } from 'react';
import { ApiClient } from '../services/api/client';
import { MarketIndex, MarketBreadth, SectorPerformance, MacroIndicator } from '../types/market';
import { StockQuote } from '../types/stock';
import { IPOItem } from '../types/ipo';
import { NewsArticle } from '../types/news';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { NepseIndexHeroChart } from '../components/charts/NepseIndexHeroChart';
import { TopMoversTabs } from '../components/stock/TopMoversTabs';
import { TodaysPriceTable } from '../components/stock/TodaysPriceTable';
import { IPOHubWidget } from '../components/ipo/IPOHubWidget';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Zap,
  DollarSign,
  BarChart3,
  Award,
  Search,
  CheckCircle2,
  PieChart,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectStock: (symbol: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectStock }) => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [sectoralIndices, setSectoralIndices] = useState<MarketIndex[]>([]);
  const [breadth, setBreadth] = useState<MarketBreadth | null>(null);
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [allStocks, setAllStocks] = useState<StockQuote[]>([]);
  const [ipos, setIpos] = useState<IPOItem[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [macro, setMacro] = useState<MacroIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [overview, stocksList, ipoList, newsList] = await Promise.all([
          ApiClient.getMarketOverview(),
          ApiClient.getAllStocks(),
          ApiClient.getIPOs(),
          ApiClient.getMarketNews()
        ]);

        if (isMounted) {
          setIndices(overview.primaryIndices);
          setSectoralIndices(overview.sectoralIndices);
          setBreadth(overview.breadth);
          setSectors(overview.sectors);
          setMacro(overview.macro);
          setAllStocks(stocksList);
          setIpos(ipoList);
          setNews(newsList.slice(0, 4));
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* 1. Hero Market Command Center */}
      <NepseIndexHeroChart
        nepseIndex={indices[0]}
        subIndices={sectoralIndices}
        breadth={breadth}
        loading={loading && indices.length === 0}
        onNavigate={onNavigate}
      />

      <DisclaimerBanner />

      {/* 2. Key Sub-Indices Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Key Sectoral & Sub-Indices
          </h2>
          <button
            onClick={() => onNavigate('markets')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 group cursor-pointer"
          >
            All 13 Sectors <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {sectoralIndices.slice(0, 5).map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <GlassCard
                key={idx.symbol}
                className="p-3.5 space-y-1.5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                onClick={() => onNavigate('markets')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 font-mono group-hover:text-cyan-300 transition-colors truncate">
                    {idx.name}
                  </span>
                  <span className={`text-[11px] font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? '+' : ''}{idx.percentChange}%
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-white font-mono">
                  {idx.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>Pts: {isPos ? '+' : ''}{idx.change}</span>
                  <span className="text-cyan-400/80">NEPSE</span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* 3. Market Pulse & Macro Stats Row */}
      {breadth && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <GlassCard className="p-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              NEPSE Market Breadth
            </span>
            <div className="flex items-center justify-between font-mono">
              <span className="text-emerald-400 font-black text-lg">{breadth.advances} Advances</span>
              <span className="text-slate-500">•</span>
              <span className="text-rose-400 font-black text-lg">{breadth.declines} Declines</span>
            </div>
            <div className="w-full bg-rose-500/20 rounded-full h-2 overflow-hidden flex">
              <div 
                className="bg-emerald-400 h-full transition-all rounded-full" 
                style={{ width: `${(breadth.advances / ((breadth.advances + breadth.declines) || 1)) * 100}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono pt-0.5">
              <span>A/D Ratio: <strong className="text-slate-200">{breadth.advanceDeclineRatio}x</strong></span>
              <span><strong className="text-emerald-300">{breadth.newFiftyTwoWeekHighs}</strong> 52W Highs</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              Total Market Turnover
            </span>
            <div className="text-2xl font-black text-white font-mono">NPR 4.36 Arb</div>
            <p className="text-[11px] text-slate-400 leading-tight">
              1.21 Crore shares traded across 244 securities on Nepal Stock Exchange today.
            </p>
          </GlassCard>

          <GlassCard className="p-4 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider block">
              NRB Monetary Stance & Rates
            </span>
            <div className="text-lg font-bold text-slate-400 font-mono">Data unavailable</div>
            <p className="text-[11px] text-slate-400 leading-tight">
              No Nepal Rastra Bank monetary data feed is integrated yet.
            </p>
          </GlassCard>
        </div>
      )}

      {/* 4. HamroShare-Style Top Movers (Gainers, Losers, Turnover, Active, 52W Highs) */}
      <TopMoversTabs
        stocks={allStocks}
        onSelectStock={onSelectStock}
        onNavigate={onNavigate}
      />

      {/* 5. Sector Performance Heatmap */}
      <GlassCard className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-white font-mono">
              NEPSE Sector Performance & Momentum
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">1-Day Change</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sectors.map((sec) => {
            const isPos = (sec.oneDayChange ?? 0) >= 0;
            return (
              <div
                key={sec.name}
                onClick={() => onNavigate('markets')}
                className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 transition-all cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-300 group-hover:text-cyan-300 transition-colors truncate">
                    {sec.name}
                  </span>
                  <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sec.oneDayChange !== null ? `${isPos ? '+' : ''}${sec.oneDayChange}%` : 'N/A'}
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isPos ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${Math.min(100, Math.abs(sec.oneDayChange ?? 0) * 20 + 20)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                  <span>Top: <strong className="text-cyan-400">{sec.topStockSymbol ?? 'N/A'}</strong></span>
                  <span className="text-emerald-400 font-semibold">{sec.topStockGain !== null ? `+${sec.topStockGain}%` : 'N/A'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 6. Today's Price & Live Floorsheet Table */}
      <TodaysPriceTable
        stocks={allStocks}
        onSelectStock={onSelectStock}
      />

      {/* 7. IPO & Investment Hub Showcase */}
      <IPOHubWidget
        ipos={ipos}
        onNavigate={onNavigate}
      />

      {/* 8. Latest Market & Corporate Disclosures */}
      <GlassCard className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm sm:text-base font-extrabold text-white font-mono flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" /> HamroShare & NEPSE Corporate Disclosures
          </h3>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            All Market News →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {news.map((n) => (
            <div key={n.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2 hover:border-cyan-500/20 transition-all">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-cyan-400 font-bold">{n.source}</span>
                <span className="text-slate-500 font-mono">{n.publishedTimeFormatted}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 leading-snug">{n.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{n.summary}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
