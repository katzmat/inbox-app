import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { colors } from "../tokens/colors";

type DividerProps = ViewProps & {
  color?: string;
  thickness?: number;
};

export default function Divider({
  color = colors.line.neutral3,
  thickness = 1,
  style,
  ...rest
}: DividerProps) {
  return (
    <View
      style={[styles.divider, { backgroundColor: color, height: thickness }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    width: "100%",
  },
});
