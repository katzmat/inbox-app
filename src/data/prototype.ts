export const TODAY = "Tuesday, February 10, 2026";
export const USER_NAME = "Matt";

export type UrgentItem = {
  id: number;
  category: string;
  icon: string;
  subject: string;
  detail: string;
  from: string;
  time: string;
  thread: string;
  priority: string;
};

export type AttentionItem = {
  id: number;
  category: string;
  icon: string;
  subject: string;
  detail: string;
  from: string;
  time: string;
  thread: string;
};

export type FYIItem = {
  id: number;
  subject: string;
  icon: string;
  from: string;
};

export const urgentItems: UrgentItem[] = [
  {
    id: 1,
    category: "Health Insurance",
    icon: "🏥",
    subject: "Health insurance decision deadline this month",
    detail:
      "Yahoo UHC vs. Purdue plan — waiting on Geoff Beck's analysis from Valeo Financial",
    from: "UnitedHealthcare / Valeo Financial",
    time: "Deadline: Feb 2026",
    thread: "insurance-comparison",
    priority: "urgent",
  },
  {
    id: 2,
    category: "Home",
    icon: "🐕",
    subject: "Pet Pals Veterinary closing Feb 4 — find new vet for Voltaggio",
    detail:
      "Closure email sent. Pet may be registered under co-parent's name.",
    from: "Pet Pals Veterinary Hospital",
    time: "Immediate",
    thread: "vet-closing",
    priority: "urgent",
  },
  {
    id: 3,
    category: "Bills",
    icon: "🚨",
    subject: "Republic Services account in collections",
    detail:
      "Past-due balance needs resolution. Auto-pay was enrolled Oct 20, 2025.",
    from: "Republic Services",
    time: "Past due",
    thread: "republic-services",
    priority: "urgent",
  },
  {
    id: 4,
    category: "Payments",
    icon: "💳",
    subject: "Card failures: Bon Appétit, Asana, possibly Kapwing & Replit",
    detail:
      "Multiple services tied to same card. Bon Appétit declining since Dec 25.",
    from: "Stripe / Various",
    time: "Since Dec 25",
    thread: "card-failures",
    priority: "urgent",
  },
];

export const needsAttention: AttentionItem[] = [
  {
    id: 5,
    category: "Kids",
    icon: "📅",
    subject: "Feb 16 daycare closed — Piper coverage needed",
    detail:
      "Professional development day. Risa teaching 12:30–1:30pm, needs extra hands.",
    from: "Day Early Learning",
    time: "6 days away",
    thread: "daycare-gap",
  },
  {
    id: 6,
    category: "Home",
    icon: "🚿",
    subject: "Envision shower inspection done — awaiting resolution",
    detail:
      "Pooling/drainage issues since Aug remodel. Inspection completed, no final answer yet.",
    from: "Envision Remodeling (Ryan)",
    time: "Waiting",
    thread: "shower-remediation",
  },
  {
    id: 7,
    category: "Home",
    icon: "🔧",
    subject: "Ciriello plumbing — still waiting on camera images",
    detail:
      "Follow-ups sent. Pipe joint misalignment found. Need images + estimate.",
    from: "Chelsea Wall, Ciriello Plumbing",
    time: "Stalled",
    thread: "plumbing-sewer",
  },
  {
    id: 8,
    category: "Family",
    icon: "🍪",
    subject: "Girl Scout cookie booth at CFI — Feb 4 done, season through March",
    detail:
      "Brownie Troop 3728. Cookie season Jan–Mar. Coordinate with Christie Davis.",
    from: "Girl Scouts",
    time: "Ongoing",
    thread: "cookie-season",
  },
  {
    id: 9,
    category: "Car",
    icon: "🚗",
    subject: "Kia Niro overdue for service since September",
    detail: "Tyler Automotive. Last service was Sept 18, 2025.",
    from: "Tyler Automotive",
    time: "5 months overdue",
    thread: "car-service",
  },
];

export const fyi: FYIItem[] = [
  { id: 10, subject: "Risa DC trip Mar 11–14 — you'll be solo with kids", icon: "✈️", from: "Calendar" },
  { id: 11, subject: "Chicago trip Mar 19–22 — status: 'most likely out'", icon: "🏙️", from: "Friends group" },
  { id: 12, subject: "Summer camp planning card active on Trello with Anne", icon: "⛺", from: "Trello" },
  { id: 13, subject: "Downstairs bathroom remodel estimate expired Jan 3", icon: "🛁", from: "All Worth Construction" },
  { id: 14, subject: "HVAC filter change due end of month", icon: "🌡️", from: "Home reminder" },
];

export const quietStats = {
  totalEmails: 2847,
  promotional: 1423,
  socialNotifications: 412,
  newsletters: 287,
  receiptsOrganized: 156,
  subscriptionsTracked: 47,
  needsYou: 9,
  autoHandled: 2838,
};

export type Person = {
  name: string;
  relation?: string;
  avatar: string;
  color: string;
  status?: string;
  latestSubject: string;
  latestPreview: string;
  time: string;
  unread: number;
  threads?: string[];
  flag?: string;
};

export const people = {
  innerCircle: [
    {
      name: "Risa",
      relation: "Spouse",
      avatar: "RC",
      color: "#E8B4B8",
      status: "online",
      latestSubject: "Insurance comparison docs from Geoff",
      latestPreview: "hi love — forwarding the analysis. can we look at this tonight after Piper's down?",
      time: "2h ago",
      unread: 3,
      threads: ["Insurance decision (Yahoo vs Purdue)", "Shower remediation with Envision", "Capital One statement — due Feb 8"],
    },
    {
      name: "Anne",
      relation: "Co-parent",
      avatar: "AJ",
      color: "#B4C7E8",
      status: "offline",
      latestSubject: "Summer camp Trello card updated",
      latestPreview: "Added ISI sports camps and Girl Scout day camps to the board. Can you look at guitar lesson options?",
      time: "Yesterday",
      unread: 1,
      threads: ["Summer camp planning", "Feb 16 daycare gap coverage", "ISI tuition spring semester"],
    },
  ] as Person[],
  kidsSchool: [
    {
      name: "ISI — Jennie & Theo",
      avatar: "ISI",
      color: "#C8D8B4",
      latestSubject: "Ready for the Week Ahead — Feb 9",
      latestPreview: "Choir Thursday 3pm. Innovation Unit presentations coming up. Spirit day Friday.",
      time: "Yesterday",
      unread: 2,
    },
    {
      name: "Day Early Learning — Piper",
      avatar: "DL",
      color: "#D8C8E8",
      latestSubject: "MomentPath Daily Report",
      latestPreview: "Check-in 8:47am. 2 meals, 1 nap (1h 20m), 3 diapers. Supplies needed: wipes.",
      time: "Today",
      unread: 1,
    },
    {
      name: "Christie Davis",
      relation: "Girl Scout Troop Leader",
      avatar: "CD",
      color: "#E8D8B4",
      latestSubject: "Cookie season update + booth schedule",
      latestPreview: "Next booth TBD. Please submit orders by Friday. Remind your scouts about patches!",
      time: "3 days ago",
      unread: 0,
    },
  ] as Person[],
  professional: [
    {
      name: "Geoff Beck",
      relation: "Financial Advisor, Valeo",
      avatar: "GB",
      color: "#B4D8D8",
      latestSubject: "Insurance analysis — had the flu, catching up",
      latestPreview: "Sorry for the delay — was down with flu late Jan. Working on the Yahoo vs Purdue comparison now.",
      time: "4 days ago",
      unread: 0,
    },
    {
      name: "Katy Feeser",
      relation: "Therapist",
      avatar: "KF",
      color: "#D8B4C8",
      latestSubject: "Session confirmation — Wed 11am",
      latestPreview: "See you Wednesday at 11. Telehealth link below.",
      time: "1 week ago",
      unread: 0,
    },
  ] as Person[],
  contractors: [
    {
      name: "Ryan — Envision Remodeling",
      avatar: "ER",
      color: "#E8C8B4",
      latestSubject: "Re: Inspection follow-up",
      latestPreview: "Inspection completed Friday. Will review findings and get back to you with next steps.",
      time: "5 days ago",
      unread: 1,
      flag: "waiting",
    },
    {
      name: "Chelsea Wall — Ciriello Plumbing",
      avatar: "CP",
      color: "#B4B4E8",
      latestSubject: "Re: Camera images request",
      latestPreview: "(No reply since Nov follow-up)",
      time: "2+ months",
      unread: 0,
      flag: "stalled",
    },
    {
      name: "Chaz Worth — All Worth Construction",
      avatar: "AW",
      color: "#C8E8C8",
      latestSubject: "Estimate #1146 — bathroom remodel",
      latestPreview: "Estimate expired Jan 3. Scope under discussion — tile selections made.",
      time: "5 weeks ago",
      unread: 0,
      flag: "expired",
    },
  ] as Person[],
};

export type TraditionalEmail = {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  important: boolean;
  category: string;
  dimmed?: boolean;
};

export const traditionalInbox: TraditionalEmail[] = [
  { id: 1, from: "Risa Cromer", subject: "Insurance comparison docs from Geoff", preview: "hi love — forwarding the analysis. can we look at this tonight after Piper's down?", time: "2h ago", unread: true, important: true, category: "personal" },
  { id: 2, from: "Day Early Learning", subject: "MomentPath Daily Report — Piper", preview: "Check-in 8:47am. 2 meals, 1 nap (1h 20m), 3 diapers. Supplies needed: wipes.", time: "3h ago", unread: true, important: false, category: "daycare" },
  { id: 3, from: "UnitedHealthcare", subject: "Open enrollment reminder — action needed", preview: "Your enrollment window closes this month. Review your plan options...", time: "4h ago", unread: true, important: true, category: "bills" },
  { id: 4, from: "Anne Johnson", subject: "Summer camp Trello card updated", preview: "Added ISI sports camps and Girl Scout day camps to the board...", time: "Yesterday", unread: true, important: true, category: "personal" },
  { id: 5, from: "ISI — International School", subject: "Ready for the Week Ahead — Feb 9", preview: "Choir Thursday 3pm. Innovation Unit presentations coming up...", time: "Yesterday", unread: true, important: false, category: "school" },
  { id: 6, from: "Republic Services", subject: "FINAL NOTICE — Past due balance", preview: "Your account has been referred to collections...", time: "Yesterday", unread: true, important: true, category: "bills" },
  { id: 7, from: "Envision Remodeling", subject: "Re: Inspection follow-up", preview: "Inspection completed Friday. Will review findings...", time: "2 days ago", unread: false, important: false, category: "home" },
  { id: 8, from: "Stripe", subject: "Payment failed for Bon Appétit", preview: "We were unable to process your payment...", time: "2 days ago", unread: false, important: false, category: "bills" },
  { id: 9, from: "Christie Davis", subject: "Cookie season update + booth schedule", preview: "Next booth TBD. Please submit orders by Friday...", time: "3 days ago", unread: false, important: false, category: "school" },
  { id: 10, from: "Geoff Beck — Valeo Financial", subject: "Insurance analysis — catching up", preview: "Sorry for the delay — was down with flu...", time: "4 days ago", unread: false, important: false, category: "personal" },
  { id: 11, from: "TLDR Newsletter", subject: "TLDR AI 2026-02-10", preview: "Google announces Gemini 2.5 Pro...", time: "5h ago", unread: false, important: false, category: "newsletter", dimmed: true },
  { id: 12, from: "Every by Dan Shipper", subject: "How to think about AI agents", preview: "The agent economy is here...", time: "6h ago", unread: false, important: false, category: "newsletter", dimmed: true },
  { id: 13, from: "Target", subject: "Your Target 360 delivery is on the way!", preview: "Order arriving tomorrow...", time: "7h ago", unread: false, important: false, category: "shopping", dimmed: true },
  { id: 14, from: "DoorDash", subject: "Matt, hungry? Here's 20% off", preview: "Use code SAVE20 on your next order...", time: "8h ago", unread: false, important: false, category: "promo", dimmed: true },
  { id: 15, from: "Instacart", subject: "Your weekly deals are here", preview: "Save on groceries this week...", time: "9h ago", unread: false, important: false, category: "promo", dimmed: true },
  { id: 16, from: "LinkedIn", subject: "5 new jobs for UX Researcher", preview: "Based on your profile...", time: "10h ago", unread: false, important: false, category: "social", dimmed: true },
  { id: 17, from: "Chess.com", subject: "Your daily puzzle is ready", preview: "Can you find the winning move?", time: "11h ago", unread: false, important: false, category: "social", dimmed: true },
];
