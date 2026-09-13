# MISS NEPSE Stock Analysis Platform — Production Deployment Guide

## Overview

MISS is now configured for full-stack deployment on **Vercel** (serverless). The platform consists of:

- **Frontend**: React + Vite (served as static SPA)
- **Backend**: Express API (serverless functions via `/api` routes)
- **Data**: NEPSE market data via `@rumess/nepse-api`
- **Analytics**: Technical, Fundamental, and Smart Money engines
- **AI**: Rule-based stock analysis and screener queries

---

## Architecture Changes

### Local Development

```
Frontend → http://localhost:5173
  ↓ (via Vite proxy)
Backend  → http://localhost:3001 (/api/*)
```

**Run both:**
```bash
npm run dev      # Frontend on port 5173 with proxy to backend
npm run server   # Backend server on port 3001
```

### Vercel Production

```
Browser → https://your-app.vercel.app
  ↓ (same-origin)
Frontend HTML/CSS/JS → served from root
API Routes → /api/* → serverless functions
```

---

## Files Changed

### 1. **src/server/server.ts**
- Converted from standalone listener to serverless-compatible export
- Added `export default app` for Vercel handler
- Preserved local `app.listen()` for dev (conditional on `NODE_ENV`)
- CORS configuration now reads `CORS_ORIGIN` env var

### 2. **api/index.ts** (NEW)
- Vercel serverless entry point
- Wraps Express app and handles HTTP requests
- Handles CORS preflight OPTIONS requests
- Routes all `/api/*` requests to Express

### 3. **src/services/api/client.ts**
- Smart API URL resolution:
  - Production: Uses same-origin relative paths (`/api/...`)
  - Local dev: Falls back to `http://localhost:3001` or `VITE_API_URL`
- No hardcoded localhost in production

### 4. **vite.config.ts**
- Changed `base: '/miss/'` → `base: '/'` for Vercel root
- Added dev server proxy: `/api/*` → `http://localhost:3001`
- Enables local development without environment setup

### 5. **vercel.json** (NEW)
- Builds frontend and backend
- Routes `/api/*` to serverless handler
- Routes all other paths to SPA root (`/index.html`)
- Caching headers for static assets
- Security headers (X-Content-Type-Options, etc.)

### 6. **package.json**
- Added `@vercel/node` dependency for serverless types
- Scripts unchanged; local workflows still work

### 7. **.env.example** (NEW)
- Template for required environment variables
- `VITE_API_URL` (optional, for custom deployments)
- `CORS_ORIGIN` (optional, defaults to `*` for dev)
- `NODE_ENV`, `PORT` (for local dev)

### 8. **.github/workflows/vercel-deploy.yml** (NEW)
- Automated deployment to Vercel on `main` push
- Requires GitHub secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

### 9. **.gitignore**
- Updated to protect `.env`, `.env.local`, `.env.production.local`
- `.env.example` remains tracked (template only)

---

## Environment Variables for Vercel

### Required in Vercel Project Settings

**None are strictly required.** MISS works with defaults. However, you may want to set:

1. **CORS_ORIGIN** (optional)
   - Default: `*` (allows all origins)
   - Production recommendation: Set to your frontend domain(s)
   - Example: `https://miss.example.com,https://www.miss.example.com`

2. **VITE_API_URL** (optional)
   - Leave blank to use same-origin routes (recommended)
   - Only set if frontend and backend are on different domains
   - Example: `https://api.miss.example.com`

### How to Set in Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable with scope: `Production`
4. Redeploy

---

## Deployment Steps

### 1. Prepare GitHub Repository

Ensure these files are committed:
- `vercel.json` (configuration)
- `api/index.ts` (serverless handler)
- `src/server/server.ts` (updated for serverless)
- `.env.example` (no actual secrets)
- `.github/workflows/vercel-deploy.yml` (GitHub Actions)

### 2. Create Vercel Project

```bash
# Option A: CLI
npm install -g vercel
vercel

# Option B: Web
# 1. Visit vercel.com/new
# 2. Import your GitHub repository
# 3. Framework preset: Other
# 4. Root directory: ./
# 5. Build command: npm run build
# 6. Output directory: dist
```

### 3. Configure Environment Variables

In Vercel Project Settings → Environment Variables:
- (Optional) `CORS_ORIGIN` = your domain(s)
- (Optional) `VITE_API_URL` = if using a separate backend domain
- **Do NOT commit secrets to repository**

### 4. Deploy

```bash
# Automatic (recommended)
# Push to main branch; GitHub Actions will deploy

# Manual
vercel --prod
```

---

## Verification Checklist

After deployment:

- [ ] **SPA Routes Work**
  - Visit `/` → homepage loads
  - Visit `/stock/NABIL` → stock detail page loads (no 404)
  - Browser refresh on any page still works

- [ ] **API Requests Work**
  - `GET /api/health` → `{ success: true, service: "MISS Backend", ... }`
  - `GET /api/market/overview` → market data loads
  - `GET /api/stocks` → stock list loads
  - `POST /api/ai/chat` → AI analysis responds

- [ ] **Frontend API Calls Use Correct URL**
  - Open browser DevTools → Network
  - Requests to `/api/...` should be same-origin (no `http://localhost:3001`)

- [ ] **CORS Headers Present**
  - API responses include `Access-Control-Allow-Origin` header

---

## Troubleshooting

### Problem: API requests fail with 404
**Cause:** Routes not reaching serverless handler.

**Solution:**
1. Check `vercel.json` routes configuration
2. Ensure `/api/index.ts` exists
3. Run `vercel logs` to see function logs
4. Redeploy: `vercel --prod`

### Problem: SPA routes return 404 (e.g., `/stock/NABIL`)
**Cause:** Requests not routed to `index.html`.

**Solution:**
1. Verify `vercel.json` route `{ src: "/(.*)", dest: "/" }`
2. Frontend should use client-side routing (React Router)
3. Redeploy

### Problem: Frontend makes requests to `http://localhost:3001`
**Cause:** `VITE_API_URL` is set or API client fallback triggered.

**Solution:**
1. Remove `VITE_API_URL` from Vercel environment
2. Redeploy
3. Verify `src/services/api/client.ts` logic (should use `/api/...` in production)

### Problem: CORS errors in browser console
**Cause:** `CORS_ORIGIN` too restrictive or preflight OPTIONS failing.

**Solution:**
1. Set `CORS_ORIGIN=*` in Vercel (development)
2. Check `api/index.ts` OPTIONS handler
3. Verify `Express cors()` middleware in `src/server/server.ts`

### Problem: Build fails
**Cause:** TypeScript errors or missing dependencies.

**Solution:**
```bash
npm install          # Ensure all deps installed
npm run build        # Check build locally
npm test             # Run tests
npx tsc --noEmit     # Check TypeScript
```

---

## Local Development (No Changes Required)

```bash
# Terminal 1: Frontend
npm run dev
# → http://localhost:5173 (with proxy to /api routes)

# Terminal 2: Backend
npm run server
# → http://localhost:3001

# Visit http://localhost:5173 in browser
```

**The Vite proxy (`vite.config.ts`) redirects `/api/*` to `localhost:3001` automatically.**

---

## Fallback: Railway or Other Platforms

If you need to use Railway or another platform instead:

1. **Railway:**
   - Use `railway.json` (not modified)
   - Deploy as full-stack app
   - Set `CORS_ORIGIN` in environment

2. **Other Serverless Platforms** (AWS Lambda, Google Cloud Run, etc.):
   - Use `src/server/server.ts` directly (exports `app`)
   - Configure platform-specific handlers
   - Adjust routes/environment variable names as needed

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│            Vercel (Production)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ Frontend (React + Vite)                      │  │
│  │ - SPA routes: /, /stock/..., /screeners,... │  │
│  │ - Served from dist/                         │  │
│  │ - API calls: /api/...                       │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                              │
│                     ↓ (same-origin)               │
│  ┌──────────────────────────────────────────────┐  │
│  │ /api/* Routes (Serverless Functions)        │  │
│  │ api/index.ts → Express app                  │  │
│  │ - /api/health                               │  │
│  │ - /api/market/*                             │  │
│  │ - /api/stocks/*                             │  │
│  │ - /api/screeners/*                          │  │
│  │ - /api/ipo/*                                │  │
│  │ - /api/news                                 │  │
│  │ - /api/ai/chat                              │  │
│  │ - /api/settings                             │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                              │
└─────────────────────┼──────────────────────────────┘
                      │
                      ↓ (external)
            ┌─────────────────────┐
            │  NEPSE Market Data  │
            │ (@rumess/nepse-api) │
            └─────────────────────┘

┌─────────────────────────────────────────────────────┐
│      Local Development (npm run dev + npm run server)│
├─────────────────────────────────────────────────────┤
│                                                     │
│  Browser → http://localhost:5173                   │
│             (Vite + React)                         │
│             ↓ /api/* proxy ↓                       │
│             http://localhost:3001                  │
│             (Express Backend)                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "feat: Enable Vercel serverless deployment"
   git push origin main
   ```

2. **Create Vercel project** (web or CLI)

3. **Set environment variables** (if needed)

4. **Monitor deployment** → Vercel logs / GitHub Actions

5. **Test all routes** → Market data, stock details, screeners, AI

---

## Questions?

Refer to:
- [Vercel Node.js Docs](https://vercel.com/docs/functions/nodejs)
- [Express.js Guide](https://expressjs.com/)
- [Vite Guide](https://vitejs.dev/)

Good luck with your MISS NEPSE deployment! 🚀
