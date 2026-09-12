import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Database, ShieldCheck, ExternalLink } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const sources = [
    {
      name: 'HamroShare (hamroshare.com.np)',
      type: 'Live Continuous Scraped Market Feed',
      authority: 'Real-Time Scraping & API Provider',
      dataSupplied: 'Live NEPSE Index ticks, daily turnover in Arb/Crore, floor-sheet updates, active 504+ listed company quotes, Graham numbers, proposed dividends, and SEBON pipeline IPOs.',
      url: 'https://hamroshare.com.np'
    },
    {
      name: 'Nepal Stock Exchange (NEPSE - nepalstock.com)',
      type: 'Official Stock Exchange of Nepal',
      authority: 'Primary Statutory Regulatory Tier',
      dataSupplied: 'Official equity quotes, daily candle series, market breadth, index constituents, corporate filings, and trading calendar.',
      url: 'https://www.nepalstock.com'
    },
    {
      name: 'Nepal Rastra Bank (NRB) & Central Bank',
      type: 'Central Bank of Nepal',
      authority: 'Authoritative Monetary Authority',
      dataSupplied: 'Policy repo rates, interbank interest rates, banking base rates, CPI inflation figures, monthly foreign remittance inflows, and FX reserves.',
      url: 'https://www.nrb.org.np'
    },
    {
      name: 'Securities Board of Nepal (SEBON) & CDSC (MeroShare)',
      type: 'Capital Market Regulator & Clearing Depository',
      authority: 'Securities Regulator Tier',
      dataSupplied: 'IPO approvals, book-building issues, right shares, debentures, and demat ownership statistics.',
      url: 'https://www.sebon.gov.np'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-400" /> Data Sources & Lineage (NEPSE & HamroShare)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete transparency into data lineage, live scraping protocols, and authoritative Nepalese financial sources.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((s, idx) => (
          <GlassCard key={idx} className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm font-mono">{s.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono">
                  {s.authority}
                </span>
              </div>
              <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                Official Portal <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{s.dataSupplied}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
