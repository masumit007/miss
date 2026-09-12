import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  tooltip?: string;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  change,
  changeLabel,
  prefix = '',
  suffix = '',
  highlight = false
}) => {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-slate-900/40 border-white/5'} flex flex-col justify-between`}>
      <span className="text-xs font-medium text-slate-400 tracking-wide">{label}</span>
      <div className="mt-2 flex items-baseline gap-1">
        {prefix && <span className="text-sm font-semibold text-slate-400">{prefix}</span>}
        <span className="text-xl font-bold font-mono text-slate-100 tracking-tight">{value}</span>
        {suffix && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
      </div>
      {(change !== undefined || subValue || changeLabel) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {change !== undefined ? (
            <span className={`inline-flex items-center gap-0.5 font-medium ${change > 0 ? 'text-emerald-400' : change < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {change > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : change < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
              {change > 0 ? '+' : ''}{change}%
            </span>
          ) : subValue ? (
            <span className="text-slate-400 font-mono">{subValue}</span>
          ) : null}
          {changeLabel && <span className="text-slate-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
};
