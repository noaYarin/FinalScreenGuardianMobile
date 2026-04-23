import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  leftButton: {
    marginLeft: 10,
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "#1E40AF",
    alignItems: "center",
    justifyContent: "center",
  },

  rightButton: {
    marginRight: 10,
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.85,
  },
});

