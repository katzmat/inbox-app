/**
 * BriefingStateSheet — renders every interactive state of ConceptLifeThreads
 * as labeled, static frames for easy export to Figma.
 *
 * Open at /statesheet in the browser, then screenshot or copy-paste into Figma.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrbitText, spacing, radius, shadows } from "../../orbit-ds";
import { useBriefingData } from "../hooks/useBriefingData";
import { USER_NAME } from "../data/briefing";
import type { BriefingEmail } from "../data/briefing";

// --- Greyscale palette (matches ConceptLifeThreads) ---
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

type LifeThread = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  emails: BriefingEmail[];
};

function buildLifeThreads(sections: {
  needsAttention: BriefingEmail[];
  glance: Record<string, BriefingEmail[]>;
  low: BriefingEmail[];
}): LifeThread[] {
  const threads: LifeThread[] = [];
  const allEmails = [
    ...sections.needsAttention,
    ...Object.values(sections.glance).flat(),
    ...sections.low,
  ];
  const personalDomains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com"];
  const people = allEmails.filter((e) => {
    const match = e.fromFull?.match(/@([^\s>]+)/);
    return match && personalDomains.some((d) => match[1].toLowerCase().includes(d));
  });
  if (people.length > 0) threads.push({ id: "people", label: "People", icon: "people-outline", color: "#5B5EA6", emails: people });
  const school = Object.entries(sections.glance).filter(([cat]) => cat.includes("School") || cat.includes("Kids")).flatMap(([, e]) => e);
  if (school.length > 0) threads.push({ id: "kids", label: "Kids & School", icon: "school-outline", color: "#E07A5F", emails: school });
  const money = [
    ...Object.entries(sections.glance).filter(([cat]) => cat.includes("Purchase") || cat.includes("Payment")).flatMap(([, e]) => e),
    ...allEmails.filter((e) => e.reason?.toLowerCase().includes("payment") || e.reason?.toLowerCase().includes("bill") || e.subject.toLowerCase().includes("payment") || e.subject.toLowerCase().includes("invoice")),
  ];
  const moneyDeduped = [...new Map(money.map((e) => [e.id, e])).values()];
  if (moneyDeduped.length > 0) threads.push({ id: "money", label: "Money & Bills", icon: "card-outline", color: "#3D405B", emails: moneyDeduped });
  const home = allEmails.filter((e) => e.reason?.toLowerCase().includes("home") || e.reason?.toLowerCase().includes("contractor") || e.subject.toLowerCase().includes("delivery") || e.subject.toLowerCase().includes("shipping") || e.glanceCategory?.includes("Shipping"));
  if (home.length > 0) threads.push({ id: "home", label: "Home & Errands", icon: "home-outline", color: "#81B29A", emails: home });
  const calendar = Object.entries(sections.glance).filter(([cat]) => cat.includes("Calendar") || cat.includes("Event")).flatMap(([, e]) => e);
  if (calendar.length > 0) threads.push({ id: "calendar", label: "Calendar & Events", icon: "calendar-outline", color: "#F2CC8F", emails: calendar });
  const reads = [
    ...Object.entries(sections.glance).filter(([cat]) => cat.includes("Newsletter")).flatMap(([, e]) => e),
    ...sections.low.filter((e) => e.reason?.toLowerCase().includes("newsletter") || e.category === "Newsletter"),
  ];
  const readsDeduped = [...new Map(reads.map((e) => [e.id, e])).values()];
  if (readsDeduped.length > 0) threads.push({ id: "reads", label: "News & Reads", icon: "newspaper-outline", color: "#6D6875", emails: readsDeduped });
  const assignedIds = new Set(threads.flatMap((t) => t.emails.map((e) => e.id)));
  const noise = sections.low.filter((e) => !assignedIds.has(e.id));
  if (noise.length > 0) threads.push({ id: "noise", label: "Noise", icon: "volume-mute-outline", color: "#bbb", emails: noise });
  return threads;
}

// ─── Reusable sub-components (static, no interactivity) ───

function Header({ total }: { total: number }) {
  return (
    <View style={cs.header}>
      <OrbitText variant="title2" color={G.black}>Your Life</OrbitText>
      <Text style={cs.headerSub}>{total} emails organized by what matters</Text>
    </View>
  );
}

function UrgentBannerCollapsed({ count }: { count: number }) {
  return (
    <View style={cs.urgentBanner}>
      <Ionicons name="alert-circle" size={18} color={G.white} />
      <Text style={cs.urgentText}>
        {count} thing{count !== 1 ? "s" : ""} need{count === 1 ? "s" : ""} your attention today
      </Text>
      <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>▾</Text>
    </View>
  );
}

function UrgentBannerExpanded({ count, emails }: { count: number; emails: BriefingEmail[] }) {
  return (
    <View>
      <View style={cs.urgentBanner}>
        <Ionicons name="alert-circle" size={18} color={G.white} />
        <Text style={[cs.urgentText, { flex: 1 }]}>
          {count} thing{count !== 1 ? "s" : ""} need{count === 1 ? "s" : ""} your attention today
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>▴</Text>
      </View>
      <View style={cs.urgentList}>
        {emails.map((email) => (
          <View key={email.id} style={cs.urgentItem}>
            <View style={{ flex: 1 }}>
              <Text style={cs.urgentFrom}>{email.from}</Text>
              <Text style={cs.urgentSubject}>{email.subject}</Text>
              {email.reason && <Text style={cs.urgentReason}>{email.reason}</Text>}
              {email.suggestedAction && <Text style={cs.urgentAction}>→ {email.suggestedAction}</Text>}
            </View>
            <Ionicons name="open-outline" size={14} color={G.muted} />
          </View>
        ))}
      </View>
    </View>
  );
}

function ThreadCardCollapsed({ thread }: { thread: LifeThread }) {
  return (
    <View style={cs.threadCard}>
      <View style={cs.threadHeader}>
        <View style={[cs.threadIcon, { backgroundColor: thread.color + "18" }]}>
          <Ionicons name={thread.icon} size={20} color={thread.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={cs.threadLabel}>{thread.label}</Text>
          <Text style={cs.threadCount}>{thread.emails.length} email{thread.emails.length !== 1 ? "s" : ""}</Text>
        </View>
        <Text style={cs.chevron}>▾</Text>
      </View>
      {thread.emails[0] && (
        <Text style={cs.threadPreview} numberOfLines={1}>
          {thread.emails[0].from}: {thread.emails[0].subject}
        </Text>
      )}
    </View>
  );
}

function ThreadCardExpanded({ thread }: { thread: LifeThread }) {
  return (
    <View style={cs.threadCard}>
      <View style={cs.threadHeader}>
        <View style={[cs.threadIcon, { backgroundColor: thread.color + "18" }]}>
          <Ionicons name={thread.icon} size={20} color={thread.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={cs.threadLabel}>{thread.label}</Text>
          <Text style={cs.threadCount}>{thread.emails.length} email{thread.emails.length !== 1 ? "s" : ""}</Text>
        </View>
        <Text style={[cs.chevron, { transform: [{ rotate: "180deg" }] }]}>▾</Text>
      </View>
      <View style={cs.threadEmails}>
        {thread.emails.map((email) => (
          <View key={email.id} style={cs.threadEmailRow}>
            <View style={[cs.dot, { backgroundColor: thread.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={cs.emailFrom}>{email.from}</Text>
              <Text style={cs.emailSubject} numberOfLines={1}>{email.subject}</Text>
              {email.reason && <Text style={cs.emailReason} numberOfLines={1}>{email.reason}</Text>}
            </View>
            <Ionicons name="open-outline" size={14} color={G.light} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Frame wrapper with label ───

function Frame({ label, description, width, children }: { label: string; description: string; width?: number; children: React.ReactNode }) {
  return (
    <View style={[fs.frame, width ? { width } : undefined]}>
      <View style={fs.labelRow}>
        <Text style={fs.label}>{label}</Text>
        <Text style={fs.desc}>{description}</Text>
      </View>
      <View style={[fs.phone, width ? { width: width - 48 } : undefined]}>
        {children}
      </View>
    </View>
  );
}

// ─── Main State Sheet ───

export default function BriefingStateSheet() {
  const { connState, sections, stats } = useBriefingData();

  if (connState === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#e8e8e8" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, color: G.muted }}>Loading email data for state sheet...</Text>
      </View>
    );
  }

  const threads = buildLifeThreads(sections);
  const urgentCount = sections.needsAttention.length;

  return (
    <ScrollView style={ss.root} contentContainerStyle={ss.content} horizontal={false}>
      {/* Title */}
      <Text style={ss.title}>Briefing State Sheet</Text>
      <Text style={ss.subtitle}>
        ConceptLifeThreads.tsx — all interactive states rendered statically for Figma export
      </Text>

      {/* Row 1: Loading + Default */}
      <Text style={ss.rowLabel}>Core States</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.row}>
        <Frame label="1. Loading" description="Initial load spinner" width={393}>
          <View style={[cs.container, { height: 600, alignItems: "center", justifyContent: "center" }]}>
            <ActivityIndicator color={G.muted} />
          </View>
        </Frame>

        <Frame label="2. Default — All Collapsed" description="Urgent banner + thread cards with previews" width={393}>
          <View style={cs.container}>
            <Header total={stats.total} />
            {urgentCount > 0 && (
              <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[3] }}>
                <UrgentBannerCollapsed count={urgentCount} />
              </View>
            )}
            <View style={cs.threadList}>
              {threads.map((thread) => (
                <ThreadCardCollapsed key={thread.id} thread={thread} />
              ))}
            </View>
          </View>
        </Frame>
      </ScrollView>

      {/* Row 2: Urgent states */}
      <Text style={ss.rowLabel}>Urgent Banner States</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.row}>
        <Frame label="3. Urgent — Collapsed" description="Banner shows count, chevron pointing down" width={393}>
          <View style={cs.container}>
            <Header total={stats.total} />
            <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[3] }}>
              <UrgentBannerCollapsed count={urgentCount || 3} />
            </View>
            <View style={cs.threadList}>
              {threads.slice(0, 2).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
            </View>
          </View>
        </Frame>

        <Frame label="4. Urgent — Expanded" description="Banner open with needs-attention email list" width={393}>
          <View style={cs.container}>
            <Header total={stats.total} />
            <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[3] }}>
              <UrgentBannerExpanded count={urgentCount || 3} emails={sections.needsAttention} />
            </View>
            <View style={cs.threadList}>
              {threads.slice(0, 2).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
            </View>
          </View>
        </Frame>
      </ScrollView>

      {/* Row 3: Thread card states */}
      <Text style={ss.rowLabel}>Thread Card States</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.row}>
        <Frame label="5. Thread — Collapsed" description="Icon, label, count, single-line preview" width={393}>
          <View style={{ padding: spacing[5], gap: spacing[3], backgroundColor: G.bg }}>
            {threads.slice(0, 3).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
          </View>
        </Frame>

        <Frame label="6. Thread — Expanded (Single)" description="One thread open showing all emails" width={393}>
          <View style={{ padding: spacing[5], gap: spacing[3], backgroundColor: G.bg }}>
            {threads[0] && <ThreadCardExpanded thread={threads[0]} />}
            {threads.slice(1, 3).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
          </View>
        </Frame>

        <Frame label="7. Threads — Multiple Expanded" description="Several threads open simultaneously" width={393}>
          <View style={{ padding: spacing[5], gap: spacing[3], backgroundColor: G.bg }}>
            {threads[0] && <ThreadCardExpanded thread={threads[0]} />}
            {threads[1] && <ThreadCardExpanded thread={threads[1]} />}
            {threads.slice(2, 4).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
          </View>
        </Frame>
      </ScrollView>

      {/* Row 4: Full screen compositions */}
      <Text style={ss.rowLabel}>Full Screen Compositions</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ss.row}>
        <Frame label="8. Full — Default Flow" description="How a user first sees the screen" width={393}>
          <View style={cs.container}>
            <Header total={stats.total} />
            {urgentCount > 0 && (
              <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[3] }}>
                <UrgentBannerCollapsed count={urgentCount} />
              </View>
            )}
            <View style={cs.threadList}>
              {threads.map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
            </View>
          </View>
        </Frame>

        <Frame label="9. Full — Active Exploration" description="Urgent expanded + first thread open" width={393}>
          <View style={cs.container}>
            <Header total={stats.total} />
            <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[3] }}>
              <UrgentBannerExpanded count={urgentCount || 3} emails={sections.needsAttention} />
            </View>
            <View style={cs.threadList}>
              {threads[0] && <ThreadCardExpanded thread={threads[0]} />}
              {threads.slice(1).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
            </View>
          </View>
        </Frame>

        <Frame label="10. Full — Deep Dive" description="Multiple threads expanded, urgent collapsed" width={393}>
          <View style={cs.container}>
            <Header total={stats.total} />
            {urgentCount > 0 && (
              <View style={{ paddingHorizontal: spacing[5], marginTop: spacing[3] }}>
                <UrgentBannerCollapsed count={urgentCount} />
              </View>
            )}
            <View style={cs.threadList}>
              {threads[0] && <ThreadCardExpanded thread={threads[0]} />}
              {threads[1] && <ThreadCardExpanded thread={threads[1]} />}
              {threads[2] && <ThreadCardExpanded thread={threads[2]} />}
              {threads.slice(3).map((t) => <ThreadCardCollapsed key={t.id} thread={t} />)}
            </View>
          </View>
        </Frame>
      </ScrollView>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

// ─── State sheet layout styles ───
const ss = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#e0e0e0" },
  content: { padding: 32 },
  title: { fontSize: 32, fontWeight: "700", color: G.black, marginBottom: 4 },
  subtitle: { fontSize: 14, color: G.muted, marginBottom: 32 },
  rowLabel: { fontSize: 18, fontWeight: "700", color: G.dark, marginTop: 32, marginBottom: 12 },
  row: { gap: 24, paddingBottom: 8 },
});

// ─── Frame styles ───
const fs = StyleSheet.create({
  frame: { gap: 8 },
  labelRow: { gap: 2 },
  label: { fontSize: 14, fontWeight: "700", color: G.black },
  desc: { fontSize: 12, color: G.muted },
  phone: {
    width: 345,
    backgroundColor: G.bg,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: G.faint,
  },
});

// ─── Component styles (mirrors ConceptLifeThreads exactly) ───
const cs = StyleSheet.create({
  container: { backgroundColor: G.bg },
  header: { paddingHorizontal: spacing[5], paddingTop: spacing[6], paddingBottom: spacing[2] },
  headerSub: { fontSize: 14, color: G.muted, marginTop: 4 },

  urgentBanner: {
    flexDirection: "row", alignItems: "center", gap: spacing[2],
    paddingHorizontal: spacing[4], paddingVertical: spacing[3],
    backgroundColor: G.black, borderRadius: radius.md,
  },
  urgentText: { fontSize: 14, fontWeight: "600", color: G.white, flex: 1 },
  urgentList: {
    backgroundColor: G.white, borderRadius: radius.md, marginTop: spacing[2],
    overflow: "hidden", ...shadows.cardSubtle,
  },
  urgentItem: {
    flexDirection: "row", alignItems: "center", gap: spacing[2],
    padding: spacing[3], borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: G.faint,
  },
  urgentFrom: { fontSize: 12, fontWeight: "600", color: G.mid },
  urgentSubject: { fontSize: 14, fontWeight: "600", color: G.black, marginTop: 1 },
  urgentReason: { fontSize: 12, color: G.muted, marginTop: 2 },
  urgentAction: { fontSize: 12, fontWeight: "500", color: G.dark, marginTop: 3 },

  threadList: { padding: spacing[5], gap: spacing[3] },
  threadCard: {
    backgroundColor: G.white, borderRadius: radius.lg, padding: spacing[4], ...shadows.cardSubtle,
  },
  threadHeader: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  threadIcon: { width: 36, height: 36, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  threadLabel: { fontSize: 16, fontWeight: "600", color: G.black },
  threadCount: { fontSize: 12, color: G.muted, marginTop: 1 },
  chevron: { fontSize: 16, color: G.light },
  threadPreview: { fontSize: 13, color: G.muted, marginTop: spacing[2], marginLeft: 48 },
  threadEmails: { marginTop: spacing[3], gap: spacing[2] },
  threadEmailRow: {
    flexDirection: "row", alignItems: "center", gap: spacing[2],
    paddingVertical: spacing[2], paddingHorizontal: spacing[2],
    borderRadius: radius.sm, backgroundColor: G.bg,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  emailFrom: { fontSize: 12, fontWeight: "600", color: G.mid },
  emailSubject: { fontSize: 13, color: G.dark, marginTop: 1 },
  emailReason: { fontSize: 11, color: G.light, marginTop: 1 },
});
