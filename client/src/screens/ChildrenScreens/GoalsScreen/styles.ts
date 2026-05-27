import { StyleSheet } from "react-native";

export const COLORS = {
  screenBg: "#EEF4FC",
  white: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  progressTrack: "#E2E8F0",
  progressFill: "#3B82F6",
  goalCompletedBg: "#FFF4E6",
  goalCompletedBorder: "#A67C52",
  goalActiveBg: "#FFFFFF",
  goalActiveBorder: "#CBD5E1",
  shadow: "#0F172A",
};

export const styles = StyleSheet.create({
  page: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    gap: 14,
  },

  subHeader: {
    alignItems: "center",
    paddingVertical: 4,
    gap: 4,
  },

  subHeaderEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },

  subHeaderTitle: {
    fontSize: 22,
    color: COLORS.text,
    textAlign: "center",
  },

  subHeaderSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
  },

  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    gap: 10,
  },

  progressHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "left",
  },

  progressPercent: {
    fontSize: 18,
    color: "#2563EB",
  },

  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.progressTrack,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: COLORS.progressFill,
  },

  goalsList: {
    gap: 12,
  },

  goalCard: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },

  goalCardCompleted: {
    backgroundColor: COLORS.goalCompletedBg,
    borderColor: COLORS.goalCompletedBorder,
  },

  goalCardActive: {
    backgroundColor: COLORS.goalActiveBg,
    borderColor: COLORS.goalActiveBorder,
  },

  goalCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  goalTextBlock: {
    flex: 1,
    gap: 6,
  },

  goalTitle: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: "left",
  },

  goalDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
    textAlign: "left",
  },

  goalProgress: {
    fontSize: 14,
    color: "#2563EB",
    textAlign: "left",
  },

  checkboxCompleted: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#FDE8C8",
    borderWidth: 1.5,
    borderColor: COLORS.goalCompletedBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxEmpty: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#94A3B8",
    backgroundColor: COLORS.white,
  },
});
