import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { spacing } from "../tokens/spacing";

type BottomSheetProps = ViewProps & {
  visible?: boolean;
};

/**
 * Stub component — will be enhanced with animations and gestures in the future.
 */
export default function BottomSheet({ visible = false, children, style, ...rest }: BottomSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.sheet, style]} {...rest}>
        <View style={styles.handle} />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.scrim,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
    paddingTop: spacing[2],
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line.neutral3,
    alignSelf: "center",
    marginBottom: spacing[4],
  },
});
