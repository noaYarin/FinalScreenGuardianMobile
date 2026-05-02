import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
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
    fontSize: 28,
    lineHeight: 34,
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
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

  tabsRow: {
    flexDirection: "row",
    gap: 10,
  },

  tabButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9E4FF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  tabButtonActive: {
    backgroundColor: "#5B7FFF",
    borderColor: "#5B7FFF",
  },

  tabButtonText: {
    fontSize: 13,
    color: "#4C6FFF",
  },

  tabButtonTextActive: {
    color: "#FFFFFF",
  },

  tabCountBadge: {
    minWidth: 24,
    height: 24,
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
    fontSize: 22,
    lineHeight: 28,
    color: "#1E293B",
  },

  listSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
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

  taskCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EEF7",
    backgroundColor: "#FBFDFF",
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
    gap: 4,
  },

  taskTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1E293B",
  },

  taskMeta: {
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

  taskNote: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },

  proofImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },

  taskBottomRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  metaPill: {
    borderRadius: 999,
    backgroundColor: "#EEF3FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  metaPillText: {
    fontSize: 12,
    color: "#4C6FFF",
  },

  approvedPill: {
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

  approvedPillText: {
    fontSize: 12,
    color: "#15803D",
  },

  completedPill: {
    borderRadius: 999,
    backgroundColor: "#F5F8FF",
    borderWidth: 1,
    borderColor: "#D9E4FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  completedPillText: {
    fontSize: 12,
    color: "#4C6FFF",
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
    fontSize: 16,
    color: "#243447",
  },

  emptyStateText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },

  pressed: {
    opacity: 0.85,
  },

    proofPill: {
    borderRadius: 999,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "#D9E4FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  proofPillText: {
    fontSize: 12,
    color: "#4C6FFF",
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