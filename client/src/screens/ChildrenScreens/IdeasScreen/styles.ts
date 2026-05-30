import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 14,
    paddingBottom: 0,
  },

  scroll: {
    flex: 1,
    minHeight: 0,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
    gap: 14,
  },

  topCard: {
    marginHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  headerIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    borderWidth: 1,
    borderColor: "#E9D5FF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 19,
    color: "#0F172A",
    textAlign: "center",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#4767B5",
    textAlign: "center",
  },

  interestsSection: {
    marginTop: 12,
    gap: 8,
  },

  interestsSectionLabel: {
    fontSize: 13,
    color: "#4767B5",
    textAlign: "center",
  },

  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },

  interestChip: {
    width: "31.5%",
    maxWidth: "31.5%",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 72,
  },

  interestChipText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#1E3A8A",
    textAlign: "center",
  },

  interestsEmptyBox: {
    backgroundColor: "#EAF2FF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  interestsEmptyText: {
    fontSize: 12,
    color: "#1E3A8A",
    textAlign: "center",
  },

  list: {
    gap: 12,
  },

  activitiesPanel: {
    flexGrow: 1,
    minHeight: 500,
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  footerActions: {
    marginTop: "auto",
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },

  gridRow: {
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },

  gridCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
    minHeight: 124,
  },

  gridIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7DAFF",
    marginBottom: 10,
  },

  gridTitle: {
    fontSize: 14,
    color: "#0F172A",
  },

  gridDesc: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  ideaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  ideaTextSide: {
    flex: 1,
    paddingRight: 14,
    gap: 6,
  },

  ideaTitle: {
    fontSize: 17,
    lineHeight: 22,
    color: "#0F172A",
  },

  ideaDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },

  ideaIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7DAFF",
  },

  interestButton: {
    width: "100%",
    backgroundColor: "#A7F3D0",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  primaryPressed: {
    opacity: 0.92,
  },

  primaryButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  interestButtonText: {
    color: "#064E3B",
    fontSize: 13,
  },

  shuffleButton: {
    width: "100%",
    backgroundColor: "#A7F3D0",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  shuffleButtonText: {
    color: "#064E3B",
    fontSize: 15,
  },

  loadingRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: {
    color: "#1E3A8A",
    fontSize: 13,
  },

  errorBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  errorTitle: {
    color: "#0F172A",
    fontSize: 16,
  },

  errorText: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 12,
    textAlign: "center",
  },
});

