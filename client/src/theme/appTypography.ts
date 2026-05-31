import type { TextStyle } from "react-native";

export const APP_HEADING = {
  h1: { fontSize: 26, lineHeight: 32 },
  // Section title
  h2: { fontSize: 18, lineHeight: 24 },
  // Card or list item title
  h3: { fontSize: 16, lineHeight: 22 },
  // Filter chip, eyebrow, small label
  h4: { fontSize: 14, lineHeight: 20 },
} as const satisfies Record<string, TextStyle>;

export const APP_TEXT = {
  subtitle: { fontSize: 14, lineHeight: 20 },
  body: { fontSize: 14, lineHeight: 20 },
  bodySmall: { fontSize: 12, lineHeight: 16 },
  caption: { fontSize: 11, lineHeight: 14 },
} as const satisfies Record<string, TextStyle>;

// Large numbers (coins, timer, stats)
export const APP_DISPLAY = {
  amount: { fontSize: 42, lineHeight: 46 },
  stat: { fontSize: 22, lineHeight: 28 },
  timer: { fontSize: 34, lineHeight: 38 },
} as const satisfies Record<string, TextStyle>;

export type AppHeadingLevel = keyof typeof APP_HEADING;

export const APP_HEADING_WEIGHT: Record<
  AppHeadingLevel,
  "regular" | "medium" | "bold" | "extraBold"
> = {
  h1: "extraBold",
  h2: "extraBold",
  h3: "extraBold",
  h4: "bold",
};
