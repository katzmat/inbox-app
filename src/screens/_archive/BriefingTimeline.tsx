// @ts-nocheck
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  allBriefings,
  emailsByTier,
  briefingStats,
  type BriefingEmail,
  type Briefing,
} from "../data/briefing";
import { useCountdown } from "../hooks/useCountdown";

const TIER_RAIL_COLOR: Record<string, string> = {
  priority: colors.status.urgent,
  uncertain: colors.core.warning,
  low: "#d0d0d0",
};

// ─── Timeline Waypoint ────────────────────────────────

function Waypoint({
  briefing,
  isLast,
  expanded,
  onToggle,
  onPullEarly,
  pulled,
  countdown,
}: {
  briefing: Briefing;
  isLast: boolean;
  expanded: number | null;
  onToggle: (id: number) => void;
  onPullEarly: () => void;
  pulled: boolean;
  countdown: string;
}) {
  const [showEmails, setShowEmails] = useState(briefing.isActive);
  const tiers = emailsByTier(briefing);
  const stats = briefingStats(briefing);

  const handleFutureTap = () => {
    if (briefing.isFuture && !pulled) {
      Alert.alert(
        "Pull this briefing early?",
        `Get your ${briefing.label.toLowerCase()} now instead of waiting.`,
        [
          { text: "Not yet", style: "cancel" },
          { text: "Pull now", onPress: onPullEarly },
        ]
      );
    } else {
      setShowEmails(!showEmails);
    }
  };

  return (
    <View style={styles.waypoint}>
      {/* Left rail */}
      <View style={styles.rail}>
        <View
          style={[
            styles.dot,
            briefing.isActive && styles.dotActive,
            briefing.isFuture && !pulled && styles.dotFuture,
          ]}
        />
        {!isLast && <View style={styles.railLine} />}
      </View>

      {/* Content */}
      <View style={styles.waypointContent}>
        <TouchableOpacity onPress={handleFutureTap} activeOpacity={0.7}>
          <View style={styles.waypointHeader}>
            <View>
              <OrbitText
                variant="label2"
                color={
                  briefing.isFuture && !pulled
                    ? colors.foreground.tertiary
                    : colors.foreground.primary
                }
              >
                {briefing.label}
              </OrbitText>
              <OrbitText
                variant="caption2"
                color={colors.foreground.tertiary}
                style={{ marginTop: 2 }}
              >
                {briefing.time}
                {briefing.isFuture && !pulled && ` · in ${countdown}`}
                {pulled && briefing.isFuture && " · Pulled early ✓"}
              </OrbitText>
            </View>
            {briefing.isActive && (
              <Tag label="NOW" color="rgba(125,46,255,0.1)" textColor="#7d2eff" />
            )}
            {briefing.isFuture && !pulled && (
              <OrbitText variant="caption2" color="#7d2eff">
                Tap to pull
              </OrbitText>
            )}
          </View>
        </TouchableOpacity>

        {/* Emails (only if active or toggled open) */}
        {showEmails && briefing.emails.length > 0 && (
          <View style={styles.emailList}>
            {/* Priority */}
            {tiers.priority.length > 0 && (
              <TierGroup
                label="Priority"
                emails={tiers.priority}
                railColor={TIER_RAIL_COLOR.priority}
                expanded={expanded}
                onToggle={onToggle}
              />
            )}
            {/* Uncertain */}
            {tiers.uncertain.length > 0 && (
              <TierGroup
                label="Might Matter"
                emails={tiers.uncertain}
                railColor={TIER_RAIL_COLOR.uncertain}
                expanded={expanded}
                onToggle={onToggle}
              />
            )}
            {/* Low */}
            {tiers.low.length > 0 && (
              <TierGroup
                label="Low Priority"
                emails={tiers.low}
                railColor={TIER_RAIL_COLOR.low}
                expanded={expanded}
                onToggle={onToggle}
              />
            )}
          </View>
        )}

        {briefing.isFuture && !pulled && briefing.emails.length === 0 && (
          <View style={styles.lockedPlaceholder}>
            <OrbitText variant="xSmall" color={colors.foreground.tertiary}>
              Emails will appear at {briefing.time}
            </OrbitText>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Tier Group ───────────────────────────────────────

function TierGroup({
  label,
  emails,
  railColor,
  expanded,
  onToggle,
}: {
  label: string;
  emails: BriefingEmail[];
  railColor: string;
  expanded: number | null;
  onToggle: (id: number) => void;
}) {
  return (
    <View style={styles.tierGroup}>
      <OrbitText
        variant="legal"
        color={railColor}
        style={{ letterSpacing: 2, fontWeight: "600", marginBottom: spacing[2] }}
      >
        {label.toUpperCase()} ({emails.length})
      </OrbitText>
      {emails.map((email) => (
        <TouchableOpacity
          key={email.id}
          onPress={() => onToggle(email.id)}
          activeOpacity={0.7}
          style={styles.timelineEmail}
        >
          <View style={[styles.tierStrip, { backgroundColor: railColor }]} />
          <View style={styles.emailContent}>
            <OrbitText variant="label4" color={colors.foreground.primary}>
              {email.subject}
            </OrbitText>
            <OrbitText
              variant="caption2"
              color={colors.foreground.tertiary}
              style={{ marginTop: 2 }}
            >
              {email.from}
            </OrbitText>
            {expanded === email.id && (
              <View style={{ marginTop: spacing[2], gap: spacing[2] }}>
                <OrbitText
                  variant="xSmall"
                  color={colors.foreground.secondary}
                  style={{ lineHeight: 20 }}
                >
                  {email.detail}
                </OrbitText>
                <OrbitText
                  variant="caption2"
                  color="rgba(125,46,255,0.6)"
                  style={{ fontStyle: "italic" }}
                >
                  {email.reason}
                </OrbitText>
                <Button label={email.suggestedAction} variant="neutral" size="sm" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────

export default function BriefingTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [chronological, setChronological] = useState(false);
  const midday = useCountdown(5 * 3600 + 30 * 60);
  const evening = useCountdown(10 * 3600 + 30 * 60);

  const toggle = (id: number) =>
    setExpanded(expanded === id ? null : id);

  const allEmails = allBriefings[0].emails; // morning is active

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <OrbitText
          variant="legal"
          color={colors.foreground.tertiary}
          style={{ letterSpacing: 2.5, fontWeight: "500", marginBottom: 6 }}
        >
          YOUR DAY IN THREE MOMENTS
        </OrbitText>
        <OrbitText
          variant="title3"
          color={colors.foreground.primary}
          style={{ letterSpacing: -0.5 }}
        >
          Briefing Timeline
        </OrbitText>
      </View>

      <View style={styles.body}>
        {chronological ? (
          <>
            <OrbitText
              variant="legal"
              color={colors.foreground.tertiary}
              style={{ letterSpacing: 2, fontWeight: "600", marginBottom: spacing[3] }}
            >
              ALL MESSAGES
            </OrbitText>
            {allEmails.map((email) => (
              <TouchableOpacity
                key={email.id}
                onPress={() => toggle(email.id)}
                activeOpacity={0.7}
                style={styles.chronoRow}
              >
                <View
                  style={[
                    styles.chronoDot,
                    { backgroundColor: TIER_RAIL_COLOR[email.tier] },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <OrbitText variant="label4" color={colors.foreground.primary}>
                    {email.subject}
                  </OrbitText>
                  <OrbitText
                    variant="caption2"
                    color={colors.foreground.tertiary}
                    style={{ marginTop: 2 }}
                  >
                    {email.from}
                  </OrbitText>
                  {expanded === email.id && (
                    <OrbitText
                      variant="xSmall"
                      color={colors.foreground.secondary}
                      style={{ marginTop: spacing[2], lineHeight: 20 }}
                    >
                      {email.detail}
                    </OrbitText>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          allBriefings.map((briefing, idx) => (
            <Waypoint
              key={briefing.id}
              briefing={briefing}
              isLast={idx === allBriefings.length - 1}
              expanded={expanded}
              onToggle={toggle}
              onPullEarly={
                briefing.id === "midday"
                  ? midday.pullEarly
                  : evening.pullEarly
              }
              pulled={
                briefing.id === "midday"
                  ? midday.pulled
                  : briefing.id === "evening"
                  ? evening.pulled
                  : false
              }
              countdown={
                briefing.id === "midday"
                  ? midday.formatted
                  : evening.formatted
              }
            />
          ))
        )}

        <TouchableOpacity
          onPress={() => {
            setChronological(!chronological);
            setExpanded(null);
          }}
          style={styles.toggleLink}
        >
          <OrbitText variant="label4" color="#7d2eff">
            {chronological
              ? "← Back to timeline view"
              : "See all as list →"}
          </OrbitText>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.warm },
  header: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  body: { paddingHorizontal: spacing[6], paddingTop: spacing[5] },
  // Waypoint
  waypoint: { flexDirection: "row", marginBottom: spacing[2] },
  rail: { width: 28, alignItems: "center" },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.foreground.tertiary,
    borderWidth: 2,
    borderColor: colors.background.warm,
  },
  dotActive: { backgroundColor: "#7d2eff", borderColor: "rgba(125,46,255,0.2)" },
  dotFuture: { backgroundColor: "#ddd", borderColor: colors.background.warm },
  railLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.line.warm,
    marginVertical: 2,
  },
  waypointContent: { flex: 1, paddingLeft: spacing[3], paddingBottom: spacing[6] },
  waypointHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailList: { marginTop: spacing[4] },
  lockedPlaceholder: {
    marginTop: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.background.warmSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line.warm,
    borderStyle: "dashed",
  },
  // Tier group
  tierGroup: { marginBottom: spacing[4] },
  timelineEmail: {
    flexDirection: "row",
    marginBottom: spacing[2],
    backgroundColor: colors.background.primary,
    borderRadius: radius.md,
    overflow: "hidden",
    ...shadows.cardSubtle,
  },
  tierStrip: { width: 4 },
  emailContent: { flex: 1, padding: spacing[4] },
  // Chrono
  chronoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  chronoDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  toggleLink: {
    marginTop: spacing[6],
    alignItems: "center",
    paddingVertical: spacing[4],
  },
});
