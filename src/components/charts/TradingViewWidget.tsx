import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  exchange?: string;
  theme?: 'dark' | 'light';
  height?: number;
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  exchange = 'NSE',
  theme = 'dark',
  height = 480
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // TradingView ticker format e.g. NSE:RELIANCE
    const tvSymbol = `${exchange}:${symbol.toUpperCase()}`;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: 'D',
      timezone: 'Asia/Kolkata',
      theme: theme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      hide_top_toolbar: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com'
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = `${height}px`;
    widgetContainer.style.width = '100%';

    containerRef.current.appendChild(widgetContainer);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, exchange, theme, height]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 p-1">
      <div ref={containerRef} className="w-full" style={{ height: `${height}px` }}>
        <div className="flex items-center justify-center h-full text-slate-400 text-xs">
          Loading TradingView Interactive Chart ({exchange}:{symbol})...
        </div>
      </div>
    </div>
  );
};
