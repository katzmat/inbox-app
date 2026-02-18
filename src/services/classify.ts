// Client-side heuristic classifier: GmailMessage[] → BriefingEmail[]

import type { GmailMessage } from "./gmail";
import type { BriefingEmail, BriefingTier } from "../data/briefing";

/** Senders that are almost always noise */
const NOREPLY_PATTERNS = [
  "noreply",
  "no-reply",
  "donotreply",
  "notifications@",
  "mailer-daemon",
  "postmaster@",
];

const PROMO_PATTERNS = [
  "promo",
  "marketing",
  "deals@",
  "offers@",
  "newsletter@",
  "digest@",
  "news@",
  "updates@",
  "info@",
];

function looksAutomated(from: string): boolean {
  const lower = from.toLowerCase();
  return (
    NOREPLY_PATTERNS.some((p) => lower.includes(p)) ||
    PROMO_PATTERNS.some((p) => lower.includes(p))
  );
}

/** Extract a readable sender name from a "Name <email>" header */
function senderName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();
  // No angle-bracket format — just return the whole thing trimmed
  return from.split("@")[0].replace(/[._+]/g, " ").trim();
}

function classify(msg: GmailMessage): { tier: BriefingTier; reason: string } {
  const from = msg.from.toLowerCase();

  // Priority: starred or IMPORTANT label
  if (msg.isStarred) {
    return { tier: "priority", reason: "Starred in your inbox" };
  }
  if (msg.labelIds.includes("IMPORTANT") && msg.isUnread) {
    // Only if it also looks like a real person
    if (!looksAutomated(from)) {
      return { tier: "priority", reason: "Marked important by Gmail" };
    }
  }

  // Low: automated / promo senders
  if (looksAutomated(from)) {
    return { tier: "low", reason: "Automated or promotional sender" };
  }
  if (msg.labelIds.includes("CATEGORY_PROMOTIONS")) {
    return { tier: "low", reason: "Promotional email" };
  }
  if (msg.labelIds.includes("CATEGORY_SOCIAL")) {
    return { tier: "low", reason: "Social notification" };
  }
  if (msg.labelIds.includes("CATEGORY_UPDATES") && !msg.isUnread) {
    return { tier: "low", reason: "Read update" };
  }
  if (msg.labelIds.includes("CATEGORY_FORUMS")) {
    return { tier: "low", reason: "Forum / mailing list" };
  }

  // Glance: unread from real people
  if (msg.isUnread) {
    return { tier: "uncertain", reason: "Unread from a real sender" };
  }

  // Already read, not starred — low
  return { tier: "low", reason: "Already read, no action signals" };
}

/** Derive a short category string from labels + sender */
function guessCategory(msg: GmailMessage): string {
  if (msg.labelIds.includes("CATEGORY_PROMOTIONS")) return "Promo";
  if (msg.labelIds.includes("CATEGORY_SOCIAL")) return "Social";
  if (msg.labelIds.includes("CATEGORY_UPDATES")) return "Updates";
  if (msg.labelIds.includes("CATEGORY_FORUMS")) return "Forums";
  return "Inbox";
}

export function classifyEmails(messages: GmailMessage[]): BriefingEmail[] {
  return messages.map((msg, i) => {
    const { tier, reason } = classify(msg);
    return {
      id: i + 1,
      from: senderName(msg.from),
      subject: msg.subject,
      preview: msg.snippet,
      detail: msg.snippet,
      fullBody: msg.snippet, // full body not fetched in list view
      reason,
      tier,
      category: guessCategory(msg),
      suggestedAction: tier === "priority" ? "Review" : "Read later",
    };
  });
}
