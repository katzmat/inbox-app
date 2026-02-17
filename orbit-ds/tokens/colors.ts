/**
 * Orbit Design System — Color Tokens
 * Extracted from Figma variables (palette/*)
 */

export const colors = {
  // Brand
  brand: "#7d2eff",
  brandLight: "#f4f0ff",

  // Foreground
  foreground: {
    primary: "#1d1d1f",
    secondary: "#1d1d1fbf", // 75% opacity
    tertiary: "#1d1d1f9c", // 61% opacity
    onColor: "#ffffff",
    disabled: "#1d1d1f3d", // 24% opacity
  },

  // Background
  background: {
    primary: "#ffffff",
    secondary: "#f5f5f5",
    FAB: "#1d1d1fe5", // 90% opacity
    scrim: "#1d1d1f99", // 60% opacity
    warm: "#FAFAF7",
    warmSecondary: "#f5f3ee",
    warmTertiary: "#edeae3",
  },

  // Lines & Borders
  line: {
    neutral: "rgba(29,29,31,0.5)",
    neutral3: "#1d1d1f14", // 8% opacity
    warm: "#f0ece4",
  },

  // Core Status Colors
  core: {
    positive: "#008751",
    alert: "#d30d2e",
    warning: "#bf4900",
  },

  // Legacy status (used by prototype screens)
  status: {
    urgent: "#c0392b",
    success: "#27ae60",
    warning: "#ffeaa7",
    expired: "#fab1a0",
    waiting: "#dfe6e9",
  },

  // Product Colors
  product: {
    grey: "#73737b",
  },
} as const;

export type Colors = typeof colors;
