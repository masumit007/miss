import { describe, it, expect } from 'vitest';
import { TechnicalEngine } from '../services/analytics/technicalEngine';
import { MockDataProvider } from '../services/providers/MockDataProvider';

describe('TechnicalEngine Mathematical Calculations (NEPSE)', () => {
  const provider = new MockDataProvider();

  it('calculates SMA correctly', () => {
    const prices = [10, 20, 30, 40, 50];
    const sma5 = TechnicalEngine.calculateSMA(prices, 5);
    expect(sma5).toBe(30);

    const sma3 = TechnicalEngine.calculateSMA(prices, 3);
    expect(sma3).toBe(40);
  });

  it('calculates EMA correctly', () => {
    const prices = [10, 12, 14, 16, 18, 20];
    const ema = TechnicalEngine.calculateEMA(prices, 3);
    expect(ema).toBeGreaterThan(16);
    expect(ema).toBeLessThanOrEqual(20);
  });

  it('calculates RSI 14 and classifies overbought/oversold boundaries', () => {
    const rising = Array.from({ length: 30 }, (_, i) => 100 + i * 5);
    const rsiHigh = TechnicalEngine.calculateRSI(rising, 14);
    expect(rsiHigh.value).toBeGreaterThanOrEqual(70);
    expect(rsiHigh.classification).toBe('OVERBOUGHT');

    const falling = Array.from({ length: 30 }, (_, i) => 250 - i * 5);
    const rsiLow = TechnicalEngine.calculateRSI(falling, 14);
    expect(rsiLow.value).toBeLessThanOrEqual(30);
    expect(rsiLow.classification).toBe('OVERSOLD');
  });

  it('calculates MACD lines and crossover status', () => {
    const closes = Array.from({ length: 50 }, (_, i) => 500 + Math.sin(i) * 20 + i * 2);
    const macd = TechnicalEngine.calculateMACD(closes, 12, 26, 9);
    expect(macd.fastPeriod).toBe(12);
    expect(macd.slowPeriod).toBe(26);
    expect(typeof macd.macdLine).toBe('number');
    expect(typeof macd.signalLine).toBe('number');
    expect(typeof macd.histogram).toBe('number');
  });

  it('detects Support and Resistance levels with Fibonacci retracements', async () => {
    const candles = await provider.getHistoricalCandles('NABIL');
    const quote = await provider.getQuote('NABIL');
    const sr = TechnicalEngine.calculateSupportResistance(candles, quote!.currentPrice);
    
    expect(sr.resistance1).toBeGreaterThanOrEqual(sr.support1);
    expect(sr.fibonacciLevels.fib236).toBeGreaterThan(0);
    expect(sr.fibonacciLevels.fib618).toBeGreaterThan(0);
  });
});
