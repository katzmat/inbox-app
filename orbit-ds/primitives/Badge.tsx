import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";

type BadgeVariant = "unread" | "thread" | "flag";

type BadgeProps = {
  variant?: BadgeVariant;
  value?: number | string;
  color?: string;
};

export default function Badge({
  variant = "unread",
  value,
  color,
}: BadgeProps) {
  const bgColor =
    color ??
    (variant === "unread"
      ? colors.foreground.primary
      : variant === "thread"
      ? colors.product.grey
      : colors.status.warning);

  const textColor =
    variant === "flag" ? "#555" : colors.foreground.onColor;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.xl,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
  },
});
