/**
 * Vercel Serverless Handler for MISS Backend
 *
 * This file serves as the entry point for Vercel's serverless execution.
 * It wraps the Express application, pre-bundled into a single self-contained
 * file (api/_server-bundle.mjs) by `npm run build:api` at build time, so
 * there are no runtime relative-import lookups left for Node's strict ESM
 * resolver to fail on.
 *
 * For local development, run: npm run server
 * For Vercel deployment, this file is automatically invoked.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import app from './_server-bundle.mjs';

// Vercel serverless handler
export default (req: VercelRequest, res: VercelResponse) => {
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
    );
    return res.status(200).end();
  }

  // Route to Express app
  return app(req, res);
};
