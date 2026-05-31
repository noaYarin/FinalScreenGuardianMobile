import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";
import {
  PARENT_HEADING,
  PARENT_TEXT,
} from "@/src/theme/parentTypography";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    gap: 22,
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: "#315BFF",
    gap: 10,
  },

  infoBulbRow: {
    width: "100%",
    alignSelf: "flex-start",
  },

  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  heroAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  heroAvatarText: {
    fontSize: 26,
    color: "#FFFFFF",
    textAlign: "center",
  },

  heroTextBlock: {
    flex: 1,
    gap: 4,
  },

  heroTitle: {
    ...PARENT_HEADING.h1,
    color: "#ffffff",
  },

  heroSubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "rgba(255,255,255,0.88)",
  },

  cardsList: {
    gap: 18,
  },

  limitCard: {
    width: "100%",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#E8EEF8",
    shadowColor: "#102040",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  limitTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },

  limitTitleWrap: {
    flex: 1,
    gap: 4,
  },

  limitTitle: {
    ...PARENT_HEADING.h3,
    color: "#1F2A44",
  },

  limitMeta: {
    ...PARENT_TEXT.bodySmall,
    color: "#7B879C",
  },

  limitIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  timePillsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 16,
  },

  timePill: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#F8FAFD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  timePillLabel: {
    ...PARENT_TEXT.bodySmall,
    color: "#7B879C",
    marginBottom: 6,
  },

  timePillValue: {
    fontSize: 18,
    color: "#1F2A44",
    textAlign: "left",
  },

  progressMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  progressMetaText: {
    ...PARENT_TEXT.bodySmall,
    color: "#6E7A90",
  },

  progressMetaValue: {
    fontSize: 14,
    color: "#3D6BF2",
  },

  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E8EEF8",
    overflow: "hidden",
    marginBottom: 14,
    position: "relative",
  },

  progressFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
    backgroundColor: "#3D6BF2",
  },

  summaryText: {
    fontSize: 15,
    color: "#53627C",
    marginBottom: 18,
    lineHeight: 22,
  },

  actionsRow: {
    gap: 12,
  },

  statusChip: {
    alignSelf: "flex-start",
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  statusChipNormal: {
    backgroundColor: "#EAF8F2",
  },

  statusChipReached: {
    backgroundColor: "#FEE2E2",
  },

  statusChipTextReached: {
    color: "#DC2626",
  },

  statusChipWarning: {
    backgroundColor: "#FFF4E5",
  },

  statusChipText: {
    fontSize: 12,
  },

  statusChipTextNormal: {
    color: "#1C8C5E",
  },

  statusChipTextWarning: {
    color: "#C67A18",
  },

  editButtonWrap: {
    width: "100%",
  },

  editButton: {
    alignSelf: "stretch",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#3D6BF2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    shadowColor: "#3D6BF2",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  editButtonPressed: {
    opacity: 0.85,
  },

  editButtonText: {
    fontSize: 17,
    color: "#FFFFFF",
    textAlign: "center",
  },

  editorWrap: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E6EEFF",
    padding: 14,
    gap: 12,
  },

  editorHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  editorTitle: {
    ...PARENT_HEADING.h2,
    color: "#1F2A44",
  },

  editorControlsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },

  stepButton: {
    minWidth: 76,
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    alignSelf: "center",
  },

  stepButtonPrimary: {
    backgroundColor: "#3D6BF2",
  },

  stepButtonSecondary: {
    backgroundColor: "#EEF3FB",
    borderWidth: 1,
    borderColor: "#D9E4F6",
  },

  stepButtonPressed: {
    opacity: 0.85,
  },

  stepButtonDisabled: {
    opacity: 0.55,
  },

  stepButtonTextPrimary: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  stepButtonTextSecondary: {
    fontSize: 15,
    color: "#1F2A44",
  },

  stepButtonTextDisabled: {
    color: "#A8B3C7",
  },

  currentValueBox: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8EEF8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  currentValueLabel: {
    fontSize: 11,
    color: "#7B879C",
    marginBottom: 3,
    textAlign: "center",
  },

  currentValueText: {
    fontSize: 18,
    color: "#1F2A44",
    textAlign: "center",
  },

  manualInput: {
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9E2F2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2A44",
    textAlign: "center",
  },

  manualInputDisabled: {
    backgroundColor: "#F3F4F6",
    color: "#9CA3AF",
  },

  emptyState: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 8,
  },

  emptyTitle: {
    ...PARENT_HEADING.h1,
    color: "#1F2A44",
    textAlign: "center",
  },

  editorHint: {
    ...PARENT_TEXT.bodySmall,
    color: "#6B7890",
  },

  emptySubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#6B7280",
    textAlign: "center",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  switchTextWrap: {
    flex: 1,
  },

  switchHint: {
    ...PARENT_TEXT.bodySmall,
    color: "#6B7890",
    marginTop: 4,
  },

  saveButtonStrong: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#2563EB",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  saveButtonStrongPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  saveButtonStrongText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  saveButtonStrongBottom: {
    marginTop: 16,
    alignSelf: "stretch",
    justifyContent: "center",
  },
  editorHintBottom: {
    marginTop: 14,
    marginBottom: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scheduleToggleCard: {
    marginTop: 16,
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
    ...PARENT_HEADING.h2,
    color: "#172033",
    marginBottom: 3,
  },

  scheduleToggleSubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#6B7280",
  },

  unsavedChangesBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF7ED",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FED7AA",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  unsavedChangesText: {
    flex: 1,
    fontSize: 12.5,
    color: "#B45309",
  },

  savedChangesBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ECFDF3",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  savedChangesText: {
    flex: 1,
    fontSize: 12.5,
    color: "#1F7A3D",
  },

  weeklyOverviewSection: {
    marginBottom: 14,
  },

  weeklyOverviewToggle: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  weeklyOverviewTogglePressed: {
    opacity: 0.85,
  },

  weeklyOverviewToggleLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  weeklyOverviewToggleText: {
    fontSize: 14,
    color: "#172033",
  },

  weeklyOverviewCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
  },

  weeklyOverviewHeader: {
    marginBottom: 10,
  },

  weeklyOverviewTitle: {
    ...PARENT_HEADING.h2,
    color: "#172033",
    marginBottom: 3,
  },

  weeklyOverviewSubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#6B7280",
  },

  weeklyOverviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  weeklyOverviewDayWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  weeklyOverviewDayBadge: {
    width: 30,
    height: 30,
    borderRadius: 11,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  weeklyOverviewDayBadgeBlocked: {
    backgroundColor: "#FEF2F2",
  },

  weeklyOverviewDayBadgeAllDay: {
    backgroundColor: "#ECFDF3",
  },

  weeklyOverviewDayBadgeText: {
    fontSize: 12,
    color: "#2F6BFF",
  },

  weeklyOverviewDayBadgeTextBlocked: {
    color: "#B42318",
  },

  weeklyOverviewDayBadgeTextAllDay: {
    color: "#1F7A3D",
  },

  weeklyOverviewDayName: {
    ...PARENT_HEADING.h3,
    color: "#172033",
  },

  weeklyOverviewStatusPill: {
    maxWidth: "58%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  weeklyOverviewStatusPillBlocked: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },

  weeklyOverviewStatusPillAllDay: {
    backgroundColor: "#ECFDF3",
    borderColor: "#BBF7D0",
  },

  weeklyOverviewStatusText: {
    fontSize: 11.5,
    color: "#2F6BFF",
  },

  weeklyOverviewStatusTextBlocked: {
    color: "#B42318",
  },

  weeklyOverviewStatusTextAllDay: {
    color: "#1F7A3D",
  },

  dayHeaderRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  dayExpandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    padding: 14,
    backgroundColor: "#F8FAFC",
  },

  dayStatusAllowed: {
    color: "#1F7A3D",
  },

  dayStatusBlocked: {
    color: "#B42318",
  },

  scheduleModeStatusPillAllDay: {
    backgroundColor: "#ECFDF3",
    borderColor: "#BBF7D0",
  },

  scheduleModeStatusTextAllDay: {
    color: "#1F7A3D",
  },

  scheduleModeButtonSuccessActive: {
    backgroundColor: "#ECFDF3",
    borderColor: "#BBF7D0",
  },

  scheduleModeButtonSuccessTextActive: {
    color: "#1F7A3D",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 8,
  },

  footerUnsavedText: {
    fontSize: 12.5,
    color: "#B45309",
  },

  primaryActionButtonDisabled: {
    opacity: 0.45,
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
});