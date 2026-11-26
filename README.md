GOLDEN ELITE - Frontend
=======================

A luxury black and muted-gold React + Vite frontend for the GOLDEN ELITE private social and premium content platform.

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/goldeneliteregistrations-commits/golden-elite-website.git
cd golden-elite-website

# 2. Install dependencies
npm install

# 3. Copy the example env file to .env and set your Supabase credentials
cp .env.example .env
# Edit .env and set:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# 4. Build (production)
npm run build

# 5. Start the development server
npm run dev
```

> **Important:** This frontend is still a work-in-progress and needs real browser and Supabase integration testing. Authentication, data fetching, and write operations have not yet been validated against a live Supabase project.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

* `VITE_SUPABASE_URL` — Your Supabase project URL
* `VITE_SUPABASE_PUBLISHABLE_KEY` — Your Supabase anon / public key

Do **not** commit real keys to the repository.

## Tech Stack

* React 18
* Vite
* @supabase/supabase-js
* React Router DOM

## Current Status

The frontend provides the full UI skeleton with pages for login/signup, Elite Feed, Discover Listers, Lister profiles, Member Dashboard, Lister Dashboard, Admin Dashboard, and a "Red Door Room" (COMING SOON) page.

All data views are currently placeholder — they display "No data available yet" messages. Real integration with Supabase (auth, database queries, storage) remains to be implemented and tested.

### Pricing Display Only

* Daily Member: R39
* Weekly Member: R99
* Monthly Member: R159
* Yearly Member: R1,359
* Content-only Lister: Free
* Service Lister: R200/month (first month free)
* Services + Content Lister: R200/month

### Backend

Supabase is the intended backend. No database schema, auth settings, or Supabase project changes are required from the frontend code itself. The Supabase client is configured via `import.meta.env` — no hardcoded credentials exist.

## License

Private project — not for public distribution.
