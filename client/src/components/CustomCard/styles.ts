import { StyleSheet } from "react-native";

import { styles as minuteCardStyles } from "@/src/components/MinuteCard/styles";

export const styles = StyleSheet.create({
  customCard: {
    width: "100%",
    flex: 0,
    minHeight: 72,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: "#FFF3DD",
    borderColor: "#FFE6BA",
  },

  customRowInner: {
    alignItems: "center",
    justifyContent: "center",
  },

  cardOverlayPressable: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },

  customValueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  customControlBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#FFE1A8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFE6BA",
  },

  pressedOpacity: {
    opacity: 0.7,
  },

  customValue: {
    minWidth: 36,
    fontSize: 22,
    lineHeight: 26,
    color: "#B46B00",
    letterSpacing: 0.2,
    textAlign: "center",
    includeFontPadding: false,
  },
});

export const sharedMinuteCardStyles = minuteCardStyles;
