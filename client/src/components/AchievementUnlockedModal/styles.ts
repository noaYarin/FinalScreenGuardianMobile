import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE6BA",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF3DD",
    borderWidth: 1,
    borderColor: "#FFE1A8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  kicker: {
    fontSize: 14,
    color: "#7C3AED",
    textAlign: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 22,
    lineHeight: 28,
    color: "#111827",
    textAlign: "center",
  },

  description: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
    textAlign: "center",
  },

  rewardPill: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF3DD",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  rewardText: {
    fontSize: 14,
    color: "#B46B00",
  },

  button: {
    marginTop: 18,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#7C3AED",
    paddingVertical: 13,
    alignItems: "center",
  },

  buttonPressed: {
    opacity: 0.86,
  },

  buttonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
});