import React from "react";
import { View, Text, StyleSheet, ViewProps } from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { spacing } from "../tokens/spacing";
import { shadows } from "../tokens/shadows";

type ToastProps = ViewProps & {
  message: string;
  visible?: boolean;
};

/**
 * Stub component — will be enhanced with animations and auto-dismiss in the future.
 */
export default function Toast({ message, visible = false, style, ...rest }: ToastProps) {
  if (!visible) return null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.toast, style]} {...rest}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 100,
    left: spacing[4],
    right: spacing[4],
    alignItems: "center",
  },
  toast: {
    backgroundColor: colors.foreground.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    ...shadows.card,
  },
  message: {
    color: colors.foreground.onColor,
    fontSize: 14,
    fontWeight: "500",
  },
});
