# CLAUDE.md — inbox-app

## What This Is
A React Native (Expo Web) email briefing prototype connected to real email (Yahoo or Gmail) via IMAP. The active screen is `MorningBrief.tsx` — a tiered, classified view of the user's inbox.

## Stack
- React Native + Expo SDK 54, TypeScript strict mode
- Expo Web on port 8083 (`npx expo start --web --port 8083`)
- Custom design system: `orbit-ds/` (do NOT modify orbit-ds internals)
- Express backend at `../email-prototype/` on port 3000 (JWT auth + IMAP)

## Running

### Local development
```bash
# Terminal 1: backend
cd ../email-prototype && node server.js

# Terminal 2: frontend
npx expo start --web --port 8083
```
Backend requires `.env` with `YAHOO_CLIENT_ID`, `YAHOO_CLIENT_SECRET`, `JWT_SECRET`, and `ALLOWED_ORIGINS=http://localhost:8083`.

### Remote access via ngrok
```bash
# Build static frontend bundle
npx expo export --platform web

# Start backend (serves API + static bundle at /app/)
cd ../email-prototype && node server.js

# Start ngrok with stable domain
ngrok http 3000 --url sprintshellproto.ngrok.io
```
**Stable remote URL**: https://sprintshellproto.ngrok.io/app/

The backend serves the Expo web build at `/app/` so a single ngrok tunnel handles both API and frontend. After any frontend code changes, re-run `npx expo export --platform web` and restart the backend.

**Note**: ngrok requires your laptop to be open and online. The URL is stable (doesn't change on restart) but the tunnel must be running.

## Auth & Login
- **LoginScreen.tsx** — two-tab form: Yahoo or Gmail, both using email + app password
- **App.tsx** — checks session on mount, shows LoginScreen if not connected, Disconnect button in nav
- **No OAuth redirect needed** — participants create an app password in their email provider's security settings
- Yahoo: login.yahoo.com → Account Security → Generate App Password (requires 2-step verification)
- Gmail: myaccount.google.com → Security → App Passwords (requires 2-step verification)

## File Layout
```
App.tsx                         — Root: session gate + PhoneFrame + tab nav (Inbox | Briefing | Disconnect)
src/
  PrototypeScreen.tsx           — Renders MorningBrief
  screens/
    LoginScreen.tsx             — Yahoo/Gmail app password login
    MorningBrief.tsx            — ★ ACTIVE SCREEN: tiered briefing UI
    ProtoZones.tsx              — Zones prototype (Surfaced / Brief / Station)
    (others are inactive prototypes)
  services/
    gmail.ts                    — API client: checkSession, loginYahooPassword, loginGmailPassword, fetchEmails, disconnect
    classify.ts                 — ★ CLASSIFICATION ENGINE: rules framework
  data/
    briefing.ts                 — Types + mock data + createBriefingFromGmail factory
  hooks/
    useBriefingData.ts          — Session check + email fetch + classification orchestration
    useCountdown.ts             — Countdown timer for next briefing
  components/                   — Shared components (used by InboxScreen, not Briefing)
orbit-ds/                       — Design system (DO NOT MODIFY)
docs/
  classification-rules.md       — Source-of-truth classification framework
```

## Classification Architecture

### The Engine: `src/services/classify.ts`
Evaluates each email message in strict priority order:
1. **Timely** — OTP, verification, security, URGENT, same-day meetings
2. **Spam** — phishing subject patterns (no label required — works for Yahoo too)
3. **Precise rules** — Calendar, Action, Payments, Packages, Comments (pattern tables)
4. **Label heuristics** — Gmail's CATEGORY_PROMOTIONS/FORUMS/SOCIAL/UPDATES (Gmail only via X-GM-LABELS)
5. **Real-person detection** — personal email domain + not automated subject
6. **Default** → Other

Yahoo has no category labels — classification falls through to pattern matching, which covers most cases.

### Categories → UI Tiers
- **Priority**: Timely, Important Context, Important Draft, Important SOP, Important Info, Action
- **Worth a Glance** (grouped accordions): Calendar, Payments, Packages, Comments, Newsletter, Social, Updates
- **Low Priority** (collapsed bar): Promotion, Other, Spam

### Real-Person Detection
A sender is "real" only if ALL of:
- From a personal domain (gmail, yahoo, outlook, icloud, etc.)
- Not an automated sender pattern (noreply, no-reply, etc.)
- Not a promo/newsletter/social sender
- Subject not automated (daily report, product update, order confirmed, etc.)

### Adding a Category
1. Add to `Category` type union
2. Add pattern tables (`*_FROM_PATTERNS`, `*_SUBJECT_PATTERNS`)
3. Add detection block in `classify()` at correct priority level
4. Add tier mapping in `tierFromClassification()`
5. Glance-tier categories auto-group into accordion bundles in the UI

### Canonical Rules
`docs/classification-rules.md` is the source-of-truth framework. Keep it in sync.

## UI Structure (MorningBrief.tsx)

### States
- `loading` — spinner, empty stats (no mock data flash)
- `disconnected` — falls back to mock data
- `connected` — real classified emails

### Sections
- **Masthead** — greeting, user email, stats, countdown timer
- **Priority** — elevated cards with expand/collapse, suggested action + "Open email" chip
- **Worth a Glance** — `GlanceCategoryGroup` accordions (Newsletter, Packages, Social, etc.)
- **Low Priority** — `LowSummaryBar` collapsed summary
- **Chrono toggle** — flat chronological view of all emails

### Every email when expanded shows:
- Preview text
- `AI: {reason}` tag
- "Open email →" chip (opens via `webLink` — Gmail web or Yahoo Mail)

## Key Types

```typescript
type BriefingEmail = {
  id: number;
  gmailId?: string;      // IMAP UID
  webLink?: string;       // Deep link to email in web client
  from: string;
  subject: string;
  preview: string;
  detail: string;
  fullBody: string;
  reason: string;         // AI classification reason shown to user
  tier: "priority" | "uncertain" | "low";
  category: string;       // Framework category name
  suggestedAction: string;
};
```

## Conventions
- Greyscale palette (G.black through G.white) — no color except brand purple in orbit-ds
- Import orbit-ds via barrel: `import { Component } from "../../orbit-ds"`
- `npx tsc --noEmit` must pass clean before committing
- Mock data in `briefing.ts` serves as fallback when backend is down — keep it realistic
- All fetch calls use `credentials: "include"` for session cookies
- `API_BASE` auto-detects: localhost for dev, same origin when served from `/app/` via ngrok
