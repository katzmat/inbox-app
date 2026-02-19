// ─── Briefing Data Layer ───────────────────────────────
// Shared types for agent-classified briefings.

export type BriefingTier = "needsAttention" | "glance" | "low" | "priority" | "uncertain";

export type GlanceCategory =
  | "Shipping & Deliveries"
  | "Purchases & Receipts"
  | "Newsletters & Reads"
  | "Events & Calendar"
  | "Updates & Alerts"
  | "Social & Community"
  | "School & Kids"
  | "Comments & Collab";

export type BriefingEmail = {
  id: string | number;
  from: string;
  fromFull?: string;
  subject: string;
  snippet: string;
  date: string;
  webLink?: string;
  summary: string | null;
  reason: string | null;
  suggestedAction: string | null;
  urgencyType: string | null;
  glanceCategory: GlanceCategory | null;
  // Legacy fields kept for mock data / inactive screen compatibility
  preview?: string;
  detail?: string;
  fullBody?: string;
  tier?: BriefingTier;
  category?: string;
};

export type BriefingResponse = {
  generatedAt: string;
  backend: string;
  profileStatus: "ready" | "building" | "none";
  summary: {
    total: number;
    needsAttention: number;
    glance: number;
    low: number;
  };
  sections: {
    needsAttention: BriefingEmail[];
    glance: Record<string, BriefingEmail[]>;
    low: BriefingEmail[];
  };
};

export type BriefingStats = {
  needsAttention: number;
  glance: number;
  low: number;
  total: number;
  // Legacy aliases for inactive prototype screens
  priority?: number;
  uncertain?: number;
};

// ─── Mock Data (fallback when disconnected) ────────────

const mockNeedsAttention: BriefingEmail[] = [
  {
    id: "mock-1",
    from: "Risa Cromer",
    subject: "Insurance comparison docs from Geoff",
    snippet: "hi love — forwarding the analysis. can we look at this tonight after Piper's down?",
    date: "",
    reason: "From spouse, time-sensitive financial decision with deadline this month",
    summary: "Risa forwarded Geoff's insurance comparison — wants to review tonight after Piper's bedtime.",
    suggestedAction: "Review attachment tonight",
    urgencyType: "person",
    glanceCategory: null,
    preview: "hi love — forwarding the analysis. can we look at this tonight after Piper's down?",
    detail: "Geoff Beck's Yahoo vs Purdue health insurance comparison is attached. Decision deadline is this month.",
    fullBody: "",
    tier: "needsAttention",
    category: "Insurance",
  },
  {
    id: "mock-2",
    from: "Republic Services",
    subject: "FINAL NOTICE — Past due balance",
    snippet: "Your account has been referred to collections. Immediate action required.",
    date: "",
    reason: "Past-due account, financial consequence detected",
    summary: "Past-due balance of $127.43 on waste collection — referred to collections.",
    suggestedAction: "Call to resolve",
    urgencyType: "action",
    glanceCategory: null,
    preview: "Your account has been referred to collections. Immediate action required.",
    detail: "Past-due balance on waste collection account.",
    fullBody: "",
    tier: "needsAttention",
    category: "Bills",
  },
  {
    id: "mock-3",
    from: "Stripe",
    subject: "Payment failed for Bon Appétit",
    snippet: "We were unable to process your payment method ending in 4242.",
    date: "",
    reason: "Recurring payment failure, multiple services may be affected",
    summary: "Visa ending in 4242 failing since Dec 25 — Bon Appétit subscription at risk.",
    suggestedAction: "Update card on file",
    urgencyType: "action",
    glanceCategory: null,
    preview: "We were unable to process your payment method ending in 4242.",
    detail: "Card failures across Bon Appétit, possibly Asana and Kapwing.",
    fullBody: "",
    tier: "needsAttention",
    category: "Payments",
  },
];

const mockGlance: Record<string, BriefingEmail[]> = {
  "School & Kids": [
    {
      id: "mock-4",
      from: "Day Early Learning",
      subject: "Reminder: Center closed Feb 16 — Professional Development",
      snippet: "Day Early Learning will be closed Monday, Feb 16 for staff professional development.",
      date: "",
      reason: "Childcare disruption — may require schedule coordination",
      summary: "Piper's daycare closed Feb 16 — may need coverage since Risa teaches that afternoon.",
      suggestedAction: "Coordinate coverage",
      urgencyType: null,
      glanceCategory: "School & Kids",
      preview: "Day Early Learning will be closed Monday, Feb 16 for staff professional development.",
      detail: "Piper's daycare closed.",
      fullBody: "",
      tier: "glance",
      category: "Kids",
    },
    {
      id: "mock-7",
      from: "ISI — International School",
      subject: "Ready for the Week Ahead — Feb 9",
      snippet: "Choir Thursday 3pm. Innovation Unit presentations coming up. Spirit day Friday.",
      date: "",
      reason: "School newsletter with schedule items",
      summary: "This week: Choir Thursday 3pm, Spirit Day Friday, Innovation Unit presentations Feb 20-21.",
      suggestedAction: "Note choir Thursday 3pm",
      urgencyType: null,
      glanceCategory: "School & Kids",
      preview: "Choir Thursday 3pm. Innovation Unit presentations coming up.",
      detail: "Weekly digest from Jennie & Theo's school.",
      fullBody: "",
      tier: "glance",
      category: "School",
    },
  ],
  "Updates & Alerts": [
    {
      id: "mock-5",
      from: "Envision Remodeling (Ryan)",
      subject: "Re: Inspection follow-up",
      snippet: "Inspection completed Friday. Will review findings and get back to you with next steps.",
      date: "",
      reason: "Active contractor thread — home repair",
      summary: "Ryan confirmed inspection is done — will send findings by end of week.",
      suggestedAction: "Follow up end of week",
      urgencyType: null,
      glanceCategory: "Updates & Alerts",
      preview: "Inspection completed Friday.",
      detail: "Shower drainage issue inspection done.",
      fullBody: "",
      tier: "glance",
      category: "Home",
    },
    {
      id: "mock-6",
      from: "Christie Davis",
      subject: "Cookie season update + booth schedule",
      snippet: "Next booth TBD. Please submit orders by Friday.",
      date: "",
      reason: "Kids' extracurricular — Friday deadline",
      summary: "Cookie pre-orders due Friday. Next booth date TBD.",
      suggestedAction: "Submit cookie orders by Friday",
      urgencyType: null,
      glanceCategory: "Updates & Alerts",
      preview: "Next booth TBD. Please submit orders by Friday.",
      detail: "Girl Scout Brownie Troop 3728 cookie season.",
      fullBody: "",
      tier: "glance",
      category: "Family",
    },
  ],
};

const mockLow: BriefingEmail[] = [
  {
    id: "mock-8",
    from: "TLDR Newsletter",
    subject: "TLDR AI 2026-02-10",
    snippet: "Google announces Gemini 2.5 Pro, OpenAI shipping desktop agents…",
    date: "",
    reason: "Newsletter — read at leisure",
    summary: null,
    suggestedAction: null,
    urgencyType: null,
    glanceCategory: null,
    tier: "low",
    category: "Newsletter",
  },
  {
    id: "mock-9",
    from: "DoorDash",
    subject: "Matt, hungry? Here's 20% off",
    snippet: "Use code SAVE20 on your next order. Expires Thursday.",
    date: "",
    reason: "Promotional email",
    summary: null,
    suggestedAction: null,
    urgencyType: null,
    glanceCategory: null,
    tier: "low",
    category: "Promo",
  },
  {
    id: "mock-10",
    from: "LinkedIn",
    subject: "5 new jobs match your profile",
    snippet: "Based on your profile: UX Researcher roles in Indianapolis and remote.",
    date: "",
    reason: "Automated job alert",
    summary: null,
    suggestedAction: null,
    urgencyType: null,
    glanceCategory: null,
    tier: "low",
    category: "Social",
  },
  {
    id: "mock-11",
    from: "Chess.com",
    subject: "Your daily puzzle is ready",
    snippet: "Can you find the winning move? Today's puzzle is rated 1450.",
    date: "",
    reason: "Entertainment notification",
    summary: null,
    suggestedAction: null,
    urgencyType: null,
    glanceCategory: null,
    tier: "low",
    category: "Social",
  },
];

export const mockBriefingResponse: BriefingResponse = {
  generatedAt: new Date().toISOString(),
  backend: "mock",
  profileStatus: "none",
  summary: {
    total: 11,
    needsAttention: mockNeedsAttention.length,
    glance: Object.values(mockGlance).reduce((sum, arr) => sum + arr.length, 0),
    low: mockLow.length,
  },
  sections: {
    needsAttention: mockNeedsAttention,
    glance: mockGlance,
    low: mockLow,
  },
};

export const USER_NAME = "Matt";
export const TODAY = "Tuesday, February 10, 2026";

// ─── Legacy compatibility (inactive prototype screens) ─

export type Briefing = {
  id: string;
  label: string;
  time: string;
  isActive: boolean;
  isFuture: boolean;
  emails: BriefingEmail[];
};

const allMockEmails: BriefingEmail[] = [
  ...mockNeedsAttention,
  ...Object.values(mockGlance).flat(),
  ...mockLow,
];

export const morningBriefing: Briefing = {
  id: "morning",
  label: "Morning Briefing",
  time: "7:00 AM",
  isActive: true,
  isFuture: false,
  emails: allMockEmails,
};

export const middayBriefing: Briefing = {
  id: "midday",
  label: "Midday Briefing",
  time: "12:30 PM",
  isActive: false,
  isFuture: true,
  emails: [],
};

export const eveningBriefing: Briefing = {
  id: "evening",
  label: "Evening Briefing",
  time: "5:30 PM",
  isActive: false,
  isFuture: true,
  emails: [],
};

export const allBriefings: Briefing[] = [
  morningBriefing,
  middayBriefing,
  eveningBriefing,
];

export function emailsByTier(
  briefing: Briefing
): Record<string, BriefingEmail[]> {
  return {
    priority: briefing.emails.filter(
      (e) => e.tier === "needsAttention" || e.urgencyType != null
    ),
    uncertain: briefing.emails.filter(
      (e) => e.tier === "glance" || e.glanceCategory != null
    ),
    low: briefing.emails.filter(
      (e) =>
        e.tier === "low" || (!e.urgencyType && !e.glanceCategory && !e.tier)
    ),
  };
}

export function briefingStats(briefing: Briefing): BriefingStats {
  const tiers = emailsByTier(briefing);
  return {
    needsAttention: tiers.priority.length,
    glance: tiers.uncertain.length,
    low: tiers.low.length,
    total: briefing.emails.length,
    priority: tiers.priority.length,
    uncertain: tiers.uncertain.length,
  };
}

export function createBriefingFromGmail(
  classifiedEmails: BriefingEmail[]
): Briefing {
  return {
    id: "morning-live",
    label: "Morning Briefing",
    time: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
    isActive: true,
    isFuture: false,
    emails: classifiedEmails,
  };
}
