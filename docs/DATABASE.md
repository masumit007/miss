# Database Schema: PostgreSQL 26 Entities
Normalized relational schema designed for high-throughput equity screening and multi-year financial statements.

## Key Tables
1. `users`: User profiles, preferences, and admin roles.
2. `exchanges`: NSE and BSE market calendar, trading sessions, and timezones.
3. `companies`: Company master, CIN, ISIN, sector, industry, face value.
4. `securities`: Ticker symbols, BSE codes, exchange mappings.
5. `quotes`: Real-time and snapshot quote metrics with data provenance.
6. `ohlc_data`: Daily and intraday historical candlestick series.
7. `financial_statements`: Annual Balance Sheet, P&L, and Cash Flow line items.
8. `financial_ratios`: ROE, ROCE, P/E, PEG, P/B, EV/EBITDA, D/E.
9. `ownership`: Promoter, FII, DII, and Public quarterly shareholding and pledges.
10. `corporate_actions`: Dividends, stock splits, bonus issues, buybacks.
11. `ipo` & `ipo_subscription`: IPO issue parameters and category-wise subscription multiples.
12. `news` & `news_sentiment`: Categorized corporate news and AI sentiment scores.
13. `technical_indicators` & `technical_signals`: Calculated RSI, MACD, SMAs, S/R levels.
14. `stock_scores`: Multi-factor 0-100 scores and subfactor decompositions.
15. `watchlists` & `watchlist_items`: User and AI-generated watchlist buckets.
16. `alerts`: Informational alert rules and trigger history.
17. `data_sources`: Data lineage and provider health monitoring.
18. `system_settings` & `developer_contribution_settings`: System configurations and UPI QR parameters.
