import { StyleSheet } from "react-native";
import { REPORTS_COLORS } from "@/src/screens/ParentScreens/ReportsScreen/styles";
import {
  PARENT_HEADING,
  PARENT_TEXT,
  PARENT_DISPLAY,
} from "@/src/theme/parentTypography";

export const analyticsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
    paddingBottom: 40,
  },
  scroll: {
    flexGrow: 1,
    padding: 16,
  },
  scrollWithFooter: {
    paddingBottom: 120,
  },
  paper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 20,
    marginBottom: 16,
  },
  paperFill: {
    flex: 1,
    marginBottom: 16,
  },
  infoBulbRow: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  brand: {
    ...PARENT_TEXT.bodySmall,
    color: REPORTS_COLORS.mutedText,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    ...PARENT_HEADING.h1,
    color: "#111827",
    marginTop: 4,
  },
  meta: {
    marginTop: 12,
    fontSize: 14,
    color: REPORTS_COLORS.mutedText,
    lineHeight: 22,
  },
  sectionTitle: {
    ...PARENT_HEADING.h2,
    color: REPORTS_COLORS.primary,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  indicatorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  indicatorCard: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
  },
  indicatorLabel: {
    fontSize: 12,
    color: REPORTS_COLORS.mutedText,
  },
  indicatorValue: {
    ...PARENT_DISPLAY.stat,
    color: "#111827",
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableCell: {
    fontSize: 12,
    color: "#374151",
  },
  colApp: { flex: 2 },
  colTime: { flex: 1.2 },
  colPct: { flex: 0.8 },
  colStatus: { flex: 1.2 },
  note: {
    fontSize: 12,
    color: REPORTS_COLORS.mutedText,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 40,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: REPORTS_COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  secondaryBtn: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  btnTextSecondary: {
    color: REPORTS_COLORS.primary,
    fontSize: 15,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  dateLabel: {
    fontSize: 12,
    color: REPORTS_COLORS.mutedText,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    color: "#111827",
  },
  generateBtn: {
    marginTop: 20,
    backgroundColor: REPORTS_COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  aiSummaryCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    padding: 12,
    gap: 6,
  },
  aiRiskLabel: {
    ...PARENT_TEXT.bodySmall,
    color: REPORTS_COLORS.primary,
  },

  smartSection: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E0E7FF",
    padding: 16,
    marginTop: 18,
    gap: 14,
  },

  smartHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  smartIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  smartIcon: {
    fontSize: 18,
  },

  smartHeaderText: {
    flex: 1,
  },

  smartTitle: {
    ...PARENT_HEADING.h3,
    color: "#111827",
  },

  smartSubtitle: {
    ...PARENT_TEXT.bodySmall,
    color: "#6B7280",
    marginTop: 2,
  },

  attentionBadge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  attentionText: {
    fontSize: 11,
    color: REPORTS_COLORS.primary,
  },

  smartSummary: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },

  insightsList: {
    gap: 10,
  },

  insightCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },

  insightPositive: {
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
  },

  insightWarning: {
    borderColor: "#FED7AA",
    backgroundColor: "#FFF7ED",
  },

  insightRecommendation: {
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },

  insightInfo: {
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  insightHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  insightIcon: {
    fontSize: 15,
  },

  insightTitle: {
    flex: 1,
    ...PARENT_HEADING.h3,
    color: "#111827",
  },

  insightMessage: {
    ...PARENT_TEXT.bodySmall,
    lineHeight: 20,
    color: "#4B5563",
  },

  sectionHeaderCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginTop: 16,
  },

  sectionHeaderTitle: {
    ...PARENT_HEADING.h2,
    color: "#111827",
  },

  sectionHeaderSubtitle: {
    ...PARENT_TEXT.bodySmall,
    color: "#6B7280",
    marginTop: 3,
  },
  appNameCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  appRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  appRankText: {
    fontSize: 12,
    color: REPORTS_COLORS.primary,
  },

  appNameText: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
  },
  generateNote: {
  fontSize: 12,
  lineHeight: 18,
  color: "#6B7280",
  textAlign: "center",
  marginTop: 4,
  marginBottom: 10,
},
});
