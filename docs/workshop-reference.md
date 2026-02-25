# Inbox App — Workshop Reference Guide

> Quick-reference for navigating the project, firing up demos, and understanding the architecture.
> Print-friendly. Last updated: 2026-02-19.

---

## 1. Live Links

### Remote (ngrok) — shareable, works on any device
| Screen | URL |
|--------|-----|
| Briefing (main) | https://sprintshellproto.ngrok.io/app/ |
| Inbox | https://sprintshellproto.ngrok.io/app/inbox |
| Settings | https://sprintshellproto.ngrok.io/app/settings |
| Gallery (archived concepts) | https://sprintshellproto.ngrok.io/app/gallery |

### Local dev (hot reload, latest code)
| Screen | URL |
|--------|-----|
| Briefing (main) | http://localhost:8083 |
| Inbox | http://localhost:8083/inbox |
| Settings | http://localhost:8083/settings |
| Gallery (archived concepts) | http://localhost:8083/gallery |

### Backend API (port 3000)
| Endpoint | Method | What it does |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/session` | GET | Check auth status → `{ connected, userEmail, provider }` |
| `/api/briefing?maxResults=50` | GET | Classified, tiered emails + stats (requires auth) |
| `/api/emails?maxResults=30` | GET | Raw IMAP messages (requires auth) |
| `/api/profile` | GET | Cached life graph for current user |
| `/auth/gmail-password` | POST | Login with Gmail app password |
| `/auth/yahoo-password` | POST | Login with Yahoo app password |
| `/auth/disconnect` | POST | Clear session cookie |

---

## 2. Startup Commands

### Quick start (all three services)
```bash
# Terminal 1 — Backend
cd ~/Desktop/email-prototypes/email-prototype && node server.js

# Terminal 2 — Frontend (Expo dev server)
cd ~/Desktop/email-prototypes/inbox-app && npx expo start --web --port 8083

# Terminal 3 — ngrok tunnel (for remote access)
ngrok http 3000 --url sprintshellproto.ngrok.io
```

### After frontend code changes (update ngrok build)
```bash
cd ~/Desktop/email-prototypes/inbox-app && npx expo export --platform web
# Then restart the backend — it serves the static build at /app/
```

### Troubleshooting
```bash
# Port 3000 stuck? Kill stale process
lsof -i :3000 -t | xargs kill -9

# Check what's running
lsof -i :3000    # backend
lsof -i :8083    # expo
pgrep -f ngrok   # tunnel

# Type check
cd ~/Desktop/email-prototypes/inbox-app && npx tsc --noEmit
```

---

## 3. Login Flow (for workshop participants)

The app uses **app passwords** — no OAuth popups.

### Gmail
1. Go to [myaccount.google.com → Security → App Passwords](https://myaccount.google.com/apppasswords)
2. Requires 2-step verification enabled
3. Generate an app password → copy the 16-character code
4. In the app: select Gmail tab, enter email + app password

### Yahoo
1. Go to [login.yahoo.com → Account Security](https://login.yahoo.com/account/security)
2. Enable 2-step verification if not already on
3. Generate App Password → copy it
4. In the app: select Yahoo tab, enter email + app password

---

## 4. Project Structure

### Directories at a glance
```
email-prototypes/
├── inbox-app/                  ← Frontend (React Native + Expo Web)
│   ├── app/                    ← Routes (Expo Router, file-based)
│   ├── src/                    ← Screens, services, hooks, stores, data
│   ├── orbit-ds/               ← Design system (tokens, primitives, components)
│   └── docs/                   ← Classification rules, this guide
│
└── email-prototype/            ← Backend (Express 5 + IMAP + Claude)
    ├── routes/                 ← auth.js, api.js, pages.js
    ├── services/               ← jwt, imap, classifier, profile agent
    ├── middleware/              ← requireAuth.js
    └── scripts/                ← CLI tools for life graph
```

---

## 5. Frontend Files

### Routes (`app/`)
| File | Renders | Notes |
|------|---------|-------|
| `_layout.tsx` | Root layout | Session gate, auth redirect, PhoneFrame wrapper |
| `login.tsx` | LoginScreen | Shown when not authenticated |
| `(tabs)/_layout.tsx` | Tab bar | Briefing / Inbox / Settings / Gallery tabs |
| `(tabs)/briefing.tsx` | ConceptLifeThreads | Default tab, the main prototype |
| `(tabs)/inbox.tsx` | InboxScreen | Chronological email list |
| `(tabs)/settings.tsx` | Settings | Disconnect button, preferences |
| `(tabs)/gallery.tsx` | Concept gallery | All archived prototype concepts in one scrollable view |

### Screens (`src/screens/`)
| File | What it is |
|------|-----------|
| **MorningBrief.tsx** | Tiered briefing: Priority cards → Glance accordions → Low summary bar |
| **ConceptLifeThreads.tsx** | Life threads + relationship-based briefing (active prototype) |
| **LoginScreen.tsx** | Yahoo/Gmail app password login with tab switcher |
| `_archive/AccordionBriefing.tsx` | Archived: accordion layout concept |
| `_archive/BriefingTimeline.tsx` | Archived: timeline view concept |
| `_archive/CalmFamiliar.tsx` | Archived: calm/familiar aesthetic concept |
| `_archive/QuietReport.tsx` | Archived: quiet report concept |
| `_archive/ProtoZones.tsx` | Archived: zones-based layout concept |
| `_archive/StackedCards.tsx` | Archived: stacked cards concept |
| `_archive/YourPeople.tsx` | Archived: people-focused view concept |

### Services (`src/services/`)
| File | Role |
|------|------|
| **gmail.ts** | API client — `checkSession()`, `loginGmailPassword()`, `loginYahooPassword()`, `disconnect()`. Auto-detects localhost vs ngrok. |
| **classify.ts** | Classification engine — rules-based email sorting. Priority order: Timely → Spam → Precise rules → Gmail labels → Real-person → Default |

### State Management (`src/stores/` — Zustand)
| File | Role |
|------|------|
| **session.ts** | Auth state — `status`, `userEmail`, `provider`. Methods: `init()`, `onLoginSuccess()`, `disconnect()` |
| **briefing.ts** | Email data — `fetchBriefing()`, stores classified response, falls back to mock data |

### Hooks (`src/hooks/`)
| File | Role |
|------|------|
| **useBriefingData.ts** | Orchestration — bridges session + briefing stores, returns ready-to-render data |
| **useCountdown.ts** | Countdown timer for "next briefing" display |

---

## 6. Backend Files

### Core
| File | Role |
|------|------|
| **server.js** | Express app setup, CORS, static file serving, route mounting, `/app/` Expo build |
| **config.js** | Centralized env config — reads `.env`, exports all settings |

### Routes (`routes/`)
| File | Handles |
|------|---------|
| **auth.js** | Login (Gmail/Yahoo app password), disconnect, OAuth (legacy) |
| **api.js** | `/api/session`, `/api/emails`, `/api/briefing`, `/api/profile` |
| **pages.js** | Landing page HTML, legacy email client variants |

### Services (`services/`)
| File | Role |
|------|------|
| **imap.js** | IMAP connections — fetch messages from Gmail/Yahoo, normalize to common shape, assign thread IDs |
| **jwt.js** | Token create/verify, cookie set/clear (HS256, 24h expiry) |
| **agent-classifier.js** | Email classification via Claude API (with rules fallback). Caches results 30 min. |
| **profile-agent.js** | Life graph builder — samples ~200 emails, builds relationship map via Claude. Caches 7 days. |

### Scripts (`scripts/`)
| File | Use |
|------|-----|
| `build-life-graph.js` | CLI: manually build a life graph |
| `fetch-life-graph-data.js` | CLI: fetch raw email data for analysis |
| `analyze-life-graph.js` | CLI: analyze life graph structure |

---

## 7. Orbit Design System (`orbit-ds/`)

Import anything via barrel: `import { Card, Button, colors } from "../../orbit-ds"`

### Tokens
| Token file | What's in it |
|-----------|-------------|
| `colors.ts` | Brand purple `#7d2eff`, greyscale, status colors |
| `typography.ts` | 18 variants: display, title, headline, body, label, caption, etc. |
| `spacing.ts` | Scale 0–64px with `sp()` helper |
| `radius.ts` | Border radius xs–xl |
| `shadows.ts` | Elevation levels |

### Primitives (atoms)
`Button` · `Avatar` · `Badge` · `Tag` · `TextInput` · `Toggle` · `Icon` · `Star` · `Divider` · `Notification` · `OrbitText`

### Components (molecules)
`Card` · `ListItem` · `SearchBar` · `Modal` · `EmptyState` · `TopNavigation` · `TabBar` · `Banner` · `SectionHeader` · `BottomSheet` · `Toast` · `StatusBar` · `FloatingActionBar` · `ActionButton` · `PersonCard` · `AdContainer`

### Layouts
`PhoneFrame` (web demo wrapper) · `ScreenShell` (header + content + footer)

---

## 8. Classification Framework

### Tier → UI mapping
| Tier | Categories | UI Treatment |
|------|-----------|-------------|
| **Needs Attention** | Timely, Important, Action | Elevated cards, expanded, action chips |
| **Worth a Glance** | Shipping, Purchases, Newsletters, Events, Updates, Social, School, Comments | Grouped accordions, collapsed by default |
| **Low Priority** | Promotion, Other, Spam | Single collapsed summary bar |

### Classification priority (evaluated top to bottom)
1. **Timely** — OTP codes, verification, security alerts, URGENT, same-day meetings
2. **Spam** — phishing subject patterns (no label needed — works for Yahoo)
3. **Precise rules** — Calendar, Action, Payments, Packages, Comments (pattern matching)
4. **Gmail labels** — `CATEGORY_PROMOTIONS`, `CATEGORY_FORUMS`, `CATEGORY_SOCIAL`, `CATEGORY_UPDATES`
5. **Real-person detection** — personal email domain + not automated subject
6. **Default** → Other (low priority)

### Key files
- Rules engine: `inbox-app/src/services/classify.ts`
- Backend classifier: `email-prototype/services/agent-classifier.js` (Claude-powered)
- Canonical rules doc: `inbox-app/docs/classification-rules.md`

---

## 9. Architecture at a Glance

```
┌─────────────────────────────────────────────────────┐
│  Browser / Phone                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Expo Web (React Native)                       │  │
│  │  Tabs: Briefing | Inbox | Settings | Gallery   │  │
│  │  ↕ fetch w/ credentials: "include"             │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │  Express Backend :3000  │
          │  JWT auth (httpOnly)    │
          │  /api/briefing          │──→ Claude API (classification + life graph)
          │  /api/emails            │──→ IMAP (Gmail / Yahoo)
          │  /app/ (static build)   │
          └─────────────────────────┘
                       │
              ┌────────┴────────┐
              │  ngrok tunnel   │
              │  sprintshell…   │
              └─────────────────┘
```

---

## 10. Key Concepts Glossary

| Term | Meaning |
|------|---------|
| **Briefing** | The main prototype view — a tiered summary of your inbox |
| **Life Graph** | A relationship map built from email patterns (senders, threads, topics) |
| **Life Threads** | Ongoing topics/themes in your life (e.g., "Kids' school", "Home renovation") |
| **App Password** | A provider-generated password for IMAP access (not your real password) |
| **Glance Category** | Mid-tier email grouping (Shipping, Newsletters, etc.) shown as accordions |
| **PhoneFrame** | The phone-shaped wrapper shown in web demos |
| **Orbit DS** | The custom design system — tokens, primitives, and components |
| **Classification Engine** | Rules-based + AI-powered email sorting into tiers and categories |

---

## 11. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend framework | React Native + Expo SDK 54 |
| Routing | Expo Router (file-based) |
| State management | Zustand |
| Language | TypeScript (strict mode) |
| Design system | Orbit DS (custom) |
| Backend | Express 5 (Node.js) |
| Auth | JWT (HS256, httpOnly cookies, 24h) |
| Email access | IMAP via imapflow |
| AI | Anthropic Claude API |
| Tunnel | ngrok (stable domain) |

---

*File: `inbox-app/docs/workshop-reference.md`*
