// ─── Email Classifier ─────────────────────────────────────
// Implements the Comprehensive Email Management Rules & Logic Framework.
// Priority order: Timely rules → Precise classification rules → Label/sender heuristics → Default.
// Maps each email to a Category + ActionType, then derives a BriefingTier for the UI.

import type { GmailMessage } from "./gmail";
import type { BriefingEmail, BriefingTier } from "../data/briefing";

// ─── Category & Action Types ──────────────────────────────

type ActionType = "InboxAction" | "DraftAction" | "BriefAction" | "UnsubscribeAction";

type Category =
  | "Timely"
  | "Important Draft"
  | "Important Context"
  | "Important Info"
  | "Important SOP"
  | "Calendar"
  | "Payments"
  | "Packages"
  | "Comments"
  | "Action"
  | "Newsletter"
  | "Social"
  | "Updates"
  | "Promotion"
  | "Other"
  | "Spam";

type Classification = {
  category: Category;
  action: ActionType;
  reason: string;
  suggestedAction: string;
};

// ─── Pattern Tables ───────────────────────────────────────

/** Timely: OTP, verification codes, security alerts, same-day urgency */
const TIMELY_SUBJECT_PATTERNS = [
  "verification code",
  "verify your",
  "otp",
  "one-time",
  "one time",
  "security alert",
  "suspicious sign",
  "login attempt",
  "password reset",
  "confirm your identity",
  "urgent",
  "webinar starting",
  "starts in",
  "meeting changed",
  "meeting cancelled",
  "meeting canceled",
];

const TIMELY_FROM_PATTERNS = [
  "twilio.com",
  "authy.com",
  "accounts.google.com",
  "security@",
  "verify@",
  "auth@",
  "no-reply@accounts",
];

/** Calendar invite signals */
const CALENDAR_SUBJECT_PATTERNS = [
  "invitation:",
  "invite:",
  "accepted:",
  "declined:",
  "updated invitation",
  "rsvp",
  "cal.com",
  "calendly",
  "google calendar",
];

const CALENDAR_FROM_PATTERNS = [
  "calendar-notification",
  "calendar.google.com",
  "calendly.com",
  "cal.com",
];

/** Payment confirmations (NOT requests — those are Action) */
const PAYMENT_FROM_PATTERNS = [
  "venmo",
  "zelle",
  "paypal",
  "cashapp",
  "cash.app",
  "square.com",
  "stripe.com",
  "receipt",
];

const PAYMENT_SUBJECT_PATTERNS = [
  "payment received",
  "payment confirmed",
  "receipt for",
  "your receipt",
  "payment successful",
  "transfer complete",
  "sent you",
  "you paid",
  "transaction confirmed",
];

/** Package / shipping / delivery tracking */
const PACKAGE_FROM_PATTERNS = [
  "ups.com",
  "fedex.com",
  "usps.com",
  "dhl.com",
  "amazon.com",
  "ship-confirm",
  "shipping@",
  "tracking@",
];

const PACKAGE_SUBJECT_PATTERNS = [
  "shipped",
  "out for delivery",
  "delivered",
  "tracking number",
  "your order",
  "order confirmed",
  "shipment",
  "delivery update",
  "on the way",
  "arriving",
];

/** Collaboration / comments */
const COMMENTS_FROM_PATTERNS = [
  "figma.com",
  "linear.app",
  "github.com",
  "notion.so",
  "docs.google.com",
  "asana.com",
  "jira",
  "slack.com",
  "clickup.com",
];

const COMMENTS_SUBJECT_PATTERNS = [
  "commented on",
  "mentioned you",
  "assigned to you",
  "new comment",
  "replied to",
  "review requested",
  "pull request",
];

/** Newsletter signals */
const NEWSLETTER_FROM_PATTERNS = [
  "@substack.com",
  "notification@",
  "notifications@",
  "announcements@",
  "alerts@",
  "newsletter@",
  "digest@",
  "news@",
  "weekly@",
  "daily@",
  "briefing@",
  "morning@",
];

/** Promotion signals (beyond Gmail's label) */
const PROMO_FROM_PATTERNS = [
  "marketing@",
  "promo@",
  "deals@",
  "offers@",
  "sales@",
  "store@",
  "shop@",
];

/** Spam / phishing signals */
const SPAM_SUBJECT_PATTERNS = [
  "claim your prize",
  "you've won",
  "act now",
  "limited time only",
  "click here immediately",
  "verify your account or",
  "suspended your account",
  "unusual activity detected",
];

/** Action: tasks/decisions, no reply needed */
const ACTION_SUBJECT_PATTERNS = [
  "reminder",
  "please sign",
  "docusign",
  "action required",
  "action needed",
  "document to sign",
  "renew your",
  "renewal",
  "past due",
  "payment due",
  "bill is ready",
  "invoice",
  "registration",
  "application deadline",
  "prescription ready",
  "refill",
  "final notice",
];

/** Automated / noreply senders that are never "real people" */
const AUTOMATED_FROM_PATTERNS = [
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "mailer-daemon",
  "postmaster@",
  "bounce@",
  "auto@",
  "automated@",
  "system@",
];

/** Social / Other catch-all senders */
const SOCIAL_FROM_PATTERNS = [
  "linkedin.com",
  "facebook.com",
  "facebookmail.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "reddit.com",
  "tiktok.com",
  "pinterest.com",
  "nextdoor.com",
  "medium.com",
  "quora.com",
];

// ─── Matching Helpers ─────────────────────────────────────

function matchesAny(text: string, patterns: string[]): boolean {
  const lower = text.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

function senderName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();
  return from.split("@")[0].replace(/[._+]/g, " ").trim();
}

function isAutomatedSender(from: string): boolean {
  return matchesAny(from, AUTOMATED_FROM_PATTERNS);
}

/** Personal email domains — strongest signal for a real human writing to you */
const PERSONAL_DOMAINS = [
  "@gmail.com",
  "@yahoo.com",
  "@yahoo.co",
  "@outlook.com",
  "@hotmail.com",
  "@live.com",
  "@icloud.com",
  "@me.com",
  "@mac.com",
  "@aol.com",
  "@protonmail.com",
  "@proton.me",
  "@fastmail.com",
  "@hey.com",
  "@msn.com",
  "@comcast.net",
  "@att.net",
  "@sbcglobal.net",
  "@verizon.net",
  "@cox.net",
  "@charter.net",
  "@earthlink.net",
];

/** Subject patterns that indicate automated/digest/product emails even from "real-looking" senders */
const AUTOMATED_SUBJECT_PATTERNS = [
  "daily report",
  "weekly report",
  "monthly report",
  "day ahead",
  "weekly digest",
  "daily digest",
  "monthly digest",
  "new in ",
  "what's new",
  "product update",
  "release notes",
  "changelog",
  "is confirmed for",
  "order confirmed",
  "your order",
  "family order",
];

function hasPersonalDomain(from: string): boolean {
  const lower = from.toLowerCase();
  return PERSONAL_DOMAINS.some((d) => lower.includes(d));
}

function hasAutomatedSubject(subject: string): boolean {
  return matchesAny(subject, AUTOMATED_SUBJECT_PATTERNS);
}

function isRealPerson(from: string, subject: string): boolean {
  if (isAutomatedSender(from)) return false;
  if (matchesAny(from, PROMO_FROM_PATTERNS)) return false;
  if (matchesAny(from, NEWSLETTER_FROM_PATTERNS)) return false;
  if (matchesAny(from, SOCIAL_FROM_PATTERNS)) return false;
  if (hasAutomatedSubject(subject)) return false;
  // Must come from a personal email domain to count as a real person
  return hasPersonalDomain(from);
}

// ─── Classification Engine ────────────────────────────────
// Evaluates rules in strict priority order per Section 3.2 of the framework.

function classify(msg: GmailMessage): Classification {
  const from = msg.from;
  const subject = msg.subject;
  const labels = msg.labelIds;

  // ── Step 1: Timely (highest priority) ─────────────────
  if (matchesAny(subject, TIMELY_SUBJECT_PATTERNS) || matchesAny(from, TIMELY_FROM_PATTERNS)) {
    return {
      category: "Timely",
      action: "InboxAction",
      reason: "Time-sensitive — requires immediate attention",
      suggestedAction: "Review now",
    };
  }

  // ── Step 2: Spam detection ────────────────────────────
  if (matchesAny(subject, SPAM_SUBJECT_PATTERNS)) {
    return {
      category: "Spam",
      action: "UnsubscribeAction",
      reason: "Likely spam or phishing attempt",
      suggestedAction: "Ignore",
    };
  }

  // ── Step 3: Precise classification rules ──────────────

  // Calendar
  if (matchesAny(subject, CALENDAR_SUBJECT_PATTERNS) || matchesAny(from, CALENDAR_FROM_PATTERNS)) {
    return {
      category: "Calendar",
      action: "DraftAction",
      reason: "Calendar invite or event update",
      suggestedAction: "RSVP",
    };
  }

  // Action items (tasks/decisions, no reply needed)
  if (matchesAny(subject, ACTION_SUBJECT_PATTERNS)) {
    // Distinguish payment requests from general actions
    if (matchesAny(subject, ["past due", "payment due", "bill is ready", "invoice", "final notice"])) {
      return {
        category: "Action",
        action: "BriefAction",
        reason: "Payment or bill requires attention",
        suggestedAction: "Pay or resolve",
      };
    }
    return {
      category: "Action",
      action: "BriefAction",
      reason: "Task or decision required — no reply needed",
      suggestedAction: "Complete task",
    };
  }

  // Payment confirmations
  if (matchesAny(from, PAYMENT_FROM_PATTERNS) || matchesAny(subject, PAYMENT_SUBJECT_PATTERNS)) {
    return {
      category: "Payments",
      action: "BriefAction",
      reason: "Payment confirmation or receipt",
      suggestedAction: "No action needed",
    };
  }

  // Packages / shipping
  if (matchesAny(from, PACKAGE_FROM_PATTERNS) || matchesAny(subject, PACKAGE_SUBJECT_PATTERNS)) {
    return {
      category: "Packages",
      action: "BriefAction",
      reason: "Shipping or delivery update",
      suggestedAction: "Track delivery",
    };
  }

  // Collaboration / comments
  if (matchesAny(from, COMMENTS_FROM_PATTERNS) || matchesAny(subject, COMMENTS_SUBJECT_PATTERNS)) {
    return {
      category: "Comments",
      action: "BriefAction",
      reason: "Collaboration notification",
      suggestedAction: "Review comment",
    };
  }

  // ── Step 4: Label + sender heuristics ─────────────────

  // Gmail Promotions label
  if (labels.includes("CATEGORY_PROMOTIONS")) {
    return {
      category: "Promotion",
      action: "BriefAction",
      reason: "Promotional email",
      suggestedAction: "Read later",
    };
  }

  // Promo senders without the label
  if (matchesAny(from, PROMO_FROM_PATTERNS)) {
    return {
      category: "Promotion",
      action: "BriefAction",
      reason: "Marketing or promotional sender",
      suggestedAction: "Read later",
    };
  }

  // Newsletter (Forums label or newsletter senders)
  if (labels.includes("CATEGORY_FORUMS") || matchesAny(from, NEWSLETTER_FROM_PATTERNS)) {
    return {
      category: "Newsletter",
      action: "BriefAction",
      reason: "Newsletter or subscription digest",
      suggestedAction: "Read later",
    };
  }

  // Social
  if (labels.includes("CATEGORY_SOCIAL") || matchesAny(from, SOCIAL_FROM_PATTERNS)) {
    return {
      category: "Social",
      action: "BriefAction",
      reason: "Social notification",
      suggestedAction: "Read later",
    };
  }

  // ── Step 5: Important family (real people) ────────────

  if (isRealPerson(from, subject)) {
    // Starred → Important Context (highest confidence)
    if (msg.isStarred) {
      return {
        category: "Important Context",
        action: "InboxAction",
        reason: "Starred — likely needs your attention",
        suggestedAction: "Review",
      };
    }

    // Gmail IMPORTANT + unread → needs a response
    if (labels.includes("IMPORTANT") && msg.isUnread) {
      return {
        category: "Important Draft",
        action: "DraftAction",
        reason: "Unread from a real person, marked important",
        suggestedAction: "Reply",
      };
    }

    // Unread from real person → priority, surface in briefing
    if (msg.isUnread) {
      return {
        category: "Important Draft",
        action: "DraftAction",
        reason: "Unread from a real person",
        suggestedAction: "Reply",
      };
    }

    // Read, from real person — still important enough to surface
    return {
      category: "Important Info",
      action: "InboxAction",
      reason: "From a real person",
      suggestedAction: "Review",
    };
  }

  // ── Step 6: Updates label (automated but potentially useful)
  if (labels.includes("CATEGORY_UPDATES")) {
    return {
      category: "Updates",
      action: "BriefAction",
      reason: "Automated update",
      suggestedAction: "Read later",
    };
  }

  // ── Step 7: Default → Other (BriefAction) ────────────
  return {
    category: "Other",
    action: "BriefAction",
    reason: "No matching classification rule",
    suggestedAction: "Read later",
  };
}

// ─── Category → Tier Mapping ──────────────────────────────
// Maps the framework's categories + actions to the briefing UI tiers.

function tierFromClassification(c: Classification): BriefingTier {
  // Timely + Important Context/Draft/SOP → needsAttention
  if (c.category === "Timely") return "needsAttention";
  if (c.category === "Important Context") return "needsAttention";
  if (c.category === "Important Draft") return "needsAttention";
  if (c.category === "Important SOP") return "needsAttention";
  if (c.category === "Action") return "needsAttention";

  // Real people always surface as needsAttention
  if (c.category === "Important Info") return "needsAttention";

  // Transactional → glance
  if (c.category === "Calendar") return "glance";
  if (c.category === "Payments") return "glance";
  if (c.category === "Packages") return "glance";
  if (c.category === "Comments") return "glance";

  // Informational → glance — bundled by category
  if (c.category === "Newsletter") return "glance";
  if (c.category === "Social") return "glance";
  if (c.category === "Updates") return "glance";

  // Promotion, Other, Spam → low
  return "low";
}

// ─── Public API ───────────────────────────────────────────

export function classifyEmails(messages: GmailMessage[]): BriefingEmail[] {
  return messages.map((msg) => {
    const c = classify(msg);
    return {
      id: msg.id,
      webLink: msg.webLink,
      from: senderName(msg.from),
      subject: msg.subject,
      snippet: msg.snippet,
      date: msg.date,
      reason: c.reason,
      tier: tierFromClassification(c),
      category: c.category,
      suggestedAction: c.suggestedAction,
      summary: null,
      urgencyType: null,
      glanceCategory: null,
    };
  });
}
