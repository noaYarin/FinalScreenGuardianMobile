import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  iconButtonLeft: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  iconButtonRight: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.75,
  },

  bellIconBox: {
    width: 26,
    height: 26,
  },

  bellBadge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 999,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.light.tint,
  },

  bellBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    lineHeight: 10,
    fontWeight: "700",
    includeFontPadding: false,
  },
});

