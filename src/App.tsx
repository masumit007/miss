import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { ApiClient } from './services/api/client';
import { MarketStatusType } from './types/stock';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketsPage } from './pages/MarketsPage';
import { StockDetailPage } from './pages/StockDetailPage';
import { ScreenersPage } from './pages/ScreenersPage';
import { TechnicalsPage } from './pages/TechnicalsPage';
import { FundamentalsPage } from './pages/FundamentalsPage';
import { SmartMoneyPage } from './pages/SmartMoneyPage';
import { AIWatchlistPage } from './pages/AIWatchlistPage';
import { BestPicksPage } from './pages/BestPicksPage';
import { NewsPage } from './pages/NewsPage';
import { IPOPage } from './pages/IPOPage';
import { ComparePage } from './pages/ComparePage';
import { AIAnalystPage } from './pages/AIAnalystPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AlertsPage } from './pages/AlertsPage';
import { ContributePage } from './pages/ContributePage';
import { AdminPage } from './pages/AdminPage';
import { SettingsPage } from './pages/SettingsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { DocsViewerPage } from './pages/DocsViewerPage';
import { DisclaimerPage } from './pages/DisclaimerPage';

export function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('NABIL');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [marketStatus, setMarketStatus] = useState<MarketStatusType>('OPEN');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      const overview = await ApiClient.getMarketOverview();
      setMarketStatus(overview.marketStatus);
    }
    loadStatus();

    // Live market polling every 10 seconds
    const interval = setInterval(loadStatus, 10000);

    // Global keyboard shortcut for Cmd+K / Ctrl+K search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    if (params?.symbol) {
      setSelectedStockSymbol(params.symbol);
    }
    if (params?.prompt) {
      setAiPrompt(params.prompt);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedStockSymbol(symbol);
    setActivePage('stocks');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        marketStatus={marketStatus}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavigate}
        activePage={activePage}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onSelectStock={handleSelectStock}
      />

      {/* Main App Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Dynamic Page Content View */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:ml-64 pb-24 lg:pb-12">
          {activePage === 'home' && (
            <HomePage onNavigate={handleNavigate} onSelectStock={handleSelectStock} />
          )}

          {activePage === 'markets' && (
            <MarketsPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'stocks' && (
            <StockDetailPage symbol={selectedStockSymbol} onNavigate={handleNavigate} />
          )}

          {activePage === 'screeners' && (
            <ScreenersPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'technicals' && (
            <TechnicalsPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'fundamentals' && (
            <FundamentalsPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'smart_money' && (
            <SmartMoneyPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'ai_watchlist' && (
            <AIWatchlistPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'best_picks' && (
            <BestPicksPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'news' && (
            <NewsPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'ipo' && (
            <IPOPage />
          )}

          {activePage === 'compare' && (
            <ComparePage initialSymbol={selectedStockSymbol} onSelectStock={handleSelectStock} />
          )}

          {activePage === 'ai_analyst' && (
            <AIAnalystPage initialPrompt={aiPrompt} />
          )}

          {activePage === 'watchlist' && (
            <WatchlistPage onSelectStock={handleSelectStock} />
          )}

          {activePage === 'alerts' && (
            <AlertsPage symbol={selectedStockSymbol} />
          )}

          {activePage === 'contribute' && (
            <ContributePage />
          )}

          {activePage === 'admin' && (
            <AdminPage />
          )}

          {activePage === 'settings' && (
            <SettingsPage />
          )}

          {activePage === 'sources' && (
            <DataSourcesPage />
          )}

          {activePage === 'methodology' && (
            <MethodologyPage />
          )}

          {activePage === 'docs' && (
            <DocsViewerPage />
          )}

          {activePage === 'disclaimer' && (
            <DisclaimerPage />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStock={handleSelectStock}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
