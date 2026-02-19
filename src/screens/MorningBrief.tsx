import React, { useState, useEffect } from "react";
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
import { USER_NAME, TODAY, type BriefingEmail } from "../data/briefing";
import { useCountdown } from "../hooks/useCountdown";
import { useBriefingData } from "../hooks/useBriefingData";

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
  const displayDetail = email.summary || email.detail || email.snippet;
  const displayReason = email.reason || "";
  const displayAction = email.suggestedAction;

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
            {email.from}
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
            {displayDetail}
          </OrbitText>
          {displayReason ? (
            <Tag
              label={`AI: ${displayReason}`}
              color={G.tagBg}
              textColor={G.mid}
            />
          ) : null}
          <View style={styles.actions}>
            {displayAction ? (
              <Button label={displayAction} variant="neutral" size="sm" />
            ) : null}
            <OpenEmailChip webLink={email.webLink} />
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
  const displayDetail =
    email.summary || email.detail || email.snippet;
  const displayReason = email.reason || "";

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
              {displayDetail}
            </OrbitText>
            <View style={styles.actions}>
              {displayReason ? (
                <Tag
                  label={`AI: ${displayReason}`}
                  color={G.tagBg}
                  textColor={G.mid}
                />
              ) : null}
              <OpenEmailChip webLink={email.webLink} />
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
  expanded: string | number | null;
  onToggle: (id: string | number) => void;
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
          <OrbitText
            variant="caption2"
            color={G.muted}
            style={{ marginTop: 2 }}
          >
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
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const [chronological, setChronological] = useState(false);
  const { formatted, pullEarly, pulled } = useCountdown(5 * 3600 + 30 * 60);

  const { connState, userEmail, profileStatus, sections, stats } =
    useBriefingData();

  const toggle = (id: string | number) => setExpanded(expanded === id ? null : id);

  // Build flat list for chronological view
  const allEmails: BriefingEmail[] = [
    ...sections.needsAttention,
    ...Object.values(sections.glance).flat(),
    ...sections.low,
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Masthead */}
      <View style={styles.masthead}>
        <OrbitText
          variant="legal"
          color="rgba(255,255,255,0.4)"
          style={{
            letterSpacing: 3,
            fontWeight: "600",
            marginBottom: spacing[2],
          }}
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

        {profileStatus === "building" && connState === "connected" && (
          <View style={styles.profileBuildingBanner}>
            <ActivityIndicator
              color="rgba(255,255,255,0.6)"
              size="small"
              style={{ marginRight: spacing[2] }}
            />
            <OrbitText variant="caption2" color="rgba(255,255,255,0.6)">
              Building your profile... classifications will improve shortly.
            </OrbitText>
          </View>
        )}

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatPill
            label="needs attention"
            count={stats.needsAttention}
            color={G.white}
          />
          <StatPill
            label="worth a glance"
            count={stats.glance}
            color="rgba(255,255,255,0.5)"
          />
          <StatPill
            label="filtered"
            count={stats.low}
            color="rgba(255,255,255,0.25)"
          />
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
              Midday briefing pulled early
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
                <View style={[styles.chronoDot, tierDotColor(email)]} />
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
                        style={{ lineHeight: 20, marginBottom: spacing[2] }}
                      >
                        {email.summary || email.snippet}
                      </OrbitText>
                      <View style={styles.actions}>
                        {email.reason ? (
                          <Tag
                            label={`AI: ${email.reason}`}
                            color={G.tagBg}
                            textColor={G.mid}
                          />
                        ) : null}
                        <OpenEmailChip webLink={email.webLink} />
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            {/* Needs Attention */}
            <Card elevation="default" style={styles.prioritySection}>
              <View style={styles.priorityHeader}>
                <View style={styles.priorityDot} />
                <OrbitText
                  variant="legal"
                  color={G.dark}
                  style={{ letterSpacing: 2, fontWeight: "600" }}
                >
                  NEEDS ATTENTION
                </OrbitText>
                <View style={{ flex: 1 }} />
                <OrbitText variant="caption2" color={G.muted}>
                  {stats.needsAttention} items
                </OrbitText>
              </View>
              {sections.needsAttention.map((email) => (
                <PriorityCard
                  key={email.id}
                  email={email}
                  expanded={expanded === email.id}
                  onToggle={() => toggle(email.id)}
                />
              ))}
            </Card>

            {/* Glance — grouped by category from API */}
            <SectionHeader label="Worth a Glance" />
            {Object.entries(sections.glance).map(([category, emails]) => (
              <GlanceCategoryGroup
                key={category}
                category={category}
                emails={emails}
                expanded={expanded}
                onToggle={toggle}
              />
            ))}

            {/* Low — collapsed summary */}
            <LowSummaryBar
              emails={sections.low}
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

        {/* Profile info */}
        {connState === "connected" && (
          <ProfileSection />
        )}

        <View style={{ height: 120 }} />
      </View>
    </ScrollView>
  );
}

// ─── Profile section ──────────────────────────────────

type ProfileData = {
  identity: { name?: string; email?: string; household?: string };
  coordinationCircle: { name: string; role: string; email: string }[];
  lifeThreads: { name: string; status: string; description?: string }[];
  mailboxProfile: { primaryUses: string[]; signalToNoise: string | null };
  meta: { generatedAt?: string; messagesSampled?: number };
};

function ProfileSection() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<string>("none");

  useEffect(() => {
    if (!open) return;
    const base =
      typeof window !== "undefined" && window.location.pathname.startsWith("/app")
        ? window.location.origin
        : "http://localhost:3000";
    fetch(`${base}/api/profile`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setStatus(data.status);
        setProfile(data.profile ?? null);
      })
      .catch(() => {});
  }, [open]);

  return (
    <View style={{ marginTop: spacing[4] }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
        style={styles.profileToggle}
      >
        <OrbitText variant="caption2" color={G.light}>
          {open ? "Hide profile" : "Your profile"}
        </OrbitText>
      </TouchableOpacity>
      {open && (
        <View style={styles.profilePanel}>
          {status === "building" && (
            <OrbitText variant="caption2" color={G.muted} style={{ marginBottom: spacing[3] }}>
              Profile is still building...
            </OrbitText>
          )}
          {status === "none" && (
            <OrbitText variant="caption2" color={G.muted}>
              No profile yet. It will be created on your next briefing refresh.
            </OrbitText>
          )}
          {profile && (
            <>
              {profile.identity.name && (
                <View style={styles.profileBlock}>
                  <OrbitText variant="caption2" color={G.light} style={styles.profileLabel}>
                    IDENTITY
                  </OrbitText>
                  <OrbitText variant="label4" color={G.dark}>
                    {profile.identity.name}
                  </OrbitText>
                  {profile.identity.household && (
                    <OrbitText variant="caption2" color={G.muted} style={{ marginTop: 2 }}>
                      {profile.identity.household}
                    </OrbitText>
                  )}
                </View>
              )}

              {profile.coordinationCircle.length > 0 && (
                <View style={styles.profileBlock}>
                  <OrbitText variant="caption2" color={G.light} style={styles.profileLabel}>
                    KEY PEOPLE
                  </OrbitText>
                  {profile.coordinationCircle.map((p, i) => (
                    <OrbitText key={i} variant="xSmall" color={G.dark} style={{ lineHeight: 20 }}>
                      {p.name} — {p.role}
                    </OrbitText>
                  ))}
                </View>
              )}

              {profile.lifeThreads.length > 0 && (
                <View style={styles.profileBlock}>
                  <OrbitText variant="caption2" color={G.light} style={styles.profileLabel}>
                    LIFE THREADS
                  </OrbitText>
                  {profile.lifeThreads.map((t, i) => (
                    <View key={i} style={{ marginBottom: 4 }}>
                      <OrbitText variant="xSmall" color={G.dark}>
                        {t.name}
                        <OrbitText variant="caption2" color={G.muted}>
                          {" "}({t.status})
                        </OrbitText>
                      </OrbitText>
                      {t.description && (
                        <OrbitText variant="caption2" color={G.muted} style={{ marginTop: 1 }}>
                          {t.description}
                        </OrbitText>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {profile.meta.generatedAt && (
                <OrbitText variant="caption2" color={G.light} style={{ marginTop: spacing[2] }}>
                  Built {new Date(profile.meta.generatedAt).toLocaleDateString()} from {profile.meta.messagesSampled} emails
                </OrbitText>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Low-tier summary bar ─────────────────────────────

function LowSummaryBar({
  emails,
  expanded,
  onToggle,
}: {
  emails: BriefingEmail[];
  expanded: string | number | null;
  onToggle: (id: string | number) => void;
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
            {emails
              .slice(0, 5)
              .map((e) => e.from)
              .join(" · ")}
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
                    {email.snippet}
                  </OrbitText>
                  <View style={styles.actions}>
                    {email.reason ? (
                      <Tag
                        label={`AI: ${email.reason}`}
                        color={G.tagBg}
                        textColor={G.muted}
                      />
                    ) : null}
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

function tierDotColor(email: BriefingEmail) {
  // Determine tier from which section the email is in
  // Since we flatten all emails, use urgencyType as a proxy
  if (email.urgencyType) return { backgroundColor: G.dark };
  if (email.glanceCategory) return { backgroundColor: G.muted };
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
  profileBuildingBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: radius.sm,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing[4],
    marginTop: spacing[6],
  },
  statPill: { alignItems: "center" },
  statCount: { fontSize: 28, fontWeight: "200", lineHeight: 32 },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    marginTop: 2,
  },
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
  content: { paddingHorizontal: spacing[6], marginTop: -spacing[6] },
  // Priority / Needs Attention
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
  // Profile
  profileToggle: {
    alignItems: "center",
    paddingVertical: spacing[3],
  },
  profilePanel: {
    backgroundColor: G.white,
    borderRadius: radius.md,
    padding: spacing[5],
    marginTop: spacing[2],
    ...shadows.cardSubtle,
  },
  profileBlock: {
    marginBottom: spacing[4],
  },
  profileLabel: {
    letterSpacing: 1.5,
    fontWeight: "600" as const,
    marginBottom: spacing[1],
  },
});
