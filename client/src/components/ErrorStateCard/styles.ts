import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#F0ABFC",
    backgroundColor: "#FDF4FF",
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  title: {
    fontSize: 17,
    color: "#6B21A8",
    textAlign: "center",
  },

  message: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#7C3AED",
  },
});
