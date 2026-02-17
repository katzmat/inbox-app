import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  OrbitText,
  Card,
  Tag,
  Button,
  colors,
  spacing,
  radius,
  shadows,
} from "../../orbit-ds";
import {
  morningBriefing,
  emailsByTier,
  briefingStats,
  type BriefingEmail,
  type BriefingTier,
} from "../data/briefing";
import { useCountdown } from "../hooks/useCountdown";

const TIER_META: Record<
  BriefingTier,
  { label: string; accent: string; dot: string }
> = {
  priority: { label: "Priority", accent: colors.status.urgent, dot: "#c0392b" },
  uncertain: { label: "Might Matter", accent: colors.core.warning, dot: "#bf4900" },
  low: { label: "Low", accent: "#bbb", dot: "#ccc" },
};

// ─── Email Card ───────────────────────────────────────

function EmailCard({
  email,
  accent,
  expanded,
  onToggle,
}: {
  email: BriefingEmail;
  accent: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
      <Card elevation="subtle" style={styles.emailCard}>
        <View style={[styles.accentStrip, { backgroundColor: accent }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <OrbitText variant="label2" color={colors.foreground.primary}>
                {email.subject}
              </OrbitText>
              <OrbitText
                variant="caption2"
                color={colors.foreground.tertiary}
                style={{ marginTop: 3 }}
              >
                {email.from} · {email.category}
              </OrbitText>
            </View>
            <Text style={styles.chevron}>{expanded ? "▴" : "▾"}</Text>
          </View>

          {!expanded && (
            <OrbitText
              variant="xSmall"
              color={colors.foreground.tertiary}
              style={{ marginTop: spacing[2] }}
              numberOfLines={1}
            >
              {email.preview}
            </OrbitText>
          )}

          {expanded && (
            <View style={styles.expandedBody}>
              <OrbitText
                variant="label4"
                color={colors.foreground.secondary}
                style={{ lineHeight: 22 }}
              >
                {email.detail}
              </OrbitText>
              <View style={styles.reasonRow}>
                <OrbitText
                  variant="caption2"
                  color="rgba(125,46,255,0.7)"
                  style={{ fontWeight: "500" }}
                >
                  AI reasoning:
                </OrbitText>
                <OrbitText
                  variant="caption2"
                  color={colors.foreground.tertiary}
                  style={{ flex: 1, marginLeft: spacing[1] }}
                >
                  {email.reason}
                </OrbitText>
              </View>
              <View style={styles.actions}>
                <Button label={email.suggestedAction} variant="neutral" size="sm" />
                <Button label="Full email →" variant="tertiary" size="sm" />
              </View>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────

export default function StackedCards() {
  const [activeTier, setActiveTier] = useState<BriefingTier | "chrono">("priority");
  const [expanded, setExpanded] = useState<number | null>(null);
  const { formatted, pullEarly, pulled } = useCountdown(5 * 3600 + 30 * 60);

  const tiers = emailsByTier(morningBriefing);
  const stats = briefingStats(morningBriefing);
  const allEmails = morningBriefing.emails;

  const toggle = (id: number) =>
    setExpanded(expanded === id ? null : id);

  const tierTabs: { key: BriefingTier | "chrono"; label: string }[] = [
    { key: "priority", label: `Priority (${stats.priority})` },
    { key: "uncertain", label: `Might Matter (${stats.uncertain})` },
    { key: "low", label: `Low (${stats.low})` },
    { key: "chrono", label: "⏱" },
  ];

  const visibleEmails: BriefingEmail[] =
    activeTier === "chrono" ? allEmails : tiers[activeTier];

  return (
    <View style={styles.container}>
      {/* Compact header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <OrbitText variant="label2" color={colors.foreground.primary}>
            Morning Briefing
          </OrbitText>
          <View style={styles.countdownChip}>
            {!pulled ? (
              <TouchableOpacity onPress={pullEarly} activeOpacity={0.7}>
                <OrbitText variant="caption2" color={colors.foreground.tertiary}>
                  Next in {formatted} · <Text style={{ color: "#7d2eff" }}>Pull now</Text>
                </OrbitText>
              </TouchableOpacity>
            ) : (
              <OrbitText variant="caption2" color={colors.core.positive}>
                Midday pulled ✓
              </OrbitText>
            )}
          </View>
        </View>

        {/* Tier tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          {tierTabs.map((tab) => {
            const isActive = activeTier === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => {
                  setActiveTier(tab.key);
                  setExpanded(null);
                }}
                style={[styles.tierTab, isActive && styles.tierTabActive]}
              >
                <Text
                  style={[styles.tierTabText, isActive && styles.tierTabTextActive]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Cards */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {activeTier === "chrono" && (
          <View style={styles.chronoLabel}>
            <OrbitText variant="caption2" color={colors.foreground.tertiary}>
              All {allEmails.length} messages — chronological
            </OrbitText>
          </View>
        )}
        {visibleEmails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            accent={
              activeTier === "chrono"
                ? TIER_META[email.tier].accent
                : TIER_META[activeTier as BriefingTier].accent
            }
            expanded={expanded === email.id}
            onToggle={() => toggle(email.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.warm },
  header: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  countdownChip: {},
  tabBarContent: { paddingHorizontal: spacing[6], gap: spacing[1] },
  tierTab: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tierTabActive: { borderBottomColor: colors.foreground.primary },
  tierTabText: { fontSize: 13, fontWeight: "400", color: "#999" },
  tierTabTextActive: { fontWeight: "600", color: colors.foreground.primary },
  list: { flex: 1, paddingHorizontal: spacing[5], paddingTop: spacing[4] },
  emailCard: {
    flexDirection: "row",
    marginBottom: spacing[3],
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  accentStrip: { width: 4 },
  cardBody: { flex: 1, padding: spacing[5] },
  cardHeader: { flexDirection: "row", alignItems: "flex-start" },
  chevron: { fontSize: 16, color: "#ccc", marginLeft: spacing[3] },
  expandedBody: { marginTop: spacing[3], gap: spacing[2] },
  reasonRow: { flexDirection: "row", alignItems: "flex-start", marginTop: spacing[1] },
  actions: { flexDirection: "row", gap: spacing[2], marginTop: spacing[2] },
  chronoLabel: { paddingBottom: spacing[3], paddingLeft: spacing[1] },
});
