import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { FileText, ChevronRight, BookOpen, Sparkles } from 'lucide-react';

export const DocsViewerPage: React.FC = () => {
  const docList = [
    { id: 'README', title: 'README.md', desc: 'Platform overview, features, and setup' },
    { id: 'ARCHITECTURE', title: 'ARCHITECTURE.md', desc: 'Full-stack system architecture and layers' },
    { id: 'API', title: 'API.md', desc: 'Complete REST endpoint specifications' },
    { id: 'DATABASE', title: 'DATABASE.md', desc: 'PostgreSQL schema with 26 normalized entities' },
    { id: 'DATA_SOURCES', title: 'DATA_SOURCES.md', desc: 'NSE/BSE and official data lineage' },
    { id: 'DATA_PIPELINE', title: 'DATA_PIPELINE.md', desc: 'Ingestion, caching TTLs, and validation' },
    { id: 'AI_ARCHITECTURE', title: 'AI_ARCHITECTURE.md', desc: 'Grounded tool-calling LLM architecture' },
    { id: 'AI_PROMPTS', title: 'AI_PROMPTS.md', desc: 'System prompts & hallucination guardrails' },
    { id: 'TECHNICAL_ANALYSIS', title: 'TECHNICAL_ANALYSIS.md', desc: 'Formulas for RSI, MACD, SMAs, S/R' },
    { id: 'FUNDAMENTAL_ANALYSIS', title: 'FUNDAMENTAL_ANALYSIS.md', desc: 'Piotroski, Buffett, Graham, Lynch' },
    { id: 'SCORING_METHODOLOGY', title: 'SCORING_METHODOLOGY.md', desc: '8-Factor multi-factor 0-100 model' },
    { id: 'SCREENERS', title: 'SCREENERS.md', desc: 'Preset & natural language screening engine' },
    { id: 'NEWS_ENGINE', title: 'NEWS_ENGINE.md', desc: 'Sentiment classification & deduplication' },
    { id: 'IPO_ENGINE', title: 'IPO_ENGINE.md', desc: 'IPO subscription & research scoring' },
    { id: 'SECURITY', title: 'SECURITY.md', desc: 'Security, secrets, and rate limiting' },
    { id: 'DEPLOYMENT', title: 'DEPLOYMENT.md', desc: 'Production deployment guide' },
    { id: 'TESTING', title: 'TESTING.md', desc: 'Unit, mathematical, and AI test suites' },
    { id: 'MONITORING', title: 'MONITORING.md', desc: 'Observability and health metrics' },
    { id: 'CONFIGURATION', title: 'CONFIGURATION.md', desc: 'Dynamic system configuration parameters' },
    { id: 'ADMIN_GUIDE', title: 'ADMIN_GUIDE.md', desc: 'Administrator operational handbook' },
    { id: 'USER_GUIDE', title: 'USER_GUIDE.md', desc: 'End-user research walkthrough' },
    { id: 'TROUBLESHOOTING', title: 'TROUBLESHOOTING.md', desc: 'Common issues and resolutions' },
    { id: 'CONTRIBUTING', title: 'CONTRIBUTING.md', desc: 'Developer contribution guidelines' },
    { id: 'CHANGELOG', title: 'CHANGELOG.md', desc: 'Version release notes' },
    { id: 'ROADMAP', title: 'ROADMAP.md', desc: 'Future planned analytical capabilities' },
    { id: 'DISCLAIMER', title: 'DISCLAIMER.md', desc: 'Legal and investment risk disclosures' }
  ];

  const [selectedDoc, setSelectedDoc] = useState(docList[0]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-400" /> Platform Documentation Suite
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive documentation covering architecture, database schemas, APIs, mathematical models, and deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Document List */}
        <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
          {docList.map((doc) => {
            const isSelected = selectedDoc.id === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm' 
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border-white/5'
                }`}
              >
                <div>
                  <span className="font-bold text-xs font-mono block">{doc.title}</span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{doc.desc}</span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
              </button>
            );
          })}
        </div>

        {/* Right: Document Viewer */}
        <GlassCard className="lg:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg font-bold text-white font-mono">{selectedDoc.title}</h2>
            <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              MISS Official Docs
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-white/5">
{`# ${selectedDoc.title}
## Overview
This document specifies the ${selectedDoc.title.replace('.md', '')} for MISS (Mini Intelligent Stock System) built by Sumit.

- **Platform**: MISS — Mini Intelligent Stock System
- **Scope**: AI-Powered NSE & BSE Stock Intelligence & Research
- **Author**: Built by Sumit
- **Purpose**: Research, Screening, Education, and Mathematical Analysis (No Trade Execution)

### Core Principles & Architecture
1. Zero fake real-time data: all endpoints and cards display source, status (LIVE, DELAYED, EOD, CACHED, DEMO DATA), and timestamp in IST.
2. Multi-factor scoring (0-100) with complete factor explainability.
3. Strict regulatory and risk disclaimers across all analytical surfaces.
4. Clean separation of concerns between provider layer, quantitative analytics engines, and user interfaces.`}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
