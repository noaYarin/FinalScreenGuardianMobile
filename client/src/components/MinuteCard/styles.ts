import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  minuteCard: {
    flex: 1,
    minHeight: 72,
    minWidth: 0,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    position: "relative",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
    }),
  },

  cardPressed: {
    opacity: 0.88,
  },

  cardActive: {
    borderColor: "#2F6DEB",
    borderWidth: 2,
    transform: [{ scale: 1.01 }],
  },

  tileBlue: {
    backgroundColor: "#EAF2FF",
    borderColor: "#D6E6FF",
  },

  tilePurple: {
    backgroundColor: "#F3E8FF",
    borderColor: "#DDD6FE",
  },

  minutesValue: {
    fontSize: 22,
    lineHeight: 26,
    color: "#0F172A",
    letterSpacing: 0.2,
    includeFontPadding: false,
  },

  minutesLabel: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 14,
    color: "#1E2A39",
    opacity: 0.75,
    includeFontPadding: false,
  },
});
