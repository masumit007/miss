import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-amber-500/10 border-y sm:border border-amber-500/20 sm:rounded-2xl p-4 my-4 backdrop-blur-md text-amber-200/90 text-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Investment Research & Regulatory Disclaimer: </span>
            <span>
              This platform provides market intelligence, quantitative screening, technical analysis, and educational research only. It does not provide trade execution or guaranteed stock predictions.
            </span>
          </div>
        </div>
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-amber-400 hover:text-amber-200 shrink-0 flex items-center gap-1 font-medium transition-colors cursor-pointer"
        >
          {expanded ? 'Hide Details' : 'Read Full Notice'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-amber-500/20 text-slate-300 space-y-1.5 leading-relaxed">
          <p>• <strong>No Guaranteed Returns</strong>: Stock-market investments are subject to market risks. Past performance does not guarantee future results.</p>
          <p>• <strong>Model Calculations</strong>: Technical indicators, Piotroski scores, CANSLIM ratings, and AI-generated scores are analytical estimations and can be incorrect or incomplete.</p>
          <p>• <strong>Authoritative Verification</strong>: Always conduct your own independent research and verify facts directly through official exchange filings (NSE/BSE) and audited company disclosures before making financial decisions.</p>
          <p>• <strong>Built by Sumit</strong> for educational and analytical purposes. No broker or portfolio management integration is present.</p>
        </div>
      )}
    </div>
  );
};
