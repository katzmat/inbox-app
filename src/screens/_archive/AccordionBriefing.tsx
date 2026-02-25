// @ts-nocheck
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
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
} from "../../../orbit-ds";
import {
  morningBriefing,
  emailsByTier,
  briefingStats,
  USER_NAME,
  type BriefingEmail,
  type BriefingTier,
} from "../../data/briefing";
function useCountdown(_s: number) { return { formatted: "—", pullEarly: () => {}, pulled: false }; }

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TIER_CONFIG: Record<
  BriefingTier,
  { label: string; subtitle: string; color: string; bg: string; icon: string }
> = {
  priority: {
    label: "Priority",
    subtitle: "Needs your attention now",
    color: colors.status.urgent,
    bg: "rgba(192,57,43,0.05)",
    icon: "🔴",
  },
  uncertain: {
    label: "Might Matter",
    subtitle: "AI isn't sure — your call",
    color: colors.core.warning,
    bg: "rgba(191,73,0,0.04)",
    icon: "🟡",
  },
  low: {
    label: "Low Priority",
    subtitle: "Filtered for you",
    color: "#999",
    bg: "rgba(0,0,0,0.02)",
    icon: "⚪",
  },
};

const TIER_ORDER: BriefingTier[] = ["priority", "uncertain", "low"];

// ─── Accordion Section ────────────────────────────────

function AccordionSection({
  tier,
  emails,
  isOpen,
  onToggleSection,
  expandedEmail,
  onToggleEmail,
}: {
  tier: BriefingTier;
  emails: BriefingEmail[];
  isOpen: boolean;
  onToggleSection: () => void;
  expandedEmail: number | null;
  onToggleEmail: (id: number) => void;
}) {
  const config = TIER_CONFIG[tier];

  return (
    <View style={[styles.section, { borderLeftColor: config.color }]}>
      {/* Section header — always visible */}
      <TouchableOpacity
        onPress={onToggleSection}
        activeOpacity={0.7}
        style={[styles.sectionHeader, isOpen && { backgroundColor: config.bg }]}
      >
        <View style={styles.sectionHeaderLeft}>
          <Text style={styles.sectionIcon}>{config.icon}</Text>
          <View>
            <OrbitText variant="label2" color={colors.foreground.primary}>
              {config.label}
            </OrbitText>
            <OrbitText
              variant="caption2"
              color={colors.foreground.tertiary}
              style={{ marginTop: 2 }}
            >
              {emails.length} {emails.length === 1 ? "message" : "messages"} ·{" "}
              {config.subtitle}
            </OrbitText>
          </View>
        </View>
        <View style={styles.sectionHeaderRight}>
          <View style={[styles.countBadge, { backgroundColor: config.color }]}>
            <Text style={styles.countBadgeText}>{emails.length}</Text>
          </View>
          <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>▾</Text>
        </View>
      </TouchableOpacity>

      {/* Collapsed preview — sender names */}
      {!isOpen && (
        <View style={styles.collapsedPreview}>
          <OrbitText variant="caption2" color={colors.foreground.tertiary} numberOfLines={1}>
            {emails.map((e) => e.from).join(" · ")}
          </OrbitText>
        </View>
      )}

      {/* Expanded — email list */}
      {isOpen && (
        <View style={styles.emailList}>
          {emails.map((email, idx) => (
            <EmailRow
              key={email.id}
              email={email}
              tier={tier}
              isLast={idx === emails.length - 1}
              expanded={expandedEmail === email.id}
              onToggle={() => onToggleEmail(email.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Email Row ────────────────────────────────────────

function EmailRow({
  email,
  tier,
  isLast,
  expanded,
  onToggle,
}: {
  email: BriefingEmail;
  tier: BriefingTier;
  isLast: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.emailRow,
        !isLast && styles.emailRowBorder,
        expanded && styles.emailRowExpanded,
      ]}
    >
      <View style={styles.emailHeader}>
        <View style={{ flex: 1 }}>
          <OrbitText variant="label4" color={colors.foreground.primary}>
            {email.subject}
          </OrbitText>
          <OrbitText
            variant="caption2"
            color={colors.foreground.tertiary}
            style={{ marginTop: 2 }}
          >
            {email.from} · {email.category}
          </OrbitText>
        </View>
        <Text style={styles.emailChevron}>{expanded ? "▴" : "▾"}</Text>
      </View>

      {!expanded && (
        <OrbitText
          variant="caption2"
          color={colors.foreground.tertiary}
          style={{ marginTop: spacing[1] }}
          numberOfLines={1}
        >
          {email.preview}
        </OrbitText>
      )}

      {expanded && (
        <View style={styles.emailExpanded}>
          <OrbitText
            variant="label4"
            color={colors.foreground.secondary}
            style={{ lineHeight: 22 }}
          >
            {email.detail}
          </OrbitText>

          {/* Full body preview */}
          <View style={styles.fullBodyPreview}>
            <OrbitText
              variant="xSmall"
              color={colors.foreground.tertiary}
              style={{ lineHeight: 20 }}
            >
              {email.fullBody}
            </OrbitText>
          </View>

          {/* Reasoning */}
          <View style={styles.reasoningBox}>
            <OrbitText
              variant="caption2"
              color="rgba(125,46,255,0.7)"
              style={{ fontWeight: "600", marginBottom: 4 }}
            >
              Why this is in "{TIER_CONFIG[tier].label}"
            </OrbitText>
            <OrbitText variant="caption2" color={colors.foreground.tertiary}>
              {email.reason}
            </OrbitText>
          </View>

          <View style={styles.actions}>
            <Button label={email.suggestedAction} variant="neutral" size="sm" />
            <Button label="Move tier" variant="tertiary" size="sm" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────

export default function AccordionBriefing() {
  const [openSections, setOpenSections] = useState<Set<BriefingTier>>(
    new Set(["priority"])
  );
  const [expandedEmail, setExpandedEmail] = useState<number | null>(null);
  const [chronological, setChronological] = useState(false);
  const { formatted, pullEarly, pulled } = useCountdown(5 * 3600 + 30 * 60);

  const tiers = emailsByTier(morningBriefing);
  const stats = briefingStats(morningBriefing);

  const toggleSection = (tier: BriefingTier) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = new Set(openSections);
    if (next.has(tier)) {
      next.delete(tier);
    } else {
      next.add(tier);
    }
    setOpenSections(next);
    setExpandedEmail(null);
  };

  const toggleEmail = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedEmail(expandedEmail === id ? null : id);
  };

  const allEmails = morningBriefing.emails;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <OrbitText
              variant="legal"
              color={colors.foreground.tertiary}
              style={{ letterSpacing: 2.5, fontWeight: "500", marginBottom: 4 }}
            >
              MORNING BRIEFING
            </OrbitText>
            <OrbitText
              variant="title3"
              color={colors.foreground.primary}
              style={{ letterSpacing: -0.5 }}
            >
              Hey {USER_NAME} — {stats.total} emails
            </OrbitText>
          </View>
        </View>

        {/* Stats chips */}
        <View style={styles.statsRow}>
          {TIER_ORDER.map((tier) => {
            const config = TIER_CONFIG[tier];
            const count = tiers[tier].length;
            return (
              <View key={tier} style={[styles.statChip, { borderColor: config.color }]}>
                <Text style={[styles.statChipCount, { color: config.color }]}>
                  {count}
                </Text>
                <Text style={styles.statChipLabel}>{config.label.toLowerCase()}</Text>
              </View>
            );
          })}
        </View>

        {/* Countdown */}
        <View style={styles.countdownRow}>
          {!pulled ? (
            <>
              <OrbitText variant="caption2" color={colors.foreground.tertiary}>
                Next briefing in {formatted}
              </OrbitText>
              <TouchableOpacity onPress={pullEarly} style={styles.pullBtn}>
                <OrbitText variant="caption2" color="#7d2eff" style={{ fontWeight: "600" }}>
                  Get it now
                </OrbitText>
              </TouchableOpacity>
            </>
          ) : (
            <OrbitText variant="caption2" color={colors.core.positive}>
              Midday briefing pulled early ✓
            </OrbitText>
          )}
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {chronological ? (
          <>
            <OrbitText
              variant="legal"
              color={colors.foreground.tertiary}
              style={{
                letterSpacing: 2,
                fontWeight: "600",
                marginBottom: spacing[3],
                paddingLeft: spacing[1],
              }}
            >
              ALL MESSAGES — CHRONOLOGICAL
            </OrbitText>
            {allEmails.map((email) => (
              <TouchableOpacity
                key={email.id}
                onPress={() => toggleEmail(email.id)}
                activeOpacity={0.7}
                style={styles.chronoRow}
              >
                <View
                  style={[
                    styles.chronoDot,
                    { backgroundColor: TIER_CONFIG[email.tier].color },
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
                    {email.from} · {email.category}
                  </OrbitText>
                  {expandedEmail === email.id && (
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
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          /* ── Accordion tiers ── */
          TIER_ORDER.map((tier) => (
            <AccordionSection
              key={tier}
              tier={tier}
              emails={tiers[tier]}
              isOpen={openSections.has(tier)}
              onToggleSection={() => toggleSection(tier)}
              expandedEmail={expandedEmail}
              onToggleEmail={toggleEmail}
            />
          ))
        )}

        {/* Toggle link */}
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setChronological(!chronological);
            setExpandedEmail(null);
          }}
          style={styles.toggleLink}
        >
          <OrbitText variant="label4" color="#7d2eff">
            {chronological
              ? "← Back to accordion view"
              : "Switch to chronological view →"}
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
  // Header
  header: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.line.warm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing[2],
    marginTop: spacing[4],
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  statChipCount: { fontSize: 14, fontWeight: "600" },
  statChipLabel: { fontSize: 12, color: colors.foreground.tertiary },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.line.warm,
  },
  pullBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderColor: "rgba(125,46,255,0.2)",
    borderRadius: radius.sm,
  },
  // Body
  body: { paddingHorizontal: spacing[5], paddingTop: spacing[4] },
  // Accordion section
  section: {
    marginBottom: spacing[3],
    borderLeftWidth: 3,
    borderRadius: radius.lg,
    backgroundColor: colors.background.primary,
    overflow: "hidden",
    ...shadows.cardSubtle,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    flex: 1,
  },
  sectionIcon: { fontSize: 20 },
  sectionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  countBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  chevron: { fontSize: 16, color: "#ccc" },
  chevronOpen: { transform: [{ rotate: "180deg" }] },
  collapsedPreview: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    paddingTop: 0,
  },
  // Email list
  emailList: {},
  emailRow: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  emailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.line.warm,
  },
  emailRowExpanded: {
    backgroundColor: "rgba(125,46,255,0.02)",
  },
  emailHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  emailChevron: { fontSize: 14, color: "#ccc", marginLeft: spacing[2] },
  emailExpanded: {
    marginTop: spacing[3],
    gap: spacing[3],
  },
  fullBodyPreview: {
    backgroundColor: colors.background.warmSecondary,
    borderRadius: radius.md,
    padding: spacing[4],
    borderLeftWidth: 2,
    borderLeftColor: colors.line.warm,
  },
  reasoningBox: {
    backgroundColor: "rgba(125,46,255,0.04)",
    borderRadius: radius.md,
    padding: spacing[3],
  },
  actions: { flexDirection: "row", gap: spacing[2] },
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
