# Batched Email Briefing Prototype

## Quick Start
```bash
cd ~/Desktop/email-prototypes/inbox-app
npx expo start --web
```
Opens at `http://localhost:8081`. Click **Briefing** tab at bottom.

## What This Is
A "newspaper for your inbox" — replaces continuous email trickle with periodic batched briefings (morning/midday/evening). The active prototype is the **Morning Briefing** screen: a greyscale, calm layout that groups 12 emails into 3 tiers with progressive disclosure and AI reasoning transparency.

## Architecture

### Key Files
| File | Role |
|------|------|
| `src/screens/MorningBrief.tsx` | **Active screen** — greyscale briefing with masthead, tiered sections, countdown, chrono toggle |
| `src/data/briefing.ts` | Types (`BriefingEmail`, `Briefing`, `BriefingTier`) + 12 mock emails across 3 tiers + helpers |
| `src/hooks/useCountdown.ts` | `useCountdown(seconds)` → `{ formatted, pulled, pullEarly }` |
| `src/PrototypeScreen.tsx` | Thin wrapper, renders MorningBrief directly |
| `App.tsx` | Root — SafeAreaView + PhoneFrame + bottom nav (Inbox / Briefing) |

### Unused but available iterations
| File | Concept |
|------|---------|
| `src/screens/StackedCards.tsx` | Tier tabs with full-width accent cards |
| `src/screens/BriefingTimeline.tsx` | Vertical timeline with 3 waypoints |
| `src/screens/AccordionBriefing.tsx` | Collapsible tier accordion with LayoutAnimation |

### Data Shape
```ts
BriefingEmail {
  id, from, subject, preview, detail, fullBody,
  reason,          // AI transparency string
  tier,            // "priority" | "uncertain" | "low"
  category, suggestedAction
}
```
Morning briefing: 3 priority, 4 uncertain ("glance"), 5 low. Midday/evening are future stubs.

### Design Tokens
- **Greyscale palette** — defined as `G` object in MorningBrief.tsx (black/dark/mid/muted/light/faint/white)
- **Orbit DS** — `orbit-ds/` barrel export for Card, Tag, Button, OrbitText, SectionHeader, spacing, radius, shadows
- **PhoneFrame** — 393×852 web wrapper with rounded corners

### Interaction Model
- Tap any email → expands detail + AI reason tag
- Tap again → collapses
- "Get it now" → pulls next briefing early (countdown stops)
- "Switch to chronological view" → flat list with tier-colored dots
- Low-priority bar → expands sender list → individual emails expandable

## Stack
React Native + Expo SDK 54 + TypeScript strict + react-native-web
