import { StyleSheet } from "react-native";
import {
  PARENT_DISPLAY,
  PARENT_HEADING,
  PARENT_TEXT,
} from "@/src/theme/parentTypography";

const COLORS = {
  white: "#FFFFFF",
  bg: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  soft: "#EFF6FF",
  blue: "#2563EB",
  border: "#E2E8F0",
  red: "#DC2626",
  redSoft: "#FEE2E2",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  orange: "#EA580C",
  orangeSoft: "#FFEDD5",
  shadow: "#000000",
};

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    gap: 16,
  },

  containerWide: {
    maxWidth: 760,
  },

  introCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    flexDirection: "row",
    gap: 14,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  introIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.soft,
    alignItems: "center",
    justifyContent: "center",
  },

  introTextWrap: {
    flex: 1,
    gap: 6,
  },

  title: {
    ...PARENT_HEADING.h1,
    color: COLORS.text,
  },

  subtitle: {
    ...PARENT_TEXT.subtitle,
    color: COLORS.muted,
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },

  summaryCard: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    minHeight: 82,
    justifyContent: "center",
  },

  summaryNumber: {
    ...PARENT_DISPLAY.stat,
    color: COLORS.text,
  },

  summaryLabel: {
    ...PARENT_TEXT.bodySmall,
    color: COLORS.muted,
    marginTop: 4,
  },

  toolsCard: {
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 12,
  },

  searchBox: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 8,
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
  },

  filterChip: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  filterChipSelected: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },

  filterChipText: {
    ...PARENT_TEXT.bodySmall,
    color: COLORS.muted,
  },

  filterChipTextSelected: {
    color: COLORS.white,
  },

  appsList: {
    gap: 12,
  },

  appCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.soft,
    alignItems: "center",
    justifyContent: "center",
  },

  appInfo: {
    flex: 1,
    gap: 4,
  },

  appName: {
    ...PARENT_HEADING.h3,
    color: COLORS.text,
  },

  packageName: {
    fontSize: 12,
    color: COLORS.muted,
  },

  usageBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 4,
    backgroundColor: COLORS.orangeSoft,
  },

  usageText: {
    fontSize: 12,
    color: COLORS.orange,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },

  statusBadgeBlocked: {
    backgroundColor: COLORS.redSoft,
  },

  statusBadgeAllowed: {
    backgroundColor: COLORS.greenSoft,
  },

  statusText: {
    fontSize: 12,
  },

  statusTextBlocked: {
    color: COLORS.red,
  },

  statusTextAllowed: {
    color: COLORS.green,
  },

  actionButton: {
    minWidth: 76,
    minHeight: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  blockButton: {
    backgroundColor: COLORS.red,
  },

  allowButton: {
    backgroundColor: COLORS.green,
  },

  actionButtonDisabled: {
    opacity: 0.55,
  },

  actionButtonText: {
    fontSize: 13,
    color: COLORS.white,
  },

  stateCard: {
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },

  emptyTitle: {
    ...PARENT_HEADING.h1,
    color: COLORS.text,
    textAlign: "center",
  },

  stateText: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
  },
});