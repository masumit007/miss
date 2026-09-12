import React from 'react';
import { 
  Home, 
  TrendingUp, 
  Search, 
  SlidersHorizontal, 
  Activity, 
  LineChart, 
  Coins, 
  Sparkles, 
  Award, 
  Newspaper, 
  Rocket, 
  Scale, 
  Bot, 
  Bookmark, 
  Bell, 
  Heart, 
  Settings, 
  Database, 
  BookOpen, 
  ShieldAlert,
  X,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpenMobile,
  onCloseMobile
}) => {
  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'home', label: 'Home Overview', icon: Home },
        { id: 'markets', label: 'MISS Markets', icon: TrendingUp },
        { id: 'stocks', label: 'MISS Stocks', icon: Search },
        { id: 'screeners', label: 'MISS Screeners', icon: SlidersHorizontal }
      ]
    },
    {
      title: 'QUANTITATIVE RESEARCH',
      items: [
        { id: 'technicals', label: 'MISS Technicals', icon: Activity },
        { id: 'fundamentals', label: 'MISS Fundamentals', icon: LineChart },
        { id: 'smart_money', label: 'MISS Smart Money', icon: Coins }
      ]
    },
    {
      title: 'INTELLIGENCE & AI',
      items: [
        { id: 'ai_watchlist', label: 'MISS Watch', icon: Sparkles },
        { id: 'best_picks', label: 'MISS Picks', icon: Award },
        { id: 'ai_analyst', label: 'MISS AI Analyst', icon: Bot },
        { id: 'compare', label: 'Stock Comparison', icon: Scale }
      ]
    },
    {
      title: 'EVENTS & CORPORATE',
      items: [
        { id: 'news', label: 'MISS News', icon: Newspaper },
        { id: 'ipo', label: 'MISS IPO', icon: Rocket }
      ]
    },
    {
      title: 'USER SUITE',
      items: [
        { id: 'watchlist', label: 'My Watchlist', icon: Bookmark },
        { id: 'alerts', label: 'MISS Alerts', icon: Bell },
        { id: 'contribute', label: 'Contribute (Sumit)', icon: Heart }
      ]
    },
    {
      title: 'SYSTEM & TRANSPARENCY',
      items: [
        { id: 'admin', label: 'Admin Dashboard', icon: Settings },
        { id: 'settings', label: 'User Settings', icon: SlidersHorizontal },
        { id: 'sources', label: 'Data Sources', icon: Database },
        { id: 'methodology', label: 'Methodology & Math', icon: BookOpen },
        { id: 'docs', label: 'Documentation (26 Docs)', icon: FileText },
        { id: 'disclaimer', label: 'Risk Disclaimer', icon: ShieldAlert }
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" 
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0e17]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-slate-950 font-mono text-sm">
              M
            </div>
            <span className="font-extrabold text-white font-mono">MISS MENU</span>
          </div>
          <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive 
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-white/10 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>MISS v1.0.0</span>
            <span className="text-cyan-400 font-semibold">Built by Sumit</span>
          </div>
        </div>
      </aside>
    </>
  );
};
