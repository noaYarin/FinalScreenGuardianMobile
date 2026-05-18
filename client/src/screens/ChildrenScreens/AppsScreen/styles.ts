import { StyleSheet } from "react-native";

const COLORS = {
  white: "#FFFFFF",
  bg: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",

  blue: "#2563EB",
  blueSoft: "#DBEAFE",

  mint: "#DCFCE7",
  green: "#16A34A",

  orangeSoft: "#FFEDD5",

  redSoft: "#FEE2E2",
  red: "#DC2626",

  yellowSoft: "#FEF3C7",

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
    alignSelf: "center",
  },

  heroCard: {
    borderRadius: 30,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  heroText: {
    flex: 1,
    gap: 5,
  },

  title: {
    fontSize: 24,
    lineHeight: 31,
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: COLORS.orangeSoft,
    borderWidth: 1,
    borderColor: "#FED7AA",
    padding: 18,
  },

  lockedStatCard: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: COLORS.redSoft,
    borderWidth: 1,
    borderColor: "#FECACA",
    padding: 18,
  },

  statNumber: {
    fontSize: 28,
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 13,
    marginTop: 4,
    color: COLORS.muted,
  },

  refreshButton: {
    minHeight: 54,
    borderRadius: 22,
    backgroundColor: COLORS.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  refreshText: {
    color: COLORS.white,
    fontSize: 15,
  },

  lockedSection: {
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    gap: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionTitle: {
    fontSize: 18,
    color: COLORS.text,
  },

  sectionHint: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
  },

  lockedChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  lockedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.redSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  lockedChipText: {
    color: COLORS.red,
    fontSize: 13,
  },

  searchCard: {
    minHeight: 52,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 8,
  },

  appsList: {
    gap: 12,
  },

  appCard: {
    borderRadius: 26,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 1,
  },

  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  appIconLocked: {
    backgroundColor: COLORS.redSoft,
  },

  appInfo: {
    flex: 1,
    gap: 4,
  },

  appName: {
    fontSize: 16,
    color: COLORS.text,
  },

  packageName: {
    fontSize: 12,
    color: COLORS.muted,
  },

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    minWidth: 88,
    alignItems: "center",
  },

  openBadge: {
    backgroundColor: COLORS.mint,
  },

  lockedBadge: {
    backgroundColor: COLORS.redSoft,
  },

  statusBadgeText: {
    fontSize: 13,
  },

  openBadgeText: {
    color: COLORS.green,
  },

  lockedBadgeText: {
    color: COLORS.red,
  },

  stateCard: {
    borderRadius: 26,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },

  emptyTitle: {
    fontSize: 18,
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