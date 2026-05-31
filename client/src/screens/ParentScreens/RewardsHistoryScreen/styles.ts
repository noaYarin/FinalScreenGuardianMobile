import { StyleSheet } from "react-native";
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

  listHeaderSubtitle: {
    marginTop: 2,
    ...PARENT_TEXT.bodySmall,
    color: "#64748B",
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
    fontSize: 13,
    color: "#4C6FFF",
  },

  headerRow: {
    gap: 12,
  },

  headerRowWide: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },

  titleBlock: {
    flex: 1,
    gap: 4,
  },

  title: {
    ...PARENT_HEADING.h1,
    color: "#1E293B",
  },

  subtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#64748B",
  },

  filterCard: {
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    padding: 14,
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
    backgroundColor: "#FFFFFF",
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
    color: "#243447",
  },

  filterModeButtonTextActive: {
    color: "#FFFFFF",
  },

  selectorWrap: {
    marginTop: 2,
  },

  listSection: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    padding: 16,
    gap: 14,
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  listTitle: {
    ...PARENT_HEADING.h1,
    color: "#1E293B",
  },

  listSubtitle: {
    marginTop: 4,
    ...PARENT_TEXT.subtitle,
    color: "#64748B",
  },

  listCountPill: {
    borderRadius: 999,
    backgroundColor: "#EEF3FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  listCountPillText: {
    fontSize: 12,
    color: "#4C6FFF",
  },

  listContent: {
    gap: 12,
  },

  rewardCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EEF7",
    backgroundColor: "#FBFDFF",
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
    gap: 4,
  },

  rewardTitle: {
    ...PARENT_HEADING.h3,
    color: "#1E293B",
  },

  rewardMeta: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
  },

  coinsBadge: {
    borderRadius: 999,
    backgroundColor: "#FFF8E7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  coinsBadgeText: {
    fontSize: 13,
    color: "#7C5A06",
  },

  rewardNote: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },

  rewardBottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7EEF7",
    backgroundColor: "#FBFDFF",
    paddingVertical: 28,
    paddingHorizontal: 18,
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
});