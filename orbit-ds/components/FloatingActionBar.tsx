import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { radius } from "../tokens/radius";
import { shadows } from "../tokens/shadows";

type FABAction = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
};

type FloatingActionBarProps = {
  actions?: FABAction[];
};

const DEFAULT_ACTIONS: FABAction[] = [
  { icon: "search-outline" },
  { icon: "checkbox-outline" },
  { icon: "pencil-outline" },
];

export default function FloatingActionBar({
  actions = DEFAULT_ACTIONS,
}: FloatingActionBarProps) {
  return (
    <View style={styles.wrapper}>
      <BlurView intensity={50} tint="dark" style={styles.bar}>
        {actions.map((action, i) => (
          <TouchableOpacity
            key={i}
            style={styles.iconContainer}
            onPress={action.onPress}
          >
            <Ionicons name={action.icon} size={24} color={colors.foreground.onColor} />
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingBottom: 34,
    paddingTop: spacing[1.5],
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
    height: 52,
    paddingHorizontal: spacing[4],
    borderRadius: radius.full,
    overflow: "hidden",
    backgroundColor: colors.background.FAB,
    ...shadows.fab,
    borderWidth: 1,
    borderColor: colors.line.neutral3,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
});
