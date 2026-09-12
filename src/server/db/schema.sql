-- ============================================================
-- MISS (Mini Intelligent Stock System) PostgreSQL Schema
-- Built by Sumit
-- Normalized relational database schema covering all 26 entities
-- ============================================================

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'USER', -- 'USER', 'ADMIN', 'ANALYST'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Exchanges
CREATE TABLE IF NOT EXISTS exchanges (
    code VARCHAR(10) PRIMARY KEY, -- 'NSE', 'BSE'
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50) DEFAULT 'India',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    isin VARCHAR(12) UNIQUE NOT NULL,
    cin VARCHAR(30),
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    face_value NUMERIC(10, 2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Securities
CREATE TABLE IF NOT EXISTS securities (
    symbol VARCHAR(50) PRIMARY KEY,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    exchange_code VARCHAR(10) REFERENCES exchanges(code),
    bse_code VARCHAR(20),
    security_type VARCHAR(20) DEFAULT 'EQUITY',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Quotes (Real-time / Snapshot)
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    current_price NUMERIC(15, 2) NOT NULL,
    day_change NUMERIC(15, 2) NOT NULL,
    day_change_percent NUMERIC(8, 4) NOT NULL,
    open_price NUMERIC(15, 2) NOT NULL,
    high_price NUMERIC(15, 2) NOT NULL,
    low_price NUMERIC(15, 2) NOT NULL,
    prev_close NUMERIC(15, 2) NOT NULL,
    volume BIGINT NOT NULL,
    delivery_volume BIGINT,
    delivery_percentage NUMERIC(6, 2),
    data_status VARCHAR(20) DEFAULT 'DEMO DATA', -- 'LIVE', 'DELAYED', 'EOD', 'CACHED', 'DEMO DATA'
    data_source VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. OHLC Data (Historical Series)
CREATE TABLE IF NOT EXISTS ohlc_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    timeframe VARCHAR(10) DEFAULT '1D',
    candle_date DATE NOT NULL,
    open NUMERIC(15, 2) NOT NULL,
    high NUMERIC(15, 2) NOT NULL,
    low NUMERIC(15, 2) NOT NULL,
    close NUMERIC(15, 2) NOT NULL,
    volume BIGINT NOT NULL,
    delivery_volume BIGINT,
    vwap NUMERIC(15, 2),
    UNIQUE(symbol, timeframe, candle_date)
);

-- 7. Financial Statements (Annual & Balance Sheets)
CREATE TABLE IF NOT EXISTS financial_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    fiscal_year VARCHAR(10) NOT NULL, -- 'FY26', 'FY25'
    revenue NUMERIC(20, 2) NOT NULL,
    ebitda NUMERIC(20, 2) NOT NULL,
    operating_profit NUMERIC(20, 2) NOT NULL,
    net_profit NUMERIC(20, 2) NOT NULL,
    eps NUMERIC(10, 2) NOT NULL,
    operating_cash_flow NUMERIC(20, 2) NOT NULL,
    capex NUMERIC(20, 2) NOT NULL,
    free_cash_flow NUMERIC(20, 2) NOT NULL,
    total_assets NUMERIC(20, 2) NOT NULL,
    total_equity NUMERIC(20, 2) NOT NULL,
    total_debt NUMERIC(20, 2) NOT NULL,
    cash_investments NUMERIC(20, 2) NOT NULL,
    current_assets NUMERIC(20, 2) NOT NULL,
    current_liabilities NUMERIC(20, 2) NOT NULL,
    shares_count NUMERIC(15, 2) NOT NULL,
    dividend_per_share NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, fiscal_year)
);

-- 8. Financial Ratios
CREATE TABLE IF NOT EXISTS financial_ratios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    roe NUMERIC(8, 2),
    roce NUMERIC(8, 2),
    roa NUMERIC(8, 2),
    pe NUMERIC(10, 2),
    peg NUMERIC(10, 2),
    pb NUMERIC(10, 2),
    ev_ebitda NUMERIC(10, 2),
    debt_to_equity NUMERIC(8, 2),
    interest_coverage NUMERIC(8, 2),
    current_ratio NUMERIC(8, 2),
    quick_ratio NUMERIC(8, 2),
    dividend_yield NUMERIC(6, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Ownership & Promoter Holdings
CREATE TABLE IF NOT EXISTS ownership (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    quarter VARCHAR(20) NOT NULL,
    promoter_percent NUMERIC(6, 2) NOT NULL,
    promoter_pledged_percent NUMERIC(6, 2) NOT NULL,
    fii_percent NUMERIC(6, 2) NOT NULL,
    dii_percent NUMERIC(6, 2) NOT NULL,
    public_percent NUMERIC(6, 2) NOT NULL,
    fii_change_qoq NUMERIC(6, 2),
    dii_change_qoq NUMERIC(6, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(symbol, quarter)
);

-- 10. Corporate Actions
CREATE TABLE IF NOT EXISTS corporate_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    announcement_date DATE NOT NULL,
    ex_date DATE,
    record_date DATE,
    details TEXT NOT NULL,
    ratio_amount VARCHAR(50),
    source_url VARCHAR(255)
);

-- 11. IPO Data
CREATE TABLE IF NOT EXISTS ipo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'UPCOMING', 'OPEN', 'CLOSED', 'LISTED'
    open_date DATE,
    close_date DATE,
    listing_date DATE,
    price_band_min NUMERIC(15, 2),
    price_band_max NUMERIC(15, 2),
    lot_size INT,
    issue_size_crores NUMERIC(15, 2),
    fresh_issue_crores NUMERIC(15, 2),
    ofs_crores NUMERIC(15, 2),
    research_score INT,
    business_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. IPO Subscriptions
CREATE TABLE IF NOT EXISTS ipo_subscription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ipo_id UUID REFERENCES ipo(id) ON DELETE CASCADE,
    qib_multiple NUMERIC(10, 2),
    nii_multiple NUMERIC(10, 2),
    retail_multiple NUMERIC(10, 2),
    overall_multiple NUMERIC(10, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. News
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    source VARCHAR(150) NOT NULL,
    source_tier VARCHAR(100) NOT NULL,
    url VARCHAR(500),
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(100),
    is_fact BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. News Sentiment
CREATE TABLE IF NOT EXISTS news_sentiment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    symbol VARCHAR(50) REFERENCES securities(symbol),
    sentiment VARCHAR(20) NOT NULL, -- 'POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED'
    sentiment_score NUMERIC(5, 2),
    reasoning TEXT
);

-- 15. Technical Indicators
CREATE TABLE IF NOT EXISTS technical_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    rsi_14 NUMERIC(6, 2),
    macd_line NUMERIC(10, 2),
    macd_signal NUMERIC(10, 2),
    macd_histogram NUMERIC(10, 2),
    sma_20 NUMERIC(15, 2),
    sma_50 NUMERIC(15, 2),
    sma_200 NUMERIC(15, 2),
    adx_14 NUMERIC(6, 2),
    support_1 NUMERIC(15, 2),
    resistance_1 NUMERIC(15, 2),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Technical Signals
CREATE TABLE IF NOT EXISTS technical_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    signal_type VARCHAR(50) NOT NULL,
    confidence_score INT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Screening Results Cache
CREATE TABLE IF NOT EXISTS screening_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screener_preset VARCHAR(100) NOT NULL,
    results_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Stock Scores (0-100)
CREATE TABLE IF NOT EXISTS stock_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    fundamental_score INT,
    technical_score INT,
    growth_score INT,
    valuation_score INT,
    smart_money_score INT,
    risk_score INT,
    news_score INT,
    macro_score INT,
    scoring_data_json JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. AI Analysis Cache
CREATE TABLE IF NOT EXISTS ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    prompt TEXT,
    response TEXT NOT NULL,
    structured_verdict_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Watchlists
CREATE TABLE IF NOT EXISTS watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Watchlist Items
CREATE TABLE IF NOT EXISTS watchlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(watchlist_id, symbol)
);

-- 22. Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(50) REFERENCES securities(symbol) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL,
    threshold_value NUMERIC(15, 2),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 23. Data Sources & Provider Status
CREATE TABLE IF NOT EXISTS data_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'HEALTHY',
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    latency_ms INT DEFAULT 45
);

-- 24. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(255),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 25. System Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 26. Developer Contribution Settings
CREATE TABLE IF NOT EXISTS developer_contribution_settings (
    id INT PRIMARY KEY DEFAULT 1,
    enabled BOOLEAN DEFAULT TRUE,
    header_text VARCHAR(255) NOT NULL,
    description_text TEXT NOT NULL,
    upi_id VARCHAR(100) NOT NULL,
    qr_image_url VARCHAR(500) NOT NULL,
    developer_name VARCHAR(100) DEFAULT 'Sumit',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_quotes_symbol ON quotes(symbol);
CREATE INDEX IF NOT EXISTS idx_ohlc_symbol_date ON ohlc_data(symbol, candle_date DESC);
CREATE INDEX IF NOT EXISTS idx_ratios_symbol ON financial_ratios(symbol);
CREATE INDEX IF NOT EXISTS idx_scores_symbol ON stock_scores(symbol);
CREATE INDEX IF NOT EXISTS idx_news_symbol ON news_sentiment(symbol);
