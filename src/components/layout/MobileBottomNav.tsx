import React from 'react';
import { Home, TrendingUp, SlidersHorizontal, Bot, Bookmark, MoreHorizontal } from 'lucide-react';

interface MobileBottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onNavigate,
  onOpenMobileMenu
}) => {
  const primaryTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'screeners', label: 'Screeners', icon: SlidersHorizontal },
    { id: 'ai_analyst', label: 'MISS AI', icon: Bot },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080b11]/90 backdrop-blur-xl border-t border-white/10 lg:hidden px-2 py-1 flex items-center justify-around">
      {primaryTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 stroke-[2.5]' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-1">{tab.label}</span>
          </button>
        );
      })}
      
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-slate-200"
      >
        <MoreHorizontal className="w-5 h-5 text-slate-400" />
        <span className="text-[10px] mt-1">More</span>
      </button>
    </nav>
  );
};
