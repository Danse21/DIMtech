# DIMtech

DIMtech is an MVP travel planner for Swedish public transport. It helps a user search a journey, compare available routes, inspect every leg, open operator ticket links, and generate a simple booking/QR confirmation flow for demo purposes.

The project was built for a hackathon-style MVP, so the focus is a complete end-to-end user journey rather than a production ticketing backend.

## MVP Highlights

- Search public transport trips between Swedish stops and cities.
- Use browser geolocation to select the nearest origin stop.
- Sort trip results by departure time, duration, or transfers.
- Expand a trip to inspect train, bus, tram, metro, walking, and transfer legs.
- Open operator-specific ticket links for supported providers.
- Switch UI language between English and Swedish.
- Continue to a booking page that reuses the same trip card UI without per-leg ticket buttons.
- Generate a QR-based trip confirmation page for presentation and prototype validation.

## Tech Stack

- **Next.js 16 App Router**: application routing, API route handlers, production build pipeline.
- **React 19**: client-side interaction, state, and component composition.
- **TypeScript**: typed ResRobot responses, trip display models, and component props.
- **Tailwind CSS v4**: responsive styling and utility-first UI implementation.
- **ResRobot Reseplanerare API v2.1**: Swedish public transport location, nearby stop, and trip data.
- **qrcode.react**: QR code rendering for the booking/ticket prototype.
- **Next Font / Geist**: optimized application typography.

## Key Solutions

### Secure API Proxy

The ResRobot API key is never exposed to the browser. Client components call local API routes, and the server-side route handlers attach the private API key before forwarding requests to ResRobot.

Implemented routes:

- `GET /api/locations?q=...`: stop/city autocomplete.
- `GET /api/nearby?lat=...&lon=...`: nearby stops from browser geolocation.
- `GET /api/trips?originId=...&destId=...&date=...&time=...`: journey search.

### Shared Trip UI

Trip rendering is decomposed into a reusable display component:

- `src/components/TripDisplayCard.tsx`: shared visual card for trip summary and leg details.
- `src/components/TripCard.tsx`: ResRobot adapter that adds live operator ticket links and the main booking CTA.
- `src/app/book/page.tsx`: reuses the same display card, but intentionally omits per-leg buy buttons and the full-trip booking CTA.

This keeps the search results and booking confirmation visually consistent while allowing each screen to control available actions.

### ResRobot Response Handling

ResRobot returns `Trip.LegList.Leg` as either a single object or an array depending on trip complexity. The app normalizes this shape before rendering, sorting, and building booking data.

### Lightweight i18n

Language state is handled with React context:

- `src/context/i18n.tsx`
- `src/messages/en.ts`
- `src/messages/sv.ts`

There is no URL-based locale routing; the MVP uses a simple in-app language toggle.

### Operator Deep Links

`src/lib/operators.ts` maps ResRobot operator names to ticket/search URLs for supported operators such as SJ, SL, Västtrafik, Skånetrafiken, Flixbus, Vy, Öresundståg, and others.

## User Flow

1. User enters an origin and destination, or selects origin with geolocation.
2. The app fetches stop suggestions through `/api/locations`.
3. The user searches trips through `/api/trips`.
4. Results are shown as expandable trip cards.
5. The user can inspect legs and open operator ticket links from the search result.
6. The user clicks `Book full trip` to open the booking prototype.
7. The booking page displays the same trip card without ticket-buy actions.
8. The user confirms and receives a QR-based trip confirmation.

## Project Structure

```text
src/
  app/
    api/
      locations/route.ts   # ResRobot location search proxy
      nearby/route.ts      # ResRobot nearby stops proxy
      trips/route.ts       # ResRobot trip search proxy
    book/page.tsx          # Booking prototype page
    trip/page.tsx          # QR trip confirmation page
    page.tsx               # Main search page
  components/
    StopInput.tsx          # Debounced stop autocomplete
    TripCard.tsx           # Search-result trip adapter/actions
    TripDisplayCard.tsx    # Shared trip summary/details UI
    TripList.tsx           # Sorting and result list
  context/
    i18n.tsx               # Language context
  lib/
    operators.ts           # Operator ticket URL mapping
    resrobot.ts            # Server-side ResRobot client
  messages/
    en.ts                  # English strings
    sv.ts                  # Swedish strings
  types/
    resrobot.ts            # ResRobot API types
```

## Running Locally

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```bash
RESROBOT_API_KEY=your_resrobot_api_key
```

The key should be from Trafiklab for product `ResRobot Reseplanerare v2.1`.

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
node node_modules/typescript/lib/_tsc.js --noEmit
npm run build
```

Note: this repository uses the direct TypeScript binary path because the local `.bin/tsc` shim is known to be unreliable in this setup.

## Demo Script

1. Open the app and switch between `EN` and `SV` to show localization.
2. Search a route, for example Stockholm to Gothenburg or another Swedish route supported by ResRobot.
3. Sort results by duration and transfers.
4. Expand a trip card to show individual legs and operator links.
5. Click `Book full trip`.
6. Show that the booking page uses the same trip card but removes the separate operator buy buttons.
7. Confirm booking and present the QR confirmation screen.

## MVP Limitations

- The booking and QR confirmation flow is a prototype, not a real paid ticketing system.
- Displayed prices are MVP placeholder values and are not returned by ResRobot.
- Operator deep links depend on each provider's public URL format and may require further production validation.
- There is no persisted user account, payment integration, or backend booking database.
- Some copy on booking/ticket screens is still hard-coded and can be moved into the i18n message files later.

## Future Improvements

- Replace placeholder prices with real fare data or operator-specific pricing integrations.
- Add persisted bookings and server-side QR validation.
- Add automated tests for trip normalization, operator links, and booking payload encoding.
- Improve mobile accessibility and keyboard navigation for stop suggestions.
- Expand i18n coverage across booking and ticket confirmation screens.
