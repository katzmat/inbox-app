// ─── Briefing Data Layer ───────────────────────────────
// Shared types + mock data for all batched-briefing prototypes.

export type BriefingTier = "priority" | "uncertain" | "low";

export type BriefingEmail = {
  id: number;
  gmailId?: string;
  from: string;
  subject: string;
  preview: string;
  detail: string;
  fullBody: string;
  reason: string;
  tier: BriefingTier;
  category: string;
  suggestedAction: string;
};

export type Briefing = {
  id: string;
  label: string;
  time: string;
  isActive: boolean;
  isFuture: boolean;
  emails: BriefingEmail[];
};

export type BriefingStats = {
  priority: number;
  uncertain: number;
  low: number;
  total: number;
};

// ─── Morning Briefing Emails ──────────────────────────

const priorityEmails: BriefingEmail[] = [
  {
    id: 1,
    from: "Risa Cromer",
    subject: "Insurance comparison docs from Geoff",
    preview: "hi love — forwarding the analysis. can we look at this tonight after Piper's down?",
    detail: "Geoff Beck's Yahoo vs Purdue health insurance comparison is attached. Decision deadline is this month.",
    fullBody: "hi love — forwarding the analysis from Geoff. he finally got over the flu and sent the Yahoo vs Purdue comparison. can we look at this tonight after Piper's down? I think the Purdue plan has better pediatric coverage but the Yahoo one is cheaper monthly. let me know. xo",
    reason: "From spouse, time-sensitive financial decision with deadline this month",
    tier: "priority",
    category: "Insurance",
    suggestedAction: "Review attachment tonight",
  },
  {
    id: 2,
    from: "Republic Services",
    subject: "FINAL NOTICE — Past due balance",
    preview: "Your account has been referred to collections. Immediate action required.",
    detail: "Past-due balance on waste collection account. Auto-pay was enrolled Oct 20, 2025 but may not have resolved the arrears.",
    fullBody: "Dear Matthew Katz,\n\nThis is a final notice regarding your past-due balance of $127.43 on account #RS-4419827. Your account has been referred to our collections department. Please remit payment immediately to avoid further action.\n\nIf you believe this is in error or have already enrolled in auto-pay, please call us at 1-800-722-8610.\n\nRepublic Services Customer Care",
    reason: "Past-due account, financial consequence detected",
    tier: "priority",
    category: "Bills",
    suggestedAction: "Call to resolve",
  },
  {
    id: 3,
    from: "Stripe",
    subject: "Payment failed for Bon Appétit",
    preview: "We were unable to process your payment method ending in 4242.",
    detail: "Card failures across Bon Appétit, possibly Asana and Kapwing. Same card declining since Dec 25.",
    fullBody: "Hi Matt,\n\nWe were unable to process your payment of $6.99 for Bon Appétit using Visa ending in 4242. This is your 3rd failed attempt since December 25, 2025.\n\nPlease update your payment method to continue your subscription.\n\nStripe Billing",
    reason: "Recurring payment failure, multiple services may be affected",
    tier: "priority",
    category: "Payments",
    suggestedAction: "Update card on file",
  },
];

const uncertainEmails: BriefingEmail[] = [
  {
    id: 4,
    from: "Day Early Learning",
    subject: "Reminder: Center closed Feb 16 — Professional Development",
    preview: "Day Early Learning will be closed Monday, Feb 16 for staff professional development.",
    detail: "Piper's daycare closed. Risa is teaching 12:30–1:30pm that day — coverage needed.",
    fullBody: "Dear Families,\n\nThis is a reminder that Day Early Learning will be closed on Monday, February 16th for staff professional development. Normal hours resume Tuesday.\n\nPlease plan accordingly.\n\nDay Early Learning Team",
    reason: "Childcare disruption — may require schedule coordination",
    tier: "uncertain",
    category: "Kids",
    suggestedAction: "Coordinate coverage with Anne",
  },
  {
    id: 5,
    from: "Envision Remodeling (Ryan)",
    subject: "Re: Inspection follow-up",
    preview: "Inspection completed Friday. Will review findings and get back to you with next steps.",
    detail: "Shower pooling/drainage issues since Aug remodel. Inspection done, awaiting resolution plan.",
    fullBody: "Hey Matt,\n\nJust wanted to confirm the inspection was completed Friday afternoon. Our team found a few things related to the drainage slope that we need to discuss. I'll have a full write-up for you by end of this week.\n\nThanks for your patience.\n\nRyan — Envision Remodeling",
    reason: "Active contractor thread — waiting on resolution for home repair",
    tier: "uncertain",
    category: "Home",
    suggestedAction: "Follow up end of week",
  },
  {
    id: 6,
    from: "Christie Davis",
    subject: "Cookie season update + booth schedule",
    preview: "Next booth TBD. Please submit orders by Friday. Remind your scouts about patches!",
    detail: "Girl Scout Brownie Troop 3728 cookie season runs Jan–Mar. Feb 4 booth completed.",
    fullBody: "Hi Troop Families!\n\nGreat job at the CFI booth on Feb 4! Next booth date TBD — I'll confirm by Wednesday. Please submit all pre-orders by this Friday.\n\nRemind your scouts that patches are earned at 150+ boxes. We're at 89 as a troop!\n\nChristie Davis\nTroop 3728 Leader",
    reason: "Kids' extracurricular — has a Friday deadline for orders",
    tier: "uncertain",
    category: "Family",
    suggestedAction: "Submit cookie orders by Friday",
  },
  {
    id: 7,
    from: "ISI — International School",
    subject: "Ready for the Week Ahead — Feb 9",
    preview: "Choir Thursday 3pm. Innovation Unit presentations coming up. Spirit day Friday.",
    detail: "Weekly digest from Jennie & Theo's school with schedule reminders.",
    fullBody: "Dear ISI Families,\n\nHere's what's ahead this week:\n• Monday: Regular schedule\n• Thursday: Choir performance at 3pm (families welcome)\n• Friday: Spirit Day — wear school colors!\n• Coming up: Innovation Unit presentations Feb 20–21\n\nISI Weekly Newsletter",
    reason: "School newsletter — contains schedule items for this week",
    tier: "uncertain",
    category: "School",
    suggestedAction: "Note choir Thursday 3pm",
  },
];

const lowEmails: BriefingEmail[] = [
  {
    id: 8,
    from: "TLDR Newsletter",
    subject: "TLDR AI 2026-02-10",
    preview: "Google announces Gemini 2.5 Pro, OpenAI shipping desktop agents…",
    detail: "Daily AI/tech newsletter digest.",
    fullBody: "TLDR AI — February 10, 2026\n\n🔥 Headlines:\n• Google announces Gemini 2.5 Pro with 2M context\n• OpenAI shipping desktop agents to Plus users\n• Meta open-sources video generation model\n\n📰 Read more at tldr.tech",
    reason: "Newsletter — read at leisure, no action needed",
    tier: "low",
    category: "Newsletter",
    suggestedAction: "Read later",
  },
  {
    id: 9,
    from: "DoorDash",
    subject: "Matt, hungry? Here's 20% off",
    preview: "Use code SAVE20 on your next order. Expires Thursday.",
    detail: "Promotional offer from DoorDash.",
    fullBody: "Hey Matt! 🍕\n\nWe miss you! Here's 20% off your next order with code SAVE20. Expires Thursday at midnight.\n\nOrder now at doordash.com",
    reason: "Promotional email — no urgency",
    tier: "low",
    category: "Promo",
    suggestedAction: "Ignore or use coupon",
  },
  {
    id: 10,
    from: "Target",
    subject: "Your Target 360 delivery is on the way!",
    preview: "Order #TGT-9928374 arriving tomorrow by 8pm.",
    detail: "Delivery confirmation for an existing order.",
    fullBody: "Hi Matt,\n\nYour order #TGT-9928374 is on its way!\n\nEstimated delivery: Tomorrow by 8pm\nItems: Pampers Size 4, Goldfish crackers (2), Paper towels\n\nTrack your delivery in the Target app.",
    reason: "Order tracking — informational, no action needed",
    tier: "low",
    category: "Shopping",
    suggestedAction: "No action needed",
  },
  {
    id: 11,
    from: "LinkedIn",
    subject: "5 new jobs match your profile",
    preview: "Based on your profile: UX Researcher roles in Indianapolis and remote.",
    detail: "Automated job recommendation email.",
    fullBody: "Hi Matt,\n\n5 new jobs match your preferences:\n1. Sr. UX Researcher — Salesforce (Remote)\n2. UX Research Lead — Lilly (Indianapolis)\n3. Design Researcher — Genesys (Remote)\n...\n\nView all on LinkedIn",
    reason: "Automated job alert — low relevance unless actively searching",
    tier: "low",
    category: "Social",
    suggestedAction: "Ignore",
  },
  {
    id: 12,
    from: "Chess.com",
    subject: "Your daily puzzle is ready",
    preview: "Can you find the winning move? Today's puzzle is rated 1450.",
    detail: "Daily chess puzzle notification.",
    fullBody: "♟️ Daily Puzzle — February 10, 2026\n\nRating: 1450\nTheme: Discovered attack\n\nCan you find the winning move? Play now at chess.com/puzzles",
    reason: "Entertainment notification — no urgency",
    tier: "low",
    category: "Social",
    suggestedAction: "Play when free",
  },
];

// ─── Assembled Briefings ──────────────────────────────

export const morningBriefing: Briefing = {
  id: "morning",
  label: "Morning Briefing",
  time: "7:00 AM",
  isActive: true,
  isFuture: false,
  emails: [...priorityEmails, ...uncertainEmails, ...lowEmails],
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

export const allBriefings: Briefing[] = [morningBriefing, middayBriefing, eveningBriefing];

// ─── Helpers ──────────────────────────────────────────

export function emailsByTier(briefing: Briefing): Record<BriefingTier, BriefingEmail[]> {
  return {
    priority: briefing.emails.filter((e) => e.tier === "priority"),
    uncertain: briefing.emails.filter((e) => e.tier === "uncertain"),
    low: briefing.emails.filter((e) => e.tier === "low"),
  };
}

export function briefingStats(briefing: Briefing): BriefingStats {
  const tiers = emailsByTier(briefing);
  return {
    priority: tiers.priority.length,
    uncertain: tiers.uncertain.length,
    low: tiers.low.length,
    total: briefing.emails.length,
  };
}

export const USER_NAME = "Matt";
export const TODAY = "Tuesday, February 10, 2026";

// ─── Gmail → Briefing Factory ────────────────────────

export function createBriefingFromGmail(classifiedEmails: BriefingEmail[]): Briefing {
  return {
    id: "morning-live",
    label: "Morning Briefing",
    time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    isActive: true,
    isFuture: false,
    emails: classifiedEmails,
  };
}
