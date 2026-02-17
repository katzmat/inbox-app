import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";

type SectionHeaderProps = {
  label: string;
  style?: ViewStyle;
};

export default function SectionHeader({ label, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[6],
    marginBottom: spacing[3],
    paddingLeft: spacing[1],
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: colors.foreground.tertiary,
  },
});
