import { describe, it, expect } from 'vitest';
import { AIOrchestrator } from '../services/ai/aiOrchestrator';
import { AITools } from '../services/ai/aiTools';

describe('MISS NEPSE AI Orchestrator & Tool Retrieval', () => {
  it('retrieves accurate quote data without hallucination', async () => {
    const quote = await AITools.getStockQuote('NABIL');
    expect((quote as any).symbol).toBe('NABIL');
    expect((quote as any).price).toBeGreaterThan(0);
  });

  it('answers stock analysis prompt with structured verdict for NEPSE', async () => {
    const res = await AIOrchestrator.answerQuery('Is NABIL a good stock on NEPSE?');
    expect(res.sender).toBe('assistant');
    expect(res.structuredVerdict).toBeDefined();
    expect(res.structuredVerdict?.quickVerdict).toBeDefined();
  });
});
