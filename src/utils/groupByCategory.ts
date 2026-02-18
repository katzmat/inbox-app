import type { BriefingEmail } from "../data/briefing";

/** Group emails by category, preserving order of first appearance */
export function groupByCategory(
  emails: BriefingEmail[]
): { category: string; emails: BriefingEmail[] }[] {
  const map = new Map<string, BriefingEmail[]>();
  for (const email of emails) {
    const existing = map.get(email.category);
    if (existing) {
      existing.push(email);
    } else {
      map.set(email.category, [email]);
    }
  }
  return Array.from(map.entries()).map(([category, emails]) => ({
    category,
    emails,
  }));
}
