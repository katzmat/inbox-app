import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";

type TextInputProps = RNTextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  containerStyle?: ViewStyle;
};

const sizeStyles: Record<"sm" | "md" | "lg", { minHeight: number; fontSize: number }> = {
  sm: { minHeight: 36, fontSize: 14 },
  md: { minHeight: 44, fontSize: 16 },
  lg: { minHeight: 52, fontSize: 16 },
};

export default function TextInput({
  label,
  hint,
  error,
  size = "md",
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);
  const sv = sizeStyles[size];

  const borderColor = error
    ? colors.core.alert
    : focused
    ? colors.foreground.primary
    : colors.line.neutral3;

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        placeholderTextColor={colors.foreground.disabled}
        style={[
          styles.input,
          {
            minHeight: sv.minHeight,
            fontSize: sv.fontSize,
            borderColor,
          },
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label3,
    color: colors.foreground.primary,
    marginBottom: spacing[1],
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    backgroundColor: colors.background.primary,
    color: colors.foreground.primary,
    ...typography.body1,
  },
  hint: {
    ...typography.caption2,
    color: colors.foreground.tertiary,
    marginTop: spacing[1],
  },
  error: {
    ...typography.caption2,
    color: colors.core.alert,
    marginTop: spacing[1],
  },
});
