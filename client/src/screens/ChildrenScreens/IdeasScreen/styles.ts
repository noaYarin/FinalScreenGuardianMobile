import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 44,
    gap: 14,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 10,
    gap: 14,
  },

  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
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

  selectedHintRow: {
    marginTop: 10,
    backgroundColor: "#EAF2FF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  selectedHintText: {
    fontSize: 12,
    color: "#1E3A8A",
  },

  list: {
    flex: 1,
    gap: 10,
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
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
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
    paddingRight: 10,
    gap: 4,
  },

  ideaTitle: {
    fontSize: 15,
    color: "#0F172A",
  },

  ideaDesc: {
    fontSize: 12,
    color: "#64748B",
  },

  ideaIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#EAF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7DAFF",
  },

  primaryButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: "#0F172A",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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

  primaryButtonText: {
    color: "#064E3B",
    fontSize: 15,
  },

  shuffleButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#0F172A",
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
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

