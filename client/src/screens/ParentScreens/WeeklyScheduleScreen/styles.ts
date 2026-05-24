import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 130,
  },

  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  contentMaxWidth: {
    width: "100%",
    maxWidth: 980,
    gap: 14,
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  heroIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  heroTextWrap: {
    flex: 1,
    gap: 3,
  },

  heroTitle: {
    fontSize: 21,
    color: "#172033",
  },

  heroSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#64748B",
  },

  scheduleToggleCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  scheduleToggleTextWrap: {
    flex: 1,
  },

  scheduleToggleTitle: {
    fontSize: 15,
    color: "#172033",
    marginBottom: 3,
  },

  scheduleToggleSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#64748B",
  },

  unsavedInlineText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "#B45309",
  },

  scheduleStatusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },

  scheduleStatusBadgeActive: {
    backgroundColor: "#ECFDF3",
    borderColor: "#BBF7D0",
  },

  scheduleStatusBadgeInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },

  scheduleStatusText: {
    fontSize: 12.5,
  },

  scheduleStatusTextActive: {
    color: "#1F7A3D",
  },

  scheduleStatusTextInactive: {
    color: "#64748B",
  },

  heroStatsRow: {
    flexDirection: "row",
    gap: 10,
  },

  heroStatsColumn: {
    flexDirection: "column",
  },

  statCard: {
    flex: 1,
    minHeight: 74,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    padding: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    gap: 5,
  },

  statLabel: {
    fontSize: 12.5,
    color: "#64748B",
  },

  statValue: {
    fontSize: 22,
    color: "#172033",
  },

  daysRailSection: {
    gap: 9,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  sectionTitle: {
    fontSize: 17,
    color: "#172033",
  },

  sectionHint: {
    fontSize: 12.5,
    color: "#64748B",
  },

  dayRailOuter: {
    width: "100%",
  },

  dayRailWrap: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },

  dayRailChip: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 7,
  },

  dayRailChipActive: {
    backgroundColor: "#FFFFFF",
  },

  dayRailChipInactive: {
    backgroundColor: "#F8FAFC",
  },

  dayRailChipFocused: {
    backgroundColor: "#2F6BFF",
    borderColor: "#2F6BFF",
  },

  dayRailChipPressed: {
    opacity: 0.82,
  },

  dayRailChipLetter: {
    fontSize: 15,
  },

  dayRailChipLetterActive: {
    color: "#2F6BFF",
  },

  dayRailChipLetterInactive: {
    color: "#94A3B8",
  },

  dayRailChipLabel: {
    marginTop: 2,
    fontSize: 9.5,
  },

  dayRailChipLabelActive: {
    color: "#64748B",
  },

  dayRailChipLabelInactive: {
    color: "#94A3B8",
  },

  dayRailChipFocusedText: {
    color: "#FFFFFF",
  },

  weeklyOverviewSection: {
    marginBottom: 2,
  },

  weeklyOverviewTextButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
  },

  weeklyOverviewTextButtonPressed: {
    opacity: 0.65,
  },

  weeklyOverviewTextButtonLabel: {
    fontSize: 13.5,
    color: "#2F6BFF",
  },

  weeklyOverviewSimpleCard: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  weeklyOverviewSimpleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  weeklyOverviewSimpleDay: {
    flex: 1,
    fontSize: 13.5,
    color: "#172033",
  },

  weeklyOverviewSimpleTime: {
    fontSize: 13,
    color: "#2F6BFF",
    textAlign: "right",
  },

  weeklyOverviewSimpleBlocked: {
    color: "#B42318",
  },

  weeklyOverviewSimpleAllDay: {
    color: "#1F7A3D",
  },

  cardsSection: {
    gap: 10,
  },

  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },

  dayCardActive: {
    borderColor: "#2F6BFF",
    borderWidth: 1.5,
  },

  dayCardDisabled: {
    backgroundColor: "#FFF7F7",
  },

  dayCardHeader: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 14,
  },

  dayIdentityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  dayBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  dayBadgeDisabled: {
    backgroundColor: "#FEF2F2",
  },

  dayBadgeText: {
    fontSize: 17,
    color: "#2F6BFF",
  },

  dayNameWrap: {
    flex: 1,
    gap: 3,
  },

  dayName: {
    fontSize: 17,
    color: "#172033",
  },

  dayStatus: {
    fontSize: 12.5,
    color: "#64748B",
  },

  dayStatusAllowed: {
    color: "#1F7A3D",
  },

  dayStatusBlocked: {
    color: "#B42318",
  },

  dayHeaderRight: {
    alignItems: "flex-end",
    gap: 7,
  },

  scheduleModeStatusPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },

  scheduleModeStatusPillAllowed: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },

  scheduleModeStatusPillAllDay: {
    backgroundColor: "#ECFDF3",
    borderColor: "#BBF7D0",
  },

  scheduleModeStatusPillBlocked: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  scheduleModeStatusText: {
    fontSize: 11.5,
  },

  scheduleModeStatusTextAllowed: {
    color: "#2F6BFF",
  },

  scheduleModeStatusTextAllDay: {
    color: "#1F7A3D",
  },

  scheduleModeStatusTextBlocked: {
    color: "#B42318",
  },

  dayExpandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    padding: 14,
    backgroundColor: "#FFFFFF",
  },

  scheduleModeButtonsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  scheduleModeButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    paddingVertical: 8,
  },

  scheduleModeButtonActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#2F6BFF",
  },

  scheduleModeButtonSuccessActive: {
    backgroundColor: "#ECFDF3",
    borderColor: "#1F7A3D",
  },

  scheduleModeButtonDangerActive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#B42318",
  },

  scheduleModeButtonPressed: {
    opacity: 0.8,
  },

  scheduleModeButtonText: {
    fontSize: 11.3,
    color: "#64748B",
    textAlign: "center",
  },

  scheduleModeButtonTextActive: {
    color: "#2F6BFF",
  },

  scheduleModeButtonSuccessTextActive: {
    color: "#1F7A3D",
  },

  scheduleModeButtonDangerTextActive: {
    color: "#B42318",
  },

  blockedDayMessage: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  blockedDayText: {
    fontSize: 13,
    color: "#B42318",
  },

  timeGrid: {
    gap: 12,
  },

  timeGridTablet: {
    flexDirection: "row",
  },

  timeCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },

  timeLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  timeLabel: {
    fontSize: 13.5,
    color: "#64748B",
  },

  timeValueBox: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E0EC",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  timeValue: {
    flex: 1,
    fontSize: 17,
    color: "#172033",
    textAlign: "center",
  },

  timeAdjustButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  timeAdjustButtonPressed: {
    opacity: 0.82,
  },

  dayFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
  },

  totalHoursPill: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    alignSelf: "flex-start",
  },

  totalHoursText: {
    fontSize: 13,
    color: "#334155",
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  footerUnsavedRow: {
    alignItems: "center",
    marginBottom: 8,
  },

  footerUnsavedText: {
    fontSize: 12.5,
    color: "#B45309",
  },

  primaryActionButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#2F6BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryActionButtonPressed: {
    opacity: 0.88,
  },

  primaryActionButtonDisabled: {
    opacity: 0.45,
  },

  primaryActionText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});