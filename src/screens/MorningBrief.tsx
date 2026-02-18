import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  OrbitText,
  Button,
  Card,
  Tag,
  SectionHeader,
  colors,
  spacing,
  radius,
  shadows,
} from "../../orbit-ds";
import {
  USER_NAME,
  TODAY,
  type BriefingEmail,
} from "../data/briefing";
import { useCountdown } from "../hooks/useCountdown";
import { useBriefingData } from "../hooks/useBriefingData";
import { groupByCategory } from "../utils/groupByCategory";

// ─── Greyscale palette ────────────────────────────────
const G = {
  black: "#1d1d1f",
  dark: "#333",
  mid: "#666",
  muted: "#999",
  light: "#bbb",
  faint: "#ddd",
  bg: "#f5f5f5",
  bgWarm: "#fafafa",
  white: "#fff",
  line: "#e8e8e8",
  tagBg: "rgba(0,0,0,0.05)",
};

// ─── Sub-components ───────────────────────────────────

function PriorityCard({
  email,
  expanded,
  onToggle,
}: {
  email: BriefingEmail;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[styles.priorityCard, expanded && styles.priorityCardExpanded]}
    >
      <View style={styles.priorityRow}>
        <View style={styles.priorityDotSmall} />
        <View style={{ flex: 1 }}>
          <OrbitText variant="label2" color={G.black}>
            {email.subject}
          </OrbitText>
          <OrbitText
            variant="caption2"
            color={G.muted}
            style={{ marginTop: 3 }}
          >
            {email.from} · {email.category}
          </OrbitText>
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronExpanded]}>
          ▾
        </Text>
      </View>
      {expanded && (
        <View style={styles.expandedDetail}>
          <OrbitText
            variant="label4"
            color={G.dark}
            style={{ lineHeight: 22 }}
          >
            {email.detail}
          </OrbitText>
          <Tag
            label={`AI: ${email.reason}`}
            color={G.tagBg}
            textColor={G.mid}
          />
          <View style={styles.actions}>
            <Button label={email.suggestedAction} variant="neutral" size="sm" />
            <OpenEmailChip gmailId={email.gmailId} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function GlanceRow({
  email,
  expanded,
  onToggle,
}: {
  email: BriefingEmail;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={styles.glanceItemRow}
    >
      <View style={{ flex: 1 }}>
        <OrbitText variant="label4" color={G.black}>
          {email.subject}
        </OrbitText>
        <OrbitText
          variant="caption2"
          color={G.muted}
          style={{ marginTop: 2 }}
        >
          {email.from}
        </OrbitText>
        {expanded && (
          <View style={{ marginTop: spacing[2] }}>
            <OrbitText
              variant="xSmall"
              color={G.dark}
              style={{ lineHeight: 20 }}
            >
              {email.detail}
            </OrbitText>
            <View style={styles.actions}>
              <Tag
                label={`AI: ${email.reason}`}
                color={G.tagBg}
                textColor={G.mid}
              />
              <OpenEmailChip gmailId={email.gmailId} />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

/** Accordion group for a category within the Glance section */
function GlanceCategoryGroup({
  category,
  emails,
  expanded,
  onToggle,
}: {
  category: string;
  emails: BriefingEmail[];
  expanded: number | null;
  onToggle: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.glanceGroup}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
        style={styles.glanceGroupHeader}
      >
        <View style={styles.glanceDot} />
        <View style={{ flex: 1 }}>
          <OrbitText variant="label3" color={G.dark}>
            {category}
          </OrbitText>
          <OrbitText variant="caption2" color={G.muted} style={{ marginTop: 2 }}>
            {emails.length} {emails.length === 1 ? "email" : "emails"}
          </OrbitText>
        </View>
        <Text style={styles.chevronSmall}>{open ? "▴" : "▾"}</Text>
      </TouchableOpacity>
      {open &&
        emails.map((email) => (
          <GlanceRow
            key={email.id}
            email={email}
            expanded={expanded === email.id}
            onToggle={() => onToggle(email.id)}
          />
        ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────

export default function MorningBrief() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [chronological, setChronological] = useState(false);
  const { formatted, pullEarly, pulled } = useCountdown(5 * 3600 + 30 * 60);

  const { connState, userEmail, briefing, tiers, stats, handleConnectGmail } =
    useBriefingData();

  const toggle = (id: number) =>
    setExpanded(expanded === id ? null : id);

  const allEmails = briefing.emails;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Masthead */}
      <View style={styles.masthead}>
        <OrbitText
          variant="legal"
          color="rgba(255,255,255,0.4)"
          style={{ letterSpacing: 3, fontWeight: "600", marginBottom: spacing[2] }}
        >
          MORNING BRIEFING
        </OrbitText>
        <OrbitText
          variant="title2"
          color={G.white}
          style={{ fontWeight: "300" }}
        >
          Good morning, {USER_NAME}.
        </OrbitText>
        <OrbitText
          variant="body1"
          color="rgba(255,255,255,0.55)"
          style={{ fontWeight: "300", marginTop: 6 }}
        >
          {connState === "connected" && userEmail
            ? userEmail
            : TODAY}
        </OrbitText>

        {/* Connect Gmail banner when disconnected */}
        {connState === "disconnected" && (
          <TouchableOpacity
            onPress={handleConnectGmail}
            style={styles.connectBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.connectBtnText}>Connect Gmail</Text>
          </TouchableOpacity>
        )}
        {connState === "loading" && (
          <ActivityIndicator
            color="rgba(255,255,255,0.5)"
            style={{ marginTop: spacing[4] }}
          />
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatPill label="priority" count={stats.priority} color={G.white} />
          <StatPill label="glance" count={stats.uncertain} color="rgba(255,255,255,0.5)" />
          <StatPill label="filtered" count={stats.low} color="rgba(255,255,255,0.25)" />
        </View>

        {/* Countdown / pull-early */}
        <View style={styles.countdownRow}>
          {!pulled ? (
            <>
              <OrbitText variant="caption2" color="rgba(255,255,255,0.4)">
                Next briefing in {formatted}
              </OrbitText>
              <TouchableOpacity onPress={pullEarly} style={styles.pullBtn}>
                <Text style={styles.pullBtnText}>Get it now</Text>
              </TouchableOpacity>
            </>
          ) : (
            <OrbitText variant="caption2" color="rgba(255,255,255,0.5)">
              Midday briefing pulled early ✓
            </OrbitText>
          )}
        </View>
      </View>

      {/* Body */}
      <View style={styles.content}>
        {chronological ? (
          <>
            <SectionHeader label="All Messages — Chronological" />
            {allEmails.map((email) => (
              <TouchableOpacity
                key={email.id}
                onPress={() => toggle(email.id)}
                activeOpacity={0.7}
                style={styles.chronoRow}
              >
                <View style={[styles.chronoDot, tierDotColor(email.tier)]} />
                <View style={{ flex: 1 }}>
                  <OrbitText variant="label4" color={G.black}>
                    {email.subject}
                  </OrbitText>
                  <OrbitText
                    variant="caption2"
                    color={G.muted}
                    style={{ marginTop: 2 }}
                  >
                    {email.from} · {email.category}
                  </OrbitText>
                  {expanded === email.id && (
                    <View style={{ marginTop: spacing[2] }}>
                      <OrbitText
                        variant="xSmall"
                        color={G.dark}
                        style={{ lineHeight: 20, marginBottom: spacing[2] }}
                      >
                        {email.detail}
                      </OrbitText>
                      <View style={styles.actions}>
                        <Tag
                          label={`AI: ${email.reason}`}
                          color={G.tagBg}
                          textColor={G.mid}
                        />
                        <OpenEmailChip gmailId={email.gmailId} />
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {/* Priority */}
            <Card elevation="default" style={styles.prioritySection}>
              <View style={styles.priorityHeader}>
                <View style={styles.priorityDot} />
                <OrbitText
                  variant="legal"
                  color={G.dark}
                  style={{ letterSpacing: 2, fontWeight: "600" }}
                >
                  PRIORITY
                </OrbitText>
                <View style={{ flex: 1 }} />
                <OrbitText variant="caption2" color={G.muted}>
                  {stats.priority} items
                </OrbitText>
              </View>
              {tiers.priority.map((email) => (
                <PriorityCard
                  key={email.id}
                  email={email}
                  expanded={expanded === email.id}
                  onToggle={() => toggle(email.id)}
                />
              ))}
            </Card>

            {/* Glance — grouped by category */}
            <SectionHeader label="Worth a Glance" />
            {groupByCategory(tiers.uncertain).map((group) => (
              <GlanceCategoryGroup
                key={group.category}
                category={group.category}
                emails={group.emails}
                expanded={expanded}
                onToggle={toggle}
              />
            ))}

            {/* Low — collapsed summary */}
            <LowSummaryBar
              emails={tiers.low}
              expanded={expanded}
              onToggle={toggle}
            />
          </>
        )}

        {/* Toggle link */}
        <TouchableOpacity
          onPress={() => {
            setChronological(!chronological);
            setExpanded(null);
          }}
          style={styles.toggleLink}
        >
          <OrbitText variant="label4" color={G.mid}>
            {chronological
              ? "← Back to briefing view"
              : "Switch to chronological view →"}
          </OrbitText>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </View>
    </ScrollView>
  );
}

// ─── Low-tier summary bar ─────────────────────────────

function LowSummaryBar({
  emails,
  expanded,
  onToggle,
}: {
  emails: BriefingEmail[];
  expanded: number | null;
  onToggle: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginTop: spacing[6] }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={styles.lowBar}
        activeOpacity={0.7}
      >
        <View>
          <OrbitText
            variant="xSmall"
            color={G.mid}
            style={{ fontWeight: "500" }}
          >
            {emails.length} low-priority — filtered for you
          </OrbitText>
          <OrbitText
            variant="caption2"
            color={G.light}
            style={{ marginTop: 4 }}
          >
            {emails.map((e) => e.from).join(" · ")}
          </OrbitText>
        </View>
        <Text style={styles.chevron}>{open ? "▴" : "▾"}</Text>
      </TouchableOpacity>
      {open &&
        emails.map((email) => (
          <TouchableOpacity
            key={email.id}
            onPress={() => onToggle(email.id)}
            activeOpacity={0.7}
            style={styles.lowRow}
          >
            <View style={{ flex: 1 }}>
              <OrbitText variant="label4" color={G.dark}>
                {email.subject}
              </OrbitText>
              <OrbitText
                variant="caption2"
                color={G.muted}
                style={{ marginTop: 2 }}
              >
                {email.from}
              </OrbitText>
              {expanded === email.id && (
                <View style={{ marginTop: spacing[2] }}>
                  <OrbitText
                    variant="xSmall"
                    color={G.muted}
                    style={{ lineHeight: 20 }}
                  >
                    {email.preview}
                  </OrbitText>
                  <View style={styles.actions}>
                    <Tag
                      label={`AI: ${email.reason}`}
                      color={G.tagBg}
                      textColor={G.muted}
                    />
                    <OpenEmailChip gmailId={email.gmailId} />
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────

function openEmail(gmailId?: string) {
  if (!gmailId) return;
  const url = `https://mail.google.com/mail/u/0/#inbox/${gmailId}`;
  if (Platform.OS === "web") {
    window.open(url, "_blank");
  } else {
    Linking.openURL(url);
  }
}

function OpenEmailChip({ gmailId }: { gmailId?: string }) {
  if (!gmailId) return null;
  return (
    <TouchableOpacity
      onPress={() => openEmail(gmailId)}
      activeOpacity={0.7}
      style={styles.openEmailChip}
    >
      <Text style={styles.openEmailChipText}>Open email →</Text>
    </TouchableOpacity>
  );
}

function StatPill({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <View style={styles.statPill}>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function tierDotColor(tier: string) {
  if (tier === "priority") return { backgroundColor: G.dark };
  if (tier === "uncertain") return { backgroundColor: G.muted };
  return { backgroundColor: G.light };
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bgWarm },
  masthead: {
    backgroundColor: G.black,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[10],
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing[4],
    marginTop: spacing[6],
  },
  statPill: { alignItems: "center" },
  statCount: { fontSize: 28, fontWeight: "200", lineHeight: 32 },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[5],
  },
  pullBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  pullBtnText: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  connectBtn: {
    marginTop: spacing[4],
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    alignSelf: "flex-start",
  },
  connectBtnText: {
    fontSize: 13,
    color: G.white,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  content: { paddingHorizontal: spacing[6], marginTop: -spacing[6] },
  // Priority
  prioritySection: { borderRadius: radius.lg },
  priorityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: G.dark,
  },
  priorityDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: G.dark,
    marginTop: 6,
  },
  priorityCard: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  priorityCardExpanded: { backgroundColor: G.bgWarm },
  priorityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  expandedDetail: {
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: G.line,
    gap: spacing[2],
  },
  actions: { flexDirection: "row", gap: spacing[2], marginTop: spacing[1] },
  // Glance
  glanceGroup: {
    backgroundColor: G.white,
    borderRadius: radius.md,
    marginBottom: spacing[2],
    ...shadows.cardSubtle,
  },
  glanceGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
  },
  glanceItemRow: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderTopColor: G.line,
  },
  glanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: G.muted,
    marginTop: 2,
  },
  openEmailChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    backgroundColor: G.bg,
  },
  openEmailChipText: {
    fontSize: 12,
    color: G.mid,
    fontWeight: "500",
  },
  chevron: { fontSize: 18, color: G.light },
  chevronSmall: { fontSize: 14, color: G.light, marginLeft: spacing[2] },
  chevronExpanded: { transform: [{ rotate: "180deg" }] },
  // Low
  lowBar: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    backgroundColor: G.bg,
    borderRadius: radius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lowRow: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  // Chrono
  chronoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    paddingVertical: 14,
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  chronoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  toggleLink: {
    marginTop: spacing[8],
    alignItems: "center",
    paddingVertical: spacing[4],
  },
});
