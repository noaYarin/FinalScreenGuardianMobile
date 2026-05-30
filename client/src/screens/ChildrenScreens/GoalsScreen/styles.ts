import { StyleSheet } from "react-native";

import {
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

export const COLORS = {
  white: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  accent: "#2563EB",
  heroBorder: "#E2E8F0",
  shadow: "#0F172A",
};

export const LOCKED_BADGE_COLORS = {
  border: "#CBD5E1",
  icon: "#94A3B8",
  lockBorder: "#E2E8F0",
  lockIcon: "#94A3B8",
};

export const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    gap: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  heroCard: {
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: COLORS.heroBorder,
    alignItems: "center",
    gap: 12,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  stateMessage: {
    ...CHILD_TEXT.body,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  errorCard: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FECDD3",
  },

  errorTitle: {
    ...CHILD_HEADING.h2,
    color: COLORS.text,
    textAlign: "center",
  },

  errorSubtitle: {
    ...CHILD_TEXT.subtitle,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  heroEyebrow: {
    ...CHILD_TEXT.bodySmall,
    color: COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textAlign: "center",
  },

  heroTitle: {
    ...CHILD_HEADING.h1,
    color: COLORS.text,
    textAlign: "center",
  },

  heroDescription: {
    ...CHILD_TEXT.body,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingHorizontal: 8,
  },

  heroCompleteCard: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  heroCompleteTitle: {
    ...CHILD_HEADING.h3,
    color: "#14532D",
    textAlign: "center",
  },

  heroCompleteSubtitle: {
    ...CHILD_TEXT.subtitle,
    color: "#166534",
    textAlign: "center",
  },

  sectionHeader: {
    gap: 4,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    ...CHILD_HEADING.h2,
    color: COLORS.text,
    textAlign: "left",
  },

  sectionSubtitle: {
    ...CHILD_TEXT.bodySmall,
    color: COLORS.textMuted,
    textAlign: "left",
  },

  badgeGrid: {
    gap: 14,
  },

  badgeGridRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 20,
  },

  badgeGridItem: {
    width: 96,
    alignItems: "center",
  },

  badgeWrap: {
    alignItems: "center",
    gap: 8,
    alignSelf: "center",
  },

  badgeWrapHero: {
    alignItems: "center",
    justifyContent: "center",
  },

  badgeShell: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeCircle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },

  badgeCircleLocked: {
    opacity: 0.9,
  },

  badgeIconLocked: {
    opacity: 0.75,
  },

  lockBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  lockBadgeHero: {
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
  },

  earnedBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  earnedBadgeHero: {
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2.5,
  },

  badgeCaption: {
    alignItems: "center",
    paddingHorizontal: 2,
    minHeight: 28,
  },

  badgeTitle: {
    ...CHILD_TEXT.caption,
    color: COLORS.text,
    textAlign: "center",
  },

  badgeTitleLocked: {
    color: COLORS.textMuted,
  },

  summaryPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  summaryPillText: {
    ...CHILD_TEXT.bodySmall,
    color: COLORS.textMuted,
  },

  summaryPillValue: {
    ...CHILD_TEXT.bodySmall,
    color: COLORS.accent,
  },
});
