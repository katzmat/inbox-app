import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrbitText, Card, spacing, radius, shadows, colors } from "../../orbit-ds";
import { useBriefingData } from "../hooks/useBriefingData";
import { USER_NAME } from "../data/briefing";
import type { BriefingEmail } from "../data/briefing";

const G = {
  black: "#1d1d1f",
  dark: "#333",
  mid: "#666",
  muted: "#999",
  light: "#bbb",
  faint: "#eee",
  bg: "#f5f5f5",
  white: "#fff",
};

function openEmail(webLink?: string) {
  if (!webLink) return;
  if (Platform.OS === "web") window.open(webLink, "_blank");
  else Linking.openURL(webLink);
}

// Map emails to life contexts based on glance categories + classification
type LifeThread = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  emails: BriefingEmail[];
};

function buildLifeThreads(
  sections: {
    needsAttention: BriefingEmail[];
    glance: Record<string, BriefingEmail[]>;
    low: BriefingEmail[];
  }
): LifeThread[] {
  const threads: LifeThread[] = [];
  const allEmails = [
    ...sections.needsAttention,
    ...Object.values(sections.glance).flat(),
    ...sections.low,
  ];

  // People — emails from personal senders (detect by simple domain heuristic)
  const personalDomains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com"];
  const people = allEmails.filter((e) => {
    const match = e.fromFull?.match(/@([^\s>]+)/);
    return match && personalDomains.some((d) => match[1].toLowerCase().includes(d));
  });
  if (people.length > 0) {
    threads.push({
      id: "people",
      label: "People",
      icon: "people-outline",
      color: "#5B5EA6",
      emails: people,
    });
  }

  // Kids & School
  const school = Object.entries(sections.glance)
    .filter(([cat]) => cat.includes("School") || cat.includes("Kids"))
    .flatMap(([, e]) => e);
  if (school.length > 0) {
    threads.push({
      id: "kids",
      label: "Kids & School",
      icon: "school-outline",
      color: "#E07A5F",
      emails: school,
    });
  }

  // Money & Bills
  const money = [
    ...Object.entries(sections.glance)
      .filter(([cat]) => cat.includes("Purchase") || cat.includes("Payment"))
      .flatMap(([, e]) => e),
    ...allEmails.filter(
      (e) =>
        e.reason?.toLowerCase().includes("payment") ||
        e.reason?.toLowerCase().includes("bill") ||
        e.subject.toLowerCase().includes("payment") ||
        e.subject.toLowerCase().includes("invoice")
    ),
  ];
  const moneyDeduped = [...new Map(money.map((e) => [e.id, e])).values()];
  if (moneyDeduped.length > 0) {
    threads.push({
      id: "money",
      label: "Money & Bills",
      icon: "card-outline",
      color: "#3D405B",
      emails: moneyDeduped,
    });
  }

  // Home & Errands
  const home = allEmails.filter(
    (e) =>
      e.reason?.toLowerCase().includes("home") ||
      e.reason?.toLowerCase().includes("contractor") ||
      e.subject.toLowerCase().includes("delivery") ||
      e.subject.toLowerCase().includes("shipping") ||
      e.glanceCategory?.includes("Shipping")
  );
  if (home.length > 0) {
    threads.push({
      id: "home",
      label: "Home & Errands",
      icon: "home-outline",
      color: "#81B29A",
      emails: home,
    });
  }

  // Calendar & Events
  const calendar = Object.entries(sections.glance)
    .filter(([cat]) => cat.includes("Calendar") || cat.includes("Event"))
    .flatMap(([, e]) => e);
  if (calendar.length > 0) {
    threads.push({
      id: "calendar",
      label: "Calendar & Events",
      icon: "calendar-outline",
      color: "#F2CC8F",
      emails: calendar,
    });
  }

  // News & Reads
  const reads = [
    ...Object.entries(sections.glance)
      .filter(([cat]) => cat.includes("Newsletter"))
      .flatMap(([, e]) => e),
    ...sections.low.filter(
      (e) => e.reason?.toLowerCase().includes("newsletter") || e.category === "Newsletter"
    ),
  ];
  const readsDeduped = [...new Map(reads.map((e) => [e.id, e])).values()];
  if (readsDeduped.length > 0) {
    threads.push({
      id: "reads",
      label: "News & Reads",
      icon: "newspaper-outline",
      color: "#6D6875",
      emails: readsDeduped,
    });
  }

  // Noise — everything else in low
  const assignedIds = new Set(threads.flatMap((t) => t.emails.map((e) => e.id)));
  const noise = sections.low.filter((e) => !assignedIds.has(e.id));
  if (noise.length > 0) {
    threads.push({
      id: "noise",
      label: "Noise",
      icon: "volume-mute-outline",
      color: "#bbb",
      emails: noise,
    });
  }

  return threads;
}

function ThreadCard({ thread }: { thread: LifeThread }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
      style={styles.threadCard}
    >
      <View style={styles.threadHeader}>
        <View style={[styles.threadIcon, { backgroundColor: thread.color + "18" }]}>
          <Ionicons name={thread.icon} size={20} color={thread.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.threadLabel}>{thread.label}</Text>
          <Text style={styles.threadCount}>
            {thread.emails.length} email{thread.emails.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronExpanded]}>▾</Text>
      </View>

      {/* Preview — top email subject */}
      {!expanded && thread.emails[0] && (
        <Text style={styles.threadPreview} numberOfLines={1}>
          {thread.emails[0].from}: {thread.emails[0].subject}
        </Text>
      )}

      {/* Expanded — all emails */}
      {expanded && (
        <View style={styles.threadEmails}>
          {thread.emails.map((email) => (
            <TouchableOpacity
              key={email.id}
              onPress={() => openEmail(email.webLink)}
              style={styles.threadEmailRow}
            >
              <View style={[styles.dotIndicator, { backgroundColor: thread.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.emailFrom}>{email.from}</Text>
                <Text style={styles.emailSubject} numberOfLines={1}>
                  {email.subject}
                </Text>
                {email.reason && (
                  <Text style={styles.emailReason} numberOfLines={1}>
                    {email.reason}
                  </Text>
                )}
              </View>
              <Ionicons name="open-outline" size={14} color={G.light} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function ConceptLifeThreads() {
  const { connState, sections, stats } = useBriefingData();
  const [urgentExpanded, setUrgentExpanded] = useState(false);

  if (connState === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={G.muted} />
      </View>
    );
  }

  const threads = buildLifeThreads(sections);
  const urgentCount = sections.needsAttention.length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <OrbitText variant="title2" color={G.black}>
          Your Life
        </OrbitText>
        <Text style={styles.headerSubtitle}>
          {stats.total} emails organized by what matters
        </Text>
      </View>

      {/* Urgent banner — tappable */}
      {urgentCount > 0 && (
        <TouchableOpacity
          onPress={() => setUrgentExpanded(!urgentExpanded)}
          activeOpacity={0.8}
          style={styles.urgentBanner}
        >
          <Ionicons name="alert-circle" size={18} color={G.white} />
          <Text style={[styles.urgentText, { flex: 1 }]}>
            {urgentCount} thing{urgentCount !== 1 ? "s" : ""} need{urgentCount === 1 ? "s" : ""} your attention today
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            {urgentExpanded ? "▴" : "▾"}
          </Text>
        </TouchableOpacity>
      )}
      {urgentExpanded && sections.needsAttention.length > 0 && (
        <View style={styles.urgentList}>
          {sections.needsAttention.map((email) => (
            <TouchableOpacity
              key={email.id}
              onPress={() => openEmail(email.webLink)}
              activeOpacity={0.7}
              style={styles.urgentItem}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.urgentItemFrom}>{email.from}</Text>
                <Text style={styles.urgentItemSubject}>{email.subject}</Text>
                {email.reason && (
                  <Text style={styles.urgentItemReason}>{email.reason}</Text>
                )}
                {email.suggestedAction && (
                  <Text style={styles.urgentItemAction}>→ {email.suggestedAction}</Text>
                )}
              </View>
              <Ionicons name="open-outline" size={14} color={G.muted} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Thread cards */}
      <View style={styles.threadList}>
        {threads.map((thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
  },
  headerSubtitle: {
    fontSize: 14,
    color: G.muted,
    marginTop: 4,
  },

  urgentBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    marginHorizontal: spacing[5],
    marginTop: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: G.black,
    borderRadius: radius.md,
  },
  urgentText: {
    fontSize: 14,
    fontWeight: "600",
    color: G.white,
  },
  urgentList: {
    marginHorizontal: spacing[5],
    backgroundColor: G.white,
    borderRadius: radius.md,
    marginTop: spacing[2],
    overflow: "hidden",
    ...shadows.cardSubtle,
  },
  urgentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    padding: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: G.faint,
  },
  urgentItemFrom: {
    fontSize: 12,
    fontWeight: "600",
    color: G.mid,
  },
  urgentItemSubject: {
    fontSize: 14,
    fontWeight: "600",
    color: G.black,
    marginTop: 1,
  },
  urgentItemReason: {
    fontSize: 12,
    color: G.muted,
    marginTop: 2,
  },
  urgentItemAction: {
    fontSize: 12,
    fontWeight: "500",
    color: G.dark,
    marginTop: 3,
  },

  threadList: {
    padding: spacing[5],
    gap: spacing[3],
  },

  threadCard: {
    backgroundColor: G.white,
    borderRadius: radius.lg,
    padding: spacing[4],
    ...shadows.cardSubtle,
  },
  threadHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  threadIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  threadLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: G.black,
  },
  threadCount: {
    fontSize: 12,
    color: G.muted,
    marginTop: 1,
  },
  chevron: {
    fontSize: 16,
    color: G.light,
  },
  chevronExpanded: {
    transform: [{ rotate: "180deg" }],
  },
  threadPreview: {
    fontSize: 13,
    color: G.muted,
    marginTop: spacing[2],
    marginLeft: 48,
  },

  threadEmails: {
    marginTop: spacing[3],
    gap: spacing[2],
  },
  threadEmailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: radius.sm,
    backgroundColor: G.bg,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emailFrom: {
    fontSize: 12,
    fontWeight: "600",
    color: G.mid,
  },
  emailSubject: {
    fontSize: 13,
    color: G.dark,
    marginTop: 1,
  },
  emailReason: {
    fontSize: 11,
    color: G.light,
    marginTop: 1,
  },
});
