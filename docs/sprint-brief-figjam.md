# Sprint Brief — Inbox Prototyping Platform

> For FigJam — each section maps to a frame on the board.

---

## Frame 1: What We Built

**We built a kitchen, not a meal.**

We didn't build one prototype and call it done. We set up the whole kitchen — the pantry stocked with real ingredients, the cookware organized and ready, the recipe book written — so the team can walk in and start cooking up inbox concepts without rebuilding infrastructure every time.

### How it works (4 steps)
1. **Login** — User types their email + an app password. No OAuth, no IT tickets, 2 minutes.
2. **Fetch** — Backend connects to their real inbox (Gmail or Yahoo) and pulls latest messages.
3. **Classify** — Each email runs through a rules engine: *Needs Attention*, *Worth a Glance*, or *Low Priority*.
4. **Display** — A screen renders the classified briefing using shared UI components.

### Why this matters
A single prototype answers one question. A platform lets you ask many. From here, a new inbox concept takes hours to build, not weeks.

---

## Frame 2: The Cookware (Orbit Design System)

**Pots, pans, knives, cutting boards — all hanging on the wall, labeled, ready to grab.**

Orbit is a shared library of **34 reusable UI pieces**. When we build a new screen, we're pulling components off the rack — not forging them from scratch.

### What's available

| Layer | What's in it | Count |
|---|---|---|
| **Primitives** | Button, TextInput, Toggle, Avatar, Badge, Tag, Text, Icon, Star, Divider, Notification | 11 |
| **Components** | Card, SearchBar, Modal, EmptyState, ListItem, Banner, TopNav, TabBar, BottomSheet, Toast, FloatingActionBar, SectionHeader, ActionButton, PersonCard, StatusBar, AdContainer | 16 |
| **Layouts** | PhoneFrame, ScreenShell | 2 |
| **Design Tokens** | Colors (brand purple + greyscale), Typography (18 styles), Spacing, Radius, Shadows | 5 sets |

### What this means
Every screen uses the same visual language automatically. Change a color token and the whole system updates. A designer can look at the component list and know exactly what's available to work with — these are the ingredients of every screen.

**For engineers**: barrel-exported from `orbit-ds/index.ts`, strict TypeScript, React Native + Expo Web.

---

## Frame 3: The Pantry (Real Email Data)

**Real ingredients, not plastic fruit.**

We don't prototype with fake data. The system connects to real Gmail and Yahoo inboxes so every concept gets tested against actual email — messy subjects, real senders, the whole thing.

### Why this matters
- Concepts feel completely different when tested against your own inbox
- Edge cases surface naturally — you don't have to imagine them
- Stakeholders can log in and react to something personal and familiar
- Immediate trust: "this actually works with my email"

### How it connects
- **Gmail** and **Yahoo** via IMAP (standard email protocol)
- Users create an "app password" in their email settings — 2 minutes, no IT
- **Read-only** — we never send, delete, or modify anything
- **Secure** — session cookies only, nothing saved to disk, 24-hour expiry

### Backend endpoints
| Route | Purpose |
|---|---|
| `/api/session` | Check login status |
| `/api/briefing` | Classified, tiered emails ready for display |
| `/api/profile` | Life graph — key relationships in this inbox |
| `/auth/gmail-password` | Gmail login |
| `/auth/yahoo-password` | Yahoo login |
| `/auth/disconnect` | Log out |

---

## Frame 4: The Recipe Book (Classification Engine)

**The recipes that decide what goes on the plate and how it's arranged.**

Every email gets evaluated and sorted into a tier. The rules are documented in plain language — readable by anyone, not buried in code.

### The 3 tiers

| Tier | What belongs here | How it shows up |
|---|---|---|
| **Needs Attention** | Spouse's email, security alerts, bills, verification codes | Elevated cards, expanded by default |
| **Worth a Glance** | Packages, newsletters, school updates, calendar events | Grouped accordions by category |
| **Low Priority** | Promos, social notifications, spam | Collapsed summary bar |

### How it decides

```
Email arrives
  ↓
Time-sensitive? (OTP, security alert, "URGENT")
  → Yes → Needs Attention. Stop.
  ↓
Spam? (phishing patterns)
  → Yes → Low Priority. Stop.
  ↓
Matches a known pattern? (calendar, payment, package tracking)
  → Yes → Assign to that category.
  ↓
Sender is a real person? (personal email, not automated)
  → Yes → Needs Attention.
  ↓
Default → Low Priority.
```

### 16 categories under the hood

**Priority**: Timely, Important Context, Important Draft, Important SOP, Important Info, Action

**Glance** (auto-grouped): Calendar, Payments, Packages, Comments, Newsletter, Social, Updates

**Low**: Promotion, Other, Spam

### The key thing
The rules live in one doc (`classification-rules.md`) that reads like a product spec. Want to change how something gets sorted? Update the doc and the code follows. Anyone on the team can propose a rule change.

---

## Frame 5: The Prep Work (Connective Tissue)

**Mise en place — everything chopped, measured, and within reach before you start cooking.**

These are the behind-the-scenes pieces already done so new screens don't have to redo them. Data fetching, login state, classification — all handled. A new screen just plugs in.

### State stores
| Store | Tracks |
|---|---|
| **Session** | Login status, email, provider (Gmail/Yahoo) |
| **Briefing** | Classified email data, loading state, summary stats |

### Hooks
| Hook | Does |
|---|---|
| `useBriefingData` | One-liner to get session + classified emails into any screen |
| `useCountdown` | Timer to next briefing refresh |
| `usePinnedEmails` | Local pin/star functionality |

### What this means in practice
Building a new screen concept:
1. Create one file
2. Import Orbit components
3. Call `useBriefingData()` to get data
4. Done.

That's the real payoff of the platform. The prep is done. You just cook.

---

## Frame 6: The First Dish (Morning Briefing)

**Proof the kitchen works — a full meal, plated and served.**

Morning Briefing is the first screen built on the platform. It uses every layer: real data, classification, Orbit components, state management. It's the demo, but it's also a real product concept.

### Sections
- **Masthead** — Greeting, user email, stats, countdown timer
- **Priority** — Elevated cards for emails that need you. Expand for preview, classification reason, "Open email" link
- **Worth a Glance** — Accordion groups by category (Newsletters: 3, Packages: 2, Social: 5)
- **Low Priority** — Collapsed bar: "35 low-priority emails"
- **Chrono toggle** — Flat chronological view of everything

### Every email shows
- Subject, sender, time
- Preview text (expandable)
- `AI: {reason}` — why it was classified this way
- "Open email →" — link to the real email in Gmail or Yahoo

### States
| State | Behavior |
|---|---|
| Loading | Spinner, no flash of fake data |
| Disconnected | Falls back to realistic mock data |
| Connected | Real classified emails |

---

## Frame 7: The Floor Plan (Architecture)

**How the kitchen is wired — gas, water, electric.**

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────┐
│   Your Phone    │       │   Our Backend    │       │  Your Email  │
│   or Browser    │──────→│   (Express.js)   │──────→│  (Gmail /    │
│                 │  API  │                  │ IMAP  │   Yahoo)     │
│  Expo Web App   │←──────│  JWT Auth        │←──────│              │
│  Orbit DS       │  JSON │  Classification  │ Email │              │
│  React Native   │       │  Life Graph      │  data │              │
└─────────────────┘       └──────────────────┘       └──────────────┘
```

### Remote access
- **Stable URL**: `https://sprintshellproto.ngrok.io/app/`
- Anyone with the link can test on their phone or laptop
- One tunnel serves both app and API
- Runs off Matt's laptop — needs to be open and online

### Security
- Read-only — never touches your email
- Encrypted session cookies, 24-hour expiry
- App passwords are scoped and revocable
- Nothing stored on disk

---

## Frame 8: The Tasting Menu (Concepts We Explored)

**We didn't nail the dish on the first try. Here's what we tasted along the way.**

**8 screen concepts** were built and tested. 7 are archived — preserved, not trashed — because they hold ideas worth coming back to.

| Concept | What it explored |
|---|---|
| AccordionBriefing | Everything in collapsible groups |
| BriefingTimeline | Chronological timeline view |
| CalmFamiliar | Minimal, quiet aesthetic |
| ProtoZones | Spatial zones for email tiers |
| QuietReport | Newspaper-style daily report |
| StackedCards | Swipeable card stack |
| YourPeople | People-first view (grouped by sender) |
| **ConceptLifeThreads** | *Active* — grouping by life context (family, work, health, finance) |

Each one took hours to build because the platform was already in place. That's the point.

---

## Frame 9: How To Use the Kitchen

### Designers
- Orbit components map to what you'd build in Figma — use them as your shared vocabulary
- Any new screen idea can be assembled from existing blocks + real data
- Log in with your own email to feel how a concept handles *your* inbox

### Engineers
- New screen = one file in `app/(tabs)/` + Orbit imports + `useBriefingData()`. That's it.
- Extend classification by adding patterns or updating `classification-rules.md`
- New component = add to `orbit-ds/`, export from barrel, use anywhere
- `npx tsc --noEmit` must pass clean

### Product & Stakeholders
- Visit the URL on your phone, log in, see your own email classified
- "Package tracking should be higher priority" — the rules are adjustable
- "What if we grouped by person instead of category?" — that's a new screen, not a new project

---

## Frame 10: By the Numbers

| | |
|---|---|
| UI building blocks | **34** |
| Classification categories | **16** |
| Screen concepts explored | **8** |
| Email providers | **2** (Gmail + Yahoo) |
| API endpoints | **6** |
| New screen build time | **Hours** |

---

## Frame 11: What Is Claude Code?

**The kitchen appliance nobody's seen before — here's what it does and doesn't do.**

### Plain English
Claude Code is a coding assistant that runs in the terminal. You describe what you want, it writes code, you review and approve. It's fast at repetitive work and good at following project conventions. Every product and design decision was made by a human.

### What it handled this sprint
- **Scaffolding** — project structure, routing, auth flow
- **Component library** — built Orbit DS from design specs
- **Classification** — translated the rules doc into working code
- **Iteration speed** — 8 screen concepts in one sprint
- **Documentation** — kept project docs current as things evolved

### What it didn't do
- Make product decisions
- Choose what to build or how it should work
- Run unsupervised — every change was reviewed

### The honest take
It makes one person faster at building. It also makes mistakes that need catching. Less "AI built this" — more "this is what one person can cover in a sprint with good tools."

---

## Suggested FigJam Layout

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│  [1. What We Built]          [2. The Cookware]                 │
│   Kitchen framing + flow      Orbit component grid             │
│                                                                │
│  [3. The Pantry]             [4. The Recipe Book]              │
│   Real data + security        Tiers + decision tree            │
│                                                                │
│  [5. The Prep Work]          [6. The First Dish]               │
│   Stores, hooks, services     Morning Briefing annotated       │
│   "3 steps to a new screen"                                    │
│                                                                │
│  [7. The Floor Plan]         [8. The Tasting Menu]             │
│   Architecture diagram        8 concept thumbnails             │
│   Remote access                                                │
│                                                                │
│  [9. How To Use It]    [10. Numbers]    [11. Claude Code]      │
│   By role               Stats grid       What it is/isn't      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Sticky note colors
- **Blue** — Descriptions and facts
- **Green** — Actionable / "how to use this"
- **Pink** — Numbers and stats
- **Purple** — Section titles (brand color)
