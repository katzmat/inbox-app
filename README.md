# Inbox App — Email Briefing Prototype Platform

A modular React Native (Expo Web) platform for rapidly prototyping email inbox concepts. Connected to real email (Gmail/Yahoo) via IMAP with AI-powered classification. Built as a sprint-ready toolkit — real data, real design system, easy to extend.

**This is a read-only prototype** — users view and explore their email, but don't compose, reply, or modify it.

## Architecture

```
Expo Web App (port 8083)  ──fetch──>  Express Backend (port 3000)  ──IMAP──>  Gmail / Yahoo
  ├─ Expo Router (file-based)            ├─ JWT auth (httpOnly cookies)
  ├─ Orbit Design System                 ├─ Profile Agent (Claude → life graph)
  ├─ Zustand state management            ├─ Agent Classifier (Claude + rules fallback)
  └─ TypeScript strict mode              └─ Email threading (In-Reply-To + subject)
```

## Quick Start

```bash
# Backend (Terminal 1)
cd ../email-prototype
cp .env.example .env   # Fill in JWT_SECRET, optionally ANTHROPIC_API_KEY
npm install && node server.js

# Frontend (Terminal 2)
cd inbox-app
npm install
npx expo start --web --port 8083
```

## Auth

No OAuth redirects. Users create an **app password** in their email provider's security settings:
- **Yahoo**: login.yahoo.com → Account Security → Generate App Password
- **Gmail**: myaccount.google.com → Security → App Passwords

Both require 2-step verification enabled first.

## Key Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout — session gate, auth redirect, error boundary |
| `app/(tabs)/` | Tab routes — Briefing, Inbox, Settings (add new tabs here) |
| `src/screens/MorningBrief.tsx` | Main briefing screen — tiered view with grouped accordions |
| `src/stores/session.ts` | Zustand store — session state (connected, email, provider) |
| `src/stores/briefing.ts` | Zustand store — briefing data, fetch, derived selectors |
| `src/services/gmail.ts` | API client — session, login, fetch, disconnect |
| `src/data/briefing.ts` | Types + mock data fallback |
| `orbit-ds/` | Design system — components, primitives, tokens |
| `docs/classification-rules.md` | Source-of-truth classification framework |

## Adding a New Screen

1. Create `app/(tabs)/myscreen.tsx`
2. Add a `<Tabs.Screen>` entry in `app/(tabs)/_layout.tsx`
3. Build UI using Orbit components: `import { Card, Button, SearchBar } from "../../orbit-ds"`

## Orbit Design System

Reusable components in `orbit-ds/`:

**Primitives**: Button, TextInput, Toggle, Avatar, Badge, Tag, Text, Icon, Star, Divider, Notification

**Components**: Card, SearchBar, Modal, EmptyState, ListItem, Banner, TopNavigation, TabBar, BottomSheet, Toast, FloatingActionBar, SectionHeader, ActionButton

**Tokens**: `colors` (brand purple + greyscale), `typography` (18 variants), `spacing` (0–64px), `radius`, `shadows`

## Classification

Emails are classified into 3 tiers by the backend agent classifier (Claude-powered with rules fallback):

| Tier | Examples | UI Treatment |
|------|----------|--------------|
| **Needs Attention** | From spouse, past-due bills, security alerts | Elevated cards with expand/collapse |
| **Worth a Glance** | School updates, packages, newsletters | Grouped accordion bundles by category |
| **Low Priority** | Promos, social notifications, spam | Collapsed summary bar |

See `docs/classification-rules.md` for the full taxonomy.

## Remote Access (ngrok)

```bash
npx expo export --platform web       # Build static bundle
cd ../email-prototype && node server.js  # Serves at /app/
ngrok http 3000 --url sprintshellproto.ngrok.io
```

Stable URL: `https://sprintshellproto.ngrok.io/app/`

## TypeScript

```bash
npx tsc --noEmit  # Must pass clean
```
