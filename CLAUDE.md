# CLAUDE.md — inbox-app

## What This Is
A React Native (Expo Web) email briefing prototype connected to real Gmail via OAuth. The active screen is `MorningBrief.tsx` — a tiered, classified view of the user's inbox.

## Stack
- React Native + Expo SDK 54, TypeScript strict mode
- Expo Web on port 8083 (`npx expo start --web --port 8083`)
- Custom design system: `orbit-ds/` (do NOT modify orbit-ds internals)
- Express backend at `../email-prototype/` on port 3000 (OAuth proxy + Gmail API)

## Running
```bash
# Terminal 1: backend
cd ../email-prototype && node server.js

# Terminal 2: frontend
npx expo start --web --port 8083
```
Backend requires `.env` with `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET`, and `ALLOWED_ORIGINS=http://localhost:8083`. See `../email-prototype/.env.example`.

## File Layout
```
App.tsx                         — Root: PhoneFrame + tab nav (Inbox | Briefing)
src/
  PrototypeScreen.tsx           — Renders MorningBrief
  screens/
    MorningBrief.tsx            — ★ ACTIVE SCREEN: tiered briefing UI
    (others are inactive prototypes)
  services/
    gmail.ts                    — API client: checkSession, getAuthUrl, fetchEmails
    classify.ts                 — ★ CLASSIFICATION ENGINE: rules framework
  data/
    briefing.ts                 — Types + mock data + createBriefingFromGmail factory
  hooks/
    useCountdown.ts             — Countdown timer for next briefing
  components/                   — Shared components (used by InboxScreen, not Briefing)
orbit-ds/                       — Design system (DO NOT MODIFY)
docs/
  classification-rules.md       — Source-of-truth classification framework
```

## Classification Architecture

### The Engine: `src/services/classify.ts`
Evaluates each Gmail message in strict priority order:
1. **Timely** — OTP, verification, security, URGENT, same-day meetings
2. **Spam** — phishing patterns + SPAM label
3. **Precise rules** — Calendar, Action, Payments, Packages, Comments (pattern tables)
4. **Label heuristics** — Gmail's CATEGORY_PROMOTIONS/FORUMS/SOCIAL/UPDATES
5. **Real-person detection** — personal email domain + not automated subject
6. **Default** → Other

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
- `disconnected` — "Connect Gmail" button, falls back to mock data
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
- "Open email →" chip (opens Gmail via `gmailId`)

## Key Types

```typescript
type BriefingEmail = {
  id: number;
  gmailId?: string;      // Gmail message ID for deep linking
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
