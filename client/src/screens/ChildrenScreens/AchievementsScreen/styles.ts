import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerIconButton: {
    padding: 8,
  },

  headerIconButtonPressed: {
    opacity: 0.65,
  },

  page: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },

  heroCard: {
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  heroIconWrap: {
    backgroundColor: "#FFF3DD",
    borderWidth: 1,
    borderColor: "#FFE6BA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  heroTextBlock: {
    width: "100%",
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: "#111827",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  heroSummaryRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  heroSummaryCard: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    minHeight: 82,
  },

  heroSummaryCardGold: {
    backgroundColor: "#FFF3DD",
    borderColor: "#FFE6BA",
  },

  heroSummaryCardGreen: {
    backgroundColor: "#E9FFF3",
    borderColor: "#D7F7E8",
  },

  heroSummaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },

  heroSummaryIconGold: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFE1A8",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  heroSummaryIconGreen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#C9F5DE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  heroSummaryValueGold: {
    flex: 1,
    fontSize: 20,
    color: "#B46B00",
  },

  heroSummaryValueGreen: {
    flex: 1,
    fontSize: 20,
    color: "#0F8A5F",
  },

  heroSummaryLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  achievementsList: {
    width: "100%",
    gap: 14,
  },

  achievementCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: "hidden",
  },

  achievementCardGold: {
    backgroundColor: "#FFF8E8",
    borderColor: "#F9E7AF",
  },

  achievementCardLight: {
    backgroundColor: "#F8F7FF",
    borderColor: "#E7DBFF",
  },

  achievementCardLocked: {
    backgroundColor: "#F7F3FC",
    borderColor: "#E8DFF6",
    opacity: 0.96,
  },

  achievementCardPressed: {
    opacity: 0.9,
  },

  achievementInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  achievementIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  achievementIconBoxGold: {
    backgroundColor: "#FFE8A3",
  },

  achievementIconBoxLight: {
    backgroundColor: "#E9DDFF",
  },

  achievementIconBoxLocked: {
    backgroundColor: "#ECE7F5",
    borderWidth: 1,
    borderColor: "#DED5EC",
  },

  achievementTextArea: {
    flex: 1,
    alignItems: "stretch",
    minWidth: 0,
  },

  achievementTitleRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },

  achievementTitle: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 20,
    lineHeight: 25,
    color: "#374151",
  },

  achievementTitleGold: {
    color: "#6B4E00",
  },

  achievementTitleLocked: {
    color: "#6F6790",
  },

  lockedBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#7C6AA6",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    flexShrink: 0,
    marginTop: 2,
  },

  lockedBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
  },

  completedBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#10D98B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexShrink: 0,
    marginTop: 2,
  },

  completedBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
  },

  achievementSubtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: "#4B5563",
    marginBottom: 12,
  },

  achievementSubtitleGold: {
    color: "#7A6640",
  },

  achievementSubtitleLocked: {
    color: "#948BAA",
  },

  achievementBottomArea: {
    minHeight: 34,
    position: "relative",
    justifyContent: "center",
  },

  rewardPill: {
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  rewardPillGold: {
    backgroundColor: "#FFF0C7",
  },

  rewardPillLight: {
    backgroundColor: "#F3EDFF",
  },

  rewardPillLocked: {
    backgroundColor: "#ECE7F5",
  },

  pointsPill: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  pointsPillGold: {
    backgroundColor: "#FFE8A3",
  },

  pointsPillLight: {
    backgroundColor: "#E7DBFF",
  },

  rewardText: {
    fontSize: 12,
    color: "#6B7280",
  },

  rewardTextGold: {
    color: "#8A6500",
  },

  rewardTextLocked: {
    color: "#8E8AA3",
  },

  progressText: {
    fontSize: 13,
    color: "#5B21B6",
  },

  progressTextGold: {
    color: "#7C5A00",
  },

  centerText: {
    textAlign: "center",
  },
});