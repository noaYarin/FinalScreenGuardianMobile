import { StyleSheet } from "react-native";

export const REPORTS_COLORS = {
  primary: "#4F46E5",
  screenBg: "#EEF2FF",
  card: "#FFFFFF",
  cardBorder: "#E5E7EB",
  mutedText: "#6B7280",
  valueText: "#4F46E5",
  bar: "#93C5FD",
  tabInactiveBg: "#F3F4F6",
  tabInactiveText: "#4B5563",
  tabActiveBg: "#4F46E5",
  tabActiveText: "#FFFFFF",
};

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: REPORTS_COLORS.screenBg,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyStateCard: {
    backgroundColor: REPORTS_COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: REPORTS_COLORS.cardBorder,
    gap: 8,
  },

  emptyStateTitle: {
    fontSize: 16,
    color: "#111827",
  },

  emptyStateText: {
    fontSize: 14,
    color: REPORTS_COLORS.mutedText,
    lineHeight: 20,
  },

  hintText: {
    fontSize: 13,
    color: REPORTS_COLORS.mutedText,
    textAlign: "center",
  },

  generateReportBtn: {
    marginTop: 8,
    backgroundColor: REPORTS_COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  generateReportBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
});

export const timeTabsStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
  },

  tab: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: REPORTS_COLORS.tabInactiveBg,
  },

  tabActive: {
    backgroundColor: REPORTS_COLORS.tabActiveBg,
  },

  tabText: {
    fontSize: 15,
    color: REPORTS_COLORS.tabInactiveText,
  },

  tabTextActive: {
    color: REPORTS_COLORS.tabActiveText,
  },
});

export const chartStyles = StyleSheet.create({
  card: {
    backgroundColor: REPORTS_COLORS.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: REPORTS_COLORS.cardBorder,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: 12,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 18,
    color: "#111827",
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  chartViewport: {
    alignItems: "flex-start",
    overflow: "visible",
    paddingLeft: 4,
  },

  chartViewportCentered: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    paddingVertical: 8,
  },

  donutLegend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 4,
  },

  donutLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  donutLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  donutLegendText: {
    fontSize: 13,
    color: REPORTS_COLORS.mutedText,
  },
});

export const metricRowStyles = StyleSheet.create({
  card: {
    backgroundColor: REPORTS_COLORS.card,
    borderRadius: 16,
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: REPORTS_COLORS.cardBorder,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 16,
    color: "#111827",
    textAlign: "left",
  },

  value: {
    fontSize: 16,
    color: REPORTS_COLORS.valueText,
    textAlign: "right",
  },
});
