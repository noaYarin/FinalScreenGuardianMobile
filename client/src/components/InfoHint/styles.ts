import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  iconButtonPressed: {
    opacity: 0.8,
  },

  modalCard: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    gap: 8,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    padding: 16,
    justifyContent: "center",
  },

  title: {
    fontSize: 14,
    color: "#1E3A8A",
    textAlign: "center",
    alignSelf: "center",
  },
  
  titleSeparator: {
    marginTop: 8,
    marginBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  linesWrap: {
    gap: 8,
  },

  lineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    marginTop: 7,
    backgroundColor: "#F59E0B",
  },

  lineText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#334155",
  },
  
  separator: {
    marginTop: 8,
    marginLeft: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  lineItemLtr: {
    direction: "ltr",
    width: "100%",
  },
});