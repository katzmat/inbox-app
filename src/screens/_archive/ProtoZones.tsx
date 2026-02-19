// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Platform,
  Modal,
  Animated,
} from "react-native";
import {
  OrbitText,
  Card,
  Tag,
  SectionHeader,
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
import { usePinnedEmails } from "../hooks/usePinnedEmails";
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

// ─── Helpers ──────────────────────────────────────────

function openEmail(webLink?: string) {
  if (!webLink) return;
  if (Platform.OS === "web") {
    window.open(webLink, "_blank");
  } else {
    Linking.openURL(webLink);
  }
}

function OpenEmailChip({ webLink }: { webLink?: string }) {
  if (!webLink) return null;
  return (
    <TouchableOpacity
      onPress={() => openEmail(webLink)}
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

/** Inline sender summary for glance bundles — flowing text like "Day Early Learning · Julian · ..." */
function SenderSummary({ emails }: { emails: BriefingEmail[] }) {
  const names = emails.map((e) => e.from);
  return (
    <Text style={styles.senderSummaryText}>
      {"  "}{names.join(" · ")}
    </Text>
  );
}

/** Pulsing dot for NOW zone */
function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);
  return (
    <Animated.View style={[styles.pulsingDot, { opacity }]} />
  );
}

// ─── Sub-components ───────────────────────────────────

function PriorityCard({
  email,
  expanded,
  onToggle,
  onLongPress,
}: {
  email: BriefingEmail;
  expanded: boolean;
  onToggle: () => void;
  onLongPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      onLongPress={onLongPress}
      delayLongPress={500}
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
            <TouchableOpacity style={styles.suggestedActionBtn} activeOpacity={0.7}>
              <Text style={styles.suggestedActionText}>{email.suggestedAction}</Text>
            </TouchableOpacity>
            <OpenEmailChip webLink={email.webLink} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function NowCard({
  email,
  expanded,
  onToggle,
  onLongPress,
}: {
  email: BriefingEmail;
  expanded: boolean;
  onToggle: () => void;
  onLongPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.7}
      style={styles.nowCard}
    >
      <View style={styles.nowCardRow}>
        <PulsingDot />
        <View style={{ flex: 1 }}>
          <OrbitText variant="label2" color={G.black}>
            {email.subject}
          </OrbitText>
          <OrbitText
            variant="caption2"
            color={G.muted}
            style={{ marginTop: 3 }}
          >
            {email.from}
          </OrbitText>
        </View>
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
            <OpenEmailChip webLink={email.webLink} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

function GlanceBundle({
  category,
  emails,
  expanded,
  onToggle,
  onLongPress,
}: {
  category: string;
  emails: BriefingEmail[];
  expanded: number | null;
  onToggle: (id: number) => void;
  onLongPress: (email: BriefingEmail) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.glanceGroup}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
        style={styles.glanceGroupHeader}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.glanceHeaderLine}>
            <Text style={styles.glanceCategoryBold}>
              {category} ({emails.length})
            </Text>
            <SenderSummary emails={emails} />
          </Text>
        </View>
        <Text style={styles.chevronSmall}>{open ? "▴" : "▾"}</Text>
      </TouchableOpacity>
      {open &&
        emails.map((email) => (
          <TouchableOpacity
            key={email.id}
            onPress={() => onToggle(email.id)}
            onLongPress={() => onLongPress(email)}
            delayLongPress={500}
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
              {expanded === email.id && (
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
                    <OpenEmailChip webLink={email.webLink} />
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

function LowSummaryBar({
  emails,
  expanded,
  onToggle,
  onLongPress,
}: {
  emails: BriefingEmail[];
  expanded: number | null;
  onToggle: (id: number) => void;
  onLongPress: (email: BriefingEmail) => void;
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
            onLongPress={() => onLongPress(email)}
            delayLongPress={500}
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
                    <OpenEmailChip webLink={email.webLink} />
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

/** Pinned email row in the DOING zone */
function PinnedRow({
  email,
  expanded,
  onToggle,
  onRemove,
}: {
  email: BriefingEmail;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <View style={styles.pinnedRow}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={{ flex: 1 }}
      >
        <View style={styles.pinnedRowInner}>
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
          </View>
          <TouchableOpacity onPress={onRemove} activeOpacity={0.7} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>×</Text>
          </TouchableOpacity>
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
              <OpenEmailChip webLink={email.webLink} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Catchup Overlay ─────────────────────────────────
// Phase 1: surfaced + priority items one at a time as cards
// Phase 2: glance categories as a batch — all selected by default, deselect to keep

type CatchupPhase = "cards" | "glance" | "done";

function CatchupOverlay({
  visible,
  surfacedEmails,
  priorityEmails,
  glanceGroups,
  onClose,
  onPin,
}: {
  visible: boolean;
  surfacedEmails: BriefingEmail[];
  priorityEmails: BriefingEmail[];
  glanceGroups: { category: string; emails: BriefingEmail[] }[];
  onClose: () => void;
  onPin: (email: BriefingEmail) => void;
}) {
  const allCards = [...surfacedEmails, ...priorityEmails];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<CatchupPhase>("cards");
  // Glance: individual emails saved (kept) by ID
  const [keptEmails, setKeptEmails] = useState<Set<number>>(new Set());
  // Which category is drilled-down (expanded) — null = bundle view
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      setPhase(allCards.length > 0 ? "cards" : glanceGroups.length > 0 ? "glance" : "done");
      setKeptEmails(new Set());
      setExpandedCategory(null);
    }
  }, [visible]);

  const total = allCards.length;
  const email = allCards[currentIndex];

  const advance = () => {
    if (currentIndex + 1 >= total) {
      setPhase(glanceGroups.length > 0 ? "glance" : "done");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const toggleKeepEmail = (id: number) => {
    setKeptEmails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Count kept emails in a category
  const keptInCategory = (emails: BriefingEmail[]) =>
    emails.filter((e) => keptEmails.has(e.id)).length;

  if (!visible) return null;

  const progressPct =
    phase === "done"
      ? 100
      : phase === "glance"
        ? ((total) / (total + 1)) * 100
        : total > 0
          ? (currentIndex / (total + (glanceGroups.length > 0 ? 1 : 0))) * 100
          : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={qfStyles.overlay}>
        <View style={qfStyles.container}>
          {/* Header */}
          <View style={qfStyles.header}>
            <OrbitText
              variant="legal"
              color={G.muted}
              style={{ letterSpacing: 2, fontWeight: "600" }}
            >
              CATCHUP
            </OrbitText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={qfStyles.closeBtn}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={qfStyles.progressTrack}>
            <View
              style={[
                qfStyles.progressFill,
                { width: `${progressPct}%` },
              ]}
            />
          </View>

          {phase === "done" ? (
            <View style={qfStyles.doneContainer}>
              <OrbitText variant="title3" color={G.dark} style={{ fontWeight: "300" }}>
                All caught up.
              </OrbitText>
              <OrbitText
                variant="body1"
                color={G.muted}
                style={{ marginTop: spacing[2] }}
              >
                You've reviewed everything.
              </OrbitText>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={qfStyles.doneBtn}
              >
                <Text style={qfStyles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : phase === "glance" ? (
            /* Phase 2: Glance categories — batch with drill-down */
            <ScrollView style={{ marginTop: spacing[4] }} showsVerticalScrollIndicator={false}>
              {expandedCategory ? (
                /* Drill-down: individual emails in a category */
                <>
                  <TouchableOpacity
                    onPress={() => setExpandedCategory(null)}
                    activeOpacity={0.7}
                    style={{ marginBottom: spacing[3] }}
                  >
                    <OrbitText variant="label4" color={G.muted}>
                      ← Back to bundles
                    </OrbitText>
                  </TouchableOpacity>
                  <OrbitText variant="label3" color={G.dark} style={{ marginBottom: spacing[1] }}>
                    {expandedCategory}
                  </OrbitText>
                  <OrbitText variant="caption2" color={G.muted} style={{ marginBottom: spacing[3] }}>
                    Tap any to save for later. The rest are handled.
                  </OrbitText>
                  {glanceGroups
                    .find((g) => g.category === expandedCategory)
                    ?.emails.map((e) => {
                      const kept = keptEmails.has(e.id);
                      return (
                        <TouchableOpacity
                          key={e.id}
                          onPress={() => toggleKeepEmail(e.id)}
                          activeOpacity={0.7}
                          style={[qfStyles.glanceRow, kept && qfStyles.glanceRowKept]}
                        >
                          <View
                            style={[
                              qfStyles.glanceCheck,
                              kept ? qfStyles.glanceCheckKept : qfStyles.glanceCheckHandled,
                            ]}
                          >
                            {!kept && <Text style={qfStyles.glanceCheckMark}>✓</Text>}
                          </View>
                          <View style={{ flex: 1 }}>
                            <OrbitText variant="label4" color={kept ? G.dark : G.muted}>
                              {e.subject}
                            </OrbitText>
                            <OrbitText variant="caption2" color={G.light} style={{ marginTop: 2 }}>
                              {e.from}
                            </OrbitText>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </>
              ) : (
                /* Bundle view */
                <>
                  <OrbitText variant="label3" color={G.dark} style={{ marginBottom: spacing[1] }}>
                    Worth a Glance
                  </OrbitText>
                  <OrbitText variant="caption2" color={G.muted} style={{ marginBottom: spacing[4] }}>
                    All handled by default. Tap a bundle to save individual messages.
                  </OrbitText>
                  {glanceGroups.map((group) => {
                    const keptCount = keptInCategory(group.emails);
                    return (
                      <TouchableOpacity
                        key={group.category}
                        onPress={() => setExpandedCategory(group.category)}
                        activeOpacity={0.7}
                        style={[qfStyles.glanceRow, keptCount > 0 && qfStyles.glanceRowKept]}
                      >
                        <View
                          style={[
                            qfStyles.glanceCheck,
                            keptCount > 0 ? qfStyles.glanceCheckKept : qfStyles.glanceCheckHandled,
                          ]}
                        >
                          {keptCount === 0 && <Text style={qfStyles.glanceCheckMark}>✓</Text>}
                          {keptCount > 0 && (
                            <Text style={{ fontSize: 10, color: G.muted, fontWeight: "600" }}>
                              {keptCount}
                            </Text>
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.glanceHeaderLine}>
                            <Text style={styles.glanceCategoryBold}>
                              {group.category} ({group.emails.length})
                            </Text>
                            <Text style={styles.senderSummaryText}>
                              {"  "}{group.emails.map((e) => e.from).join(" · ")}
                            </Text>
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14, color: G.light }}>›</Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              <TouchableOpacity
                onPress={() => setPhase("done")}
                activeOpacity={0.7}
                style={[qfStyles.primaryAction, { marginTop: spacing[5] }]}
              >
                <Text style={qfStyles.primaryActionText}>
                  {keptEmails.size > 0
                    ? `Done — saving ${keptEmails.size}`
                    : "All handled"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : email ? (
            /* Phase 1: Individual cards */
            <View style={qfStyles.cardArea}>
              <OrbitText variant="caption2" color={G.muted} style={{ marginTop: 6 }}>
                {currentIndex + 1} of {total}
              </OrbitText>
              <View style={qfStyles.card}>
                {currentIndex < surfacedEmails.length && (
                  <OrbitText
                    variant="legal"
                    color={G.muted}
                    style={{ letterSpacing: 1, fontWeight: "500", marginBottom: spacing[1] }}
                  >
                    SURFACED
                  </OrbitText>
                )}
                <OrbitText variant="label2" color={G.black}>
                  {email.subject}
                </OrbitText>
                <OrbitText
                  variant="caption2"
                  color={G.muted}
                  style={{ marginTop: 4 }}
                >
                  {email.from} · {email.category}
                </OrbitText>
                <OrbitText
                  variant="label4"
                  color={G.dark}
                  style={{ lineHeight: 22, marginTop: spacing[4] }}
                >
                  {email.detail}
                </OrbitText>
                <Tag
                  label={`AI: ${email.reason}`}
                  color={G.tagBg}
                  textColor={G.mid}
                />
                <OpenEmailChip webLink={email.webLink} />
              </View>

              <View style={qfStyles.actionRow}>
                <TouchableOpacity
                  onPress={() => advance()}
                  activeOpacity={0.7}
                  style={qfStyles.primaryAction}
                >
                  <Text style={qfStyles.primaryActionText}>
                    {email.suggestedAction}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={qfStyles.secondaryRow}>
                <TouchableOpacity
                  onPress={() => advance()}
                  activeOpacity={0.7}
                  style={qfStyles.secondaryAction}
                >
                  <Text style={qfStyles.secondaryActionText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (email) onPin(email);
                    advance();
                  }}
                  activeOpacity={0.7}
                  style={qfStyles.secondaryAction}
                >
                  <Text style={qfStyles.secondaryActionText}>Pin to Station</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────

export default function ProtoZones() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [quickflowOpen, setQuickflowOpen] = useState(false);
  const { formatted, pullEarly, pulled } = useCountdown(5 * 3600 + 30 * 60);

  const { connState, userEmail, briefing, tiers, stats } =
    useBriefingData();

  const { pinned, togglePin, removePin } = usePinnedEmails();

  const toggle = (id: number) =>
    setExpanded(expanded === id ? null : id);

  // Timely emails for NOW zone: priority tier + Timely category
  const timelyEmails = tiers.priority.filter((e) => e.category === "Timely");
  // Non-timely priority for YOUR BRIEF
  const briefPriority = tiers.priority.filter((e) => e.category !== "Timely");

  return (
    <View style={{ flex: 1, backgroundColor: G.bgWarm }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ═══ MASTHEAD ═══ */}
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
            {connState === "connected" && userEmail ? userEmail : TODAY}
          </OrbitText>

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

          {/* Countdown */}
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
                Midday briefing pulled early
              </OrbitText>
            )}
          </View>
        </View>

        {/* ═══ BODY ═══ */}
        <View style={styles.content}>

          {/* ─── SURFACED ─── */}
          <View style={styles.zoneHeader}>
            <OrbitText
              variant="legal"
              color={G.dark}
              style={{ letterSpacing: 2, fontWeight: "600" }}
            >
              SURFACED
            </OrbitText>
          </View>
          {timelyEmails.length > 0 ? (
            <View style={styles.surfacedStack}>
              <OrbitText
                variant="caption2"
                color={G.muted}
                style={{ marginBottom: spacing[3] }}
              >
                Arrived since your last brief
              </OrbitText>
              {timelyEmails.map((email, i) => (
                <View
                  key={email.id}
                  style={[
                    styles.surfacedCard,
                    i < timelyEmails.length - 1 && styles.surfacedCardStacked,
                  ]}
                >
                  <NowCard
                    email={email}
                    expanded={expanded === email.id}
                    onToggle={() => toggle(email.id)}
                    onLongPress={() => togglePin(email)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.allClearBox}>
              <OrbitText variant="label4" color={G.muted}>
                All clear — nothing surfaced since your last brief.
              </OrbitText>
            </View>
          )}

          {/* ─── YOUR BRIEF ZONE ─── */}
          <View style={[styles.zoneHeader, { marginTop: spacing[8] }]}>
            <OrbitText
              variant="legal"
              color={G.dark}
              style={{ letterSpacing: 2, fontWeight: "600" }}
            >
              YOUR BRIEF
            </OrbitText>
          </View>

          {/* Priority cards */}
          {briefPriority.length > 0 && (
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
                  {briefPriority.length} items
                </OrbitText>
              </View>
              {briefPriority.map((email) => (
                <PriorityCard
                  key={email.id}
                  email={email}
                  expanded={expanded === email.id}
                  onToggle={() => toggle(email.id)}
                  onLongPress={() => togglePin(email)}
                />
              ))}
            </Card>
          )}

          {/* Glance bundles */}
          <SectionHeader label="Worth a Glance" />
          {groupByCategory(tiers.uncertain).map((group) => (
            <GlanceBundle
              key={group.category}
              category={group.category}
              emails={group.emails}
              expanded={expanded}
              onToggle={toggle}
              onLongPress={togglePin}
            />
          ))}

          {/* Low summary */}
          <LowSummaryBar
            emails={tiers.low}
            expanded={expanded}
            onToggle={toggle}
            onLongPress={togglePin}
          />

          {/* ─── STATION ─── */}
          <View style={[styles.zoneHeader, { marginTop: spacing[8] }]}>
            <OrbitText
              variant="legal"
              color={G.dark}
              style={{ letterSpacing: 2, fontWeight: "600" }}
            >
              STATION
            </OrbitText>
          </View>
          {pinned.length > 0 ? (
            <Card elevation="default" style={styles.stationSection}>
              {pinned.map((email) => (
                <PinnedRow
                  key={email.id}
                  email={email}
                  expanded={expanded === email.id}
                  onToggle={() => toggle(email.id)}
                  onRemove={() => removePin(email.id)}
                />
              ))}
            </Card>
          ) : (
            <View style={styles.stationEmpty}>
              <OrbitText variant="label4" color={G.light}>
                Nothing pinned yet
              </OrbitText>
              <OrbitText
                variant="caption2"
                color={G.light}
                style={{ marginTop: 4 }}
              >
                Long-press any email to pin it here.
              </OrbitText>
            </View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Floating catchup button */}
      {(timelyEmails.length > 0 || briefPriority.length > 0 || tiers.uncertain.length > 0) && (
        <TouchableOpacity
          onPress={() => setQuickflowOpen(true)}
          activeOpacity={0.8}
          style={styles.fab}
        >
          <Text style={styles.fabIcon}>↻</Text>
          <Text style={styles.fabLabel}>Catchup</Text>
        </TouchableOpacity>
      )}

      {/* Catchup overlay */}
      <CatchupOverlay
        visible={quickflowOpen}
        surfacedEmails={timelyEmails}
        priorityEmails={briefPriority}
        glanceGroups={groupByCategory(tiers.uncertain)}
        onClose={() => setQuickflowOpen(false)}
        onPin={togglePin}
      />
    </View>
  );
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
  pullBtnText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
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

  // Zone headers
  zoneHeader: {
    marginTop: spacing[8],
    marginBottom: spacing[3],
    paddingBottom: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },

  // Surfaced zone
  surfacedStack: {
    paddingHorizontal: spacing[1],
  },
  surfacedCard: {
    backgroundColor: G.white,
    borderRadius: radius.lg,
    ...shadows.cardSubtle,
  },
  surfacedCardStacked: {
    marginBottom: spacing[2],
  },
  nowCard: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
  },
  nowCardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: G.dark,
    marginTop: 6,
  },
  allClearBox: {
    backgroundColor: G.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
    alignItems: "center",
    ...shadows.cardSubtle,
  },

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
  suggestedActionBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.sm,
    backgroundColor: G.dark,
  },
  suggestedActionText: {
    fontSize: 12,
    color: G.white,
    fontWeight: "500",
  },

  // Floating catchup button
  fab: {
    position: "absolute",
    bottom: 28,
    right: 20,
    backgroundColor: G.dark,
    borderRadius: 24,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1.5],
    ...shadows.card,
  },
  fabIcon: {
    fontSize: 16,
    color: G.white,
    fontWeight: "600",
  },
  fabLabel: {
    fontSize: 13,
    color: G.white,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

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
  // Glance inline senders
  glanceHeaderLine: {
    fontSize: 14,
    lineHeight: 20,
  },
  glanceCategoryBold: {
    fontWeight: "700" as const,
    color: G.dark,
    fontSize: 14,
  },
  senderSummaryText: {
    fontWeight: "400" as const,
    color: G.light,
    fontSize: 14,
  },

  // Open email chip
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

  // Chevrons
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

  // STATION zone
  stationSection: { borderRadius: radius.lg },
  stationEmpty: {
    backgroundColor: G.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    alignItems: "center",
    borderWidth: 1,
    borderColor: G.line,
    borderStyle: "dashed",
  },
  pinnedRow: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  pinnedRowInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: G.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: {
    fontSize: 16,
    color: G.muted,
    fontWeight: "600",
    lineHeight: 18,
  },
});

// ─── Quickflow Styles ─────────────────────────────────

const qfStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: G.white,
    borderRadius: radius.lg,
    width: "92%",
    maxWidth: 420,
    maxHeight: "90%",
    padding: spacing[6],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[4],
  },
  closeBtn: {
    fontSize: 24,
    color: G.light,
    fontWeight: "300",
    lineHeight: 24,
  },
  progressTrack: {
    height: 3,
    backgroundColor: G.faint,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: G.dark,
    borderRadius: 2,
  },
  cardArea: {
    marginTop: spacing[6],
    flex: 1,
  },
  card: {
    backgroundColor: G.bgWarm,
    borderRadius: radius.md,
    padding: spacing[5],
    gap: spacing[3],
  },
  actionRow: {
    marginTop: spacing[5],
  },
  primaryAction: {
    backgroundColor: G.dark,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
  },
  primaryActionText: {
    fontSize: 14,
    color: G.white,
    fontWeight: "600",
  },
  secondaryRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[4],
    marginTop: spacing[3],
  },
  secondaryAction: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  secondaryActionText: {
    fontSize: 13,
    color: G.muted,
    fontWeight: "500",
  },
  doneContainer: {
    marginTop: spacing[8],
    alignItems: "center",
    paddingBottom: spacing[4],
  },
  doneBtn: {
    marginTop: spacing[6],
    backgroundColor: G.dark,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[8],
  },
  doneBtnText: {
    fontSize: 14,
    color: G.white,
    fontWeight: "600",
  },
  // Glance batch phase
  glanceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  glanceRowKept: {
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  glanceCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  glanceCheckHandled: {
    backgroundColor: G.dark,
  },
  glanceCheckKept: {
    borderWidth: 1.5,
    borderColor: G.light,
    backgroundColor: "transparent",
  },
  glanceCheckMark: {
    fontSize: 12,
    color: G.white,
    fontWeight: "600",
    lineHeight: 14,
  },
});
