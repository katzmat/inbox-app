import React from "react";
import { View, Text, Image, StyleSheet, ImageURISource } from "react-native";
import { colors } from "../tokens/colors";

type AvatarSize = "sm" | "md" | "lg";
type AvatarStatus = "online" | "offline" | "none";

type AvatarProps = {
  initials?: string;
  color?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  imageUri?: string;
  defaultSource?: ImageURISource | number;
};

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 24,
  md: 44,
  lg: 56,
};

const FONT_MAP: Record<AvatarSize, number> = {
  sm: 10,
  md: 14,
  lg: 18,
};

export default function Avatar({
  initials,
  color = colors.product.grey,
  size = "md",
  status = "none",
  imageUri,
  defaultSource,
}: AvatarProps) {
  const dim = SIZE_MAP[size];

  return (
    <View style={[styles.container, { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: color }]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          defaultSource={defaultSource}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
        />
      ) : (
        <Text style={[styles.initials, { fontSize: FONT_MAP[size] }]}>
          {initials}
        </Text>
      )}
      {status === "online" && (
        <View
          style={[
            styles.statusDot,
            {
              width: dim * 0.27,
              height: dim * 0.27,
              borderRadius: dim * 0.14,
              borderWidth: size === "sm" ? 1.5 : 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "600",
    color: colors.foreground.onColor,
  },
  statusDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.core.positive,
    borderColor: colors.background.primary,
  },
});
