# Sprint Briefing — inbox-app

## What This Is
A **sprint-ready prototyping platform** for email inbox concepts. Real email data (Gmail/Yahoo via IMAP), AI classification (Claude), and a design system (Orbit) — all wired up so you can focus on building and testing ideas, not infrastructure.

**Read-only prototype**: users view and explore their email but don't compose or modify it.

## How It Works
1. User logs in with email + app password (no OAuth setup needed)
2. Backend fetches real inbox via IMAP, builds a "life graph" of relationships
3. Claude classifies emails into tiers: Needs Attention / Worth a Glance / Low Priority
4. Frontend displays the classified briefing using Orbit design system components

## File Roles
| What | Where |
|------|-------|
| Routes (screens) | `app/(tabs)/*.tsx` — add files here for new tabs |
| Screen components | `src/screens/` — complex UI lives here, imported by routes |
| State management | `src/stores/` — Zustand stores for session + briefing data |
| API client | `src/services/gmail.ts` |
| Design system | `orbit-ds/` — primitives, components, tokens |
| Backend | `../email-prototype/` — Express + IMAP + agents |
| Classification rules | `docs/classification-rules.md` |

## Data Shape (from /api/briefing)
```json
{
  "sections": {
    "needsAttention": [{ "id", "threadId", "from", "subject", "snippet", "reason", "suggestedAction", "webLink" }],
    "glance": { "School & Kids": [...], "Updates & Alerts": [...] },
    "low": [...]
  },
  "summary": { "total": 50, "needsAttention": 3, "glance": 12, "low": 35 },
  "profileStatus": "ready|building|none"
}
```

## Stack
- React Native + Expo SDK 54 + Expo Router + TypeScript strict
- Zustand for state, Orbit DS for UI
- Express 5 backend, IMAP (imapflow), JWT auth, Claude API (optional)
