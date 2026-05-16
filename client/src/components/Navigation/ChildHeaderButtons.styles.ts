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
  iconWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: -8,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    lineHeight: 11,
  },
});

