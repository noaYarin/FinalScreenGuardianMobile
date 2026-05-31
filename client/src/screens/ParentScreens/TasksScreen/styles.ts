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
    flex: 1,
    minHeight: 44,
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

  outlineActionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#DDD6FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 14,
  },

  outlineActionButtonText: {
    fontSize: 14,
    color: "#7C3AED",
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

  taskCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3EBF7",
    backgroundColor: "#FFFFFF",
    padding: 14,
    gap: 10,
  },

  taskTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  taskMainInfo: {
    flex: 1,
    gap: 8,
  },

  taskTitle: {
    ...PARENT_HEADING.h3,
    color: "#0F172A",
  },

  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardMetaLabel: {
    ...PARENT_TEXT.bodySmall,
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

  taskBottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  taskActionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  proofPill: {
    borderRadius: 999,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "#D9E4FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  proofPillText: {
    ...PARENT_TEXT.bodySmall,
    color: "#4C6FFF",
  },

  approveButton: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  approveButtonText: {
    fontSize: 14,
    color: "#16A34A",
  },

  rejectButton: {
    flex: 1,
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  rejectButtonText: {
    fontSize: 14,
    color: "#DC2626",
  },

  deleteButton: {
    minHeight: 46,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteButtonText: {
    fontSize: 14,
    color: "#DC2626",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  modalImage: {
    width: "100%",
    height: "78%",
    borderRadius: 18,
  },

  modalCloseButton: {
    position: "absolute",
    top: 46,
    right: 18,
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.75)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});
