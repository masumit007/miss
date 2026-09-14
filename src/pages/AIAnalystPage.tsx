import React, { useState, useEffect, useRef } from 'react';
import { ApiClient } from '../services/api/client';
import { AIChatMessage } from '../types/ai';
import { GlassCard } from '../components/common/GlassCard';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { SignalBadge } from '../components/common/SignalBadge';
import { Bot, Send, Sparkles, Terminal, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';

export const AIAnalystPage: React.FC<{ initialPrompt?: string }> = ({ initialPrompt = '' }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
      text: `👋 **Welcome to MISS AI Stock Analyst** (Built by Sumit).\n\nI'm connected to the MISS quantitative engine, technical calculations, and live NEPSE market feed for **NEPSE-listed equities only**. Fundamental/ownership data is shown only when a real filed source is available for that stock.\n\nAsk me anything about a company, comparative valuations, support/resistance zones, or classic investment frameworks (Buffett, CANSLIM, Piotroski, Graham).`
    }
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'Analyze NABIL in detail',
    'Is UPPER a good stock?',
    'Compare NABIL and GBIME',
    'Which stocks are near support?',
    'Analyze SHIVM using CANSLIM',
    'Find fundamentally strong stocks with low debt'
  ];

  useEffect(() => {
    if (initialPrompt) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (promptText: string) => {
    if (!promptText.trim() || loading) return;
    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      text: promptText
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await ApiClient.sendAIMessage(promptText);
      setMessages(prev => [...prev, response]);
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        text: 'Encountered an issue executing data retrieval. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">MISS AI Analyst</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Grounded AI engine executing controlled tools across official exchange filings, quantitative indicators, and financial statements.
          </p>
        </div>
      </div>

      {/* Suggested Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-xs font-mono text-slate-500 shrink-0">Try:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(p)}
            className="px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 hover:border-cyan-500/30 border border-white/10 text-xs text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <GlassCard className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${isUser ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'bg-slate-900/90 border border-white/10 text-slate-200'}`}>
                {/* Text Content */}
                <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Tool Invocations Box */}
                {msg.toolCallsExecuted && msg.toolCallsExecuted.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 font-mono text-xs">
                    <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                      <Terminal className="w-3 h-3" /> Tools Executed by MISS Orchestrator:
                    </span>
                    {msg.toolCallsExecuted.map((tc, i) => (
                      <div key={i} className="p-2 rounded bg-slate-950/60 border border-white/5 text-[11px] text-slate-400">
                        <strong className="text-slate-300">{tc.toolName}</strong>: {tc.resultSummary}
                      </div>
                    ))}
                  </div>
                )}

                {/* Structured Verdict Card */}
                {msg.structuredVerdict && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 font-mono">Structured Analytical Verdict:</span>
                      <SignalBadge signal={msg.structuredVerdict.quickVerdict} size="sm" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
                        <strong className="text-cyan-300 block font-mono">Key Reference Levels:</strong>
                        <span>Support: {msg.structuredVerdict.keySupport} • Resistance: {msg.structuredVerdict.keyResistance}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
                        <strong className="text-emerald-300 block font-mono">Data Freshness & Provenance:</strong>
                        <span>{msg.structuredVerdict.dataFreshness} ({msg.structuredVerdict.sources.join(', ')})</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs font-mono">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <span>MISS AI is retrieving financial data and executing quantitative models...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </GlassCard>

      {/* Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask MISS AI about any NEPSE stock (e.g. Is NABIL a good stock?)..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
