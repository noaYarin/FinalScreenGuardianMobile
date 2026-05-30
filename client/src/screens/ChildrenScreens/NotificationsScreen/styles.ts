import { StyleSheet } from "react-native";

import {
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

const COLORS = {
  white: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  blue: "#2563EB",
  blueSoft: "#EAF2FF",
  blueBorder: "#D6E6FF",
  greenSoft: "#DCFCE7",
  greenText: "#166534",
  shadow: "#000000",
};

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    gap: 18,
  },

  tabletContainer: {
    maxWidth: 720,
  },

  heroCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },

  heroIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: COLORS.blueSoft,
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  heroTextBlock: {
    flex: 1,
    gap: 4,
  },

  title: {
    ...CHILD_HEADING.h1,
    color: COLORS.text,
  },

  subtitle: {
    ...CHILD_TEXT.subtitle,
    color: COLORS.muted,
  },

  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  filterChipSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },

  filterText: {
    ...CHILD_HEADING.h4,
    color: COLORS.muted,
  },

  filterTextSelected: {
    color: COLORS.white,
  },

  list: {
    width: "100%",
    gap: 12,
  },

  notificationCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    flexDirection: "row",
    gap: 14,
  },

  notificationIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationContent: {
    flex: 1,
    gap: 6,
  },

  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  notificationTitle: {
    flex: 1,
    ...CHILD_HEADING.h3,
    color: COLORS.text,
  },

  notificationMessage: {
    ...CHILD_TEXT.body,
    color: COLORS.muted,
  },

  timeLabel: {
    ...CHILD_TEXT.bodySmall,
    color: COLORS.muted,
  },

  newBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: COLORS.greenSoft,
  },

  newBadgeText: {
    ...CHILD_TEXT.caption,
    color: COLORS.greenText,
  },
});