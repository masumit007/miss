import React, { useEffect, useState } from 'react';
import { ApiClient } from '../services/api/client';
import { StockQuote, OHLCV, CorporateAction, QuarterlyResult, ShareholdingPattern, BulkBlockDeal } from '../types/stock';
import { FullTechnicalAnalysis } from '../types/technicals';
import { FullFundamentalAnalysis } from '../types/fundamentals';
import { SmartMoneyAnalysis } from '../types/smartMoney';
import { MultiFactorScore } from '../types/scoring';
import { NewsArticle } from '../types/news';
import { ResearchReport } from '../types/ai';
import { StockHeader } from '../components/stock/StockHeader';
import { StockOverviewTab } from '../components/stock/StockOverviewTab';
import { StockTechnicalsTab } from '../components/stock/StockTechnicalsTab';
import { StockFundamentalsTab } from '../components/stock/StockFundamentalsTab';
import { StockValuationTab } from '../components/stock/StockValuationTab';
import { StockSmartMoneyTab } from '../components/stock/StockSmartMoneyTab';
import { StockNewsTab, StockResultsTab } from '../components/stock/StockOtherTabs';
import { FloorsheetAnalysis } from '../types/broker';
import { StockBrokerTab } from '../components/stock/StockBrokerTab';
import { InteractiveChart } from '../components/charts/InteractiveChart';
import { ResearchReportModal } from '../components/ai/ResearchReportModal';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { GlassCard } from '../components/common/GlassCard';
import { WatchlistStore } from '../services/storage/watchlistStore';
import { 
  BarChart2, 
  Activity, 
  LineChart, 
  DollarSign, 
  PieChart, 
  Coins, 
  Newspaper, 
  TrendingUp, 
  ShieldAlert, 
  Bot, 
  Building, 
  Check,
  Award,
  BookOpen,
  Landmark
} from 'lucide-react';

interface StockDetailPageProps {
  symbol: string;
  onNavigate: (page: string, params?: any) => void;
}

const UnavailableCard: React.FC<{ label: string }> = ({ label }) => (
  <GlassCard className="py-12 text-center">
    <p className="text-slate-400 font-mono text-xs max-w-md mx-auto">{label}</p>
  </GlassCard>
);

export const StockDetailPage: React.FC<StockDetailPageProps> = ({ symbol, onNavigate }) => {
  const [data, setData] = useState<{
    quote: StockQuote;
    candles: OHLCV[];
    technicals: FullTechnicalAnalysis;
    fundamentals: FullFundamentalAnalysis | null;
    smartMoney: SmartMoneyAnalysis | null;
    score: MultiFactorScore;
    news: NewsArticle[];
    corporateActions: CorporateAction[];
    quarterlyResults: QuarterlyResult[];
  } | null>(null);
  const [floorsheet, setFloorsheet] = useState<FloorsheetAnalysis | null>(null);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStockData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const res = await ApiClient.getStockDetails(symbol);
    if (res) {
      setData(res);
      const lists = WatchlistStore.getWatchlists();
      setIsInWatchlist(lists[0]?.symbols.includes(symbol) || false);
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    loadStockData(true);
    ApiClient.getFloorsheetAnalysis(symbol).then(setFloorsheet).catch(() => setFloorsheet(null));
    // Real-time live quote refresh interval every 6 seconds
    const interval = setInterval(() => loadStockData(false), 6000);
    return () => clearInterval(interval);
  }, [symbol]);

  const handleToggleWatchlist = () => {
    const lists = WatchlistStore.getWatchlists();
    const mainList = lists[0];
    if (isInWatchlist) {
      WatchlistStore.removeStockFromWatchlist(mainList.id, symbol);
      setIsInWatchlist(false);
    } else {
      WatchlistStore.addStockToWatchlist(mainList.id, symbol);
      setIsInWatchlist(true);
    }
  };

  const handleGenerateReport = async () => {
    const rep = await ApiClient.generateReport(symbol);
    setReport(rep);
    setIsReportModalOpen(true);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-mono">Retrieving real-time analytical data for {symbol}...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: Activity },
    { id: 'chart', label: 'CHART', icon: BarChart2 },
    { id: 'technicals', label: 'TECHNICAL', icon: Activity },
    { id: 'fundamentals', label: 'FUNDAMENTAL', icon: LineChart },
    { id: 'valuation', label: 'VALUATION', icon: DollarSign },
    { id: 'ownership', label: 'OWNERSHIP', icon: PieChart },
    { id: 'smart_money', label: 'SMART MONEY', icon: Coins },
    { id: 'broker', label: 'BROKER ACTIVITY', icon: Landmark },
    { id: 'news', label: 'NEWS', icon: Newspaper },
    { id: 'results', label: 'RESULTS', icon: TrendingUp },
    { id: 'growth', label: 'GROWTH', icon: Award },
    { id: 'risk', label: 'RISK', icon: ShieldAlert },
    { id: 'governance', label: 'GOVERNANCE', icon: Building },
    { id: 'ai_analysis', label: 'AI ANALYSIS', icon: Bot }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <StockHeader
        quote={data.quote}
        score={data.score}
        isInWatchlist={isInWatchlist}
        onToggleWatchlist={handleToggleWatchlist}
        onCompare={() => onNavigate('compare', { symbol })}
        onAnalyzeWithAI={() => onNavigate('ai_analyst', { prompt: `Analyze ${symbol} in detail` })}
        onSetAlert={() => onNavigate('alerts', { symbol })}
        onGenerateReport={handleGenerateReport}
      />

      <DisclaimerBanner />

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <StockOverviewTab
            quote={data.quote}
            technicals={data.technicals}
            fundamentals={data.fundamentals}
            score={data.score}
          />
        )}

        {activeTab === 'chart' && (
          <div className="space-y-4">
            <InteractiveChart symbol={symbol} candles={data.candles} currentPrice={data.quote.currentPrice} />
          </div>
        )}

        {activeTab === 'technicals' && (
          <StockTechnicalsTab technicals={data.technicals} />
        )}

        {activeTab === 'fundamentals' && (
          data.fundamentals
            ? <StockFundamentalsTab fundamentals={data.fundamentals} />
            : <UnavailableCard label="Fundamental data unavailable — no real filed financial statements are integrated for this stock yet." />
        )}

        {activeTab === 'valuation' && (
          data.fundamentals
            ? <StockValuationTab fundamentals={data.fundamentals} />
            : <UnavailableCard label="Valuation data unavailable — requires real filed financials, not yet integrated for this stock." />
        )}

        {activeTab === 'ownership' && (
          data.smartMoney
            ? <StockSmartMoneyTab smartMoney={data.smartMoney} />
            : <UnavailableCard label="Smart Money data unavailable from configured sources — no real shareholding disclosure source is integrated for this stock yet." />
        )}

        {activeTab === 'smart_money' && (
          data.smartMoney
            ? <StockSmartMoneyTab smartMoney={data.smartMoney} />
            : <UnavailableCard label="Smart Money data unavailable from configured sources — no real shareholding disclosure source is integrated for this stock yet." />
        )}

        {activeTab === 'broker' && (
          <StockBrokerTab floorsheet={floorsheet} />
        )}

        {activeTab === 'news' && (
          <StockNewsTab news={data.news} />
        )}

        {activeTab === 'results' && (
          <StockResultsTab results={data.quarterlyResults} />
        )}

        {activeTab === 'growth' && (
          data.fundamentals
            ? <StockFundamentalsTab fundamentals={data.fundamentals} />
            : <UnavailableCard label="Growth data unavailable — no real filed financial statements are integrated for this stock yet." />
        )}

        {activeTab === 'risk' && (
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Risk & Sensitivity Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block font-mono">Beta (Volatility vs Benchmark)</span>
                <span className="text-base font-bold font-mono text-white">{data.quote.beta ?? 'N/A'}</span>
                <span className="text-[11px] text-slate-400 block mt-1">{data.quote.beta !== null && data.quote.beta > 1 ? 'Historically higher sensitivity than the NEPSE Index' : data.quote.beta !== null ? 'Lower volatility than benchmark' : 'Beta not yet available for this stock'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block font-mono">Debt to Equity</span>
                <span className="text-base font-bold font-mono text-white">{data.fundamentals ? data.fundamentals.balanceSheet.debtToEquity : 'N/A'}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">{data.fundamentals ? data.fundamentals.balanceSheet.leverageCategory : 'Data unavailable'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="text-slate-400 block font-mono">Solvency Score</span>
                <span className="text-base font-bold font-mono text-cyan-300">{data.fundamentals ? `${data.fundamentals.balanceSheet.solvencyScore}/100` : 'N/A'}</span>
                <span className="text-[11px] text-slate-400 block mt-1">{data.fundamentals ? 'Derived from real filed balance-sheet figures' : 'Data unavailable'}</span>
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'governance' && (
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" /> Corporate Governance & Disclosures
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex justify-between">
                <span>Promoter Pledging:</span>
                <strong className="text-slate-100 font-mono">{data.smartMoney ? `${data.smartMoney.latestPromoterPledged}%` : 'N/A'}</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                Auditor identity, board independence, and other governance disclosures are not sourced by MISS yet — NOT IMPLEMENTABLE WITH CURRENT VERIFIED SOURCES. MISS never asserts a specific auditor or board composition without a real, verified disclosure source.
              </div>
            </div>
          </GlassCard>
        )}

        {activeTab === 'ai_analysis' && (
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">MISS AI Synthesis & Thesis Invalidation</h3>
              </div>
              <button
                onClick={() => onNavigate('ai_analyst', { prompt: `Deep dive into ${symbol}` })}
                className="text-xs text-cyan-400 hover:underline"
              >
                Open Full AI Chatbot →
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              {data.fundamentals ? (
                <p className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                  <strong>Core Research Thesis:</strong> {data.quote.name} shows ROE of {data.fundamentals.profitability.roe}% and a Piotroski F-Score of {data.fundamentals.piotroski.score}/9, based on real filed financials.
                  {data.smartMoney ? ` Institutional ownership classification: ${data.smartMoney.smartMoneyClassification}.` : ' Ownership data is unavailable for this stock.'}
                </p>
              ) : (
                <p className="bg-slate-900/50 p-4 rounded-xl border border-white/5 text-slate-400">
                  Data unavailable — no real filed financial statements are integrated for {data.quote.name} yet, so MISS cannot generate a fundamentals-based research thesis. Technical and price data are still available in the other tabs.
                </p>
              )}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                <span className="font-bold text-rose-400 font-mono block">What Could Invalidate This Thesis?</span>
                <p>• Breakdown below primary technical reference level (Rs. {data.technicals.supportResistance.support1}).</p>
                {data.fundamentals && (
                  <p>• Consecutive quarterly revenue or earnings deceleration in future filed statements.</p>
                )}
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Research Report Modal */}
      <ResearchReportModal
        report={report}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
