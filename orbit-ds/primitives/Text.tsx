import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";
import { typography, TypographyVariant } from "../tokens/typography";
import { colors } from "../tokens/colors";

type OrbitTextProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

export default function OrbitText({
  variant = "body1",
  color,
  style,
  children,
  ...rest
}: OrbitTextProps) {
  const variantStyle = typography[variant];
  const colorStyle: TextStyle = { color: color ?? colors.foreground.primary };

  return (
    <RNText style={[variantStyle, colorStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}
