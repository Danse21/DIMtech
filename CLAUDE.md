# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

TypeScript check (tsc binary is broken in `.bin`; use node directly):
```bash
node node_modules/typescript/lib/_tsc.js --noEmit
```

## Environment

Copy `.env.local.example` → `.env.local` and fill in:
```
RESROBOT_API_KEY=<key from trafiklab.se — product: ResRobot Reseplanerare v2.1>
```

## Architecture

**Single-page app** — everything renders on `src/app/page.tsx` (client component). No separate results page.

**API key security** — the ResRobot key lives only in `.env.local` and is never exposed to the browser. All three API routes (`/api/locations`, `/api/nearby`, `/api/trips`) are thin Next.js server-side proxies to `api.resrobot.se/v2.1`.

**i18n** — language state lives in `src/context/i18n.tsx` (React context). `src/messages/en.ts` is the source of truth for all string keys; `src/messages/sv.ts` mirrors it in Swedish. No URL-based routing — just a toggle button.

**Data flow**
1. User types in `StopInput` → debounced fetch to `/api/locations?q=` → ResRobot `/location.name`
2. "Use my location" → browser Geolocation → `/api/nearby?lat=&lon=` → ResRobot `/location.nearbystops`
3. Search button → `/api/trips?originId=&destId=&date=&time=` → ResRobot `/trip`
4. Results sorted client-side in `TripList` by departure/duration/transfers
5. Each `TripCard` expands to show legs; operator deep links built from `src/lib/operators.ts`

**ResRobot response quirk** — `Trip.LegList.Leg` is either a single object or an array depending on trip complexity. Both `TripCard` and `TripList` normalize this with `Array.isArray(legs) ? legs : [legs]`.

**Operator links** — `src/lib/operators.ts` maps operator name strings (from ResRobot `Product.operator`) to web URLs and optional deep-link schemes (e.g. `sl://`, `vasttrafik://`). Add new operators there as needed.
