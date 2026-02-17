import React from "react";
import { View } from "react-native";
import { colors } from "../tokens/colors";

type NotificationProps = {
  size?: number;
  color?: string;
};

export default function Notification({
  size = 6,
  color = colors.brand,
}: NotificationProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
}
