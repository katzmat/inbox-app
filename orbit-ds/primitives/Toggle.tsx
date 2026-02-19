import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";

type ToggleProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function Toggle({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}: ToggleProps) {
  const trackColor = value ? colors.foreground.primary : colors.line.neutral3;
  const opacity = disabled ? 0.4 : 1;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => !disabled && onValueChange(!value)}
      style={[styles.row, { opacity }, style]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.thumb,
            { transform: [{ translateX: value ? 18 : 2 }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    ...typography.body1,
    color: colors.foreground.primary,
    flex: 1,
    marginRight: spacing[3],
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.background.primary,
  },
});
