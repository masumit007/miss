import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { ShieldAlert } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" /> Regulatory & Risk Disclaimer (NEPSE)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Mandatory compliance notice regarding Nepal capital market risks, educational scope, and absence of trade execution.
        </p>
      </div>

      <GlassCard className="space-y-5 p-6 sm:p-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold font-mono">
          IMPORTANT: This platform provides Nepal Stock Exchange market information, quantitative screening, technical analysis, fundamental analysis, HamroShare data aggregation, and educational research only. It does NOT constitute personalized investment advice or guaranteed return predictions.
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-white font-mono">1. Market Risk Acknowledgment</h2>
          <p>
            Stock market investments on the Nepal Stock Exchange (NEPSE) are subject to market risks. Equity prices can fluctuate significantly due to corporate earnings, monetary policy decisions by Nepal Rastra Bank (NRB), hydrological variations for hydro power projects, and global macroeconomic conditions. Past performance does not guarantee future results.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-white font-mono">2. Analytical Models & Calculations</h2>
          <p>
            Technical indicators (RSI, MACD, Moving Averages, Support/Resistance), fundamental metrics (ROE, Piotroski F-Score, Graham Number), and AI-generated scores are calculated based on algorithmic models and scraped public data feeds from HamroShare and NEPSE.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-white font-mono">3. No Brokerage or Trade Execution</h2>
          <p>
            MISS strictly does NOT provide broker login, TMS (Trade Management System) execution, automated trading, or order placement. All functionality is designed for research, screening, and educational decision-support.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-bold text-white font-mono">4. Independent Due Diligence</h2>
          <p>
            Always verify audited quarterly earnings reports and regulatory announcements directly through official exchange sources (NEPSE and SEBON) and consult a qualified, registered financial adviser before making any investment decisions.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
          MISS NEPSE (Mini Intelligent Stock System) • Built by Sumit
        </div>
      </GlassCard>
    </div>
  );
};
