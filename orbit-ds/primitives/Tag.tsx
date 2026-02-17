import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { spacing } from "../tokens/spacing";

type TagProps = {
  label: string;
  color?: string;
  textColor?: string;
};

export default function Tag({
  label,
  color = colors.background.secondary,
  textColor = colors.foreground.tertiary,
}: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: color }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
});
