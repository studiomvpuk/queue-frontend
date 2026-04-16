# QueueEase Merchant Portal

Production-ready Next.js 14 App Router web application for business staff to manage queues in real-time.

## Features

- **Live Queue Management**: Real-time queue status with WebSocket updates
- **Three-Column Dashboard**: Upcoming → In Queue → Just Served workflow
- **Walk-In Management**: Quick entry for walk-in customers
- **Keyboard Shortcuts**: Space = Call Next, S = Serve, N = No-show
- **Multi-Location Support**: Manage multiple locations from one account
- **Configuration UI**: Customize slot duration, max queue size, hours of operation
- **Modern Design**: Premium UI matching QueueEase design system (warm, confident, sleek)

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with CSS custom properties
- **State**: Zustand (auth) + TanStack Query v5 (server state)
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Socket.io-client with auto-reconnect
- **UI**: Custom primitives (no shadcn) matching design tokens
- **Animations**: Framer Motion

## Getting Started

### Installation

```bash
npm install
```

### Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set these variables:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint (default: http://localhost:3001/api/v1)
- `NEXT_PUBLIC_WS_URL` - WebSocket endpoint (default: ws://localhost:3001)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Architecture

### `/src/app`

- `page.tsx` - Marketing landing (hero, features, CTA)
- `login/page.tsx` - OTP authentication flow
- `(app)/` - Protected routes (auth required)
  - `dashboard/page.tsx` - Live queue management
  - `config/page.tsx` - Slot configuration
  - `locations/page.tsx` - Location list
  - `locations/[id]/page.tsx` - Location settings

### `/src/components/ui`

Minimal primitive components (no deps):
- Button, Card, Input, Dialog, Chip
- HeroNumber (large confident numerals with tnum)
- StatusPill, Avatar
- EmptyState, Toast

### `/src/lib`

- `api.ts` - Axios client with auto-refresh on 401
- `socket.ts` - Socket.io singleton with reconnect logic
- `store/auth.ts` - Zustand auth store (tokens, user)
- `hooks/useLocationQueue.ts` - React Query + WebSocket integration

## API Contract

All endpoints prefixed `/api/v1`. Responses wrapped as:

```json
{
  "data": {},
  "requestId": "uuid",
  "timestamp": "ISO8601"
}
```

Errors as:

```json
{
  "statusCode": 401,
  "code": "UNAUTHORIZED",
  "message": "Invalid token",
  "requestId": "uuid",
  "timestamp": "ISO8601"
}
```

### Authentication

- `POST /auth/otp/request { phone }` → { expiresAt }
- `POST /auth/otp/verify { phone, otp, firstName? }` → { user, tokens, isNewUser }
- `POST /auth/token/refresh { refreshToken }` → { accessToken, accessTokenExpiresIn, ... }
- `POST /auth/logout { refreshToken }` (requires Authorization Bearer)

### Queue Operations

- `GET /locations?category&nearLat&nearLng&radiusKm&search&cursor` - Paginated list
- `GET /locations/:id` - Detail with live queue
- `GET /bookings/me` - User's bookings
- `GET /bookings?locationId&status=CONFIRMED,ARRIVED` - For dashboard (STAFF/MANAGER)
- `POST /bookings/:id/arrived` - Customer arrived
- `POST /bookings/:id/serve` - Mark served
- `POST /bookings/:id/no-show` - No-show
- `POST /bookings` - Create booking (walk-in: source=WALK_IN, walkInName, walkInPhone)

### WebSocket

Connect at `NEXT_PUBLIC_WS_URL` with auth: `{ token: accessToken }` in handshake.

Client emits:
- `subscribeLocation(locationId)`

Server emits:
- `queue:update { locationId, peopleInQueue, nowServingCode, bookings: [...] }`
- `booking:update { bookingId, status, position }`

## Design System

CSS custom properties exposed globally (see `src/design-tokens.css`):

**Colors**: Brand (electric blue #1F6BFF), Signals (live/warn/busy), Neutrals (warm near-white)
**Radii**: 12px (sm) → 24px (default card) → 32px (hero)
**Shadows**: Soft, layered
**Font**: Inter (weights 400–800) with tabular figures (tnum) on numerals

Reference: `/mnt/queue/QueueEase-Design-System.html`

## Security

See `docs/SECURITY.md` for token handling, localStorage tradeoffs, and XSS mitigations.

**Key points:**
- Access tokens stored in memory (15m TTL)
- Refresh tokens in localStorage with short TTL
- Automatic 401 → refresh → retry on API calls
- Socket auth via access token in handshake

## Keyboard Shortcuts

- **Space** - Call next customer
- **S** - Mark customer as served
- **N** - Mark as no-show

## Deployment

### Docker

```bash
docker build -t queueease-web .
docker run -e NEXT_PUBLIC_API_URL=... -p 3000:3000 queueease-web
```

### Vercel

```bash
vercel deploy
```

Set env vars in Vercel project settings.

## Development Notes

- No external UI library — all components built to design spec
- Forms use React Hook Form + Zod for type-safe validation
- TanStack Query caches API responses (5m stale, 10m gc)
- Framer Motion for smooth dialogs/toasts
- Server state invalidated on socket updates for real-time sync

## License

Proprietary — QueueEase Inc.
