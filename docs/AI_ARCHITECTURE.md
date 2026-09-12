# MISS AI Architecture
MISS AI employs a tool-augmented orchestration model where the LLM does NOT guess or fabricate financial numbers from memory.

```
User Query ──► AI Orchestrator ──► Tool Call Registry
                                         │
                   ┌─────────────────────┼─────────────────────┐
                   ▼                     ▼                     ▼
             getStockQuote        getFundamentals        getTechnicals
                   │                     │                     │
                   └─────────────────────┼─────────────────────┘
                                         ▼
                               Grounded JSON Evidence
                                         │
                                         ▼
                             Structured Verdict Builder
                         (Quick Verdict, Bull/Bear Cases,
                          Key Reference Levels, Invalidation)
```
