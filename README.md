
# Tokyo Itinerary & Accommodation Planner

A full-stack Next.js app that recommends Tokyo districts based on your travel style and shows **live hotel prices** (Amadeus API) and **curated restaurants** (Google Places).

## Live Demo

> To deploy your own live URL quickly, see **Deployment** below. This repo is designed for one-click deploys on Vercel (frontend + serverless API routes).

## Features

- Guided questionnaire (trip length, budget, 5 priority sliders)
- Smart split-stay recommendation across two Tokyo districts
- Live hotel search (Amadeus Hotel Offers by lat/lng)
- Restaurant search (Google Places Nearby Search) with rating and price filters
- Clean, mobile-friendly UI (Tailwind CSS)
- **MOCK mode** to run without any API keys

## Tech Stack

- **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**
- Serverless API routes under `/app/api/*`
- **Amadeus Self-Service APIs** for hotel offers
- **Google Places API** for restaurants

---

## Quick Start (Local)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   Copy `.env.example` to `.env.local` and fill the values:
   ```bash
   cp .env.example .env.local
   ```

   - Get **Amadeus** credentials (free tier): https://developers.amadeus.com/
     - Set `AMADEUS_ENV=test` for test environment (works with sandbox data).
   - Create a **Google Cloud** project, enable Places API, and generate `GOOGLE_PLACES_API_KEY`.

   To try without keys, set `MOCK=1` in `.env.local`.

3. **Run**
   ```bash
   npm run dev
   ```
   App runs at http://localhost:3000

---

## Deployment (Vercel)

1. Push this project to your GitHub.
2. On https://vercel.com/new, import your repo.
3. Add the following **Environment Variables** in Vercel Project Settings:
   - `AMADEUS_API_KEY`
   - `AMADEUS_API_SECRET`
   - `AMADEUS_ENV` = `test` or `prod`
   - `GOOGLE_PLACES_API_KEY`
   - (optional) `MOCK=0`

4. Deploy. Vercel will build Next.js and expose a public URL.

> **Note:** Amadeus `test` environment returns realistic but limited availability. For full live rates, switch to `prod` once approved.

---

## API Notes

### Amadeus OAuth Token
We fetch an access token (cached in-memory per serverless instance) using your key/secret:
- `POST /v1/security/oauth2/token`

### Hotel Offers
- `GET /v2/shopping/hotel-offers?latitude={lat}&longitude={lng}&radius=5&radiusUnit=KM&adults=2&roomQuantity=1&currency=USD`

### Google Places (Restaurants)
- Nearby Search with `type=restaurant`, `radius=2000`, sorted by prominence, filtered by rating and price.

---

## District Mapping

We map Tokyo districts to coordinates and category weights:
- **Shinjuku** (nightlife, shopping)
- **Shibuya** (nightlife, shopping, foodie)
- **Ginza** (luxury shopping, foodie)
- **Asakusa** (culture/history, quiet)
- **Ueno** (museums/culture, quiet)
- **Roppongi** (nightlife, art)
- **Daikanyama/Nakameguro** (quiet, foodie, boutique shopping)

The backend picks top two matches by your slider priorities, then intelligently splits the stay across them.

---

## Security

- All remote calls are proxied through server routes (`/app/api/*`) so your keys never hit the client.
- Use Vercel app-level environment variables. Never commit keys.

---

## MOCK Mode

Set `MOCK=1` to bypass external APIs. Returns sample hotels/restaurants so you can preview the UI.

---

## License

MIT
