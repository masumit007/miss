import { describe, it, expect, beforeAll } from 'vitest';
import { AIOrchestrator } from '../services/ai/aiOrchestrator';
import { AITools } from '../services/ai/aiTools';
import { ProviderFactory } from '../services/providers/ProviderFactory';
import { MockDataProvider } from '../services/providers/MockDataProvider';

describe('MISS NEPSE AI Orchestrator & Tool Retrieval', () => {
  // AITools/AIOrchestrator resolve their data provider via
  // ProviderFactory.getProvider() internally rather than accepting one as
  // a parameter, so tests must swap in the mock provider through the
  // factory's existing setProvider() hook — otherwise these tests make
  // real network calls to nepalstock.com on every run.
  beforeAll(() => {
    ProviderFactory.setProvider(new MockDataProvider());
  });

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
