import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../tokens/colors";

type IconSize = "sm" | "md" | "lg";

type IconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: IconSize;
  color?: string;
};

const SIZE_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function Icon({
  name,
  size = "md",
  color = colors.foreground.secondary,
}: IconProps) {
  return <Ionicons name={name} size={SIZE_MAP[size]} color={color} />;
}
