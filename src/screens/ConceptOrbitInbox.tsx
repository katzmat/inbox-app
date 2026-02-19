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
import { OrbitText, Avatar, Badge, Tag, colors, spacing, radius } from "../../orbit-ds";
import { useBriefingData } from "../hooks/useBriefingData";
import type { BriefingEmail } from "../data/briefing";

const G = {
  black: "#1d1d1f",
  dark: "#333",
  mid: "#666",
  muted: "#999",
  light: "#bbb",
  faint: "#ddd",
  bg: "#f5f5f5",
  white: "#fff",
  line: "#e8e8e8",
  unread: "#1d1d1f",
  read: "#999",
};

function openEmail(webLink?: string) {
  if (!webLink) return;
  if (Platform.OS === "web") window.open(webLink, "_blank");
  else Linking.openURL(webLink);
}

function senderInitial(from: string) {
  return from.charAt(0).toUpperCase();
}

function senderColor(from: string) {
  const colors = ["#5B5EA6", "#9B2335", "#2E86AB", "#A23B72", "#F18F01", "#3C6E71", "#7B2D8E"];
  let hash = 0;
  for (let i = 0; i < from.length; i++) hash = from.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function relativeTime(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "now";
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "yesterday";
  if (diffD < 7) return `${diffD}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function EmailRow({ email, isUnread }: { email: BriefingEmail; isUnread: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      style={[styles.row, isUnread && styles.rowUnread]}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: senderColor(email.from) }]}>
        <Text style={styles.avatarText}>{senderInitial(email.from)}</Text>
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={[styles.sender, isUnread && styles.senderUnread]} numberOfLines={1}>
            {email.from}
          </Text>
          <Text style={styles.time}>{relativeTime(email.date)}</Text>
        </View>
        <Text style={[styles.subject, isUnread && styles.subjectUnread]} numberOfLines={1}>
          {email.subject}
        </Text>
        <Text style={styles.snippet} numberOfLines={expanded ? 4 : 1}>
          {email.snippet}
        </Text>

        {expanded && (
          <View style={styles.expandedContent}>
            {email.reason && (
              <View style={styles.reasonRow}>
                <Tag label={`AI: ${email.reason}`} />
              </View>
            )}
            {email.webLink && (
              <TouchableOpacity
                onPress={() => openEmail(email.webLink)}
                style={styles.openChip}
              >
                <Text style={styles.openChipText}>Open email →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Unread dot */}
      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default function ConceptOrbitInbox() {
  const { connState, userEmail, sections, stats } = useBriefingData();
  const [filter, setFilter] = useState<"all" | "priority" | "unread">("all");

  if (connState === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={G.muted} />
      </View>
    );
  }

  const allEmails = [
    ...sections.needsAttention,
    ...Object.values(sections.glance).flat(),
    ...sections.low,
  ];

  const filtered =
    filter === "priority"
      ? sections.needsAttention
      : filter === "unread"
      ? allEmails.slice(0, Math.ceil(allEmails.length * 0.6))
      : allEmails;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <OrbitText variant="title2" color={G.black}>
          Inbox
        </OrbitText>
        {userEmail && (
          <OrbitText variant="caption2" color={G.muted} style={{ marginTop: 2 }}>
            {userEmail}
          </OrbitText>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filterBar}>
        {(["all", "priority", "unread"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === "all"
                ? `All (${allEmails.length})`
                : f === "priority"
                ? `Priority (${stats.needsAttention})`
                : "Unread"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Email list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filtered.map((email, i) => (
          <EmailRow
            key={email.id}
            email={email}
            isUnread={i < filtered.length * 0.5}
          />
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.white },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    gap: spacing[2],
  },
  filterChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    backgroundColor: G.bg,
  },
  filterChipActive: {
    backgroundColor: G.black,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: G.mid,
  },
  filterTextActive: {
    color: G.white,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: G.line,
    gap: spacing[3],
  },
  rowUnread: {
    backgroundColor: "rgba(29,29,31,0.015)",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  rowContent: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sender: {
    fontSize: 14,
    fontWeight: "400",
    color: G.muted,
    flex: 1,
    marginRight: spacing[2],
  },
  senderUnread: {
    fontWeight: "600",
    color: G.black,
  },
  time: { fontSize: 12, color: G.light },
  subject: {
    fontSize: 15,
    fontWeight: "400",
    color: G.dark,
    marginTop: 1,
  },
  subjectUnread: {
    fontWeight: "600",
    color: G.black,
  },
  snippet: {
    fontSize: 13,
    color: G.muted,
    marginTop: 2,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.brand,
    marginTop: 18,
  },
  expandedContent: {
    marginTop: spacing[2],
    gap: spacing[2],
  },
  reasonRow: {
    flexDirection: "row",
  },
  openChip: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    backgroundColor: G.bg,
  },
  openChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: G.dark,
  },
});
