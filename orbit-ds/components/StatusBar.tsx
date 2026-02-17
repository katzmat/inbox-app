import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

type StatusBarProps = {
  style?: "auto" | "inverted" | "light" | "dark";
};

export default function StatusBar({ style = "dark" }: StatusBarProps) {
  return <ExpoStatusBar style={style} />;
}
