import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#070a10] border-t border-white/10 py-10 px-4 sm:px-8 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-extrabold text-slate-100 font-mono text-base tracking-wider">MISS</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400 font-medium">Mini Intelligent Stock System</span>
          </div>
          <p className="text-slate-500 max-w-md text-[11px] leading-relaxed">
            AI-Powered NSE & BSE Market Intelligence & Quantitative Stock Research platform. Built by Sumit. Designed strictly for information, research, education, screening, and analysis.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 text-slate-400">
          <button onClick={() => onNavigate('sources')} className="hover:text-cyan-300 transition-colors">Data Sources</button>
          <span>•</span>
          <button onClick={() => onNavigate('methodology')} className="hover:text-cyan-300 transition-colors">Methodology</button>
          <span>•</span>
          <button onClick={() => onNavigate('docs')} className="hover:text-cyan-300 transition-colors">Documentation</button>
          <span>•</span>
          <button onClick={() => onNavigate('disclaimer')} className="hover:text-cyan-300 transition-colors text-amber-400">Risk Disclaimer</button>
          <span>•</span>
          <button onClick={() => onNavigate('contribute')} className="hover:text-rose-300 transition-colors flex items-center gap-1 text-rose-400">
            <Heart className="w-3 h-3 fill-rose-400/20" /> Contribute
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 text-center">
        <span>© 2026 MISS (Mini Intelligent Stock System). Built by Sumit. All Rights Reserved.</span>
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Compliant Quantitative Analytics Architecture</span>
      </div>
    </footer>
  );
};
