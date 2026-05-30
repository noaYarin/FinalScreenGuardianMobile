import { StyleSheet } from "react-native";

import {
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

const COLORS = {
  white: "#FFFFFF",
  text: "#0F172A",
  muted: "#475569",
  border: "#E7EFFA",
  babyBlueTileBg: "#EAF2FF",
  babyBlueTileBorder: "#D6E6FF",
  babyBlueBadge: "#CFE3FF",
  beigeTileBg: "#FFF3DD",
  beigeTileBorder: "#FFE6BA",
  beigeBadge: "#FFE1A8",
  greenTileBg: "#E9FFF3",
  greenTileBorder: "#D7F7E8",
  greenBadge: "#C9F5DE",
  shadow: "#000000",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentMaxWidth: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    paddingHorizontal: 16,
  },

  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 6,
    gap: 8,
    marginBottom: 14,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: COLORS.babyBlueTileBg,
    borderWidth: 1,
    borderColor: COLORS.babyBlueTileBorder,
  },

  inactiveTab: {
    backgroundColor: COLORS.white,
  },

  tabText: {
    ...CHILD_HEADING.h4,
    color: COLORS.text,
  },

  listContent: {
    paddingTop: 6,
    paddingBottom: 22,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  cardHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  coinsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3DD",
    borderWidth: 1,
    borderColor: "#FFE6BA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 6,
  },

  coinsText: {
    ...CHILD_HEADING.h4,
    color: "#B46B00",
  },

  taskTitle: {
    flex: 1,
    ...CHILD_HEADING.h3,
    color: "#0F172A",
  },

  statusBoxDone: {
    flexDirection: "row",
    backgroundColor: COLORS.greenTileBg,
    borderWidth: 1,
    borderColor: COLORS.greenTileBorder,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 10,
  },

  statusTextDone: {
    color: "#0F8A5F",
    ...CHILD_HEADING.h4,
  },

  todoArea: {
    gap: 10,
  },

  todoHint: {
    color: COLORS.muted,
    ...CHILD_TEXT.body,
  },

  uploadBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.babyBlueTileBg,
    borderWidth: 1,
    borderColor: COLORS.babyBlueTileBorder,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 1,
  },

  uploadBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  uploadText: {
    color: "#2F6DEB",
    ...CHILD_HEADING.h4,
  },

  statusIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  statusIconCircleDone: {
    backgroundColor: COLORS.greenBadge,
  },

  statusIconCircleUpload: {
    backgroundColor: COLORS.babyBlueBadge,
  },

  weekBox: {
    marginTop: 8,
    backgroundColor: COLORS.beigeTileBg,
    borderWidth: 1,
    borderColor: COLORS.beigeTileBorder,
    borderRadius: 22,
    padding: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  weekInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  weekIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.beigeBadge,
  },

  weekText: {
    ...CHILD_HEADING.h3,
    color: "#9B5B00",
  },
  completedDateText: {
  ...CHILD_TEXT.bodySmall,
  color: "#64748B",
  marginTop: 2,
},
});