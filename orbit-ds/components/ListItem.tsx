import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Notification from "../primitives/Notification";
import Star from "../primitives/Star";
import Badge from "../primitives/Badge";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";

type ListItemAction = {
  label: string;
  icon?: string;
};

type ListItemProps = {
  sender: string;
  subject?: string;
  preview: string;
  time: string;
  unread?: boolean;
  starred?: boolean;
  threadCount?: number;
  hasReply?: boolean;
  actions?: ListItemAction[];
  onPress?: () => void;
  onStarToggle?: () => void;
};

export default function ListItem({
  sender,
  subject,
  preview,
  time,
  unread = false,
  starred = false,
  threadCount,
  hasReply,
  actions,
  onPress,
  onStarToggle,
}: ListItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.message}>
        {/* Unread indicator column */}
        <View style={styles.unreadColumn}>
          {unread && <Notification size={6} />}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Sender row */}
          <View style={styles.senderRow}>
            <View style={styles.senderLeft}>
              <Text
                style={[styles.senderName, unread && styles.senderNameUnread]}
                numberOfLines={1}
              >
                {sender}
              </Text>
              {threadCount != null && (
                <Badge variant="thread" value={threadCount} />
              )}
              {hasReply && (
                <Ionicons
                  name="return-up-back"
                  size={14}
                  color={colors.foreground.tertiary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <View style={styles.dateStarRow}>
              <Text style={styles.timeLabel}>{time}</Text>
              <Star filled={starred} onToggle={onStarToggle} />
            </View>
          </View>

          {/* Subject */}
          {subject && (
            <Text style={styles.subject} numberOfLines={1}>
              {subject}
            </Text>
          )}

          {/* Preview */}
          <Text style={styles.preview} numberOfLines={1}>
            {preview}
          </Text>

          {/* Action buttons */}
          {actions && actions.length > 0 && (
            <View style={styles.actionsRow}>
              {actions.map((action, i) => (
                <TouchableOpacity key={i} style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{action.label}</Text>
                  {action.icon && (
                    <Ionicons
                      name={action.icon as any}
                      size={16}
                      color={colors.brand}
                    />
                  )}
                </TouchableOpacity>
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
    backgroundColor: colors.background.primary,
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
  content: {
    flex: 1,
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
    paddingRight: spacing[6],
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
    marginRight: spacing[2],
  },
  senderName: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: colors.foreground.tertiary,
    flexShrink: 1,
  },
  senderNameUnread: {
    fontWeight: "600",
    color: colors.foreground.primary,
  },
  dateStarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.foreground.tertiary,
  },
  subject: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.foreground.secondary,
    marginTop: 2,
  },
  preview: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.foreground.tertiary,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing[1],
    marginTop: spacing[2],
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    borderWidth: 1,
    borderColor: colors.brand,
    borderRadius: 32,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    minHeight: 32,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.brand,
  },
});
