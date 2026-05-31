import { StyleSheet } from "react-native";
import {
  PARENT_HEADING,
  PARENT_TEXT,
} from "@/src/theme/parentTypography";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 18,
  },

  infoBulbRow: {
    width: "100%",
    alignSelf: "flex-start",
  },

  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    backgroundColor: "#315BFF",
    gap: 10,
  },

  heroGlow: {
    position: "absolute",
    top: -24,
    right: -24,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  heroTitle: {
    ...PARENT_HEADING.h1,
    color: "#FFFFFF",
  },

  heroSubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "rgba(255,255,255,0.88)",
  },

  heroMetaRow: {
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
  },

  heroMetaRowWide: {
    justifyContent: "flex-start",
  },

  heroMetaChip: {
    minHeight: 38,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  heroMetaText: {
    ...PARENT_TEXT.bodySmall,
    color: "#FFFFFF",
  },

  sectionHeader: {
    gap: 6,
    paddingHorizontal: 2,
  },

  sectionTitleRow: {
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "flex-start",
  },

  sectionTitle: {
    ...PARENT_HEADING.h2,
    color: "#1D2433",
  },

  sectionSubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#6F7A8F",
  },

  countBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 999,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9EEFF",
  },

  countBadgeText: {
    ...PARENT_TEXT.bodySmall,
    color: "#315BFF",
  },

  cardsWrap: {
    width: "100%",
    gap: 14,
  },

  cardsWrapWide: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  requestCard: {
    width: "100%",
    borderRadius: 26,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9EDF5",
    shadowColor: "#101828",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: 14,
  },

  requestCardWide: {
    width: "48.8%",
  },

  cardTopRow: {
    alignItems: "center",
    gap: 12,
  },

  deviceBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDF2FF",
  },

  cardTopTextWrap: {
    flex: 1,
    gap: 2,
  },

  cardTopTextWrapCentered: {
    alignItems: "center",
  },

  deviceName: {
    ...PARENT_HEADING.h3,
    color: "#1D2433",
  },

  childName: {
    ...PARENT_TEXT.subtitle,
    color: "#6F7A8F",
  },

  childNameCentered: {
    textAlign: "center",
    width: "100%",
    alignSelf: "center",
  },

  infoGrid: {
    width: "100%",
  },

  infoChip: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: "#F4F7FB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    gap: 8,
  },

  infoChipLtr: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },



  infoChipText: {
    fontSize: 13,
    color: "#344054",
  },

  extraTimeBox: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#F8FAFD",
    gap: 6,
  },

  extraTimeLabel: {
    fontSize: 13,
    color: "#4B5565",
  },

  extraTimeText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1D2433",
  },

  reasonBox: {
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#F8FAFD",
    gap: 6,
  },

  reasonLabel: {
    fontSize: 13,
    color: "#4B5565",
  },

  reasonText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1D2433",
  },

  remainingBox: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FBFCFE",
    borderWidth: 1,
    borderColor: "#EEF2F7",
  },

  remainingRowLtr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },



  remainingText: {
    fontSize: 13,
    color: "#667085",
  },

  timeRowLtr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

 
  timeText: {
    fontSize: 13,
    color: "#8A94A6",
  },

  actionsRow: {
    gap: 12,
    marginTop: 2,
  },

  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  approveButton: {
    backgroundColor: "#16C76A",
  },

  declineButton: {
    backgroundColor: "#FF4D5E",
  },

  actionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  actionButtonText: {
    fontSize: 17,
    color: "#FFFFFF",
  },

  emptyCard: {
    width: "100%",
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9EDF5",
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  emptyTitle: {
    ...PARENT_HEADING.h1,
    color: "#1D2433",
  },

  emptySubtitle: {
    ...PARENT_TEXT.subtitle,
    color: "#6F7A8F",
    textAlign: "center",
  },
  
});