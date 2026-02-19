import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";

type EmptyStateProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
};

export default function EmptyState({
  icon = "mail-outline",
  title,
  message,
  action,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name={icon}
        size={48}
        color={colors.foreground.disabled}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[6],
  },
  icon: {
    marginBottom: spacing[3],
  },
  title: {
    ...typography.headline1,
    color: colors.foreground.secondary,
    textAlign: "center",
    marginBottom: spacing[1],
  },
  message: {
    ...typography.body1,
    color: colors.foreground.tertiary,
    textAlign: "center",
    maxWidth: 280,
  },
  action: {
    marginTop: spacing[4],
  },
});
