import { StyleSheet } from "react-native";

import { APP_COLORS } from "@/constants/theme";
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
    backgroundColor: APP_COLORS.screenBg,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    gap: 24,
  },

  introCard: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  introTitle: {
    ...PARENT_HEADING.h1,
    color: "#0F172A",
    marginBottom: 6,
  },

  introSubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#64748B",
  },

  sectionBlock: {
    gap: 10,
  },

  sectionTitle: {
    ...PARENT_HEADING.h2,
    color: "#475569",
    paddingHorizontal: 4,
  },

  groupCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },

  rowButton: {
    width: "100%",
    minHeight: 78,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },

  rowPressed: {
    backgroundColor: "#F8FAFC",
  },

  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: {
    flex: 1,
    gap: 2,
  },

  rowTitle: {
    ...PARENT_HEADING.h3,
    color: "#0F172A",
  },

  rowTitleDisabled: {
    color: "#94A3B8",
  },

  rowDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
  },

  rowDescriptionDisabled: {
    color: "#CBD5E1",
  },

  rowEnd: {
    minWidth: 52,
    alignItems: "center",
    justifyContent: "center",
  },

  soonText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
  activeLimitInfoBox: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },

  activeLimitInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  activeLimitInfoTitle: {
    color: "#1E3A8A",
    fontSize: 14,
  },

  activeLimitInfoText: {
    color: "#475569",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  activeLimitCurrentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#DBEAFE",
  },

  activeLimitCurrentLabel: {
    color: "#334155",
    fontSize: 12,
  },

  activeLimitCurrentValue: {
    fontSize: 12,
  },

  activeLimitCurrentValueOn: {
    color: "#16A34A",
  },

  activeLimitCurrentValueOff: {
    color: "#64748B",
  },

  rowActive: {
    backgroundColor: "#F0FDF4",
  },

  rowUnavailable: {
    backgroundColor: "#F8FAFC",
    opacity: 0.72,
  },

  rowTitleActive: {
    color: "#166534",
  },

  rowTitleUnavailable: {
    color: "#334155",
  },

  rowDescriptionUnavailable: {
    color: "#475569",
  },

  rowStatusHint: {
    fontSize: 11,
    marginTop: 4,
  },

  rowStatusHintActive: {
    color: "#16A34A",
  },

  rowStatusHintUnavailable: {
    color: "#B45309",
  },

  activeBadgeText: {
    color: "#16A34A",
  },

  unavailableBadgeText: {
    color: "#B45309",
  },
});