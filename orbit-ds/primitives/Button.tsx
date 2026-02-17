import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { spacing } from "../tokens/spacing";

type ButtonVariant = "brand" | "neutral" | "tertiary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: spacing[3], paddingVertical: spacing[1], minHeight: 28 },
    text: { fontSize: 12, fontWeight: "500" },
  },
  md: {
    container: { paddingHorizontal: spacing[4], paddingVertical: spacing[2], minHeight: 36 },
    text: { fontSize: 14, fontWeight: "600" },
  },
  lg: {
    container: { paddingHorizontal: spacing[5], paddingVertical: spacing[3], minHeight: 44 },
    text: { fontSize: 16, fontWeight: "600" },
  },
};

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  brand: {
    container: { backgroundColor: colors.brand },
    text: { color: colors.foreground.onColor },
  },
  neutral: {
    container: { backgroundColor: colors.foreground.primary },
    text: { color: colors.foreground.onColor },
  },
  tertiary: {
    container: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.line.neutral3 },
    text: { color: colors.foreground.primary },
  },
};

export default function Button({
  label,
  variant = "brand",
  size = "md",
  icon,
  style,
  ...rest
}: ButtonProps) {
  const sv = sizeStyles[size];
  const vv = variantStyles[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.base, sv.container, vv.container, style]}
      {...rest}
    >
      {icon}
      <Text style={[styles.baseText, sv.text, vv.text]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
    gap: spacing[1],
  },
  baseText: {
    textAlign: "center",
  },
});
