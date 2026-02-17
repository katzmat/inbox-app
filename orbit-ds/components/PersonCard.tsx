import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "../primitives/Avatar";
import Badge from "../primitives/Badge";
import Card from "./Card";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { radius } from "../tokens/radius";

type PersonCardProps = {
  name: string;
  relation?: string;
  avatar: string;
  color: string;
  status?: "online" | "offline";
  latestSubject: string;
  latestPreview: string;
  time: string;
  unread: number;
  threads?: string[];
  flag?: string;
  isExpanded?: boolean;
  onPress?: () => void;
};

const FLAG_COLORS: Record<string, string> = {
  stalled: "#ffeaa7",
  expired: "#fab1a0",
  waiting: "#dfe6e9",
};

export default function PersonCard({
  name,
  relation,
  avatar,
  color,
  status,
  latestSubject,
  latestPreview,
  time,
  unread,
  threads,
  flag,
  isExpanded = false,
  onPress,
}: PersonCardProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.card, isExpanded && styles.cardExpanded]}
      >
        <View style={styles.row}>
          <Avatar
            initials={avatar}
            color={color}
            size="md"
            status={status === "online" ? "online" : "none"}
          />
          <View style={styles.content}>
            <View style={styles.nameRow}>
              <View style={styles.nameLeft}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                {relation && <Text style={styles.relation}>{relation}</Text>}
              </View>
              <View style={styles.badges}>
                {flag && (
                  <Badge
                    variant="flag"
                    value={flag}
                    color={FLAG_COLORS[flag] ?? colors.status.waiting}
                  />
                )}
                {unread > 0 && <Badge variant="unread" value={unread} />}
                <Text style={styles.time}>{time}</Text>
              </View>
            </View>
            <Text style={styles.subject}>{latestSubject}</Text>
            <Text style={styles.preview} numberOfLines={1}>{latestPreview}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && threads && threads.length > 0 && (
        <View style={styles.threadsContainer}>
          <Text style={styles.threadsLabel}>ACTIVE THREADS</Text>
          {threads.map((thread, i) => (
            <TouchableOpacity key={i} style={styles.threadRow}>
              <Text style={styles.threadText}>{thread}</Text>
              <Text style={styles.threadArrow}>{"\u2192"}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing[3],
  },
  card: {
    padding: spacing[4],
    backgroundColor: colors.background.primary,
    borderRadius: radius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  row: {
    flexDirection: "row",
    gap: spacing[3.5],
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing[2],
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    color: colors.foreground.primary,
    flexShrink: 1,
  },
  relation: {
    fontSize: 12,
    color: "#b5ae9f",
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  time: {
    fontSize: 12,
    color: "#ccc",
  },
  subject: {
    fontSize: 13,
    fontWeight: "500",
    color: "#444",
    marginTop: 4,
  },
  preview: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  threadsContainer: {
    backgroundColor: "#FDFCF9",
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.line.warm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 2,
  },
  threadsLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: "#b5ae9f",
    marginBottom: spacing[2],
    fontWeight: "500",
  },
  threadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    backgroundColor: colors.background.primary,
    borderRadius: radius.md,
    marginBottom: 4,
  },
  threadText: {
    fontSize: 13,
    color: "#555",
    flex: 1,
  },
  threadArrow: {
    color: "#ddd",
    fontSize: 14,
  },
});
