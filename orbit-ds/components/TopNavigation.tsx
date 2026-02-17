import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "../primitives/Avatar";
import { colors } from "../tokens/colors";
import { spacing } from "../tokens/spacing";

type TopNavigationProps = {
  title: string;
  avatarInitials?: string;
  avatarColor?: string;
  avatarImageUri?: string;
  rightAction?: React.ReactNode;
  onAvatarPress?: () => void;
};

export default function TopNavigation({
  title,
  avatarInitials,
  avatarColor,
  avatarImageUri,
  rightAction,
  onAvatarPress,
}: TopNavigationProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onAvatarPress} style={styles.avatarTouch}>
        <Avatar
          size="sm"
          initials={avatarInitials}
          color={avatarColor}
          imageUri={avatarImageUri}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightSlot}>
        {rightAction}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[2],
    backgroundColor: colors.background.primary,
  },
  avatarTouch: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.foreground.primary,
    letterSpacing: -0.3,
    lineHeight: 36,
  },
  rightSlot: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
