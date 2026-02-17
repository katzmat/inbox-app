import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../tokens/colors";

type StarProps = {
  filled?: boolean;
  onToggle?: () => void;
  size?: number;
};

export default function Star({ filled = false, onToggle, size = 16 }: StarProps) {
  return (
    <TouchableOpacity onPress={onToggle} disabled={!onToggle} hitSlop={8}>
      <Ionicons
        name={filled ? "star" : "star-outline"}
        size={size}
        color={filled ? "#FFB800" : colors.foreground.tertiary}
      />
    </TouchableOpacity>
  );
}
