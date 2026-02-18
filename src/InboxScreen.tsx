import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { OrbitText, spacing, radius, shadows } from "../orbit-ds";
import { useBriefingData } from "./hooks/useBriefingData";
import type { BriefingEmail } from "./data/briefing";

// ─── Greyscale palette ────────────────────────────────
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
};

function openEmail(gmailId?: string) {
  if (!gmailId) return;
  const url = `https://mail.google.com/mail/u/0/#inbox/${gmailId}`;
  if (Platform.OS === "web") {
    window.open(url, "_blank");
  } else {
    Linking.openURL(url);
  }
}

function timeAgo(): string {
  // Simple relative time — all emails are "recent" in this prototype
  return "now";
}

function InboxRow({ email }: { email: BriefingEmail }) {
  return (
    <TouchableOpacity
      onPress={() => openEmail(email.gmailId)}
      activeOpacity={0.7}
      style={styles.row}
    >
      {/* Avatar circle */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {email.from.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={styles.sender} numberOfLines={1}>
            {email.from}
          </Text>
          <Text style={styles.time}>{timeAgo()}</Text>
        </View>
        <Text style={styles.subject} numberOfLines={1}>
          {email.subject}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {email.preview}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const { connState, userEmail, briefing, handleConnectGmail } =
    useBriefingData();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <OrbitText variant="title3" color={G.black} style={{ fontWeight: "600" }}>
          Inbox
        </OrbitText>
        {connState === "connected" && userEmail && (
          <OrbitText variant="caption2" color={G.muted}>
            {userEmail}
          </OrbitText>
        )}
      </View>

      {connState === "loading" && (
        <View style={styles.centered}>
          <ActivityIndicator color={G.muted} />
        </View>
      )}

      {connState === "disconnected" && (
        <View style={styles.centered}>
          <OrbitText variant="body1" color={G.muted} style={{ marginBottom: spacing[4] }}>
            Connect Gmail to see your inbox
          </OrbitText>
          <TouchableOpacity
            onPress={handleConnectGmail}
            style={styles.connectBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.connectBtnText}>Connect Gmail</Text>
          </TouchableOpacity>
        </View>
      )}

      {connState === "connected" && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Email count */}
          <View style={styles.countBar}>
            <OrbitText variant="caption2" color={G.muted}>
              {briefing.emails.length} messages
            </OrbitText>
          </View>

          {/* Flat chronological list — no tiers, no categories, just emails */}
          {briefing.emails.map((email) => (
            <InboxRow key={email.id} email={email} />
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: G.white,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
    backgroundColor: G.white,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[8],
  },
  connectBtn: {
    backgroundColor: G.dark,
    borderRadius: radius.md,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2.5],
  },
  connectBtnText: {
    fontSize: 14,
    color: G.white,
    fontWeight: "600",
  },
  countBar: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    backgroundColor: G.bg,
    borderBottomWidth: 1,
    borderBottomColor: G.line,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: G.line,
    gap: spacing[3],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: G.bg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: G.mid,
  },
  rowContent: {
    flex: 1,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sender: {
    fontSize: 14,
    fontWeight: "600",
    color: G.black,
    flex: 1,
    marginRight: spacing[2],
  },
  time: {
    fontSize: 12,
    color: G.light,
  },
  subject: {
    fontSize: 14,
    fontWeight: "400",
    color: G.dark,
    marginTop: 2,
  },
  preview: {
    fontSize: 13,
    color: G.muted,
    marginTop: 2,
  },
});
