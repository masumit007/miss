import React from 'react';
import { ResearchReport } from '../../types/ai';
import { X, Download, Printer, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';

interface ResearchReportModalProps {
  report: ResearchReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchReportModal: React.FC<ResearchReportModalProps> = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#0a0e17] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="font-extrabold text-white font-mono text-base">MISS RESEARCH REPORT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 text-sm leading-relaxed">
          {/* Title banner */}
          <div className="border-b border-white/10 pb-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-mono">{report.companyName} ({report.symbol})</h1>
                <p className="text-xs text-slate-400 mt-1">Generated: {report.reportDate} • {report.generatedBy}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Score</span>
                <span className="text-2xl font-bold font-mono text-cyan-300">{report.overallResearchScore}/100</span>
              </div>
            </div>
          </div>

          {/* Section: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">1. Executive Summary</h2>
            <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5">{report.executiveSummary}</p>
          </div>

          {/* Section: Business & Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">2. Business Overview</h2>
              <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5 h-full">{report.businessOverview}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">3. Growth & Quality</h2>
              <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5 h-full">{report.growthAndQuality}</p>
            </div>
          </div>

          {/* Section: Financial Performance & Valuation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">4. Financial Performance</h2>
              <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5 h-full">{report.financialPerformance}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">5. Valuation Assessment</h2>
              <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5 h-full">{report.valuationAssessment}</p>
            </div>
          </div>

          {/* Section: Technicals & Smart Money */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">6. Technical Landscape</h2>
              <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5 h-full">{report.technicalLandscape}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">7. Ownership & Smart Money</h2>
              <p className="text-slate-300 bg-slate-900/40 p-4 rounded-xl border border-white/5 h-full">{report.ownershipAndSmartMoney}</p>
            </div>
          </div>

          {/* Investment Framework Scores Checklist */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">8. Classic Investment Framework Evaluation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-xs text-slate-400 block font-mono">Piotroski F-Score</span>
                <span className="text-sm font-bold text-slate-100">{report.frameworkScores.piotroski}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-xs text-slate-400 block font-mono">CANSLIM Rating</span>
                <span className="text-sm font-bold text-slate-100">{report.frameworkScores.canslim}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-xs text-slate-400 block font-mono">Buffett Quality</span>
                <span className="text-sm font-bold text-slate-100">{report.frameworkScores.buffett}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                <span className="text-xs text-slate-400 block font-mono">Graham Deep Value</span>
                <span className="text-sm font-bold text-slate-100">{report.frameworkScores.graham}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 sm:col-span-2">
                <span className="text-xs text-slate-400 block font-mono">Peter Lynch Framework</span>
                <span className="text-sm font-bold text-slate-100">{report.frameworkScores.peterLynch}</span>
              </div>
            </div>
          </div>

          {/* Bull, Bear, Base Scenarios */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">9. Scenario Analysis (Bull, Base, Bear)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-400 font-mono block mb-1">BULL CASE</span>
                <p className="text-xs text-slate-300">{report.bullCase}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
                <span className="text-xs font-bold text-blue-400 font-mono block mb-1">BASE CASE</span>
                <p className="text-xs text-slate-300">{report.baseCase}</p>
              </div>
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20">
                <span className="text-xs font-bold text-rose-400 font-mono block mb-1">BEAR CASE</span>
                <p className="text-xs text-slate-300">{report.bearCase}</p>
              </div>
            </div>
          </div>

          {/* Key Risks */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">10. Key Identified Risks</h2>
            <ul className="list-disc list-inside bg-rose-950/15 p-4 rounded-xl border border-rose-500/20 space-y-1 text-xs text-slate-300">
              {report.keyRisks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Data Sources & Disclaimer */}
          <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-slate-400">
            <p><strong>Authoritative Data Sources:</strong> {report.dataSources.join(' • ')}</p>
            <p className="text-amber-300/80 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              <strong>Mandatory Compliance Notice:</strong> {report.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
