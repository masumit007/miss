# Data Pipeline Architecture
## Caching TTL Strategy
- **Live Quotes**: 5 - 15 seconds during trading hours (09:15 to 15:30 IST).
- **Intraday OHLCV**: 60 seconds.
- **Daily OHLCV & Technicals**: Refreshed after market close (16:30 IST).
- **Quarterly Results & Financial Ratios**: 24 hours.
- **Annual Reports & Balance Sheets**: 30 days.
- **IPO Subscription**: 5 minutes during active bidding days.

## Data Quality Validation
- Validation of nulls, negative denominator handling in P/E and PEG.
- Outlier filtering and corporate action split-adjustment verification.
