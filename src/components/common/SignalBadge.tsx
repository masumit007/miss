import React from 'react';
import { TechnicalSignalType } from '../../types/technicals';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Zap, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2,
  Anchor,
  Layers
} from 'lucide-react';

interface SignalBadgeProps {
  signal: TechnicalSignalType | string;
  size?: 'sm' | 'md' | 'lg';
}

export const SignalBadge: React.FC<SignalBadgeProps> = ({ signal, size = 'md' }) => {
  let bg = 'bg-slate-800 text-slate-300 border-slate-700';
  let Icon = Minus;

  const s = signal.toUpperCase();

  if (s.includes('BULLISH') || s === 'ACCUMULATION' || s.includes('BREAKOUT')) {
    bg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10';
    Icon = s.includes('BREAKOUT') ? Zap : TrendingUp;
  } else if (s.includes('BEARISH') || s === 'DISTRIBUTION' || s.includes('BREAKDOWN')) {
    bg = 'bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-rose-500/10';
    Icon = TrendingDown;
  } else if (s.includes('OVERBOUGHT')) {
    bg = 'bg-amber-500/15 text-amber-300 border-amber-500/40';
    Icon = AlertCircle;
  } else if (s.includes('OVERSOLD')) {
    bg = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
    Icon = CheckCircle2;
  } else if (s.includes('SUPPORT')) {
    bg = 'bg-blue-500/15 text-blue-300 border-blue-500/40';
    Icon = Anchor;
  } else if (s.includes('RESISTANCE')) {
    bg = 'bg-purple-500/15 text-purple-300 border-purple-500/40';
    Icon = Layers;
  }

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs gap-1' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm gap-2 font-semibold' 
    : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-lg border shadow-sm ${bg} ${sizeClasses}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{signal.replace(/_/g, ' ')}</span>
    </span>
  );
};
