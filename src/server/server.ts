import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { NepseClient } from '../services/nepse/NepseClient';
import { ProviderFactory } from '../services/providers/ProviderFactory';

import { TechnicalEngine } from '../services/analytics/technicalEngine';
import { FundamentalEngine } from '../services/analytics/fundamentalEngine';
import { SmartMoneyEngine } from '../services/analytics/smartMoneyEngine';
import { ScoringEngine } from '../services/analytics/scoringEngine';
import { ScreenerEngine } from '../services/analytics/screenerEngine';

import { AIOrchestrator } from '../services/ai/aiOrchestrator';
import { ReportGenerator } from '../services/ai/reportGenerator';

import { ScreenerPresetType } from '../types/screeners';
import { SettingsStore } from '../services/storage/settingsStore';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT || 3001);

// CORS configuration for production-safe deployment
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

const provider = ProviderFactory.getProvider();

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

app.get(
  '/api/health',
  (_req: Request, res: Response) => {
    res.json({
      success: true,
      service: 'MISS Backend',
      provider: provider.name,
      timestamp: new Date().toISOString()
    });
  }
);

/*
|--------------------------------------------------------------------------
| MARKET STATUS
|--------------------------------------------------------------------------
*/

app.get(
  '/api/market/status',
  async (_req: Request, res: Response) => {
    try {
      const status = await provider.getMarketStatus();

      res.json({
        success: true,
        data: status
      });
    } catch (error: any) {
      console.error('Market status error:', error);

      res.status(500).json({
        success: false,
        error:
          error?.message ||
          'Failed to get market status'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| MARKET OVERVIEW
|--------------------------------------------------------------------------
*/

app.get(
  '/api/market/overview',
  async (_req: Request, res: Response) => {
    try {
      const [
        primaryIndices,
        sectoralIndices,
        breadth,
        sectors,
        institutionalFlows,
        macro,
        status
      ] = await Promise.all([
        provider.getPrimaryIndices(),
        provider.getSectoralIndices(),
        provider.getMarketBreadth(),
        provider.getSectorPerformances(),
        provider.getInstitutionalFlows(),
        provider.getMacroIndicators(),
        provider.getMarketStatus()
      ]);

      res.json({
        success: true,

        data: {
          marketStatus: status,

          primaryIndices,

          sectoralIndices,

          breadth,

          sectors,

          recentInstitutionalFlows: institutionalFlows,

          macro,

          freshness: {
            timestamp: new Date().toISOString(),
            source: provider.name
          }
        }
      });
    } catch (error: any) {
      console.error(
        'Market overview error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get market data'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| ALL STOCKS
|--------------------------------------------------------------------------
*/

app.get(
  '/api/stocks',
  async (_req: Request, res: Response) => {
    try {
      const stocks =
        await provider.getAllStocks();

      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });
    } catch (error: any) {
      console.error(
        'Stocks error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get stocks'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| STOCK SEARCH
|--------------------------------------------------------------------------
*/

app.get(
  '/api/stocks/search',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const query =
        String(
          req.query.q || ''
        ).trim();

      const stocks =
        await provider.searchStocks(
          query
        );

      res.json({
        success: true,
        count: stocks.length,
        data: stocks
      });
    } catch (error: any) {
      console.error(
        'Stock search error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Search failed'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| STOCK DETAILS
|--------------------------------------------------------------------------
*/

app.get(
  '/api/stocks/:symbol',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const symbol =
        String(
          req.params.symbol
        )
          .trim()
          .toUpperCase();

      const quote =
        await provider.getQuote(
          symbol
        );

      if (!quote) {
        return res.status(404).json({
          success: false,

          error:
            `Stock ${symbol} was not found`
        });
      }

      const [
        candles,
        quarterlyResults,
        shareholding,
        corporateActions,
        bulkDeals,
        news
      ] = await Promise.all([
        provider.getHistoricalCandles(
          symbol,
          '1Y'
        ),

        provider.getQuarterlyResults(
          symbol
        ),

        provider.getShareholdingPattern(
          symbol
        ),

        provider.getCorporateActions(
          symbol
        ),

        provider.getBulkBlockDeals(
          symbol
        ),

        provider.getStockNews(
          symbol
        )
      ]);

      // NOTE: `quarterlyResults` (from provider.getQuarterlyResults) is a
      // different shape than the annual FinancialYearData[] FundamentalEngine
      // needs (balance sheet + cash flow), and no real annual-financials
      // source is wired up yet — so we pass [] and the engine returns
      // "unavailable" fundamentals honestly rather than fabricating them.
      const technicals = TechnicalEngine.performFullAnalysis(quote, candles);
      const fundamentals = FundamentalEngine.performFullAnalysis(quote, [], technicals.overallTechnicalScore);
      const smartMoney = SmartMoneyEngine.performAnalysis(quote, shareholding, bulkDeals);
      const score = ScoringEngine.calculateScore(quote, technicals, fundamentals, smartMoney);

      res.json({
        success: true,

        data: {
          quote,

          candles,

          technicals,

          fundamentals,

          smartMoney,

          score,

          quarterlyResults,

          shareholding,

          corporateActions,

          bulkDeals,

          news
        }
      });
    } catch (error: any) {
      console.error(
        `Stock ${req.params.symbol} error:`,
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get stock'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| HISTORICAL CHART
|--------------------------------------------------------------------------
*/

app.get(
  '/api/stocks/:symbol/chart',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const symbol =
        String(
          req.params.symbol
        )
          .trim()
          .toUpperCase();

      const timeframe =
        String(
          req.query.tf || '1D'
        );

      const candles =
        await provider.getHistoricalCandles(
          symbol,
          timeframe
        );

      res.json({
        success: true,

        symbol,

        timeframe,

        count:
          candles.length,

        data:
          candles
      });
    } catch (error: any) {
      console.error(
        'Chart error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get chart'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| STOCK REPORT
|--------------------------------------------------------------------------
*/

app.get(
  '/api/stocks/:symbol/report',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const symbol =
        String(
          req.params.symbol
        )
          .trim()
          .toUpperCase();

      const quote =
        await provider.getQuote(
          symbol
        );

      if (!quote) {
        return res.status(404).json({
          success: false,

          error:
            'Stock not found'
        });
      }

      const candles =
        await provider.getHistoricalCandles(
          symbol,
          '1Y'
        );

      const shareholding =
        await provider.getShareholdingPattern(
          symbol
        );

      const bulkDeals =
        await provider.getBulkBlockDeals(
          symbol
        );

      const technicals =
        TechnicalEngine.performFullAnalysis(
          quote,
          candles
        );

      const fundamentals =
        FundamentalEngine.performFullAnalysis(
          quote,
          [],
          technicals.overallTechnicalScore
        );

      const smartMoney =
        SmartMoneyEngine.performAnalysis(
          quote,
          shareholding,
          bulkDeals
        );

      const score =
        ScoringEngine.calculateScore(
          quote,
          technicals,
          fundamentals,
          smartMoney
        );

      const report =
        ReportGenerator.generateReport(
          quote,
          technicals,
          fundamentals,
          smartMoney,
          score
        );

      res.json({
        success: true,

        data:
          report
      });
    } catch (error: any) {
      console.error(
        'Report error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to generate report'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| SCREENERS
|--------------------------------------------------------------------------
*/

app.get(
  '/api/screeners/:preset',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const preset =
        String(
          req.params.preset
        ) as ScreenerPresetType;

      const results =
        await ScreenerEngine.runScreener(
          provider,
          preset
        );

      res.json({
        success: true,

        preset,

        count:
          results.length,

        data:
          results
      });
    } catch (error: any) {
      console.error(
        'Screener error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to run screener'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| AI SCREENER
|--------------------------------------------------------------------------
*/

app.post(
  '/api/screeners/ai-query',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { query } =
        req.body;

      if (!query) {
        return res.status(400).json({
          success: false,

          error:
            'Query required'
        });
      }

      const customConfig =
        ScreenerEngine.parseNaturalLanguageQuery(
          query
        );

      const results =
        await ScreenerEngine.runScreener(
          provider,
          'custom',
          customConfig
        );

      res.json({
        success: true,

        query,

        generatedConfig:
          customConfig,

        count:
          results.length,

        data:
          results
      });
    } catch (error: any) {
      console.error(
        'AI screener error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to run AI screener'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| IPO
|--------------------------------------------------------------------------
*/

app.get(
  '/api/ipo',
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const data =
        await provider.getIPOs();

      res.json({
        success: true,

        count:
          data.length,

        data
      });
    } catch (error: any) {
      console.error(
        'IPO error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get IPO data'
      });
    }
  }
);

app.get(
  '/api/ipo/:id',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const ipo =
        await provider.getIPOById(
          String(
            req.params.id
          )
        );

      if (!ipo) {
        return res.status(404).json({
          success: false,

          error:
            'IPO not found'
        });
      }

      res.json({
        success: true,

        data:
          ipo
      });
    } catch (error: any) {
      console.error(
        'IPO details error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get IPO'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| MARKET NEWS
|--------------------------------------------------------------------------
*/

app.get(
  '/api/news',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const category =
        req.query.category
          ? String(
              req.query.category
            )
          : undefined;

      const data =
        await provider.getMarketNews(
          category
        );

      res.json({
        success: true,

        count:
          data.length,

        data
      });
    } catch (error: any) {
      console.error(
        'News error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to get news'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| AI ANALYST
|--------------------------------------------------------------------------
*/

app.post(
  '/api/ai/chat',
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { message } =
        req.body;

      if (!message) {
        return res.status(400).json({
          success: false,

          error:
            'Message is required'
        });
      }

      const response =
        await AIOrchestrator.answerQuery(
          message
        );

      res.json({
        success: true,

        data:
          response
      });
    } catch (error: any) {
      console.error(
        'AI error:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          'Failed to process AI request'
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/

app.get(
  '/api/settings',
  (
    _req: Request,
    res: Response
  ) => {
    res.json({
      success: true,

      data:
        SettingsStore.getSettings()
    });
  }
);

/*
|--------------------------------------------------------------------------
| TEMPORARY NEPSE DEBUG
|--------------------------------------------------------------------------
|
| This route is ONLY for checking the raw responses from
| @rumess/nepse-api.
|
| We will remove it after fixing the normalizers.
|--------------------------------------------------------------------------
*/

app.get(
  '/api/debug/nepse',
  async (
    _req: Request,
    res: Response
  ) => {
    try {
      const client =
        NepseClient.getInstance();

      const [
        indices,
        liveMarket,
        history
      ] = await Promise.all([
        client.getIndices(),

        client.getLiveMarket(),

        client.getPriceVolumeHistory(
          'NABIL'
        )
      ]);

      res.json({
        success: true,

        indices,

        liveMarketSample:
          Array.isArray(liveMarket)
            ? liveMarket.slice(0, 2)
            : liveMarket,

        historySample:
          Array.isArray(history)
            ? history.slice(0, 2)
            : history
      });
    } catch (error: any) {
      console.error(
        'DEBUG NEPSE ERROR:',
        error
      );

      res.status(500).json({
        success: false,

        error:
          error?.message ||
          String(error)
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(
  (
    _req: Request,
    res: Response
  ) => {
    res.status(404).json({
      success: false,

      error:
        'MISS API route not found'
    });
  }
);

/*
|--------------------------------------------------------------------------
| VERCEL SERVERLESS EXPORT & LOCAL DEVELOPMENT
|--------------------------------------------------------------------------
*/

// Export for Vercel serverless execution
export default app;

// Local development only.
// Vercel imports this file as a serverless function,
// so it must not start its own HTTP listener there.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(
      `MISS backend running at http://localhost:${PORT}`
    );
  });
}
