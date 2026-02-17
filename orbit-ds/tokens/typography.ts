/**
 * Orbit Design System — Typography Tokens
 * All styles use Yahoo Product Sans VF (system font fallback)
 */

import { TextStyle } from "react-native";

export type TypographyVariant =
  | "display1"
  | "title1"
  | "title2"
  | "title3"
  | "title4"
  | "headline1"
  | "body1"
  | "body1Bold"
  | "label1"
  | "label2"
  | "label3"
  | "label4"
  | "small"
  | "xSmall"
  | "caption1"
  | "caption2"
  | "tiny"
  | "legal";

export const typography: Record<TypographyVariant, TextStyle> = {
  display1: {
    fontSize: 64,
    fontWeight: "700",
    lineHeight: 64,
  },
  title1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
  },
  title2: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 32,
  },
  title3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
  title4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  headline1: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  body1Bold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  label1: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
  },
  label2: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  label3: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
  label4: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  small: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  xSmall: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 16,
  },
  caption1: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  caption2: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  tiny: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  legal: {
    fontSize: 11,
    fontWeight: "400",
    lineHeight: 14,
  },
} as const;
