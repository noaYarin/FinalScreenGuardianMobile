import { StyleSheet } from "react-native";

export function questionBubbleBg(color: string) {
  return { backgroundColor: color } as const;
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topSection: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#EEF3F8",
  },

  sectionTitle: {
    marginTop: 2,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitleText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#64748B",
  },

  questionsRow: {
    width: "100%",
  },

  masonryGrid: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
  },

  masonryColumn: {
    width: "48%",
  },

  masonrySpacer: {
    width: "4%",
  },

  questionCell: {
    paddingVertical: 6,
  },

  questionBubble: {
    width: "100%",
    backgroundColor: "#EAF2FF",
    borderWidth: 0,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "100%",
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  questionBubblePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  questionBubbleText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },

  emptyWrap: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#EEF2F7",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 14,
    lineHeight: 18,
    color: "#0F172A",
    textAlign: "center",
  },

  emptySub: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: "#64748B",
    textAlign: "center",
  },

  botAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#64748B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#94A3B8",
  },

  chatCard: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#EAF1F7",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
});

