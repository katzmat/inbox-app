import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { EmailItem } from "../data/emails";

type Props = {
  email: EmailItem;
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <Ionicons
      name={filled ? "star" : "star-outline"}
      size={16}
      color={filled ? "#FFB800" : "rgba(29,29,31,0.61)"}
    />
  );
}

function UnreadDot() {
  return <View style={styles.unreadDot} />;
}

function ActionButton({
  label,
  icon,
  variant = "brand",
}: {
  label: string;
  icon?: string;
  variant?: "brand" | "neutral";
}) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === "neutral" && styles.actionButtonNeutral,
      ]}
    >
      <Text
        style={[
          styles.actionButtonText,
          variant === "neutral" && styles.actionButtonTextNeutral,
        ]}
      >
        {label}
      </Text>
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={variant === "neutral" ? "rgba(29,29,31,0.75)" : "#7d2eff"}
        />
      )}
    </TouchableOpacity>
  );
}

function AdCard({ email }: Props) {
  return (
    <View style={styles.adContainer}>
      <View style={styles.adContent}>
        <View style={styles.adHeader}>
          <Text style={styles.adBrand}>{email.adBrand}</Text>
          <Text style={styles.adTag}> · Ad</Text>
        </View>
        <Text style={styles.adPreview} numberOfLines={2}>
          {email.preview}
        </Text>
        {email.actions?.map((action, i) => (
          <ActionButton key={i} label={action.label} variant="neutral" />
        ))}
      </View>
    </View>
  );
}

export default function EmailListItem({ email }: Props) {
  if (email.isAd) {
    return <AdCard email={email} />;
  }

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.message}>
        {/* Unread indicator column */}
        <View style={styles.unreadColumn}>
          {email.unread && <UnreadDot />}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Sender row */}
          <View style={styles.senderRow}>
            <View style={styles.senderLeft}>
              <Text
                style={[
                  styles.senderName,
                  email.unread && styles.senderNameUnread,
                ]}
                numberOfLines={1}
              >
                {email.sender}
              </Text>
              {email.threadCount && (
                <View style={styles.threadBadge}>
                  <Text style={styles.threadBadgeText}>
                    {email.threadCount}
                  </Text>
                </View>
              )}
              {email.hasReply && (
                <Ionicons
                  name="return-up-back"
                  size={14}
                  color="rgba(29,29,31,0.61)"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <View style={styles.dateStarRow}>
              <Text style={styles.timeLabel}>{email.time}</Text>
              <StarIcon filled={email.starred} />
            </View>
          </View>

          {/* Subject */}
          {email.subject && (
            <Text style={styles.subject} numberOfLines={1}>
              {email.subject}
            </Text>
          )}

          {/* Preview */}
          <Text style={styles.preview} numberOfLines={1}>
            {email.preview}
          </Text>

          {/* Action buttons */}
          {email.actions && (
            <View style={styles.actionsRow}>
              {email.actions.map((action, i) => (
                <ActionButton
                  key={i}
                  label={action.label}
                  icon={action.icon}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  message: {
    flexDirection: "row",
  },
  unreadColumn: {
    width: 24,
    paddingTop: 20,
    alignItems: "center",
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7d2eff",
  },
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 12,
    paddingRight: 24,
  },
  senderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  senderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: "rgba(29,29,31,0.61)",
    flexShrink: 1,
  },
  senderNameUnread: {
    fontWeight: "600",
    color: "#1d1d1f",
  },
  threadBadge: {
    backgroundColor: "#73737b",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: "rgba(29,29,31,0.08)",
  },
  threadBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 16,
  },
  dateStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "rgba(29,29,31,0.61)",
  },
  subject: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "rgba(29,29,31,0.75)",
    marginTop: 2,
  },
  preview: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "rgba(29,29,31,0.61)",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#7d2eff",
    borderRadius: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  actionButtonNeutral: {
    borderColor: "rgba(29,29,31,0.5)",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: "#7d2eff",
  },
  actionButtonTextNeutral: {
    color: "#1d1d1f",
  },
  // Ad styles
  adContainer: {
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: "rgba(29,29,31,0.04)",
    borderRadius: 16,
    overflow: "hidden",
  },
  adContent: {
    padding: 16,
  },
  adHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  adBrand: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d1d1f",
    lineHeight: 24,
  },
  adTag: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(29,29,31,0.61)",
    lineHeight: 20,
  },
  adPreview: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: "rgba(29,29,31,0.61)",
    marginBottom: 8,
  },
});
