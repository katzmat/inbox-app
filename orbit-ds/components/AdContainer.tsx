import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionButton from "./ActionButton";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { radius } from "../tokens/radius";

type AdAction = {
  label: string;
};

type AdContainerProps = {
  brand: string;
  preview: string;
  actions?: AdAction[];
};

export default function AdContainer({ brand, preview, actions }: AdContainerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.tag}> · Ad</Text>
        </View>
        <Text style={styles.preview} numberOfLines={2}>
          {preview}
        </Text>
        {actions?.map((action, i) => (
          <ActionButton key={i} label={action.label} variant="neutral" />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[2],
    marginVertical: spacing[1],
    backgroundColor: "rgba(29,29,31,0.04)",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  content: {
    padding: spacing[4],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[1],
  },
  brand: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.foreground.primary,
    lineHeight: 24,
  },
  tag: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.foreground.tertiary,
    lineHeight: 20,
  },
  preview: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.foreground.tertiary,
    marginBottom: spacing[2],
  },
});
