import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { radius } from "../tokens/radius";

type BannerProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  backgroundColor?: string;
  borderColor?: string;
};

export default function Banner({
  title,
  subtitle,
  actionLabel = "View",
  onAction,
  onDismiss,
  backgroundColor = "#f8f6ff",
  borderColor = "#e8e4f0",
}: BannerProps) {
  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.actions}>
        {onAction && (
          <TouchableOpacity style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.dismiss}>{"\u00d7"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginRight: spacing[3],
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2d2d3d",
  },
  subtitle: {
    fontSize: 12,
    color: "#8888aa",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  button: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    backgroundColor: colors.brand,
    borderRadius: radius.sm,
  },
  buttonText: {
    color: colors.foreground.onColor,
    fontSize: 12,
    fontWeight: "500",
  },
  dismiss: {
    color: "#bbb",
    fontSize: 20,
    paddingHorizontal: 4,
  },
});
