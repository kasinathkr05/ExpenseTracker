# ExpenseTracker

A full-stack personal expense and income tracking application.

**Stack:** React (Vite) + Tailwind CSS + Recharts on the frontend, Node.js + Express + SQLite on the backend.

## Phase 1 — Scaffolding

This phase sets up:
- `client/` — Vite + React + Tailwind app skeleton, with the folder structure for components/pages/hooks/services already in place
- `server/` — Express app skeleton with a SQLite connection and a `transactions` table migration
- Root-level scripts to run both together

No feature UI or business logic yet — just a clean, runnable skeleton for the next phases to build on.

## Setup

This environment has no network access, so dependencies could not be pre-installed here. On your own machine:

```bash
# 1. Install server deps
cd server
npm install

# 2. Install client deps
cd ../client
npm install
```

## Running

```bash
# Terminal 1 — start the API (http://localhost:4000)
cd server
npm run dev

# Terminal 2 — start the frontend (http://localhost:5173)
cd client
npm run dev
```

The Vite dev server proxies `/api/*` requests to `http://localhost:4000` (see `client/vite.config.js`), so the React app can call `fetch('/api/transactions')` without CORS issues.

## What's included in Phase 1

- `server/src/db/database.js` — opens/creates `expense_tracker.db` and runs migrations on startup
- `server/src/db/migrations/001_create_transactions.sql` — creates the `transactions` table
- `server/src/app.js` + `server/server.js` — Express app with a health-check route (`GET /api/health`)
- `client/` — Vite + React app with Tailwind configured, a placeholder `App.jsx`, and the empty folders (`components/dashboard`, `components/charts`, `pages`, `services`, etc.) that Phase 2+ will fill in
- `client/src/services/api.js` — a small fetch wrapper ready for the API calls added in later phases

## Next phase

Phase 2: Transactions table CRUD API (single-user, no auth yet).
