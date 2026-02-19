import React from "react";
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
import { OrbitText, Card, Divider, spacing, radius, colors } from "../../orbit-ds";
import { useBriefingData } from "../hooks/useBriefingData";
import { USER_NAME } from "../data/briefing";
import type { BriefingEmail } from "../data/briefing";

const G = {
  black: "#1d1d1f",
  dark: "#333",
  mid: "#666",
  muted: "#999",
  light: "#bbb",
  bg: "#f5f5f5",
  white: "#fff",
  warm: "#FAFAF7",
  warmBorder: "#edeae3",
  accent: "#1d1d1f",
};

function openEmail(webLink?: string) {
  if (!webLink) return;
  if (Platform.OS === "web") window.open(webLink, "_blank");
  else Linking.openURL(webLink);
}

function todayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function DigestItem({ email }: { email: BriefingEmail }) {
  return (
    <TouchableOpacity
      onPress={() => openEmail(email.webLink)}
      activeOpacity={0.7}
      style={styles.digestItem}
    >
      <Text style={styles.digestFrom}>{email.from}</Text>
      <Text style={styles.digestSubject}>{email.subject}</Text>
      {email.summary ? (
        <Text style={styles.digestSummary}>{email.summary}</Text>
      ) : email.snippet ? (
        <Text style={styles.digestSummary}>{email.snippet}</Text>
      ) : null}
      {email.suggestedAction && (
        <View style={styles.actionTag}>
          <Text style={styles.actionTagText}>→ {email.suggestedAction}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function DigestSection({
  title,
  subtitle,
  emails,
}: {
  title: string;
  subtitle?: string;
  emails: BriefingEmail[];
}) {
  if (emails.length === 0) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.sectionDivider} />
      {emails.map((email) => (
        <DigestItem key={email.id} email={email} />
      ))}
    </View>
  );
}

export default function ConceptDailyDigest() {
  const { connState, sections, stats } = useBriefingData();

  if (connState === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={G.muted} />
      </View>
    );
  }

  // Flatten glance into readable groups
  const glanceEntries = Object.entries(sections.glance);
  const moneyEmails = glanceEntries
    .filter(([cat]) => cat.includes("Purchase") || cat.includes("Payment"))
    .flatMap(([, emails]) => emails);
  const kidsEmails = glanceEntries
    .filter(([cat]) => cat.includes("School") || cat.includes("Kids"))
    .flatMap(([, emails]) => emails);
  const updatesEmails = glanceEntries
    .filter(([cat]) => cat.includes("Update") || cat.includes("Alert") || cat.includes("Shipping"))
    .flatMap(([, emails]) => emails);
  const socialEmails = glanceEntries
    .filter(([cat]) => cat.includes("Social") || cat.includes("Newsletter") || cat.includes("Community") || cat.includes("Comment"))
    .flatMap(([, emails]) => emails);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Masthead — newspaper style */}
      <View style={styles.masthead}>
        <View style={styles.mastheadRule} />
        <Text style={styles.mastheadTitle}>The Daily Digest</Text>
        <Text style={styles.mastheadDate}>{todayFormatted()}</Text>
        <Text style={styles.mastheadEdition}>
          Personal edition for {USER_NAME} · {stats.total} messages
        </Text>
        <View style={styles.mastheadRule} />
      </View>

      {/* Lead story — priority items */}
      <DigestSection
        title="Needs Your Attention"
        subtitle={`${stats.needsAttention} item${stats.needsAttention !== 1 ? "s" : ""} requiring action`}
        emails={sections.needsAttention}
      />

      {/* Money */}
      <DigestSection
        title="Money & Bills"
        emails={moneyEmails}
      />

      {/* Kids */}
      <DigestSection
        title="Kids & School"
        emails={kidsEmails}
      />

      {/* Updates */}
      <DigestSection
        title="Updates & Deliveries"
        emails={updatesEmails}
      />

      {/* Social / newsletters */}
      <DigestSection
        title="From Around the Web"
        subtitle="Newsletters, social, and community"
        emails={socialEmails}
      />

      {/* Low priority */}
      {sections.low.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>The Rest</Text>
            <Text style={styles.sectionSubtitle}>
              {sections.low.length} messages you can probably skip
            </Text>
          </View>
          <View style={styles.sectionDivider} />
          {sections.low.slice(0, 5).map((email) => (
            <TouchableOpacity
              key={email.id}
              onPress={() => openEmail(email.webLink)}
              style={styles.lowItem}
            >
              <Text style={styles.lowFrom}>{email.from}</Text>
              <Text style={styles.lowSubject} numberOfLines={1}>
                {email.subject}
              </Text>
            </TouchableOpacity>
          ))}
          {sections.low.length > 5 && (
            <Text style={styles.moreText}>
              + {sections.low.length - 5} more
            </Text>
          )}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.mastheadRule} />
        <Text style={styles.footerText}>
          End of digest · Next edition tomorrow morning
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.warm },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Masthead
  masthead: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    alignItems: "center",
  },
  mastheadRule: {
    width: "100%",
    height: 2,
    backgroundColor: G.black,
    marginVertical: spacing[2],
  },
  mastheadTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: G.black,
    letterSpacing: -0.5,
    fontFamily: Platform.OS === "web" ? "Georgia, serif" : undefined,
    marginTop: spacing[2],
  },
  mastheadDate: {
    fontSize: 13,
    color: G.mid,
    marginTop: spacing[1],
    fontFamily: Platform.OS === "web" ? "Georgia, serif" : undefined,
  },
  mastheadEdition: {
    fontSize: 12,
    color: G.light,
    marginTop: 2,
  },

  // Sections
  section: {
    paddingHorizontal: spacing[6],
    marginTop: spacing[5],
  },
  sectionHeader: {
    marginBottom: spacing[1],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: G.black,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: G.muted,
    marginTop: 2,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: G.warmBorder,
    marginTop: spacing[2],
    marginBottom: spacing[3],
  },

  // Digest items
  digestItem: {
    marginBottom: spacing[4],
  },
  digestFrom: {
    fontSize: 11,
    fontWeight: "600",
    color: G.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  digestSubject: {
    fontSize: 16,
    fontWeight: "600",
    color: G.black,
    marginTop: 2,
    lineHeight: 22,
  },
  digestSummary: {
    fontSize: 14,
    color: G.mid,
    marginTop: 4,
    lineHeight: 20,
  },
  actionTag: {
    alignSelf: "flex-start",
    marginTop: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    backgroundColor: "rgba(29,29,31,0.06)",
    borderRadius: radius.sm,
  },
  actionTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: G.dark,
  },

  // Low priority
  lowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    paddingVertical: spacing[1.5],
  },
  lowFrom: {
    fontSize: 13,
    fontWeight: "500",
    color: G.muted,
    width: 100,
  },
  lowSubject: {
    fontSize: 13,
    color: G.light,
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    color: G.light,
    marginTop: spacing[1],
    fontStyle: "italic",
  },

  // Footer
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: G.light,
    marginTop: spacing[2],
  },
});
