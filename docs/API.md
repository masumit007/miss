# REST API Reference: MISS Platform
All endpoints return standard JSON responses with explicit data status, source provenance, and timestamps in Indian Standard Time (IST).

### Base URL: `/api`

### 1. Market Endpoints
- `GET /api/market/overview`: Full snapshot of indices, market status, breadth, sector momentum, and FII/DII cash flows.
- `GET /api/market/status`: Real-time market timing status (`OPEN`, `CLOSED`, `PRE-OPEN`, `POST-MARKET`).

### 2. Stock Analytics Endpoints
- `GET /api/stocks`: Retrieve all universe securities.
- `GET /api/stocks/search?q={query}`: Fuzzy search across symbol, company name, ISIN, BSE code.
- `GET /api/stocks/:symbol`: Complete stock dossier with quotes, technicals, fundamentals, smart money, and scores.
- `GET /api/stocks/:symbol/chart?tf={1D|1M|1Y}`: OHLCV candlestick series and delivery volume.
- `GET /api/stocks/:symbol/report`: Generates full structured research report.

### 3. Screener Endpoints
- `GET /api/screeners/:preset`: Executes preset screener (`breakout`, `support_rebound`, `piotroski_high`, etc.).
- `POST /api/screeners/ai-query`: Parses natural language prompt into structured filters and executes against universe.

### 4. AI & News Endpoints
- `POST /api/ai/chat`: Interactive conversational query grounded in quantitative data.
- `GET /api/news?category={POSITIVE|NEGATIVE}`: Curated financial news with AI sentiment scores.
- `GET /api/ipo`: Mainboard and SME IPO list with live subscription data.
