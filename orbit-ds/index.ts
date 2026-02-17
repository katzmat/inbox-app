// ═══════════════════════════════════════════
// Orbit Design System — Barrel Export
// ═══════════════════════════════════════════

// ── Tokens ──────────────────────────────────
export { colors } from "./tokens/colors";
export type { Colors } from "./tokens/colors";
export { typography } from "./tokens/typography";
export type { TypographyVariant } from "./tokens/typography";
export { spacing, sp } from "./tokens/spacing";
export type { Spacing } from "./tokens/spacing";
export { radius } from "./tokens/radius";
export type { Radius } from "./tokens/radius";
export { shadows } from "./tokens/shadows";

// ── Primitives ──────────────────────────────
export { default as OrbitText } from "./primitives/Text";
export { default as Button } from "./primitives/Button";
export { default as Avatar } from "./primitives/Avatar";
export { default as Badge } from "./primitives/Badge";
export { default as Icon } from "./primitives/Icon";
export { default as Divider } from "./primitives/Divider";
export { default as Star } from "./primitives/Star";
export { default as Tag } from "./primitives/Tag";
export { default as Notification } from "./primitives/Notification";

// ── Components ──────────────────────────────
export { default as TopNavigation } from "./components/TopNavigation";
export { default as TabBar } from "./components/TabBar";
export type { TabItem } from "./components/TabBar";
export { default as ListItem } from "./components/ListItem";
export { default as AdContainer } from "./components/AdContainer";
export { default as ActionButton } from "./components/ActionButton";
export { default as FloatingActionBar } from "./components/FloatingActionBar";
export { default as Card } from "./components/Card";
export { default as PersonCard } from "./components/PersonCard";
export { default as Banner } from "./components/Banner";
export { default as SectionHeader } from "./components/SectionHeader";
export { default as BottomSheet } from "./components/BottomSheet";
export { default as Toast } from "./components/Toast";
export { default as StatusBar } from "./components/StatusBar";

// ── Layouts ─────────────────────────────────
export { default as PhoneFrame } from "./layouts/PhoneFrame";
export { default as ScreenShell } from "./layouts/ScreenShell";
