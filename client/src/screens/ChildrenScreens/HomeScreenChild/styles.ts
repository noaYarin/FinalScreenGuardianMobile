import { StyleSheet } from "react-native";

export const TILE_COLORS = {
  apps: { bg: "#EAF2FF", badge: "#CFE3FF", icon: "#2F6DEB", border: "#D6E6FF" },
  extend: { bg: "#EAF2FF", badge: "#CFE3FF", icon: "#2F6DEB", border: "#D6E6FF" },
  shop: { bg: "#FFF3DD", badge: "#FFE1A8", icon: "#B46B00", border: "#FFE6BA" },
  tasks: { bg: "#E9FFF3", badge: "#C9F5DE", icon: "#0F8A5F", border: "#D7F7E8" },
  achievements: { bg: "#F3EDFF", badge: "#E0D2FF", icon: "#6D28D9", border: "#E7DBFF" },
  goals: { bg: "#FFEAF0", badge: "#FFC9D8", icon: "#D81B60", border: "#FFD6E2" },
  encouragement: { bg: "#FFEFF0", badge: "#FFD0D4", icon: "#E11D48", border: "#FFD9DC" },
  ideas: { bg: "#EEFFF4", badge: "#CFF7DD", icon: "#16A34A", border: "#DAF9E6" },
  help: { bg: "#EAF2FF", badge: "#CFE3FF", icon: "#2563EB", border: "#D6E6FF" },
} as const;

export const styles = StyleSheet.create({
  page: {
    width: "100%",
    alignItems: "stretch",
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 40,
    backgroundColor: "transparent",
  },

  pageSmall: {
    paddingHorizontal: 10,
  },

  headerCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    direction: "ltr",
  },

  avatarWrapRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    direction: "ltr",
  },

  avatarBlock: {
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 0,
  },

  levelBadge: {
    position: "absolute",
    top: -4,
    left: 0,
    minWidth: 42,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: "#8B5CF6",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },

  levelBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    lineHeight: 14,
    includeFontPadding: false,
    textAlign: "center",
  },

  xpProgressWrapper: {
    width: "100%",
    marginTop: 8,
  },

  xpProgressHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    direction: "ltr",
  },

  xpProgressText: {
    color: "#64748B",
    fontSize: 11,
    lineHeight: 13,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },

  xpProgressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E6EEF9",
    overflow: "hidden",
  },

  xpProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#60A5FA",
  },

  headerTextSide: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 12,
    paddingRight: 0,
    direction: "ltr",
  },

  headerActionsRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  avatarWrap: {
    borderRadius: 999,
    overflow: "hidden",
    flexShrink: 0,
  },

  avatarGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarPhoto: {
    width: "100%",
    height: "100%",
  },

  avatarLetter: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 46,
    includeFontPadding: false,
    textAlign: "center",
  },

  hello: {
    width: "100%",
    color: "#0F172A",
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
    alignSelf: "flex-start",
  },

  headerCoinsBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    direction: "ltr",
  },

  headerCoinsText: {
    color: "#92400E",
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    direction: "ltr",
  },

  cardTitleRow: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    direction: "ltr",
  },

  cardTitleRowCentered: {
    alignItems: "center",
  },

  cardTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    direction: "ltr",
  },

  cardTitleLeftCentered: {
    justifyContent: "center",
    alignSelf: "center",
  },

  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  cardTitle: {
    color: "#0F172A",
    fontSize: 16,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },

  timerValue: {
    marginTop: 10,
    color: "#0F172A",
    textAlign: "left",
    includeFontPadding: false,
    writingDirection: "ltr",
    alignSelf: "stretch",
  },

  timerValueCentered: {
    textAlign: "center",
    alignSelf: "center",
  },

  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E6EEF9",
    overflow: "hidden",
    marginTop: 12,
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#3B82F6",
  },

  timerSub: {
    marginTop: 10,
    textAlign: "left",
    color: "#2563EB",
    includeFontPadding: false,
    writingDirection: "ltr",
    alignSelf: "stretch",
  },

  timerSubCentered: {
    textAlign: "center",
    alignSelf: "center",
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    rowGap: 12,
    marginBottom: 10,
  },

  tile: {
    width: "31.5%",
    maxWidth: 250,
    aspectRatio: 1,
    borderRadius: 22,
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },

  tileInner: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },

  tileIconZone: {
    flex: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  tileLabelZone: {
    flex: 4,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 6,
  },

  tileIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderColor: "transparent",
  },

  tileText: {
    color: "#0F172A",
    textAlign: "center",
    fontSize: 11,
    lineHeight: 13,
    includeFontPadding: false,
  },

  tilePressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  tileDisabled: {
    opacity: 0.45,
  },

  tileIconDisabled: {
    opacity: 0.6,
  },

  tileTextDisabled: {
    color: "#9CA3AF",
  },

  panicBtn: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#E85A68",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  panicPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },

  panicContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    direction: "ltr",
  },

  panicIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  panicText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 20,
    includeFontPadding: false,
    textAlign: "center",
  },

  panicDisabled: {
    opacity: 0.45,
  },

  xpCoinsMiniBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
    direction: "ltr",
  },

  xpCoinsMiniText: {
    color: "#92400E",
    fontSize: 11,
    lineHeight: 13,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },

  xpLeftText: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 10,
    lineHeight: 12,
    includeFontPadding: false,
    textAlign: "center",
    writingDirection: "ltr",
  },

  coinsHintText: {
    marginTop: 5,
    color: "#64748B",
    fontSize: 11,
    lineHeight: 13,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },
  coinsSummaryBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  coinsSummaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    direction: "ltr",
  },

  coinsSummaryText: {
    color: "#9A3412",
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },

  coinsSummaryHint: {
    marginTop: 3,
    color: "#e9b389",
    fontSize: 10,
    lineHeight: 12,
    includeFontPadding: false,
    textAlign: "left",
    writingDirection: "ltr",
  },
  avatarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.38)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  avatarInfoCard: {
    width: "100%",
    maxWidth: 330,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  avatarInfoImageWrap: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#EAF3FF",
    borderWidth: 1.5,
    borderColor: "#D5E7FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    overflow: "hidden",
  },

  avatarInfoImage: {
    width: 124,
    height: 124,
  },

  avatarInfoTitle: {
    fontSize: 21,
    color: "#2F4A7D",
    textAlign: "center",
    marginBottom: 4,
    includeFontPadding: false,
  },

  avatarInfoSubtitle: {
    fontSize: 14,
    color: "#7B8CA8",
    textAlign: "center",
    marginBottom: 14,
    includeFontPadding: false,
  },

  avatarInfoProgressTrack: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#EAF0F8",
    overflow: "hidden",
    marginBottom: 8,
  },

  avatarInfoProgressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#60A5FA",
  },

  avatarInfoXpText: {
    fontSize: 13,
    color: "#51617A",
    marginBottom: 14,
    textAlign: "center",
    includeFontPadding: false,
  },

  avatarInfoTextBox: {
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#F7FAFF",
    padding: 14,
    marginBottom: 14,
    gap: 8,
  },


  avatarInfoDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: "#6B7890",
    marginBottom: 18,
    includeFontPadding: false,
  },

  avatarInfoButton: {
    minWidth: 120,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    backgroundColor: "#60A5FA",
  },

  avatarInfoButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    includeFontPadding: false,
  },
  avatarInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  avatarInfoRowIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -2,
  },

  avatarInfoXpHint: {
    fontSize: 12.5,
    color: "#7B8CA8",
    marginTop: -8,
    marginBottom: 14,
    textAlign: "center",
    includeFontPadding: false,
  },
  avatarStageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },

  avatarInfoLevelText: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },
  avatarInfoLine: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    color: "#51617A",
    textAlign: "left",
    writingDirection: "ltr",
    includeFontPadding: false,
  },
});