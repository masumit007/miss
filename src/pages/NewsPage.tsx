import React, { useState, useEffect } from 'react';
import { ApiClient } from '../services/api/client';
import { NewsArticle } from '../types/news';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Newspaper, ExternalLink, Filter } from 'lucide-react';

export const NewsPage: React.FC<{ onSelectStock: (symbol: string) => void }> = ({ onSelectStock }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await ApiClient.getMarketNews(activeFilter === 'ALL' ? undefined : activeFilter);
      setArticles(data);
      setLoading(false);
    }
    load();
  }, [activeFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-cyan-400" /> HamroShare & NEPSE News Stream
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial disclosures, audited dividend announcements, and AI-tagged market sentiment.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-white/10">
          {['ALL', 'POSITIVE', 'NEGATIVE'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeFilter === f ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <DisclaimerBanner />

      {loading ? (
        <div className="py-12 text-center text-slate-400 font-mono text-xs">Loading latest NEPSE disclosures...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <GlassCard key={art.id} className="space-y-3 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">{art.source}</span>
                <span className="text-slate-400">{art.publishedTimeFormatted}</span>
              </div>

              <h2 className="text-sm font-bold text-white leading-snug">{art.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed">{art.summary}</p>

              {/* Tags & Primary Symbol */}
              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {art.symbolsMentioned.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => onSelectStock(sym)}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 hover:border-cyan-400 text-[11px] font-mono font-bold text-cyan-300 transition-colors cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>

                <a
                  href={art.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                >
                  Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
