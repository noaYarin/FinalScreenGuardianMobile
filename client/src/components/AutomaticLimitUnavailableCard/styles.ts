import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FDBA74",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  title: {
    color: "#9A3412",
    fontSize: 15,
  },

  text: {
    color: "#7C2D12",
    fontSize: 13,
    lineHeight: 19,
  },

  mode: {
    color: "#B45309",
  },
});