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
  Avatar,
  Banner,
  Icon,
  Button,
  Tag,
  colors,
  spacing,
  radius,
} from "../../../orbit-ds";
import {
  traditionalInbox,
  quietStats,
  type TraditionalEmail,
} from "../../data/prototype";

function ChipBar() {
  const chipText = `${quietStats.receiptsOrganized} receipts organized · ${quietStats.subscriptionsTracked} subscriptions tracked`;
  return (
    <TouchableOpacity style={styles.chip} activeOpacity={0.7}>
      <Text style={{ fontSize: 13 }}>{"\ud83e\uddfe"}</Text>
      <OrbitText variant="caption2" color="#777">
        {chipText}
      </OrbitText>
      <Text style={{ color: "#bbb", fontSize: 12 }}>{"\u2192"}</Text>
    </TouchableOpacity>
  );
}

function EmailRow({
  email,
  isSelected,
  onToggle,
}: {
  email: TraditionalEmail;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const getImportanceReason = (from: string) => {
    if (from.includes("Risa")) return "replies to this sender frequently";
    if (from.includes("Anne")) return "co-parenting coordination";
    if (from.includes("United")) return "contains deadline this month";
    if (from.includes("Republic")) return "past-due balance detected";
    return "based on your patterns";
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={[
        styles.emailRow,
        isSelected && styles.emailRowSelected,
        email.unread && !email.dimmed && styles.emailRowUnread,
      ]}
    >
      <View style={styles.emailRowInner}>
        {/* Importance bar */}
        <View
          style={[
            styles.importanceBar,
            email.important && styles.importanceBarActive,
          ]}
        />
        <View style={styles.emailContent}>
          <View style={styles.emailFromRow}>
            <Text
              style={[
                styles.emailFrom,
                email.unread && !email.dimmed && styles.emailFromUnread,
                email.dimmed && styles.emailFromDimmed,
              ]}
              numberOfLines={1}
            >
              {email.from}
            </Text>
            <OrbitText variant="caption2" color="#bbb" style={{ marginLeft: spacing[3] }}>
              {email.time}
            </OrbitText>
          </View>
          <Text
            style={[
              styles.emailSubject,
              email.unread && !email.dimmed && styles.emailSubjectUnread,
              email.dimmed && styles.emailSubjectDimmed,
            ]}
            numberOfLines={1}
          >
            {email.subject}
          </Text>
          <Text
            style={[
              styles.emailPreview,
              email.dimmed && styles.emailPreviewDimmed,
            ]}
            numberOfLines={1}
          >
            {email.preview}
          </Text>
        </View>
      </View>

      {isSelected && (
        <View style={styles.emailActions}>
          <Button label="Reply" variant="brand" size="sm" />
          <Button label="Archive" variant="tertiary" size="sm" />
          {email.important && (
            <Tag
              label={`Flagged as important — ${getImportanceReason(email.from)}`}
              color={colors.brandLight}
              textColor={colors.brand}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CalmFamiliar() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <OrbitText variant="headline1" color={colors.brand} style={{ fontWeight: "700", letterSpacing: -0.5 }}>
            Mail
          </OrbitText>
          <View style={styles.connectedBadge}>
            <OrbitText variant="caption2" color="#999">
              Gmail connected
            </OrbitText>
          </View>
        </View>
        <View style={styles.topBarRight}>
          <Icon name="settings-outline" size="md" color="#999" />
          <Avatar initials="MK" size="sm" color="#e8e4f0" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {showBanner && (
          <View style={{ marginHorizontal: spacing[4], marginTop: spacing[4] }}>
            <Banner
              title="3 things need you today"
              subtitle="Insurance deadline · Republic Services past due · Card update needed"
              actionLabel="View"
              onAction={() => {}}
              onDismiss={() => setShowBanner(false)}
            />
          </View>
        )}

        <View style={{ marginHorizontal: spacing[4], marginTop: spacing[2] }}>
          <ChipBar />
        </View>

        {/* Email list */}
        <View style={styles.emailList}>
          {traditionalInbox.map((email) => (
            <EmailRow
              key={email.id}
              email={email}
              isSelected={selectedEmail === email.id}
              onToggle={() =>
                setSelectedEmail(selectedEmail === email.id ? null : email.id)
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  connectedBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    backgroundColor: "#f0f0f0",
    borderRadius: radius.sm,
  },
  topBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: spacing[3],
    paddingVertical: 5,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
  },
  emailList: {
    marginTop: spacing[2],
  },
  emailRow: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  emailRowSelected: {
    backgroundColor: "#f8f8ff",
  },
  emailRowUnread: {
    backgroundColor: "#FDFCFF",
  },
  emailRowInner: {
    flexDirection: "row",
    gap: spacing[3],
  },
  importanceBar: {
    width: 3,
    height: 36,
    borderRadius: 2,
    backgroundColor: "transparent",
    marginTop: 2,
  },
  importanceBarActive: {
    backgroundColor: colors.brand,
  },
  emailContent: {
    flex: 1,
    minWidth: 0,
  },
  emailFromRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  emailFrom: {
    fontSize: 14,
    fontWeight: "400",
    color: "#222",
    flex: 1,
  },
  emailFromUnread: {
    fontWeight: "600",
  },
  emailFromDimmed: {
    color: "#aaa",
  },
  emailSubject: {
    fontSize: 13,
    fontWeight: "400",
    color: "#444",
    marginTop: 2,
  },
  emailSubjectUnread: {
    fontWeight: "500",
  },
  emailSubjectDimmed: {
    color: "#bbb",
  },
  emailPreview: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  emailPreviewDimmed: {
    color: "#ccc",
  },
  emailActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    marginTop: spacing[3],
    marginLeft: 15,
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
