import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../tokens/colors";
import { radius } from "../tokens/radius";
import { spacing } from "../tokens/spacing";
import { typography } from "../tokens/typography";
import { shadows } from "../tokens/shadows";

type ModalProps = ViewProps & {
  visible: boolean;
  title?: string;
  onClose?: () => void;
};

export default function Modal({
  visible,
  title,
  onClose,
  children,
  style,
  ...rest
}: ModalProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.dialog, style]} {...rest}>
        {(title || onClose) && (
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title ?? ""}
            </Text>
            {onClose && (
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={colors.foreground.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={styles.body}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.scrim,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing[6],
    zIndex: 100,
  },
  dialog: {
    backgroundColor: colors.background.primary,
    borderRadius: radius.lg,
    width: "100%",
    maxWidth: 400,
    ...shadows.cardLifted,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    ...typography.headline1,
    color: colors.foreground.primary,
    flex: 1,
    marginRight: spacing[2],
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
});
