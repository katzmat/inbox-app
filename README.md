# Inbox App — Morning Briefing Prototype

A React Native (Expo Web) prototype that displays a batched email briefing UI connected to a real Gmail inbox via OAuth.

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
| `src/screens/MorningBrief.tsx` | Main briefing screen — handles loading/disconnected/connected states |
| `src/data/briefing.ts` | Types (`BriefingEmail`, `Briefing`), mock data fallback, `createBriefingFromGmail()` factory |
| `src/services/gmail.ts` | API client — `checkSession()`, `getAuthUrl()`, `fetchEmails()` |
| `src/services/classify.ts` | Heuristic email classifier — maps Gmail messages to priority/glance/low tiers |
| `src/hooks/useCountdown.ts` | Countdown timer hook for next-briefing display |
| `orbit-ds/` | Orbit Design System — shared component library |

## Email Classification (Client-Side Heuristics)

The classifier in `src/services/classify.ts` sorts emails into three tiers:

| Tier | Criteria | UI Treatment |
|------|----------|--------------|
| **Priority** | Starred, or Gmail IMPORTANT label + unread from real person | Elevated card with expand/collapse |
| **Glance** | Unread from non-automated sender | Row with expand-on-tap |
| **Low** | Automated/promo senders, social, forums, already-read | Collapsed summary bar |

Detection signals:
- `noreply`, `no-reply`, `notifications@` etc. → automated
- `CATEGORY_PROMOTIONS`, `CATEGORY_SOCIAL`, `CATEGORY_FORUMS` labels → low
- Starred → always priority
- Unread + real sender → glance

## UI Features

- **Greyscale design** — minimal, newspaper-style aesthetic
- **Progressive disclosure** — tap to expand any email for details + AI reason tag
- **Countdown timer** — shows time until next briefing with "Get it now" pull-early
- **Chronological toggle** — switch between tiered briefing view and flat chronological list
- **Graceful fallback** — shows hardcoded mock data when backend is unavailable

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
