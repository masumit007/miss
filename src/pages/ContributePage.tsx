import React, { useState } from 'react';
import { SettingsStore } from '../services/storage/settingsStore';
import { GlassCard } from '../components/common/GlassCard';
import { Heart, ShieldCheck, Copy, Check, Smartphone } from 'lucide-react';

export const ContributePage: React.FC = () => {
  const config = SettingsStore.getSettings().developerContribution;
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(config.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
          <Heart className="w-3.5 h-3.5 fill-emerald-400/20" /> Developer Support
        </div>
        <h1 className="text-3xl font-extrabold text-white font-mono">
          Contribute to Developer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          {config.descriptionText}
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8 text-center space-y-6 max-w-md mx-auto">
        {/* eSewa Official QR Code Image */}
        <div className="p-3 bg-[#111827] rounded-2xl shadow-2xl w-72 mx-auto border border-emerald-500/30 overflow-hidden">
          <img
            src="/esewa_qr.jpg"
            alt="eSewa QR Code — Sumit Kumar Mahato"
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* eSewa Details Box */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5 font-bold">
              <Smartphone className="w-4 h-4 text-emerald-400" /> eSewa ID:
            </span>
            <strong className="text-emerald-300 text-sm select-all font-bold tracking-wider">{config.upiId}</strong>
            <button
              onClick={handleCopyId}
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
              title="Copy eSewa ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-xs text-slate-400 space-y-1 bg-slate-950/40 p-3 rounded-xl border border-white/5 text-left">
            <p className="flex justify-between"><strong className="text-slate-300">Beneficiary:</strong> <span className="text-emerald-400 font-semibold">{config.accountHolderName}</span></p>
            <p className="flex justify-between"><strong className="text-slate-300">Payment Wallet:</strong> <span>eSewa Digital Wallet</span></p>
            <p className="flex justify-between"><strong className="text-slate-300">Currency:</strong> <span>NPR (Nepalese Rupee)</span></p>
          </div>
        </div>

        {/* Developer Transparency Note */}
        <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-white/5 text-left">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" /> Integrity Notice:
          </div>
          {config.developerNote}
        </div>
      </GlassCard>
    </div>
  );
};
