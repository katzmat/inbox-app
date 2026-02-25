# Workshop Facilitator Playbook

> A practical guide for Matt — organized by what you're trying to do, not by how the code works.
> Keep this open during the session. Everything you need is here.

---

## Before the Workshop Starts

### "I need to get everything running"

Open three terminal windows (or tabs) and run these one at a time:

```bash
# Terminal 1 — Start the backend
cd ~/Desktop/email-prototypes/email-prototype && node server.js
```
You should see: `Email Prototype Server ... Local: http://localhost:3000`

```bash
# Terminal 2 — Start the frontend
cd ~/Desktop/email-prototypes/inbox-app && npx expo start --web --port 8083
```
You should see: `Web Bundled ... modules` — that means it's ready.

```bash
# Terminal 3 — Start the tunnel (for remote/phone access)
ngrok http 3000 --url sprintshellproto.ngrok.io
```
You should see a green status bar with "online".

**Quick check**: Open http://localhost:8083 in your browser. If you see the login screen inside a phone frame, you're good.

### "I need to make sure the remote link works"

Open https://sprintshellproto.ngrok.io/app/ on your phone or share it with someone. If it loads the login screen, the tunnel is working.

**Important**: The remote link serves a *snapshot* of the frontend. If engineers make code changes during the workshop and you want those reflected on the remote link, someone needs to run:
```bash
cd ~/Desktop/email-prototypes/inbox-app && npx expo export --platform web
```
Then restart the backend (Ctrl+C in Terminal 1, then `node server.js` again).

The local link (localhost:8083) always shows the latest code automatically — no rebuild needed.

---

## During the Workshop

### "I want to demo the prototype to the group"

**What to show and in what order:**

1. **Start with the login screen** — shows the app password flow
   - Local: http://localhost:8083
   - Remote: https://sprintshellproto.ngrok.io/app/
   - *Talking point*: "We connect to real email via app passwords — no OAuth, no stored passwords. The credential is used once to establish a session."

2. **Log in and show the Briefing tab** — this is the main event
   - It loads real emails, classifies them, and presents a tiered view
   - *Talking point*: "Emails are sorted into three tiers — Needs Attention, Worth a Glance, and Low Priority — using a rules engine plus Claude."

3. **Expand a priority email** — tap any card in the top section
   - Shows the preview, the AI reasoning tag, and the "Open email" link
   - *Talking point*: "Each email shows *why* it was prioritized. The user can open it directly in Gmail/Yahoo."

4. **Open a Glance accordion** — tap any group like "Newsletters" or "Shipping"
   - Shows the bundled emails within that category
   - *Talking point*: "These are emails you probably don't need to act on, but might want to scan. They're auto-grouped by type."

5. **Show the Inbox tab** — tap Inbox in the bottom nav
   - Chronological list of all emails with their classifications
   - *Talking point*: "This is the traditional inbox view, but each email carries its classification. You can see how the system sorted everything."

6. **Show the Gallery tab** — tap Gallery in the bottom nav
   - All the archived design concepts in a scrollable view
   - *Talking point*: "These are the concepts we explored before landing on the current design. You can scroll through to see the evolution."

### "Someone wants to try it on their own device"

Share this with them:

> **URL**: https://sprintshellproto.ngrok.io/app/
>
> **To log in**, you'll need an app password from your email provider:
> - **Gmail**: Go to myaccount.google.com → Security → App Passwords (requires 2-step verification)
> - **Yahoo**: Go to login.yahoo.com → Account Security → Generate App Password (requires 2-step verification)
>
> Enter your email and the generated app password in the app. This is a one-time setup — the session lasts 24 hours.

**If they ask "is this safe?"**: The app password is sent over HTTPS to our backend, used once to establish an IMAP connection, and stored only in an encrypted session cookie that expires in 24 hours. We never see or store their real password. App passwords can be revoked anytime from their email provider's security settings.

### "I want to show how classification works"

**The simple explanation:**
> Every email gets evaluated against a priority ladder. First we check if it's time-sensitive (like a verification code). Then we filter out spam. Then we apply specific rules (is it a calendar invite? a package notification?). Then we check Gmail's own labels. Then we check if it's from a real person. Whatever's left goes to low priority.

**If someone wants the technical details**, point them to:
- `docs/classification-rules.md` — the full rules framework in plain English
- `src/services/classify.ts` — the frontend classification engine (readable TypeScript)
- The backend also has a Claude-powered classifier at `email-prototype/services/agent-classifier.js`

**If someone asks "why not just use AI for everything?"**:
> The rules engine handles the predictable stuff fast and reliably — spam patterns, OTP codes, known category signals. Claude handles the nuanced cases where context matters, like figuring out if an email from a company is actually a personal reply from someone you know there.

### "I want to explain the life graph concept"

The life graph is a relationship map built from someone's email patterns. It identifies:
- **Who matters** — your "coordination circle" (people you email most)
- **Life threads** — ongoing themes like "kids' school," "home renovation," "job search"
- **Sender context** — is this person family? A colleague? A service?

**Where to find it:**
- Concept doc: `email-prototype/contextual-life-graph.md`
- Sample data: `email-prototype/services/life-graph-data.json` (42 senders, 16 life threads)
- The screen that uses it: `src/screens/ConceptLifeThreads.tsx`
- Backend builder: `email-prototype/services/profile-agent.js` (uses Claude to analyze ~200 emails)

### "I want to show the design system"

The custom design system is called **Orbit DS** and lives in `inbox-app/orbit-ds/`.

**Quick pitch:**
> We built a small design system so every prototype concept shares the same visual language — typography, spacing, colors, and reusable components. This means designers and engineers speak the same vocabulary.

**Key facts:**
- Brand color: purple (`#7d2eff`) — the only color in an otherwise greyscale palette
- 18 typography variants (display, title, body, label, caption, etc.)
- ~10 primitives (Button, Avatar, Badge, Tag, TextInput, Toggle, etc.)
- ~16 components (Card, ListItem, Modal, Banner, Toast, SearchBar, etc.)
- Full inventory in `orbit-ds/index.ts` (the barrel export)

### "I want to talk about the archived concepts"

Seven design concepts were explored before landing on the current briefing view. All are preserved in `src/screens/_archive/` and viewable in the Gallery tab.

| Concept | Key idea |
|---------|----------|
| **AccordionBriefing** | Everything in collapsible sections |
| **BriefingTimeline** | Emails on a vertical timeline |
| **CalmFamiliar** | Minimal, calm aesthetic — less information density |
| **QuietReport** | Summary-first, details on demand |
| **ProtoZones** | Screen divided into functional zones |
| **StackedCards** | Tinder-style card stack interface |
| **YourPeople** | People-first view — organized by sender, not email |

Plus the active alternative: **ConceptLifeThreads** — organizes email around life threads and relationships (currently what the Briefing tab renders).

---

## When Things Go Wrong

### "The app won't load / shows a blank screen"

1. **Check the backend** — is Terminal 1 still running? Look for `Local: http://localhost:3000`
2. **Check the frontend** — is Terminal 2 still running? Look for `Web Bundled`
3. **Try the health check** — open http://localhost:3000/health in a browser. If it responds, backend is fine.
4. **Hard refresh** — Cmd+Shift+R in the browser clears cached assets

### "The remote link isn't working"

1. **Check ngrok** — is Terminal 3 still running with a green "online" status?
2. **Laptop asleep?** — ngrok needs your laptop open and online
3. **Restart ngrok**: Ctrl+C, then `ngrok http 3000 --url sprintshellproto.ngrok.io`

### "Login fails / 'connection error'"

- **Wrong password type** — they need an *app password*, not their regular email password
- **2-step verification not enabled** — app passwords require it; they need to enable it first
- **Gmail "less secure apps"** — not needed; app passwords bypass this
- **Backend crashed** — check Terminal 1 for errors, restart with `node server.js`

### "Emails aren't loading / stuck on loading"

- The backend fetches emails via IMAP on each request — it can take a few seconds
- If it's been more than 15 seconds, the IMAP connection may have timed out — refresh the page
- Check Terminal 1 for error messages

### "The port is stuck / server won't start"

```bash
# Find and kill whatever's on port 3000
lsof -i :3000 -t | xargs kill -9

# Then restart
cd ~/Desktop/email-prototypes/email-prototype && node server.js
```

### "Something broke and I need to start fresh"

```bash
# Kill everything
lsof -i :3000 -t | xargs kill -9 2>/dev/null
lsof -i :8083 -t | xargs kill -9 2>/dev/null
pkill -f ngrok 2>/dev/null

# Restart all three (in separate terminals)
cd ~/Desktop/email-prototypes/email-prototype && node server.js
cd ~/Desktop/email-prototypes/inbox-app && npx expo start --web --port 8083
ngrok http 3000 --url sprintshellproto.ngrok.io
```

---

## Working with Engineers During the Session

### "I want to request a change to the prototype"

**Be specific about what you want changed.** Here's the vocabulary that helps:

| If you want to change... | The relevant file is... | Tell the engineer... |
|--------------------------|------------------------|---------------------|
| What the briefing screen looks like | `src/screens/MorningBrief.tsx` | "Can we change the briefing layout to..." |
| How the life threads view works | `src/screens/ConceptLifeThreads.tsx` | "Can we adjust the life threads screen to..." |
| How emails get classified | `src/services/classify.ts` + `docs/classification-rules.md` | "Can we change how [category] emails are sorted?" |
| The login experience | `src/screens/LoginScreen.tsx` | "Can we change the login flow to..." |
| Colors, fonts, spacing | `orbit-ds/tokens/` | "Can we adjust the [color/type/spacing] to..." |
| A reusable component | `orbit-ds/primitives/` or `orbit-ds/components/` | "Can we modify the [Button/Card/etc.] component?" |
| What the backend returns | `email-prototype/routes/api.js` | "Can we add [field] to the API response?" |
| How the AI classifies | `email-prototype/services/agent-classifier.js` | "Can we change how Claude classifies [type] emails?" |

### "An engineer asks where something is"

Point them to **`docs/workshop-reference.md`** — it has the full file inventory with one-line descriptions of every file in the project.

Or if they want the dev-focused guide: **`CLAUDE.md`** at the project root has the complete technical reference including types, conventions, and how to add new screens/categories.

### "I want to use Claude Code to make a change myself"

You can ask Claude Code (this tool) to make changes in natural language. Some examples:

> "Change the brand color from purple to blue"
> "Add a new glance category called 'Travel' for flight and hotel emails"
> "Make the priority cards show the sender's name bigger"
> "Hide the Gallery tab"
> "Add a count badge to each glance accordion"

**Tips for working with Claude Code:**
- Be descriptive about *what you want*, not *how to code it*
- If you're not sure what's possible, ask — "Could we..." or "Is it possible to..."
- After a change, refresh the browser (the local link auto-updates)
- If something looks wrong, say so — "That's not quite right, I wanted..."
- You can always say "undo that" to revert

### "A designer wants to see the component library"

The design system components are all in `orbit-ds/`. The quickest way to show them:
1. Open the **Gallery tab** — it renders archived concepts that use various components
2. Or open `orbit-ds/index.ts` in an editor to see everything that's available
3. The full inventory is in `docs/workshop-reference.md` under section 7

---

## Talking Points & Framing

### What this project is
> An email briefing prototype that connects to your real inbox and uses a combination of rules and AI to sort your email into a prioritized daily briefing — showing you what needs attention, what's worth a glance, and what can wait.

### Why it exists
> We're exploring what email could feel like if it was designed around *your attention* instead of a chronological list. Instead of scanning 50 emails, you get a briefing that surfaces what matters.

### What makes it interesting technically
> It connects to real email (Gmail and Yahoo) via IMAP, classifies messages using a layered rules engine plus Claude, and presents them in a tiered UI built on a custom React Native design system. The life graph concept adds relationship intelligence — understanding *who* matters to you and *what's going on* in your life.

### What's prototype vs. production
> Everything here is prototype-grade — built for exploring ideas, not for shipping. The auth is simplified (app passwords instead of full OAuth), the backend is a single Node server, and the frontend is optimized for demo-ability, not scale. That's intentional — we want to move fast and test concepts.

---

## Quick Reference Card

| I want to... | Do this |
|--------------|---------|
| Start everything | Run the 3 terminal commands in "Before the Workshop Starts" |
| Show the prototype | Open http://localhost:8083 or share the ngrok link |
| Help someone log in | Share the login instructions under "Someone wants to try it" |
| Show archived concepts | Open the Gallery tab in the app |
| Explain classification | Reference the ladder explanation in "How classification works" |
| Fix a crash | Follow the steps in "When Things Go Wrong" |
| Request a code change | Use the table in "Working with Engineers" |
| Make a change with Claude Code | Describe what you want in plain English |
| Find any file | Open `docs/workshop-reference.md` |
| Share technical docs | Point to `CLAUDE.md` (dev guide) or `docs/classification-rules.md` (rules) |
| Kill everything and restart | Run the "start fresh" commands |

---

## Key URLs (tear-off)

```
REMOTE (share with anyone):
  https://sprintshellproto.ngrok.io/app/
  https://sprintshellproto.ngrok.io/app/inbox
  https://sprintshellproto.ngrok.io/app/settings
  https://sprintshellproto.ngrok.io/app/gallery

LOCAL (your laptop only):
  http://localhost:8083
  http://localhost:8083/inbox
  http://localhost:8083/settings
  http://localhost:8083/gallery

BACKEND API:
  http://localhost:3000/health
  http://localhost:3000/api/session
  http://localhost:3000/api/briefing
```

---

*File: `inbox-app/docs/workshop-facilitator-playbook.md`*
