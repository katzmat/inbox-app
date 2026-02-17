import React from "react";
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";

type ActionButtonVariant = "brand" | "neutral";

type ActionButtonProps = TouchableOpacityProps & {
  label: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  variant?: ActionButtonVariant;
};

export default function ActionButton({
  label,
  icon,
  variant = "brand",
  style,
  ...rest
}: ActionButtonProps) {
  const isBrand = variant === "brand";
  const borderColor = isBrand ? colors.brand : colors.line.neutral;
  const textColor = isBrand ? colors.brand : colors.foreground.primary;

  return (
    <TouchableOpacity
      style={[styles.button, { borderColor }, style]}
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      {icon && <Ionicons name={icon} size={16} color={textColor} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    minHeight: 32,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
