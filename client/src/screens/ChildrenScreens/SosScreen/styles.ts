import { StyleSheet } from "react-native";

import {
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

const TILE = {
  blueBg: "#EAF2FF",
  blueBorder: "#D6E6FF",
  blueIcon: "#2F6DEB",

  beigeBg: "#FFF3DD",
  beigeBorder: "#FFE6BA",
  beigeIcon: "#B46B00",

  ring1: "rgba(59, 130, 246, 0.18)",
  ring2: "rgba(59, 130, 246, 0.10)",

  danger: "#FF4B55",
};

export const styles = StyleSheet.create({
  page: {
    width: "100%",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 16,
    gap: 14,
  },

  heroCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
    alignItems: "center",
  },

  sosArea: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  ringOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: TILE.ring1,
  },

  ringInner: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: TILE.ring2,
  },

  sosButton: {
    backgroundColor: TILE.danger,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
  },

  sosButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  exMarkCircle: {
    width: 84,
    height: 84,
    borderRadius: 9999,
    borderWidth: 7,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  exMark: {
    color: "#FFFFFF",
    fontSize: 44,
    lineHeight: 44,
    textAlign: "center",
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  textBlock: {
    marginTop: 14,
    alignItems: "center",
    paddingHorizontal: 6,
  },

  titleText: {
    ...CHILD_HEADING.h1,
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    ...CHILD_HEADING.h3,
    color: "rgba(17, 24, 39, 0.72)",
    textAlign: "center",
  },

  sendCard: {
    width: "100%",
    backgroundColor: TILE.blueBg,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: TILE.blueBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
    gap: 12,
  },

  peopleIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CFE3FF",
    borderWidth: 1,
    borderColor: "rgba(47,109,235,0.18)",
  },

  sendCardText: {
    flex: 1,
  },

  sendToLabel: {
    ...CHILD_HEADING.h4,
    color: "rgba(17, 24, 39, 0.72)",
    marginBottom: 4,
  },

  sendToValue: {
    ...CHILD_HEADING.h3,
    color: TILE.blueIcon,
  },

  warningBox: {
    width: "100%",
    backgroundColor: TILE.beigeBg,
    borderWidth: 1,
    borderColor: TILE.beigeBorder,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  warningText: {
    ...CHILD_HEADING.h4,
    color: TILE.beigeIcon,
    flexShrink: 1,
    textAlign: "center",
  },

  sosButtonDisabled: {
  opacity: 0.72,
},

sendingText: {
  marginTop: 8,
  color: "#FFFFFF",
  fontSize: 13,
  textAlign: "center",
},
});