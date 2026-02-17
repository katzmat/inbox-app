export const colors = {
  brand: "#7d2eff",
  brandLight: "#f4f0ff",
  foreground: {
    primary: "#1d1d1f",
    secondary: "rgba(29,29,31,0.75)",
    tertiary: "rgba(29,29,31,0.61)",
  },
  background: {
    primary: "#ffffff",
    secondary: "#f5f5f5",
    warm: "#FAFAF7",
    warmSecondary: "#f5f3ee",
    warmTertiary: "#edeae3",
  },
  line: {
    neutral: "rgba(29,29,31,0.5)",
    neutral3: "rgba(29,29,31,0.08)",
    warm: "#f0ece4",
  },
  status: {
    urgent: "#c0392b",
    success: "#27ae60",
    warning: "#ffeaa7",
    expired: "#fab1a0",
    waiting: "#dfe6e9",
  },
  grey: "#73737b",
};

export const spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  huge: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  pill: 9999,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: "300" as const,
    color: colors.foreground.primary,
    lineHeight: 36,
  },
  heading: {
    fontSize: 26,
    fontWeight: "600" as const,
    color: colors.foreground.primary,
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
    color: colors.foreground.tertiary,
  },
  body: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: colors.foreground.primary,
    lineHeight: 22,
  },
  bodyRegular: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.foreground.secondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: colors.foreground.tertiary,
  },
  small: {
    fontSize: 11,
    fontWeight: "400" as const,
    color: colors.foreground.tertiary,
  },
};
