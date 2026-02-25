// ─── CatchupScreen ────────────────────────────────────────
// Single scrollable screen with inline collapsible bundle cards.

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBriefingData } from "../hooks/useBriefingData";
import type { BriefingEmail } from "../data/briefing";

// ─── Last Visit Singleton (persists in-memory across renders) ─

const visitStore = {
  lastVisit: new Date(Date.now() - 3 * 60 * 60 * 1000),
  markVisit() {
    this.lastVisit = new Date();
  },
};

// ─── Types ────────────────────────────────────────────────

type BundleId = "attention" | "transactions" | "newsletters" | "promotions";
type BundleAction = "archive" | "delete";
type ViewType = "cards" | "chips";

type Bundle = {
  id: BundleId;
  label: string;
  emails: BriefingEmail[];
  action: BundleAction;
  viewType: ViewType;
};

// ─── Constants ────────────────────────────────────────────

const AVATAR_COLORS = [
  "#F5A83A", "#7B68EE", "#FF6B9D", "#4CAF50", "#42A5F5",
  "#FF7043", "#AB47BC", "#26C6DA", "#EC407A", "#78909C",
  "#66BB6A", "#FFA726", "#5C6BC0", "#26A69A", "#8D6E63",
];

const TRANSACTION_CATEGORIES = [
  "Shipping & Deliveries",
  "Purchases & Receipts",
  "Events & Calendar",
];

const NEWSLETTER_CATEGORIES = [
  "Newsletters & Reads",
  "Updates & Alerts",
  "Social & Community",
  "Comments & Collab",
  "School & Kids",
];

// ─── Helpers ──────────────────────────────────────────────

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  const clean = name.replace(/<.*?>/, "").trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2).toUpperCase();
}

function getSenderName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  if (match) return match[1].trim();
  return from.split("@")[0].split("<").join("").trim();
}

function formatTimeSince(date: Date): string {
  const ms = Date.now() - date.getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function buildBundles(sections: {
  needsAttention: BriefingEmail[];
  glance: Record<string, BriefingEmail[]>;
  low: BriefingEmail[];
}): Bundle[] {
  const transactions = TRANSACTION_CATEGORIES.flatMap(
    (cat) => sections.glance[cat] || []
  );
  const newsletters = NEWSLETTER_CATEGORIES.flatMap(
    (cat) => sections.glance[cat] || []
  );

  const all: Bundle[] = [
    { id: "attention", label: "Needs Attention", emails: sections.needsAttention, action: "archive", viewType: "cards" },
    { id: "transactions", label: "Transactions", emails: transactions, action: "archive", viewType: "chips" },
    { id: "newsletters", label: "Newsletters", emails: newsletters, action: "archive", viewType: "chips" },
    { id: "promotions", label: "Promotions", emails: sections.low, action: "delete", viewType: "chips" },
  ];

  return all.filter((b) => b.emails.length > 0);
}

function cleanSnippet(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")                    // strip HTML tags
    .replace(/&[a-z]+;/gi, " ")                 // strip HTML entities
    .replace(/=[0-9A-F]{2}/gi, "")              // strip QP encoded chars (=E2=80=94 etc)
    .replace(/\{[^}]*\}/g, "")                  // strip CSS blocks
    .replace(/[a-z-]+:[^;]+;/gi, "")            // strip inline CSS properties
    .replace(/table|tr|td|border-collapse|font-size|line-height/gi, "") // leftover CSS words
    .replace(/\s+/g, " ")                       // collapse whitespace
    .trim();
}

function getShortDetail(email: BriefingEmail): string {
  const src = email.summary || email.subject || email.snippet || "";
  return cleanSnippet(src).slice(0, 20);
}

function getLongSnippet(email: BriefingEmail): string {
  const src = email.summary || email.snippet || email.preview || "";
  return cleanSnippet(src);
}

function buildSenderPreview(emails: BriefingEmail[], maxChars = 55): string {
  const names = emails.map((e) => getSenderName(e.from));
  let result = "";
  for (let i = 0; i < names.length; i++) {
    const next = i === 0 ? names[i] : ", " + names[i];
    if (result.length + next.length > maxChars && i > 0) {
      const left = names.length - i;
      return result + ` +${left} more`;
    }
    result += next;
  }
  return result;
}

// ─── AvatarCircle ─────────────────────────────────────────

function AvatarCircle({ name, size = 36 }: { name: string; size?: number }) {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 4, backgroundColor: color },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>{initials}</Text>
    </View>
  );
}

// ─── AttentionCard (simplified — no dots, no next peek) ───

function AttentionCard({
  email,
  onCTA,
  onArchive,
}: {
  email: BriefingEmail;
  onCTA: () => void;
  onArchive: () => void;
}) {
  const senderName = getSenderName(email.from);

  return (
    <View style={styles.attentionCard}>
      <View style={styles.attentionCardHeader}>
        <AvatarCircle name={senderName} size={44} />
        <View style={styles.attentionCardMeta}>
          <Text style={styles.attentionSender}>{senderName}</Text>
          {email.date ? (
            <Text style={styles.attentionTime}>
              {new Date(email.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          ) : null}
        </View>
      </View>

      {email.urgencyType && (
        <View style={styles.attentionPill}>
          <Text style={styles.attentionPillText}>{email.urgencyType}</Text>
        </View>
      )}

      <Text style={styles.attentionSubject} numberOfLines={2}>
        {email.subject}
      </Text>

      <Text style={styles.attentionSummary} numberOfLines={4}>
        {getLongSnippet(email)}
      </Text>

      <View style={styles.attentionActions}>
        <TouchableOpacity style={styles.ctaBtn} onPress={onCTA} activeOpacity={0.8}>
          <Text style={styles.ctaBtnText}>CTA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.archiveBtn} onPress={onArchive} activeOpacity={0.8}>
          <Text style={styles.archiveBtnText}>Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── CollapsibleSection (for Needs Attention only) ────────

function CollapsibleSection({
  title,
  count,
  defaultOpen,
  children,
}: {
  title: string;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{count}</Text>
          </View>
        </View>
        <Ionicons
          name={open ? "chevron-down" : "chevron-forward"}
          size={18}
          color="#999"
        />
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

// ─── BundleCard (contained card for chip-based bundles) ───

function BundleCard({
  title,
  emails,
  cols,
  actionLabel,
  defaultOpen = false,
}: {
  title: string;
  emails: BriefingEmail[];
  cols: 2 | 3;
  actionLabel: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const senderPreview = buildSenderPreview(emails);
  const initial = title[0].toUpperCase();
  const screenWidth = Dimensions.get("window").width;
  // 20px outer padding each side, 16px card padding each side, gaps between cols
  const chipWidth = (screenWidth - 40 - 32 - (cols - 1) * 8) / cols;

  const header = (
    <TouchableOpacity
      style={styles.bundleHeaderRow}
      onPress={() => setOpen(!open)}
      activeOpacity={0.7}
    >
      <View style={styles.bundleAvatar}>
        <Text style={styles.bundleAvatarText}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={styles.bundleTitle}>{title}</Text>
          <View style={styles.countBadgeDark}>
            <Text style={styles.countBadgeDarkText}>{emails.length}</Text>
          </View>
        </View>
        <Text style={styles.bundleSenderPreview} numberOfLines={2}>
          {senderPreview}
        </Text>
      </View>
      <Ionicons
        name={open ? "chevron-down" : "chevron-forward"}
        size={16}
        color="#bbb"
      />
    </TouchableOpacity>
  );

  if (!open) {
    return <View style={styles.bundleCardCollapsed}>{header}</View>;
  }

  return (
    <View style={styles.bundleCardExpanded}>
      {header}
      <View style={styles.bundleDivider} />

      {/* Chip grid */}
      <View style={styles.chipGrid}>
        {emails.map((email) => {
          const isExpanded = expandedId === email.id;
          const senderName = getSenderName(email.from);
          const detail = getShortDetail(email);

          if (isExpanded) {
            return (
              <View key={String(email.id)} style={{ width: "100%", marginBottom: 8 }}>
                <View style={styles.chipExpanded}>
                  <View style={styles.chipRow}>
                    <AvatarCircle name={senderName} size={36} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.chipSenderBold} numberOfLines={1}>
                        {senderName}
                      </Text>
                      <Text style={styles.chipDetail} numberOfLines={1}>
                        {detail}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.chipInfoBtn}
                      onPress={() => setExpandedId(null)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.chipInfoBtnText}>i</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.chipExpandedSubject} numberOfLines={2}>
                    {email.subject}
                  </Text>
                  <Text style={styles.chipExpandedSnippet} numberOfLines={2}>
                    {getLongSnippet(email)}
                  </Text>
                </View>
              </View>
            );
          }

          return (
            <View key={String(email.id)} style={{ width: chipWidth, marginBottom: 8 }}>
              <View style={styles.chipCompact}>
                <AvatarCircle name={senderName} size={36} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.chipSenderBold} numberOfLines={1}>
                    {senderName}
                  </Text>
                  <Text style={styles.chipDetail} numberOfLines={1}>
                    {detail}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.chipInfoBtn}
                  onPress={() => setExpandedId(email.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.chipInfoBtnText}>i</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Action buttons */}
      <View style={styles.bundleActions}>
        <TouchableOpacity style={styles.bundleActionPrimary} activeOpacity={0.85}>
          <Text style={styles.bundleActionPrimaryText}>{actionLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bundleActionSecondary} activeOpacity={0.7}>
          <Text style={styles.bundleActionSecondaryText}>Open bundle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── CatchupScreen (main export) ──────────────────────────

export default function CatchupScreen() {
  const { sections, connState } = useBriefingData();
  const [timeSince, setTimeSince] = useState(
    formatTimeSince(visitStore.lastVisit)
  );

  const [dismissedAttentionIds, setDismissedAttentionIds] = useState<
    Set<string | number>
  >(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(formatTimeSince(visitStore.lastVisit));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      visitStore.markVisit();
    };
  }, []);

  const bundles = buildBundles(sections);
  const totalEmails =
    sections.needsAttention.length +
    Object.values(sections.glance).flat().length +
    sections.low.length;

  const attentionBundle = bundles.find((b) => b.id === "attention");
  const transactionsBundle = bundles.find((b) => b.id === "transactions");
  const newslettersBundle = bundles.find((b) => b.id === "newsletters");
  const promoBundle = bundles.find((b) => b.id === "promotions");

  const attentionEmails = attentionBundle?.emails ?? [];
  const undismissedAttention = attentionEmails.filter(
    (e) => !dismissedAttentionIds.has(e.id)
  );

  const dismissAttention = useCallback((id: string | number) => {
    setDismissedAttentionIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  if (connState === "loading") {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading your inbox…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.homeScroll}
      contentContainerStyle={styles.homeContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.homeTopBar}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="search-outline" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Since last visit label */}
      <Text style={styles.sinceLabel}>
        SINCE YOU WERE LAST HERE · {timeSince.toUpperCase()}
      </Text>

      {/* Email count */}
      <View style={styles.emailCountRow}>
        <Text style={styles.emailCountNumber}>{totalEmails}</Text>
        <Text style={styles.emailCountLabel}> new emails</Text>
      </View>

      {/* ── Needs Attention (default OPEN) ── */}
      {attentionEmails.length > 0 && (
        <CollapsibleSection
          title="Needs Attention"
          count={attentionEmails.length}
          defaultOpen={true}
        >
          {undismissedAttention.length > 0 ? (
            undismissedAttention.map((email) => (
              <AttentionCard
                key={String(email.id)}
                email={email}
                onCTA={() => dismissAttention(email.id)}
                onArchive={() => dismissAttention(email.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyNote}>All caught up</Text>
          )}
        </CollapsibleSection>
      )}

      {/* ── Transactions bundle card ── */}
      {transactionsBundle && (
        <BundleCard
          title="Transactions"
          emails={transactionsBundle.emails}
          cols={2}
          actionLabel="Archive all"
        />
      )}

      {/* ── Newsletters bundle card ── */}
      {newslettersBundle && (
        <BundleCard
          title="Newsletters"
          emails={newslettersBundle.emails}
          cols={2}
          actionLabel="Archive all"
        />
      )}

      {/* ── Promotions bundle card ── */}
      {promoBundle && (
        <BundleCard
          title="Promotions"
          emails={promoBundle.emails}
          cols={3}
          actionLabel="Delete all"
        />
      )}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
  },

  // Avatar
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },

  // Home scroll
  homeScroll: {
    flex: 1,
    backgroundColor: "#fff",
  },
  homeContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  homeTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    paddingBottom: 20,
  },
  iconBtn: {
    padding: 4,
  },
  sinceLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#aaa",
    marginBottom: 8,
  },
  emailCountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  emailCountNumber: {
    fontSize: 52,
    fontWeight: "800",
    color: "#111",
    lineHeight: 56,
  },
  emailCountLabel: {
    fontSize: 20,
    fontWeight: "400",
    color: "#111",
  },

  // ── CollapsibleSection (Needs Attention) ──
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  sectionBody: {
    paddingTop: 12,
    paddingBottom: 8,
  },

  // ── Count badges ──
  countBadge: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  countBadgeDark: {
    backgroundColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  countBadgeDarkText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },

  // ── Empty note ──
  emptyNote: {
    fontSize: 14,
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 20,
  },

  // ── BundleCard ──
  bundleCardCollapsed: {
    marginTop: 12,
    paddingVertical: 4,
  },
  bundleCardExpanded: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  bundleHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  bundleAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  bundleAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  bundleTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },
  bundleSenderPreview: {
    fontSize: 13,
    color: "#999",
    lineHeight: 18,
    marginTop: 2,
  },
  bundleDivider: {
    height: 1,
    backgroundColor: "#ebebeb",
    marginHorizontal: 16,
  },

  // ── Chip grid ──
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
    paddingBottom: 8,
  },

  // ── Chip compact ──
  chipCompact: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 10,
    gap: 8,
  },
  chipSenderBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  chipDetail: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 1,
  },

  // ── Chip info button ──
  chipInfoBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
  },
  chipInfoBtnText: {
    fontSize: 12,
    fontWeight: "600",
    fontStyle: "italic",
    color: "#999",
  },

  // ── Chip expanded (via "i" tap) ──
  chipExpanded: {
    backgroundColor: "#fafafa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 12,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chipExpandedSubject: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 10,
    lineHeight: 21,
  },
  chipExpandedSnippet: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    lineHeight: 18,
  },

  // ── Bundle action buttons ──
  bundleActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  bundleActionPrimary: {
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  bundleActionPrimaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  bundleActionSecondary: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  bundleActionSecondaryText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "500",
  },

  // ── Attention card ──
  attentionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ebebeb",
    padding: 16,
    marginBottom: 12,
  },
  attentionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  attentionCardMeta: {
    flex: 1,
  },
  attentionSender: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  attentionTime: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 1,
  },
  attentionPill: {
    alignSelf: "flex-start",
    backgroundColor: "#eef3ff",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  attentionPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5c6bc0",
  },
  attentionSubject: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
    lineHeight: 21,
  },
  attentionSummary: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 16,
  },
  attentionActions: {
    flexDirection: "row",
    gap: 10,
  },
  ctaBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  ctaBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  archiveBtn: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  archiveBtnText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
});
