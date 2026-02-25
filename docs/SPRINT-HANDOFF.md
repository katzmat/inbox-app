# Sprint Handoff — Email Briefing Prototype
> Self-contained reference for any engineer joining this project. No additional context required.

---

> ⚠️ **Important framing:** Everything in this repository is a functional skeleton — built to validate whether the underlying system (auth, IMAP, classification, data pipeline) works, and to give researchers something real to put in front of participants. The prototypes are not intended as design direction, visual references, or production candidates. Treat the UI as scaffolding, not output.

---

## What This Is

A research prototype that connects to a participant's real Yahoo or Gmail inbox via IMAP, classifies their email using a combination of Claude and rule-based logic, and presents a tiered "morning briefing" UI. The system is designed for iterative experimentation — swapping classification logic, UI variants, and agent prompts without touching auth or data plumbing.

**Research use:** Design sprint / dscout study. 8 participants. Yahoo Mail primary.

---

## Directory Structure

```
~/Desktop/email-prototypes/
├── email-prototype/          ← Backend (Node.js/Express) — the engine
├── inbox-app/                ← Frontend (React Native / Expo Web) — the main UI
├── calm/                     ← Standalone HTML variant (legacy)
├── prototype-1-timeline.html ← Standalone prototype explorations (open directly in browser)
├── prototype-2-lanes.html
├── prototype-3-board.html
├── prototype-4-brief.html
├── prototype-4-brief-mobile.html
├── prototype-5-radar.html
├── uploader.html
└── index.html                ← Root landing page
```

---

## Two Repos, One Tunnel

| Piece | Location | Port | Serves |
|---|---|---|---|
| Backend | `email-prototype/` | 3000 | API + all static files |
| Frontend (Expo) | `inbox-app/` | 8083 (dev) | Expo dev server |
| ngrok | stable URL | — | Tunnels port 3000 to the internet |

**The backend at port 3000 serves everything over ngrok:**
- `/app/` → inbox-app Expo web build (`inbox-app/dist/`)
- `/variants/:name/` → HTML variant prototypes
- `/landing/` → landing page
- `/api/*` → REST API

---

## Getting Everything Running

### Prerequisites
- Node.js 18+
- ngrok account with the `sprintshellproto.ngrok.io` domain configured
- `.env` file in `email-prototype/` (see below)

### 1. Backend

```bash
cd ~/Desktop/email-prototypes/email-prototype
npm install
node server.js
```

Server starts on port 3000.

**Required `.env`:**
```
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
CORS_ENABLED=true
ALLOWED_ORIGINS=http://localhost:8083
PORT=3000
```

**Optional `.env` (enables Claude-powered classification):**
```
ANTHROPIC_API_KEY=sk-ant-...
CLASSIFIER_MODEL=claude-sonnet-4-6          # Model for email classification
PROFILE_MODEL=claude-sonnet-4-6             # Model for life-graph profile building
MAX_EMAILS=50                               # Emails fetched per briefing
PROFILE_MAX_EMAILS=200                      # Emails sampled to build a user's life graph
CLASSIFIER_CACHE_TTL=1800000               # Cache TTL in ms (default 30 min)
```

Without `ANTHROPIC_API_KEY`, the system falls back to rule-based classification automatically — no crash, no config change needed.

### 2. Frontend (Expo dev mode — for active development)

```bash
cd ~/Desktop/email-prototypes/inbox-app
npx expo start --web --port 8083
```

### 3. Frontend (static build — for ngrok / participant access)

```bash
cd ~/Desktop/email-prototypes/inbox-app
npx expo export --platform web
# Writes to inbox-app/dist/ — backend serves this at /app/
# Restart backend after this step
```

### 4. ngrok

```bash
ngrok http 3000 --url sprintshellproto.ngrok.io
```

**Stable remote URL:** https://sprintshellproto.ngrok.io/app/

If the tunnel is already running elsewhere you'll get `ERR_NGROK_334` — that's fine, the URL is live.

### Stale server

```bash
lsof -ti:3000 | xargs kill -9
```

---

## Live URLs (When Everything Is Running)

| What | Local | Remote |
|---|---|---|
| Morning Brief (main prototype) | http://localhost:8083 | https://sprintshellproto.ngrok.io/app/ |
| Variant: Brief | http://localhost:3000/variants/brief/ | https://sprintshellproto.ngrok.io/variants/brief/ |
| Variant: Calm | http://localhost:3000/variants/calm/ | https://sprintshellproto.ngrok.io/variants/calm/ |
| Variant: Default | http://localhost:3000/variants/default/ | https://sprintshellproto.ngrok.io/variants/default/ |
| Variant: Pulse | http://localhost:3000/variants/pulse/ | https://sprintshellproto.ngrok.io/variants/pulse/ |
| Variant: Variant B | http://localhost:3000/variants/variant-b/ | https://sprintshellproto.ngrok.io/variants/variant-b/ |
| Health check | http://localhost:3000/health | https://sprintshellproto.ngrok.io/health |

---

## Auth Flow (End to End)

1. User enters their Yahoo/Gmail email + app password in the login screen
2. Frontend POSTs to `/auth/yahoo-password` or `/auth/gmail-password`
3. Backend test-connects to IMAP to validate credentials
4. On success: creates a JWT containing `{ provider, email, name, credential }` and sets it as an httpOnly cookie (`session`, 24h)
5. All subsequent `/api/*` calls read the cookie, verify the JWT, and use `req.user.credential` to connect to IMAP
6. To disconnect: POST `/auth/disconnect` — clears the cookie immediately

**App password ≠ Yahoo password.** Participants generate a 16-char app password at `login.yahoo.com/account/security`. This requires 2-step verification to be enabled first.

---

## API Reference

All endpoints return JSON. Auth-required endpoints need the `session` cookie.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | `{ status: "ok" }` |
| GET | `/api/session` | No | `{ connected, userEmail, provider }` |
| POST | `/auth/yahoo-password` | No | Body: `{ email, appPassword }` |
| POST | `/auth/gmail-password` | No | Body: `{ email, appPassword }` |
| POST | `/auth/disconnect` | No | Clears session cookie |
| GET | `/api/emails?maxResults=30` | Yes | Raw IMAP messages |
| GET | `/api/briefing?maxResults=50` | Yes | Classified + tiered briefing |
| GET | `/api/profile` | Yes | User life graph |

### `/api/briefing` response shape

```json
{
  "generatedAt": "2026-02-25T10:00:00.000Z",
  "backend": "agent",
  "profileStatus": "ready",
  "summary": { "total": 50, "needsAttention": 3, "glance": 30, "low": 17 },
  "sections": {
    "needsAttention": [{ "id", "from", "subject", "snippet", "summary", "reason", "suggestedAction", "urgencyType", "webLink" }],
    "glance": {
      "Shipping & Deliveries": [...],
      "Newsletters & Reads": [...]
    },
    "low": [...]
  }
}
```

---

## Classification System

### How It Works

`services/agent-classifier.js` runs every email through one of two paths:

**With `ANTHROPIC_API_KEY`:** Sends emails + life graph to Claude. Returns structured JSON with tier, category, summary, reason, and suggested action. Results cached 30 min. Background upgrade: first response is rules-based (instant), agent result is cached for next load.

**Without `ANTHROPIC_API_KEY`:** Rule-based fallback using sender domain, Gmail labels, subject patterns, and the life graph sender registry.

### Three Tiers

| Tier | Key | Meaning |
|---|---|---|
| Needs Attention | `needsAttention` | User must DO something — reply, sign, confirm, decide |
| Glance | `glance` | Worth knowing, no action needed |
| Low | `low` | Promotions and noise |

### Glance Sub-Categories

```
Shipping & Deliveries
Purchases & Receipts
Newsletters & Reads
Events & Calendar
Updates & Alerts
Social & Community
School & Kids
Comments & Collab
```

### Changing Classification Behavior

**Option A — Edit the Claude prompt** (fastest, no code change):
The entire classification prompt lives in `buildClassificationPrompt()` in `services/agent-classifier.js`. The prompt includes:
- Tier definitions with examples
- Anti-gaming rules (e.g., political "URGENT" → low)
- User's life graph (coordination circle, life threads, priority rules)

Just edit the prompt text and restart the server. No code changes needed.

**Option B — Add a new glance category:**
1. Add the category name to `GLANCE_CATEGORIES` array in `agent-classifier.js`
2. Add examples to the prompt under the Tier 2 section
3. The frontend auto-groups any new category into its own accordion — no UI changes needed

**Option C — Replace the classifier entirely:**
Swap out `classifyEmailsFast` in `routes/api.js` with any function that takes `(emails, lifeGraph)` and returns `{ classifications: [...], backend: 'yourname' }`. The classification shape is:
```json
{
  "id": "email-uid",
  "tier": "needsAttention | glance | low",
  "glanceCategory": "string | null",
  "summary": "string | null",
  "reason": "string | null",
  "suggestedAction": "string | null",
  "urgencyType": "person | action | security | deadline | null"
}
```

---

## Life Graph (User Profile)

`services/profile-agent.js` builds a per-user "life graph" on first login using Claude.

**What it contains:**
- `identity` — name, email, inferred role
- `coordinationCircle` — key people the user emails, with relationship + priority weight
- `lifeThreads` — active projects, events, recurring responsibilities
- `mailboxProfile` — signal-to-noise ratio, primary inbox uses
- `priorityRules` — always-high and always-low sender rules
- `senderRegistry` — full list of senders with priority weight

**Storage:** `services/profiles/<email>.json` — plain JSON, per user, on disk. Refreshes every 7 days.

**Trigger:** Fires automatically (fire-and-forget) on first `/api/briefing` call. First response uses rules; subsequent calls use the life graph.

**To rebuild manually:**
```bash
cd email-prototype
node scripts/build-life-graph.js
```

**To plug in a custom profile shape:** Edit the Claude prompt in `_doBuildProfile()` in `profile-agent.js`. The classifier consumes whatever JSON structure you return — just keep `coordinationCircle`, `lifeThreads`, and `senderRegistry` keys if you want the rules-based fallback to work.

---

## Building UI Variations

### Option A — New Expo tab (recommended for React Native variations)

1. Create `inbox-app/app/(tabs)/myscreen.tsx`
2. Add a `<Tabs.Screen>` entry in `inbox-app/app/(tabs)/_layout.tsx`
3. Build in the tab file or create a screen in `src/screens/` and import it
4. Run `npx expo export --platform web` and restart backend to deploy

### Option B — New HTML variant (fastest for quick explorations)

1. Duplicate `email-prototype/public/variants/default/` → `public/variants/myvariant/`
2. Edit `index.html` + `variant.js` in your new folder
3. Accessible immediately at `/variants/myvariant/` — no restart needed
4. API calls from variants use the same cookie-based auth — just `fetch('/api/briefing', { credentials: 'include' })`

### Option C — Standalone HTML file

Drop a `.html` file anywhere and open it directly in a browser. Use these to quickly mock layouts before wiring to real data.

### Design System (inbox-app only)

The Orbit design system lives in `inbox-app/orbit-ds/`. Import via barrel:
```typescript
import { Button, Card, OrbitText } from "../../orbit-ds"
```

Key tokens: `colors`, `typography`, `spacing`, `radius`, `shadows` — all in `orbit-ds/tokens/`.
Brand purple: `#7d2eff`.

---

## Plugging In Agents

The agent system is intentionally minimal — two services, both optional, both with fallbacks.

### Adding a New Agent

1. Create `services/your-agent.js`
2. Check for API key before calling Claude:
   ```javascript
   const config = require('../config');
   if (!config.processor.anthropicApiKey) {
     // return non-LLM fallback
   }
   const client = new Anthropic({ apiKey: config.processor.anthropicApiKey });
   ```
3. Call Claude:
   ```javascript
   const response = await client.messages.create({
     model: config.processor.classifierModel, // or profileModel
     max_tokens: 4000,
     system: yourSystemPrompt,
     messages: [{ role: 'user', content: yourPayload }]
   });
   ```
4. Wire into `routes/api.js` — add a new route or call from `/api/briefing`
5. All config (model names, API key) lives in `config.js` → read from `.env`

### Available Claude Models (from config)

```
CLASSIFIER_MODEL=claude-sonnet-4-6   # Batch classification (speed/quality balance)
PROFILE_MODEL=claude-sonnet-4-6      # Life graph build (quality priority)
```

Change these in `.env` to swap models across the system.

---

## Tools Available (Same as Sprint Lead)

- **Claude Code** — AI coding assistant in terminal. Reads/writes code, runs commands, searches the codebase. Run `claude` in any directory.
- **Figma MCP** — Connected via Claude Code. Push screens to Figma (`/figma:implement-design`), pull designs to implement them, create diagrams. Requires Figma desktop app or browser.
- **ngrok** — Stable tunnel at `sprintshellproto.ngrok.io`. Auth configured, just run the command.

### Pushing a Screen to Figma

```bash
# In Claude Code, run:
# The Figma MCP will handle capture — just have the app running and tell Claude
# "push the current screen to Figma"
```

Claude Code handles the full workflow: generates capture ID, injects script, opens browser, polls for completion, opens Figma.

---

## Key Files Quick Reference

### Backend (`email-prototype/`)

| File | Purpose |
|---|---|
| `server.js` | Express setup, CORS, static file serving, route mounting |
| `config.js` | All env var reading — never read `process.env` elsewhere |
| `routes/auth.js` | Login endpoints (Yahoo/Gmail password, disconnect) |
| `routes/api.js` | `/session`, `/emails`, `/briefing`, `/profile` |
| `middleware/requireAuth.js` | JWT cookie verification → `req.user` |
| `services/imap.js` | IMAP connect/fetch/normalize (Gmail + Yahoo) |
| `services/agent-classifier.js` | ★ Email classification — edit prompts here |
| `services/profile-agent.js` | ★ Life graph builder — edit prompts here |
| `services/jwt.js` | Token creation/verification/cookie management |
| `services/profiles/` | Per-user life graphs (JSON files, gitignored) |
| `public/variants/` | HTML variant prototypes |

### Frontend (`inbox-app/`)

| File | Purpose |
|---|---|
| `app/_layout.tsx` | Root layout: session gate, PhoneFrame, ErrorBoundary |
| `app/(tabs)/_layout.tsx` | Tab bar (Briefing, Inbox, Settings) |
| `src/screens/MorningBrief.tsx` | ★ Main prototype screen |
| `src/screens/LoginScreen.tsx` | Yahoo/Gmail app password login |
| `src/services/gmail.ts` | API client (checkSession, login, fetchEmails, disconnect) |
| `src/services/classify.ts` | Frontend rule-based classifier (used in disconnected mode) |
| `src/hooks/useBriefingData.ts` | Session + fetch + classify orchestration |
| `src/data/briefing.ts` | Types + mock data (fallback when backend is down) |
| `orbit-ds/` | Design system — extend freely |
| `docs/classification-rules.md` | Canonical classification framework (keep in sync with backend) |

---

## What Not To Do

- Never commit `.env` — it contains the JWT secret and Yahoo OAuth credentials
- Don't use `process.env` directly — always read from `config.js`
- Don't persist email content to disk — the system intentionally keeps email data ephemeral
- Don't over-engineer — this is prototype-grade code; clarity > robustness
- `npx tsc --noEmit` must pass before committing in `inbox-app/`
