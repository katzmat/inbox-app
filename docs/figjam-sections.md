# FigJam Board — Section Content

Each of the 5 sections below includes:
- **Why** — the reasoning for the team
- **What to show** — specific screenshots and artifacts to capture
- **Details** — what to put on sticky notes or text blocks

---

## 1. Real Ingredients — Organic User Data

### Why
Most prototypes run on fake data — "John Doe sent you a message about Project X." That's fine for layout checks, but it tells you nothing about whether a concept *works*. Does the classification hold up against a real inbox full of Instacart confirmations, political spam, school notifications, and a message from your spouse buried in the noise?

We wired the prototype to real Gmail and Yahoo inboxes so every concept gets tested against the mess of actual email. When a stakeholder opens this and sees *their own inbox* sorted into tiers, the reaction is fundamentally different than seeing placeholder content. You're tasting with real food, not rubber props.

**What this unlocks**: anyone on the team can log in with their own email and immediately feel whether a concept works — for *them*, with *their* inbox, not a curated demo.

### What to show (screenshots / artifacts)

1. **Raw email data sample** — screenshot of the `life-graph-data.json` file showing real email objects with real senders, subjects, labels, dates. This is what 450 emails look like as raw ingredients before classification. (Path: `email-prototype/life-graph-data.json`)

2. **Login screen** — screenshot of the app's login screen showing the simple email + app password form. Two fields, two buttons (Gmail / Yahoo). That's the barrier to entry. (Run the app and capture `LoginScreen.tsx`)

3. **The /api/emails response** — screenshot of a browser or terminal showing the raw JSON that comes back from the backend. Real senders, real subjects, real timestamps. (Hit `https://sprintshellproto.ngrok.io/api/emails?maxResults=5` while logged in)

4. **Before vs. after** — side by side: the raw email list (unclassified) next to the classified briefing. Same data, transformed.

### Sticky note details

- Gmail and Yahoo supported — covers most personal email
- IMAP protocol — standard, secure, read-only
- Users create an "app password" in 2 minutes — no IT, no OAuth dance
- We never send, delete, or modify any email
- Session expires in 24 hours, credentials never saved to disk
- 450+ emails fetched and processed per session

---

## 2. Deep Cupboard — Design System Library

### Why
When every screen reinvents its own buttons, cards, and text styles, two things happen: everything looks slightly different, and every new idea takes forever to build. Orbit is the shared pantry — 34 components that any screen can pull from. Same visual language everywhere, no reinventing.

This matters for sprint velocity: a new screen concept is mostly assembly, not fabrication. And it matters for coherence: everything the user sees uses the same typography, spacing, color system, and interaction patterns — even across wildly different layout concepts.

**What this unlocks**: designers can think in components ("this screen uses a Card, a SectionHeader, and a Tag") and know those pieces already exist in code, tested and consistent.

### What to show (screenshots / artifacts)

1. **The barrel export file** — screenshot of `orbit-ds/index.ts` showing the full inventory organized into Tokens, Primitives, Components, Layouts. This is the "cupboard door" — everything available at a glance. (Path: `inbox-app/orbit-ds/index.ts`)

2. **Color tokens** — screenshot of `orbit-ds/tokens/colors.ts` showing the structured palette: brand purple, foreground system, backgrounds, status colors. The fact that it's a typed object means changing one value updates everything. (Path: `inbox-app/orbit-ds/tokens/colors.ts`)

3. **A component file** — screenshot of one component like `Card.tsx` or `Button.tsx` showing the code. Not to read the code — to show that each piece is a self-contained, documented unit. (Path: `inbox-app/orbit-ds/primitives/Button.tsx` or `orbit-ds/components/Card.tsx`)

4. **Components in use** — screenshot of the Morning Briefing screen with annotations pointing to specific Orbit components: "this is a Card", "this is a Tag", "this is a SectionHeader", "this is OrbitText with variant label2". Show how the pieces compose into a real screen.

5. **Figma library connection** — if Orbit exists in Figma as a library, screenshot the Figma component panel alongside the code exports. Show the 1:1 mapping.

### Sticky note details

- **11 Primitives**: Button, TextInput, Toggle, Avatar, Badge, Tag, Text, Icon, Star, Divider, Notification
- **16 Components**: Card, SearchBar, Modal, EmptyState, ListItem, Banner, TopNav, TabBar, BottomSheet, Toast, FloatingActionBar, SectionHeader, ActionButton, PersonCard, StatusBar, AdContainer
- **2 Layouts**: PhoneFrame (wraps everything in a device), ScreenShell (standard screen container)
- **5 Token sets**: Colors (brand + greyscale), Typography (18 variants), Spacing (0–64px scale), Radius, Shadows
- One import line to access everything: `import { Card, Button, Tag } from "../../orbit-ds"`
- Token-driven: change a color once, it updates everywhere
- Strict TypeScript — every prop is typed, IDE autocomplete works

---

## 3. Flexibility — Structure Built to Flex

### Why
We're not building one product — we're exploring what the product *could* be. That means the architecture can't be rigid. It needs to support rapid experimentation: try an idea, test it with real data, keep it or shelve it, try the next one.

The proof is in the numbers: **8 different screen concepts** built and tested in one sprint. 7 are archived, 1 is active, 1 more is in development. Each one took hours to build because the platform handles auth, data fetching, classification, and state management. A new screen just plugs in.

**What this unlocks**: "What if we tried grouping by person instead of category?" is a question that takes hours to answer, not weeks. The cost of experimentation is low enough to actually experiment.

### What to show (screenshots / artifacts)

1. **File-based routing** — screenshot of the `app/(tabs)/` directory listing showing `briefing.tsx`, `inbox.tsx`, `settings.tsx`. Each file = a tab. Adding a screen = adding a file. (Path: `inbox-app/app/(tabs)/`)

2. **The 3-step recipe** — a visual showing how little it takes to create a new screen:
   ```
   Step 1: Create app/(tabs)/newconcept.tsx
   Step 2: Import Orbit components
   Step 3: Call useBriefingData() → classified emails flow in
   ```

3. **The archive** — screenshot of `src/screens/_archive/` directory showing the 7 shelved concepts. This is evidence of exploration, not waste. (Path: `inbox-app/src/screens/_archive/`)

4. **The hook that does the work** — screenshot of `useBriefingData.ts` showing how one hook bridges auth, data fetching, and classification into a single clean interface for any screen. (Path: `inbox-app/src/hooks/useBriefingData.ts`)

5. **Concept gallery** — if you can run each archived screen briefly, capture a screenshot of each one. Line them up as a tasting menu:

   | Concept | What it explored |
   |---|---|
   | AccordionBriefing | Everything in collapsible groups |
   | BriefingTimeline | Chronological timeline |
   | CalmFamiliar | Minimal, quiet aesthetic |
   | ProtoZones | Spatial zones for tiers |
   | QuietReport | Newspaper-style daily report |
   | StackedCards | Swipeable card stack |
   | YourPeople | People-first (grouped by sender) |
   | **ConceptLifeThreads** | *Active* — grouped by life context |

6. **Tab layout code** — screenshot of `app/(tabs)/_layout.tsx` showing the tab configuration. Clean, short, readable — this is the entire navigation setup. (Path: `inbox-app/app/(tabs)/_layout.tsx`)

### Sticky note details

- File-based routing: 1 file = 1 screen = 1 tab
- Zustand stores handle session + briefing state — screens don't manage their own data
- `useBriefingData()` hook: one line to get auth status + classified emails into any screen
- `useCountdown()` hook: timer to next refresh, ready to drop in
- `usePinnedEmails()` hook: local pin/star behavior, reusable
- 8 concepts explored, each built in hours
- Archived concepts preserved in `_archive/` — ideas we can revisit

---

## 4. Tools — Claude Code

### Why
Claude Code is how one person covered this much ground in a sprint. It's a coding assistant that runs in the terminal — you describe what you want in plain English, it writes code, you review and approve every change.

It's not magic and it's not autonomous. Every product decision, every design choice, every "should this go in Priority or Glance" call was made by a human. Claude Code handled the execution: scaffolding project structure, building 34 Orbit components from design specs, translating classification rules into working code, iterating through 8 screen concepts, keeping documentation current.

Think of it as a very fast pair programmer that's good at the repetitive parts and needs supervision on the judgment calls.

**What this unlocks for the team**: the speed to explore more ideas per sprint. The cost of "let's try it and see" drops dramatically when the building is fast.

### What to show (screenshots / artifacts)

1. **Claude Code in action** — screenshot of a terminal showing a Claude Code session. Show a prompt like "build a new Card component with expand/collapse" and the resulting code. The visual is: person types English, code appears. (Run `claude` in the inbox-app directory and capture a real interaction)

2. **CLAUDE.md** — screenshot of the project's `CLAUDE.md` file showing conventions, file layout, and instructions. This is how the tool "remembers" project context across sessions — it reads these docs before starting. (Path: `inbox-app/CLAUDE.md`)

3. **Memory files** — screenshot of the `.claude/` memory directory showing how the tool accumulates project knowledge: orbit-ds inventory, classification details, architecture notes. (Path: `~/.claude/projects/-Users-mkatz02/memory/`)

4. **A git log** — screenshot of the commit history showing the volume and quality of commits. Each one has a descriptive title and detailed body. The pace tells the story. (Run `git log --oneline -20` in the inbox-app directory)

5. **Before/after** — a "what one person built in one sprint" summary card:
   - 34 design system components
   - 2 AI agents (classifier + life graph)
   - 8 screen concepts
   - Full auth flow (Gmail + Yahoo)
   - Classification engine with 16 categories
   - Documentation kept current throughout

### Sticky note details

- Claude Code is a terminal-based coding assistant by Anthropic
- You describe what you want → it writes code → you review and approve
- Every decision was human-made — the tool executes, it doesn't decide
- CLAUDE.md files give the tool project context (conventions, file layout, patterns)
- It makes mistakes that need catching — it's a multiplier, not a replacement
- The honest framing: this is what one person can build in a sprint with good tools

---

## 5. Sous Chefs — Agents

### Why
Two AI agents run on the backend doing specialized work that would be impractical to do by hand for every user session. They're the sous chefs — skilled workers handling specific stations so the main flow stays fast and clean.

The **Profile Agent** reads ~200 of your emails on first login and builds a "life graph" — who are the important people in your inbox, what are your active life threads (kids' school, home renovation, work projects), what's signal vs. noise. This context makes the classifier smarter: it knows your spouse's email matters more than a newsletter.

The **Classifier Agent** takes each batch of emails, combines them with your life graph, and sorts them into tiers with reasons ("From your spouse — marked as needs attention", "Newsletter from Substack — worth a glance"). Without an API key, it falls back to a hand-written rules engine that covers the common cases.

Both degrade gracefully — if there's no API key, the system still works, just with less personalization.

**What this unlocks**: classification that feels personal and context-aware, not just pattern-matching. The system knows that an email from your kid's school is more important than an email from LinkedIn — because it learned that from *your* inbox.

### What to show (screenshots / artifacts)

1. **The /api/briefing response** — screenshot of the classified JSON output showing the three tiers with real emails sorted: `needsAttention` (3 emails with reasons), `glance` grouped by category (Shipping & Deliveries, Newsletters & Reads, etc.), `low` (17 emails). This is the output of both agents working together. (Hit the endpoint while logged in)

2. **Agent classifier code** — screenshot of `agent-classifier.js` showing the `classifyWithAgent()` function — emails go in, Claude processes them with the life graph context, classified results come out. Not to read line-by-line, but to show the architecture: input → AI → structured output. (Path: `email-prototype/services/agent-classifier.js`, lines ~64–110)

3. **Profile agent code** — screenshot of `profile-agent.js` showing the build flow: fetch 200 emails → compute stats → send to Claude → get life graph back → cache to disk. (Path: `email-prototype/services/profile-agent.js`, lines ~77–135)

4. **A life graph example** — screenshot of `life-graph-data.json` or a cached profile showing the structure: 42 senders analyzed, 16 life threads identified, coordination circle of key people. This is what the sous chef produces. (Path: `email-prototype/life-graph-data.json`)

5. **The classification prompt** — screenshot of the system prompt sent to Claude for classification. Shows how the life graph context shapes the AI's decisions. (Search for `buildClassificationPrompt` in `agent-classifier.js`)

6. **The briefing screen annotated** — screenshot of Morning Briefing with callouts showing agent output: "AI: From your spouse — needs attention", "AI: Newsletter from Morning Brew — glance", "AI: Political spam — low priority". The reasons are the visible output of the agent's work.

7. **Glance categories** — visual showing the 8 sub-categories that emails get sorted into:
   - Shipping & Deliveries
   - Purchases & Receipts
   - Newsletters & Reads
   - Events & Calendar
   - Updates & Alerts
   - Social & Community
   - School & Kids
   - Comments & Collab

8. **Fallback flow** — a simple diagram:
   ```
   Has API key?
     → Yes → Claude classifies with life graph context (personalized)
     → No  → Rules engine classifies with pattern matching (still works, less personal)
   ```

### Sticky note details

- **Profile Agent**: reads ~200 emails on first login, builds a life graph via Claude
  - Identifies key people (coordination circle)
  - Maps life threads (school, work, health, finance, etc.)
  - Cached per user for 7 days
  - Runs once in the background — doesn't slow down the first session
- **Classifier Agent**: sorts each batch of emails into 3 tiers
  - Uses life graph for personalized priority (knows your spouse matters)
  - Returns: tier, reason, suggested action, glance sub-category
  - Cached for 30 minutes per email set
  - Falls back to rules engine without API key
- Both agents are optional — the system works without them, just less smart
- The classification rules doc (`classification-rules.md`) is 500+ lines — readable by anyone, not just engineers
