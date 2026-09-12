import React from 'react';
import { DataStatusType } from '../../types/stock';
import { Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface FreshnessBadgeProps {
  status: DataStatusType;
  timestamp?: string;
  source?: string;
  showDetails?: boolean;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  status,
  timestamp = '29 Aug 2026 15:30 IST',
  source = 'NSE Official Disclosures',
  showDetails = false
}) => {
  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-400';

  if (status === 'DEMO DATA') {
    badgeColor = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (status === 'DELAYED') {
    badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    dotColor = 'bg-yellow-400';
  } else if (status === 'EOD' || status === 'CACHED') {
    badgeColor = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    dotColor = 'bg-sky-400';
  } else if (status === 'UNAVAILABLE') {
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-400';
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-2 text-xs">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono font-medium ${badgeColor}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColor}`} />
        {status}
      </span>
      {showDetails && (
        <span className="text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          {timestamp}
          {source && (
            <>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-cyan-500" /> {source}
              </span>
            </>
          )}
        </span>
      )}
    </div>
  );
};
