/**
 * Orbit Design System — Border Radius Tokens
 */

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 32,
  full: 9999,
} as const;

export type Radius = typeof radius;
