import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { shadows } from "../tokens/shadows";

type CardProps = ViewProps & {
  elevation?: "none" | "subtle" | "default" | "lifted";
  backgroundColor?: string;
  borderRadiusSize?: keyof typeof radius;
};

export default function Card({
  elevation = "default",
  backgroundColor = colors.background.primary,
  borderRadiusSize = "lg",
  style,
  children,
  ...rest
}: CardProps) {
  const shadowStyle =
    elevation === "none"
      ? shadows.none
      : elevation === "subtle"
      ? shadows.cardSubtle
      : elevation === "lifted"
      ? shadows.cardLifted
      : shadows.card;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor, borderRadius: radius[borderRadiusSize] },
        shadowStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
