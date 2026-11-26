# GOLDEN ELITE - Frontend

A luxury black and muted-gold React + Vite frontend for the GOLDEN ELITE private social and premium content platform.

## Setup

1. Clone the repository:
```bash
git clone https://github.com/goldeneliteregistrations-commits/golden-elite-website.git
cd golden-elite-website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

## Tech Stack

- React 18
- Vite
- @supabase/supabase-js
- React Router DOM

## Features

- Public landing/login screen
- Email/password sign-in and sign-up UI
- Auth session handling
- Protected app shell
- Role-aware navigation (Admin, Elite Lister, Member)
- Feed home for members and approved listers
- Discover Elite Listers page
- Lister profile page
- Member dashboard
- Lister dashboard
- Admin dashboard
- Red Door Room (COMING SOON)

## Pricing Display Only

- Daily: R39
- Weekly: R99
- Monthly: R159
- Yearly: R1,359
- Content-only Lister: Free
- Service Lister: R200/month (after first month free)
- Services plus content: R200/month

## Backend

Supabase is the backend. No database schema, auth settings, or Supabase project changes are needed from the frontend.
