# System Architecture: MISS
## Architecture Overview
MISS is designed as a decoupled, high-performance financial research platform adhering to clean architecture principles.

```
┌─────────────────────────────────────────────────────────────┐
│                    Liquid Glass Web UI                      │
│        (React 19, TypeScript, Tailwind CSS, Lucide)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                    API Gateway & Express                    │
└──────┬───────────────────────┬───────────────────────┬──────┘
       │                       │                       │
┌──────▼──────────────┐ ┌──────▼──────────────┐ ┌──────▼──────────────┐
│ Quantitative Engine │ │ AI Tool Orchestrator│ │ Storage & Cache     │
│ - Technicals (14+)  │ │ - Tool Calling      │ │ - PostgreSQL        │
│ - Fundamentals (5x) │ │ - Structured Verdict│ │ - LocalStorage      │
│ - Multi-Factor 0-100│ │ - Report Generator  │ │ - TTL Caches        │
└──────┬──────────────┘ └──────┬──────────────┘ └─────────────────────┘
       │                       │
┌──────▼───────────────────────▼──────────────────────────────┐
│                 Data Provider Abstraction                   │
│  (MockDataProvider, NSE/BSE Adapters, Licensed Feeds)       │
└─────────────────────────────────────────────────────────────┘
```
