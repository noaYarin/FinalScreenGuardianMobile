import { StyleSheet } from "react-native";

export const CHILD_MOOD_COLORS = {
  great: "#22C55E",
  good: "#14B8A6",
  careful: "#F59E0B",
  over: "#EF4444",
  empty: "#D1D5DB",
  used: "#3B82F6",
  today: "#2563EB",
  best: "#EC4899",
  card: "#FFFFFF",
  text: "#1F2937",
  muted: "#6B7280",
  border: "#E5E7EB",
  donutUsed: "#F97316",
  donutUnused: "#4B5563",
};

export const childChartStyles = StyleSheet.create({
  card: {
    backgroundColor: CHILD_MOOD_COLORS.card,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: CHILD_MOOD_COLORS.border,
    gap: 14,
  },

  title: {
    fontSize: 18,
    color: CHILD_MOOD_COLORS.text,
    textAlign: "center",
  },

  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },

  legendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F9FAFB",
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendChipText: {
    fontSize: 12,
    color: CHILD_MOOD_COLORS.text,
  },

  storyList: {
    gap: 8,
  },

  storyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "transparent",
  },

  storyRowToday: {
    borderWidth: 3,
    borderColor: CHILD_MOOD_COLORS.today,
    backgroundColor: "#EFF6FF",
  },

  storyRowFuture: {
    opacity: 0.72,
  },

  storyStripe: {
    width: 5,
    alignSelf: "stretch",
    borderRadius: 4,
    minHeight: 44,
  },

  storyEmoji: {
    fontSize: 26,
  },

  storyBody: {
    flex: 1,
    gap: 2,
  },

  storyDay: {
    fontSize: 15,
    color: CHILD_MOOD_COLORS.text,
  },

  storyMessage: {
    fontSize: 14,
    color: CHILD_MOOD_COLORS.muted,
  },

  storyTime: {
    fontSize: 14,
    color: CHILD_MOOD_COLORS.text,
    fontWeight: "700",
  },

  pieWrap: {
    alignItems: "center",
    paddingVertical: 12,
    minHeight: 220,
  },

  centerLabel: {
    fontSize: 13,
    color: CHILD_MOOD_COLORS.muted,
    textAlign: "center",
  },

  centerValue: {
    fontSize: 22,
    color: CHILD_MOOD_COLORS.text,
    textAlign: "center",
    marginTop: 4,
  },

  centerValueOver: {
    color: CHILD_MOOD_COLORS.over,
  },

  donutNote: {
    fontSize: 14,
    color: CHILD_MOOD_COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 4,
  },

  donutNoteOver: {
    color: CHILD_MOOD_COLORS.over,
    fontWeight: "600",
  },
});
