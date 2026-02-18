# Inbox App — Morning Briefing Prototype

A React Native (Expo Web) prototype that displays a batched email briefing UI connected to a real Gmail inbox via OAuth. Emails are classified client-side using a comprehensive rules framework and displayed in a tiered, grouped UI.

## Architecture

```
Expo Web App (port 8083)  ──fetch──>  Express Backend (port 3000)  ──googleapis──>  Gmail API
                                       ↕ session-based OAuth
                                       ↕ /auth/google → Google consent
                                       ↕ /api/emails → real inbox data
                                       ↕ /api/session → connection status
```

### Frontend (this repo)
- **Stack**: React Native + Expo SDK 54, TypeScript strict mode
- **Design system**: Custom `orbit-ds/` component library (greyscale palette)
- **Entry screen**: `src/screens/MorningBrief.tsx`

### Backend (separate repo)
- **Location**: `../email-prototype/` (sibling directory)
- **Stack**: Express 5, `googleapis`, `express-session` with file-based store
- **Provides**: Google OAuth flow, Gmail API proxy, session management

## Setup

### 1. Backend

```bash
cd ../email-prototype

# Create .env from template
cp .env.example .env
# Fill in: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET
# Set: ALLOWED_ORIGINS=http://localhost:8083

npm install
node server.js
# → http://localhost:3000
# → Verify: curl localhost:3000/health → {"status":"ok"}
```

### 2. Frontend

```bash
cd inbox-app
npm install
npx expo start --web --port 8083
# → http://localhost:8083
```

## Auth Flow

1. App opens → checks `GET :3000/api/session` for existing session
2. If disconnected → "Connect Gmail" button appears in masthead
3. Tap → navigates to `localhost:3000/auth/google?redirect=http://localhost:8083`
4. Google OAuth consent screen → approve
5. Backend exchanges code for tokens, stores in session, redirects to `:8083`
6. App reloads → session active → fetches real emails → classifies → displays

## Key Files

| File | Purpose |
|------|---------|
| `src/screens/MorningBrief.tsx` | Main briefing screen — tiered view with grouped accordions |
| `src/data/briefing.ts` | Types (`BriefingEmail`, `Briefing`), mock data fallback, `createBriefingFromGmail()` factory |
| `src/services/gmail.ts` | API client — `checkSession()`, `getAuthUrl()`, `fetchEmails()` |
| `src/services/classify.ts` | Full classification engine — rules framework implementation |
| `src/hooks/useCountdown.ts` | Countdown timer hook for next-briefing display |
| `orbit-ds/` | Orbit Design System — shared component library |
| `docs/classification-rules.md` | Source-of-truth classification framework (categories, action types, decision tree) |

## Email Classification

### Framework

The classifier in `src/services/classify.ts` implements the comprehensive rules framework documented in `docs/classification-rules.md`. It evaluates emails in strict priority order:

1. **Timely rules** — OTP codes, verification, security alerts, `URGENT`, same-day meeting changes
2. **Spam detection** — phishing patterns + Gmail SPAM label
3. **Precise classification rules** — Calendar invites, Action items (bills/deadlines/docusigns), Payment confirmations, Packages/shipping, Collaboration comments
4. **Label + sender heuristics** — Gmail's `CATEGORY_PROMOTIONS`, `CATEGORY_FORUMS`, `CATEGORY_SOCIAL`, `CATEGORY_UPDATES` labels, plus sender pattern tables
5. **Real-person detection** — personal email domain (gmail, yahoo, outlook, etc.) + not automated subject pattern
6. **Default** → Other (BriefAction)

### Categories & Action Types

The framework defines 4 action types from `docs/classification-rules.md`:

| Action Type | Behavior |
|-------------|----------|
| **InboxAction** | Stays in inbox, no processing — for human decision-making |
| **DraftAction** | Stays in inbox, AI drafts reply — for emails needing responses |
| **BriefAction** | Archived, included in daily Brief — for informational content |
| **UnsubscribeAction** | Archived, sender blocked — for spam |

### Categories → UI Tiers

| UI Tier | Categories | UI Treatment |
|---------|-----------|--------------|
| **Priority** | Timely, Important Context, Important Draft, Important SOP, Important Info, Action | Elevated card with expand/collapse, suggested action chip |
| **Worth a Glance** | Calendar, Payments, Packages, Comments, Newsletter, Social, Updates | Grouped accordion bundles by category |
| **Low Priority** | Promotion, Other, Spam | Collapsed summary bar |

### Real-Person Detection

A sender is classified as a "real person" (→ Priority) only if:
- From a **personal email domain** (gmail.com, yahoo.com, outlook.com, icloud.com, etc.)
- NOT an automated sender (noreply, no-reply, mailer-daemon, etc.)
- NOT a promo/newsletter/social sender pattern
- Subject does NOT match automated patterns (daily report, product update, order confirmed, etc.)

This prevents company newsletters, product updates, and automated reports from flooding Priority even when sent by named individuals.

## UI Structure

### Briefing View (default)

```
┌─────────────────────────────────────┐
│  MORNING BRIEFING                   │
│  Good morning, Matt.                │
│  user@gmail.com                     │
│  [Connect Gmail] (if disconnected)  │
│  3 priority · 8 glance · 4 filtered │
│  Next briefing in 5:30  [Get it now]│
├─────────────────────────────────────┤
│  ● PRIORITY          3 items        │
│  ├─ Email subject                   │
│  │  From · Category           ▾     │
│  │  (expanded: detail, AI reason,   │
│  │   suggested action, Open email)  │
│  ├─ ...                             │
├─────────────────────────────────────┤
│  Worth a Glance                     │
│  ┌─ Newsletter (3 emails)     ▾     │
│  │  ├─ Email 1                      │
│  │  ├─ Email 2                      │
│  │  └─ Email 3                      │
│  ┌─ Packages (2 emails)       ▾     │
│  │  └─ ...                          │
│  ┌─ Social (2 emails)         ▾     │
│  │  └─ ...                          │
│  ┌─ Updates (1 email)         ▾     │
│  │  └─ ...                          │
├─────────────────────────────────────┤
│  4 low-priority — filtered     ▾    │
│  (expands to show promo/other)      │
├─────────────────────────────────────┤
│  Switch to chronological view →     │
└─────────────────────────────────────┘
```

### Every email, when expanded, shows:
- Preview/detail text
- AI classification reason tag
- **"Open email →"** chip — opens the actual email in Gmail (all sections, always)

### Additional UI features:
- **Greyscale design** — minimal, newspaper-style aesthetic
- **Progressive disclosure** — tap to expand any email for details
- **Countdown timer** — shows time until next briefing with "Get it now" pull-early
- **Chronological toggle** — switch between tiered briefing view and flat chronological list
- **Graceful fallback** — shows hardcoded mock data when backend is unavailable
- **Loading state** — spinner during session check, no flash of mock data

## API Contract

All requests use `credentials: 'include'` for session cookies.

### `GET /api/session`
```json
{ "connected": true, "userEmail": "matt@gmail.com" }
```

### `GET /api/emails?maxResults=30`
```json
{
  "messages": [
    {
      "id": "abc123",
      "threadId": "def456",
      "snippet": "Preview text...",
      "from": "Jane Doe <jane@example.com>",
      "to": "matt@gmail.com",
      "subject": "Re: Project update",
      "date": "Mon, 17 Feb 2026 09:30:00 -0500",
      "labelIds": ["INBOX", "UNREAD", "IMPORTANT"],
      "isUnread": true,
      "isStarred": false
    }
  ],
  "nextPageToken": null,
  "resultSizeEstimate": 30
}
```

### `GET /auth/google?redirect=http://localhost:8083`
Redirects to Google OAuth consent, then back to the redirect URL after auth.

## TypeScript

```bash
npx tsc --noEmit  # should pass clean
```

## Extending the Classifier

To add a new category or adjust classification:

1. **Add category** to the `Category` type union in `classify.ts`
2. **Add pattern tables** (e.g., `NEW_CAT_FROM_PATTERNS`, `NEW_CAT_SUBJECT_PATTERNS`)
3. **Add detection logic** in `classify()` at the appropriate priority level
4. **Map to tier** in `tierFromClassification()` — priority, uncertain (glance), or low
5. **The UI auto-groups** — any new category in the glance tier automatically gets its own accordion bundle

The canonical classification rules are in `docs/classification-rules.md`. Keep that doc in sync when changing classifier behavior.
