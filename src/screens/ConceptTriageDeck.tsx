import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OrbitText, Button, spacing, radius, shadows, colors } from "../../orbit-ds";
import { useBriefingData } from "../hooks/useBriefingData";
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

function tierLabel(email: BriefingEmail, sections: any): string {
  if (sections.needsAttention.some((e: BriefingEmail) => e.id === email.id)) return "NEEDS ATTENTION";
  for (const [cat] of Object.entries(sections.glance)) {
    if ((sections.glance[cat] as BriefingEmail[]).some((e: BriefingEmail) => e.id === email.id))
      return cat.toUpperCase();
  }
  return "LOW PRIORITY";
}

function tierColor(email: BriefingEmail, sections: any): string {
  if (sections.needsAttention.some((e: BriefingEmail) => e.id === email.id)) return G.black;
  if (Object.values(sections.glance).flat().some((e: any) => e.id === email.id)) return G.mid;
  return G.light;
}

function DoneScreen({ total }: { total: number }) {
  return (
    <View style={styles.doneContainer}>
      <Ionicons name="checkmark-circle-outline" size={64} color={G.faint} />
      <Text style={styles.doneTitle}>All caught up</Text>
      <Text style={styles.doneSubtitle}>
        You reviewed {total} email{total !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}

function EmailCard({
  email,
  index,
  total,
  sections,
  onNext,
}: {
  email: BriefingEmail;
  index: number;
  total: number;
  sections: any;
  onNext: () => void;
}) {
  const tier = tierLabel(email, sections);
  const color = tierColor(email, sections);

  return (
    <View style={styles.cardOuter}>
      {/* Progress */}
      <View style={styles.progress}>
        <View style={[styles.progressBar, { width: `${((index + 1) / total) * 100}%` }]} />
      </View>
      <Text style={styles.counter}>
        {index + 1} of {total}
      </Text>

      {/* Card */}
      <View style={styles.card}>
        {/* Tier badge */}
        <View style={[styles.tierBadge, { backgroundColor: color }]}>
          <Text style={styles.tierBadgeText}>{tier}</Text>
        </View>

        {/* Sender */}
        <Text style={styles.cardFrom}>{email.from}</Text>

        {/* Subject */}
        <Text style={styles.cardSubject}>{email.subject}</Text>

        {/* AI reasoning */}
        {email.reason && (
          <View style={styles.reasonBox}>
            <Ionicons name="sparkles-outline" size={14} color={G.mid} />
            <Text style={styles.reasonText}>{email.reason}</Text>
          </View>
        )}

        {/* Summary or snippet */}
        <Text style={styles.cardSnippet}>
          {email.summary || email.snippet}
        </Text>

        {/* Suggested action */}
        {email.suggestedAction && (
          <View style={styles.suggestedAction}>
            <Text style={styles.suggestedLabel}>Suggested</Text>
            <Text style={styles.suggestedText}>{email.suggestedAction}</Text>
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onNext}
          style={[styles.actionBtn, styles.actionBtnSecondary]}
        >
          <Ionicons name="checkmark" size={20} color={G.dark} />
          <Text style={styles.actionBtnSecondaryText}>Noted</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openEmail(email.webLink)}
          style={[styles.actionBtn, styles.actionBtnPrimary]}
        >
          <Ionicons name="open-outline" size={18} color={G.white} />
          <Text style={styles.actionBtnPrimaryText}>Open</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          style={[styles.actionBtn, styles.actionBtnSecondary]}
        >
          <Ionicons name="time-outline" size={18} color={G.dark} />
          <Text style={styles.actionBtnSecondaryText}>Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ConceptTriageDeck() {
  const { connState, sections, stats } = useBriefingData();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (connState === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={G.muted} />
      </View>
    );
  }

  // Build ordered deck: priority first, then glance, then low
  const deck: BriefingEmail[] = [
    ...sections.needsAttention,
    ...Object.values(sections.glance).flat(),
    ...sections.low,
  ];

  if (deck.length === 0 || currentIndex >= deck.length) {
    return <DoneScreen total={deck.length} />;
  }

  const email = deck[currentIndex];

  return (
    <View style={styles.container}>
      <EmailCard
        email={email}
        index={currentIndex}
        total={deck.length}
        sections={sections}
        onNext={() => setCurrentIndex((i) => i + 1)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: G.bg,
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  cardOuter: {
    flex: 1,
    padding: spacing[4],
    justifyContent: "center",
  },

  // Progress
  progress: {
    height: 3,
    backgroundColor: G.faint,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: spacing[1],
  },
  progressBar: {
    height: 3,
    backgroundColor: G.black,
    borderRadius: 2,
  },
  counter: {
    fontSize: 12,
    color: G.light,
    textAlign: "center",
    marginBottom: spacing[4],
  },

  // Card
  card: {
    backgroundColor: G.white,
    borderRadius: radius.lg,
    padding: spacing[5],
    ...shadows.card,
  },
  tierBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginBottom: spacing[3],
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: G.white,
    letterSpacing: 0.8,
  },
  cardFrom: {
    fontSize: 13,
    fontWeight: "500",
    color: G.muted,
  },
  cardSubject: {
    fontSize: 20,
    fontWeight: "600",
    color: G.black,
    marginTop: 4,
    lineHeight: 26,
  },
  reasonBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[1.5],
    marginTop: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: "rgba(29,29,31,0.03)",
    borderRadius: radius.md,
  },
  reasonText: {
    fontSize: 13,
    color: G.mid,
    lineHeight: 18,
    flex: 1,
  },
  cardSnippet: {
    fontSize: 15,
    color: G.dark,
    lineHeight: 22,
    marginTop: spacing[3],
  },
  suggestedAction: {
    marginTop: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: G.faint,
  },
  suggestedLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: G.light,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  suggestedText: {
    fontSize: 15,
    fontWeight: "500",
    color: G.black,
    marginTop: 2,
  },

  // Actions
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[3],
    marginTop: spacing[5],
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1.5],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.full,
  },
  actionBtnPrimary: {
    backgroundColor: G.black,
  },
  actionBtnPrimaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: G.white,
  },
  actionBtnSecondary: {
    backgroundColor: G.white,
    ...shadows.cardSubtle,
  },
  actionBtnSecondaryText: {
    fontSize: 14,
    fontWeight: "500",
    color: G.dark,
  },

  // Done
  doneContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[8],
    backgroundColor: G.bg,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: G.black,
    marginTop: spacing[4],
  },
  doneSubtitle: {
    fontSize: 15,
    color: G.muted,
    marginTop: spacing[2],
  },
});
