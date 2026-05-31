import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";
import {
  PARENT_HEADING,
  PARENT_TEXT,
} from "@/src/theme/parentTypography";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },

  topCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    padding: 14,
    gap: 10,
  },

  primaryActionButtonFull: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: COLORS.light.tint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  secondaryActionButtonFull: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F5F8FF",
    borderWidth: 1,
    borderColor: "#D9E4FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  mainPanel: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    overflow: "hidden",
  },

  panelSection: {
    padding: 16,
    gap: 10,
  },

  panelListSection: {
    backgroundColor: "#FAFBFE",
  },

  panelDivider: {
    height: 1,
    backgroundColor: "#E8EEF7",
  },

  panelLabel: {
    ...PARENT_TEXT.bodySmall,
    color: "#64748B",
  },

  listHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  listHeaderTitle: {
    ...PARENT_HEADING.h2,
    color: "#0F172A",
  },

  countPill: {
    minWidth: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  countPillText: {
    ...PARENT_TEXT.bodySmall,
    color: "#4C6FFF",
  },

  title: {
    ...PARENT_HEADING.h1,
    color: "#0F172A",
    textAlign: "center",
  },

  sectionLabel: {
    ...PARENT_TEXT.bodySmall,
    color: "#64748B",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },

  primaryActionButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: COLORS.light.tint,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  primaryActionButtonText: {
    fontSize: 15,
    color: "#1D4ED8",
  },

  secondaryActionButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#F5F8FF",
    borderWidth: 1,
    borderColor: "#D9E4FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  secondaryActionButtonText: {
    fontSize: 15,
    color: "#4C6FFF",
  },

  btnSecondary: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.light.tint,
    borderWidth: 0,
  },

  btnSecondaryText: {
    fontSize: 16,
    color: "#1D4ED8",
  },

  filterCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    padding: 16,
    gap: 12,
  },

  filterModeRow: {
    flexDirection: "row",
    gap: 10,
  },

  filterModeButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E3F4",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  filterModeButtonActive: {
    backgroundColor: "#5B7FFF",
    borderColor: "#5B7FFF",
  },

  filterModeButtonText: {
    fontSize: 14,
    color: "#334155",
  },

  filterModeButtonTextActive: {
    color: "#FFFFFF",
  },

  selectorWrap: {
    marginTop: 2,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 10,
  },

  tabButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9E4FF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  tabButtonActive: {
    backgroundColor: "#5B7FFF",
    borderColor: "#5B7FFF",
  },

  tabButtonText: {
    fontSize: 14,
    color: "#4C6FFF",
  },

  tabButtonTextActive: {
    color: "#FFFFFF",
  },

  tabCountBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  tabCountBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },

  tabCountText: {
    fontSize: 12,
    color: "#4C6FFF",
  },

  tabCountTextActive: {
    color: "#FFFFFF",
  },

  listSection: {
    gap: 12,
  },

  listContent: {
    gap: 12,
  },

  rewardCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3EBF7",
    backgroundColor: "#FFFFFF",
    padding: 14,
    gap: 10,
  },

  rewardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  rewardMainInfo: {
    flex: 1,
    gap: 8,
  },

  rewardTitle: {
    ...PARENT_HEADING.h3,
    color: "#0F172A",
  },

  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardMetaLabel: {
    fontSize: 13,
    color: "#64748B",
    minWidth: 64,
  },

  cardMetaValue: {
    fontSize: 14,
    color: "#0F172A",
  },

  coinsBadge: {
    borderRadius: 14,
    backgroundColor: "#FFF8E7",
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    gap: 2,
    minWidth: 58,
  },

  coinsBadgeText: {
    fontSize: 16,
    color: "#7C5A06",
  },

  coinsBadgeLabel: {
    fontSize: 11,
    color: "#92400E",
  },

  rewardBottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  availablePill: {
    borderRadius: 999,
    backgroundColor: "#EEF3FF",
    borderWidth: 1,
    borderColor: "#D9E4FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  availablePillText: {
    fontSize: 12,
    color: "#4C6FFF",
  },

  redeemedPill: {
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  redeemedPillText: {
    fontSize: 12,
    color: "#15803D",
  },

  emptyState: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3EBF7",
    backgroundColor: "#FFFFFF",
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  emptyStateTitle: {
    ...PARENT_HEADING.h1,
    color: "#243447",
  },

  emptyStateText: {
    textAlign: "center",
    ...PARENT_TEXT.subtitle,
    color: "#64748B",
  },

  pressed: {
    opacity: 0.85,
  },

  deleteRewardButton: {
    borderRadius: 999,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  deleteRewardButtonText: {
    fontSize: 12,
    color: "#DC2626",
  },

  disabledButton: {
    opacity: 0.6,
  },
});
