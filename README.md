# KILIFAIR 2026 Navigator - Final Mobile AI Routing Build

This fixed build is optimized for Windows local testing, Docker PostgreSQL, and mobile-first visitor navigation.

## Fastest Windows Start

Double-click:

```text
windows-start.bat
```

It will start/create a Docker PostgreSQL container, install dependencies, prepare Prisma tables, seed exhibitors, and open the app at `http://localhost:3000`.

## Manual Windows Commands

Use CMD or PowerShell with `.cmd` commands:

```powershell
npm.cmd install --legacy-peer-deps
npx.cmd prisma generate
npx.cmd prisma db push
npm.cmd run prisma:seed
npm.cmd run dev
```

## Local Database

Default `.env.example` is configured for:

```env
DATABASE_URL="postgresql://postgres:kilifair123@localhost:5432/kilifair"
```

Start only PostgreSQL with:

```text
postgres-start-only.bat
```

## Key Features in This Build

- Mobile-first visitor UI and bottom navigation
- Indoor expo map with CRS.Simple
- Booth polygons and clickable stands
- QR checkpoint-based route start points
- Shortest-path corridor routing demo
- AI Guide page at `/assistant`
- Exhibitor directory with seeded KILIFAIR-style data
- QR booth landing pages
- Favorites, program, recommendations, and admin starter
- Dockerfile fixed: no missing `package-lock.json` build failure

---

# KARIBU-KILIFAIR 2026 Navigator — Production Suite Starter

A mobile-first indoor expo navigator for KARIBU-KILIFAIR 2026. The project focuses on moving a visitor from one point to another inside the expo ground: search a company, open the booth, view the route from Gate A, save the booth, scan QR, and plan meetings.

## Production Suite Features

- 482 official exhibitor records from the KILIFAIR 2026 booklet exhibitor directory
- Humanized exhibitor briefs generated from company, country, category, stand number, and available website data
- Custom indoor map using Leaflet `CRS.Simple`, not GPS placeholders
- Booth polygons and marker centroids generated from stand numbers
- Gate A demo starting point and route line to selected booth
- Mobile bottom sheet for booth details, brief, favorites, QR, and navigation CTA
- Search by company, stand number, service, category, hall, and brief text
- Category filtering for safari operators, lodges, food, technology, finance, suppliers, arts/craft, and destination boards
- Favorites system saved locally on visitor device
- QR page per booth at `/qr/[booth]` for scan-to-navigate workflow
- Event companion page at `/program`
- Meeting request demo on exhibitor profile pages
- Smart recommendation rail on exhibitor profile pages
- Admin dashboard with exhibitors, booths, views, and search analytics
- PWA starter: manifest, icons, and service worker cache for key public pages
- Clean production handoff: no `.env`, `.git`, `.next`, or `node_modules`

## Core Visitor Routes

- `/` — landing page
- `/map` — indoor expo navigation map
- `/map?booth=T30` — open map with booth highlighted
- `/exhibitors` — searchable exhibitor directory
- `/exhibitors/[id]` — full exhibitor profile, meeting request, recommendations
- `/favorites` — saved visitor booth plan
- `/program` — event companion schedule
- `/qr` — general QR entry page
- `/qr/[booth]` — downloadable QR code for a specific booth

## Admin Routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/exhibitors`

Default seed admin:

```txt
Email: admin@kilifair.local
Password: Kilifair2026!
```

Change this before production use.

## Local Setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kilifair"
JWT_SECRET="replace-with-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

For Vercel + Neon, use the Neon PostgreSQL connection string in `DATABASE_URL` and set `NEXT_PUBLIC_APP_URL` to your production domain.

## Production Notes

- Use PostgreSQL for production; the schema uses arrays and JSON fields.
- Use HTTPS in production so geolocation and PWA install prompts work reliably.
- Replace demo indoor coordinates with traced polygons from the official floor layout when exact GIS/floor image calibration is available.
- QR codes are generated from `NEXT_PUBLIC_APP_URL`; set it correctly before printing booth QR codes.
- Meeting requests currently save locally as a demo workflow. For production, connect them to email, WhatsApp, CRM, or exhibitor dashboard notifications.
- PWA caching is intentionally conservative. Expand caching rules only after testing stale-data behavior.

## Recommended Next Upgrade

The next premium step is real indoor pathfinding: convert aisles into graph nodes and calculate shortest routes with Dijkstra/A*. The current version draws a clear demo route from Gate A to the selected booth and keeps the architecture ready for pathfinding.

## Production Navigation Suite Additions

This build includes an upgraded navigation layer:

- **Indoor CRS.Simple map** for expo-style navigation instead of outdoor GPS plotting.
- **Real booth polygon support** from `Booth.polygon`, so booths can be clicked/highlighted as stand shapes.
- **Dijkstra-style corridor routing** in `lib/navigationGraph.ts`, using QR checkpoint origins and walkable corridor nodes.
- **QR checkpoint positioning** from Gate A, Food Court, Stage, Media Desk, Seminar Area, B2B Lounge, and VIP Lounge.
- **AI Guide page** at `/assistant`, providing offline AI-style recommendations and direct navigation links.

### Navigation concept

Visitors scan or choose a QR checkpoint, select a booth, then the app calculates a corridor-following route instead of drawing a basic straight line.

### AI Guide concept

The `/assistant` page supports natural prompts such as:

- Find luxury safari lodges
- Show airlines and aviation exhibitors
- I need Zanzibar beach resorts
- Find food court and drinks
- Medical or emergency support exhibitors

For a production AI upgrade, connect the same UI to an API route backed by OpenAI or another LLM while keeping the current local rule-based assistant as fallback.
