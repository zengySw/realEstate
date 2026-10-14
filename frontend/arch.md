  # Real Estate Platform — Architecture Document

## Overview

Next.js 16 (App Router) real estate platform with Ukrainian/Russian localization, agent dashboard, and MySQL database (XAMPP).

**Stack:** Next.js 16.4 (Turbopack), React 19, TypeScript, Drizzle ORM, MySQL (mysql2), Tailwind CSS 4

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages & API routes
│   ├── (public)/                 # Public route group (no auth)
│   │   ├── layout.tsx            # Public layout with header/footer
│   │   ├── page.tsx              # Home page (hero, featured, latest)
│   │   ├── listings/
│   │   │   ├── page.tsx          # Catalog with filters
│   │   │   ├── [id]/page.tsx     # Listing detail + inquiry form
│   │   │   └── loading.tsx       # Suspense fallback
│   │   ├── login/page.tsx        # Login form
│   │   └── register/page.tsx     # Registration form
│   ├── dashboard/                # Protected route group (auth required)
│   │   ├── layout.tsx            # Dashboard shell + stats
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── listings/
│   │   │   ├── page.tsx          # Agent's listings management
│   │   │   ├── new/page.tsx      # Create listing form
│   │   │   └── [id]/edit/page.tsx # Edit listing form
│   │   ├── requests/page.tsx     # Incoming inquiries management
│   │   ├── favorites/page.tsx    # User's favorite listings
│   │   └── settings/page.tsx     # Profile settings
│   └── api/                      # REST API endpoints
│       ├── health/route.ts       # Health check
│       ├── seed/route.ts         # Seed demo data
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── register/route.ts
│       ├── listings/
│       │   ├── route.ts          # GET list, POST create
│       │   └── [id]/route.ts     # GET, PATCH, DELETE single
│       ├── requests/
│       │   ├── route.ts          # GET list, POST create
│       │   └── [id]/route.ts     # PATCH status, DELETE
│       ├── favorites/route.ts    # GET list, POST toggle
│       └── profile/route.ts      # PATCH profile update
├── components/
│   ├── ui.tsx                    # Reusable UI primitives (Button, Input, Card, Spinner, etc.)
│   ├── site-header.tsx           # Header + Footer (server components)
│   ├── search-bar.tsx            # Search with filters (client)
│   ├── listing-card.tsx          # Listing preview card (client)
│   ├── favorite-button.tsx       # Heart toggle with optimistic UI (client)
│   ├── gallery.tsx               # Image gallery with lightbox (client)
│   ├── inquiry-form.tsx          # Contact agent form (client)
│   ├── language-switcher.tsx     # UA/RU switcher (client)
│   ├── logout-button.tsx         # Logout form (client)
│   ├── listing-filters.tsx       # Sidebar filters for catalog (client)
│   ├── auth-form.tsx             # Shared login/register form
│   └── dashboard/
│       ├── shell.tsx             # Dashboard layout wrapper
│       ├── listings-manager.tsx  # Table with status actions
│       ├── listing-form.tsx      # Create/edit form (500+ lines)
│       ├── requests-board.tsx    # Kanban-style request board
│       ├── favorites-grid.tsx    # Grid with heart-to-remove
│       └── settings-form.tsx     # Profile edit form
├── db/
│   ├── index.ts                  # Drizzle + mysql2 pool (singleton)
│   ├── schema.ts                 # 5 tables: users, sessions, listings, requests, favorites
│   └── seed.ts                   # Demo data (agents, listings, favorites, requests)
├── lib/
│   ├── auth.ts                   # Session cookies (scrypt), getCurrentUser, requireUser
│   ├── queries.ts                # All DB queries (fetchListings, fetchRequests, etc.)
│   ├── taxonomy.ts               # Enums, labels, icons for types/statuses/features
│   ├── i18n.ts                   # Translation helpers, formatting (price, date, area)
│   ├── locale.ts                 # Cookie-based locale detection (ua/ru)
│   ├── constants.ts              # Cookie names, config
│   ├── payload.ts                # Zod validators for API input
│   └── listing-defaults.ts       # Default values for new listings
├── middleware.ts                 # (none — auth via layout.tsx)
└── globals.css                   # Tailwind + custom utilities
```

---

## Database Schema (MySQL)

### Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | Agents & buyers | id, name, email (unique), password_hash, phone, role (buyer\|agent), city, bio, locale, created_at |
| `sessions` | Auth tokens | token (PK), user_id (FK→users), expires_at, created_at |
| `listings` | Property ads | id, user_id (FK→users), title/titleRu, description/descriptionRu, property_type, status, deal_type, price, city, district, address, area, rooms, bedrooms, bathrooms, floor, total_floors, land_area, year_built, features (JSON), images (JSON), contact_name, contact_phone, featured, views, created_at, updated_at |
| `requests` | Inquiries/offers | id, user_id (FK→users), listing_id (FK→listings, nullable), client_name, client_phone, client_email, message, budget, preferred_city, status (new\|contacted\|viewing\|offer\|closed), viewing_at, agent_note, created_at, updated_at |
| `favorites` | User↔Listing M2M | id, user_id (FK→users), listing_id (FK→listings), created_at, unique(user_id, listing_id) |

### Relationships

```
users 1──∞ listings
users 1──∞ sessions
users 1──∞ requests
users 1──∞ favorites
listings 1──∞ requests (nullable)
listings 1──∞ favorites
```

### Indexes

- `listings_user_idx` (user_id)
- `listings_city_idx` (city)
- `requests_user_idx` (user_id)
- `favorites_user_listing_unique` (user_id, listing_id)

---

## Authentication

**Cookie-based sessions** with 30-day TTL.

- **Token:** 32-byte hex (randomBytes)
- **Password hashing:** scrypt (64-byte key, 16-byte salt) → `salt:derived`
- **Cookie:** `SESSION_COOKIE` = token, HttpOnly, SameSite=Lax, Secure in prod
- **Validation:** `getCurrentUser()` joins `sessions` + `users`, checks `expiresAt > now()`
- **Protection:** `requireUser()` redirects to `/login` if no session

### Roles

- `buyer` — can inquire, favorite, view dashboard (requests, favorites)
- `agent` — all buyer permissions + create/edit/delete own listings, manage requests

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create user + session |
| POST | `/api/auth/login` | — | Verify password + session |
| POST | `/api/auth/logout` | ✓ | Delete session + cookie |

### Listings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/listings` | — | Filtered paginated list (query params) |
| POST | `/api/listings` | ✓ (agent) | Create listing |
| GET | `/api/listings/:id` | — | Single listing + view increment |
| PATCH | `/api/listings/:id` | ✓ (owner) | Update listing |
| DELETE | `/api/listings/:id` | ✓ (owner) | Delete listing |

### Requests (Inquiries)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/requests` | ✓ | User's requests (with listing join) |
| POST | `/api/requests` | — | Create inquiry (guest→agent routing) |
| PATCH | `/api/requests/:id` | ✓ (owner) | Update status/note |
| DELETE | `/api/requests/:id` | ✓ (owner) | Delete request |

### Favorites
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/favorites` | ✓ | User's favorite listing IDs |
| POST | `/api/favorites` | ✓ | Toggle favorite (upsert) |

### Profile
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| PATCH | `/api/profile` | ✓ | Update name, phone, city, bio, role, locale |

---

## Key Data Flows

### 1. Public Catalog (`/listings`)
```
GET /listings?type=apartment&city=Kyiv&minPrice=100000
  → fetchListings(filters) [queries.ts]
    → buildConditions() → Drizzle WHERE clauses
    → SELECT * FROM listings + JSON parse images/features
  → ListingCard[] (client) with FavoriteButton
```

### 2. Listing Detail (`/listings/[id]`)
```
Server: fetchListingById(id) + fetchAgent(userId) + fetchFavoriteIds(userId) + fetchListings(similar)
Client: Gallery + InquiryForm + FavoriteButton + similar ListingCards
```

### 3. Dashboard Listings Management
```
DashboardLayout → fetchDashboardStats(userId) [stats cards]
ListingsManager (client):
  - Local state: rows, query, statusFilter
  - Actions: changeStatus (PATCH), remove (DELETE)
  - Optimistic updates + router.refresh()
```

### 4. Favorites Toggle (Heart Button)
```
FavoriteButton (client):
  1. Optimistic: setFavorite(!favorite)
  2. POST /api/favorites {listingId}
  3. Server: upsert (DELETE if exists, INSERT if not)
  4. Response: {ok, favorited: boolean}
  5. Client: confirm or revert + onChange callback
```

### 5. Inquiry Submission
```
InquiryForm (client):
  POST /api/requests {listingId, clientName, clientPhone, clientEmail, message, budget, preferredCity}
  Server:
    - If authenticated: userId = current user
    - If guest + listingId: userId = listing owner
    - Else: userId = first agent
    - INSERT requests row
```

---

## Localization (i18n)

**Two locales:** `ua` (default), `ru`

- **Detection:** `lib/locale.ts` → cookie `locale` (1 year) → fallback `ua`
- **Switcher:** `LanguageSwitcher` sets cookie + `router.refresh()`
- **Translations:** `lib/i18n.ts` — object map with `t(locale, key)` helper
- **Formatting:** `formatPrice`, `formatNumber`, `formatDate`, `formatCompactPrice`, `pluralArea`

---

## UI Components Architecture

### Design System (Tailwind 4)
- **Colors:** `brand-*` (primary), `sand-*` (neutral warm), `rose-*` (favorite/accent)
- **Utilities:** `btn`, `btn-primary`, `btn-secondary`, `btn-danger`, `btn-ghost`, `input`, `label`, `card`, `chip`, `skeleton`
- **Animations:** `animate-fade-up`, `animate-fade-in`, `transition`, `group-hover:scale-105`

### Component Patterns
1. **Server Components by default** — data fetching in page/layout
2. **Client Components** — `"use client"` for interactivity (forms, buttons, filters)
3. **Optimistic UI** — local state update → API call → confirm/revert
4. **Toast notifications** — fixed bottom-right, auto-dismiss (2-3s)
5. **Skeletons** — `ListingCardSkeleton` for loading states

---

## Dashboard Features

### Stats (DashboardLayout)
- Total listings, active/sold/reserved counts
- Total views, avg price
- Favorites count
- Requests pipeline (new/contacted/viewing/offer/closed)

### Listings Manager
- Search by title/city
- Filter by status
- Inline status dropdown (PATCH)
- Edit link, View link, Delete button
- Thumbnail preview, price, views, request count

### Requests Board (Kanban)
- Columns: new → contacted → viewing → offer → closed
- Drag-and-drop style status change (select dropdown)
- Listing link, client info, budget, agent notes
- Viewing date picker

### Favorites Grid
- Heart button on each card (filled = in favorites)
- Click heart → remove from favorites (toggle API)
- Optimistic removal + toast "Removed from favorites"

### Settings Form
- Name, phone, city, bio, role (agent/buyer), locale
- Updates user + locale cookie

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Turbopack, image domains (pexels.com) |
| `drizzle.config.json` | MySQL dialect, schema path, connection URL |
| `tsconfig.json` | Strict TS, path aliases (`@/*`) |
| `package.json` | Scripts: dev, build, start, lint, typecheck |
| `.env` | `DATABASE_URL=mysql://root@127.0.0.1:3306/realestate` |
| `eslint.config.mjs` | Next.js + TypeScript ESLint |
| `postcss.config.mjs` | Tailwind CSS 4 PostCSS plugin |

---

## Deployment Notes

### Environment Variables
```
DATABASE_URL=mysql://user:pass@host:3306/db
ADMIN_PASSWORD=...          # for seed endpoint
ADMIN_SECRET=...            # for seed endpoint
```

### Database Setup
```bash
# 1. Create DB (XAMPP MySQL on 3306)
mysql -u root -e "CREATE DATABASE realestate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Run migrations (or use schema.sql directly)
npx drizzle-kit push

# 3. Seed demo data
curl -X POST http://localhost:3000/api/seed
```

### Build & Run
```bash
npm run build    # TypeScript + Next.js production build
npm start        # Production server
npm run dev      # Turbopack dev server (port 3000)
```

---

## Known Limitations / TODO

1. **Image optimization** — external Pexels URLs work but no local upload
2. **No email notifications** — requests only stored in DB
3. **No pagination** on public catalog (limit 60)
4. **Cyrillic mojibake** in seed data — CSV was misencoded
5. **No tests** — add Vitest/Playwright
6. **No rate limiting** on auth/forms
7. **SEO** — add metadata, sitemap, structured data
8. **Map integration** — address → coordinates

---

## File-to-Feature Map

| Feature | Key Files |
|---------|-----------|
| Home page | `app/(public)/page.tsx`, `components/search-bar.tsx` |
| Catalog + filters | `app/(public)/listings/page.tsx`, `components/listing-filters.tsx`, `components/listing-card.tsx` |
| Listing detail | `app/(public)/listings/[id]/page.tsx`, `components/gallery.tsx`, `components/inquiry-form.tsx` |
| Auth | `lib/auth.ts`, `app/api/auth/*`, `components/auth-form.tsx` |
| Dashboard shell | `app/dashboard/layout.tsx`, `components/dashboard/shell.tsx` |
| Listings CRUD | `app/dashboard/listings/*`, `components/dashboard/listings-manager.tsx`, `components/dashboard/listing-form.tsx` |
| Requests board | `app/dashboard/requests/page.tsx`, `components/dashboard/requests-board.tsx` |
| Favorites | `app/dashboard/favorites/page.tsx`, `components/dashboard/favorites-grid.tsx`, `components/favorite-button.tsx` |
| Profile settings | `app/dashboard/settings/page.tsx`, `components/dashboard/settings-form.tsx` |
| DB queries | `lib/queries.ts` |
| Translations | `lib/i18n.ts`, `lib/taxonomy.ts` |