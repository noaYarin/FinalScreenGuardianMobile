import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingTop: 12,
  },

  nonScrollableContent: {
    paddingTop: 12,
  },

  inner: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
  },

  webFrame: {
    maxWidth: 430,
    width: "100%",
    alignSelf: "center",
  },
});