import { StyleSheet } from "react-native";

import {
  CHILD_DISPLAY,
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 18,
  },

  headerBlock: {
    gap: 6,
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FAE8FF",
    borderWidth: 2,
    borderColor: "#F0ABFC",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },

  title: {
    ...CHILD_HEADING.h1,
    color: "#1E293B",
  },

  subtitle: {
    ...CHILD_TEXT.subtitle,
    color: "#64748B",
  },

  balanceHero: {
    width: "100%",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 2,
    borderColor: "#FCD34D",
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },

  balanceHeroInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  coinCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 2,
    borderColor: "#FDE68A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B45309",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },

  balanceTextWrap: {
    flex: 1,
    justifyContent: "center",
    gap: 2,
  },

  balanceLabel: {
    ...CHILD_HEADING.h4,
    color: "#92400E",
    letterSpacing: 0.3,
  },

  balanceAmount: {
    ...CHILD_DISPLAY.amount,
    color: "#78350F",
  },

  balanceSub: {
    ...CHILD_TEXT.body,
    color: "#A16207",
    marginTop: 2,
  },

  rewardsContainer: {
    gap: 14,
    paddingBottom: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },

  sectionTitle: {
    ...CHILD_HEADING.h2,
    color: "#1E293B",
  },

  rewardCard: {
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },

  rewardTopRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  textBox: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },

  rewardTitle: {
    ...CHILD_HEADING.h3,
    color: "#0F172A",
  },

  rewardSub: {
    ...CHILD_TEXT.bodySmall,
    color: "#475569",
    marginTop: 4,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
  },

  pricePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },

  rewardPrice: {
    ...CHILD_HEADING.h2,
    color: "#78350F",
  },

  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statusPillReady: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#86EFAC",
  },

  statusPillLocked: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statusPillTextReady: {
    ...CHILD_TEXT.bodySmall,
    color: "#15803D",
  },

  statusPillTextLocked: {
    ...CHILD_TEXT.bodySmall,
    color: "#64748B",
  },

  redeemButton: {
    minHeight: 50,
    borderRadius: 18,
    overflow: "hidden",
  },

  redeemButtonInner: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },

  redeemButtonDisabled: {
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: "#CBD5E1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  redeemButtonText: {
    ...CHILD_HEADING.h3,
    color: "#FFFFFF",
  },

  redeemButtonTextDisabled: {
    ...CHILD_HEADING.h3,
    color: "#F8FAFC",
  },

  emptyState: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#F0ABFC",
    backgroundColor: "#FDF4FF",
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  emptyStateTitle: {
    ...CHILD_HEADING.h3,
    color: "#6B21A8",
  },

  emptyStateText: {
    textAlign: "center",
    ...CHILD_TEXT.body,
    color: "#7C3AED",
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
