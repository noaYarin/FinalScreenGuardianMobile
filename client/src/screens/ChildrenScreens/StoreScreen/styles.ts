import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  headerBlock: {
    gap: 4,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },

  balanceSection: {
    gap: 12,
  },

  balanceLabel: {
    fontSize: 18,
    color: "#111827",
  },

  balanceCard: {
    width: "100%",
    minHeight: 110,
    borderRadius: 26,
    paddingHorizontal: 22,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EFFA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  balanceBadge: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  balanceTextWrap: {
    flex: 1,
    justifyContent: "center",
  },

  balanceAmount: {
    fontSize: 38,
    color: "#111827",
    lineHeight: 42,
  },

  balanceSub: {
    fontSize: 17,
    color: "#5A6B7A",
    marginTop: 4,
  },

  rewardsContainer: {
    gap: 12,
    paddingBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#111827",
  },

  rewardCard: {
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    gap: 14,
  },

  rewardRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textBox: {
    flex: 1,
    minWidth: 0,
  },

  rewardTitle: {
    fontSize: 16,
    color: "#111827",
  },

  rewardSub: {
    fontSize: 13,
    color: "#5A6B7A",
    marginTop: 3,
    lineHeight: 18,
  },

  statusRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  availablePill: {
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  availablePillText: {
    fontSize: 12,
    color: "#15803D",
  },

  disabledPill: {
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  disabledPillText: {
    fontSize: 12,
    color: "#64748B",
  },

  priceBox: {
    minWidth: 108,
    alignItems: "flex-end",
  },

  pricePill: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  rewardPrice: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 18,
  },

  rewardCoins: {
    fontSize: 12,
    color: "#5A6B7A",
    marginTop: 2,
  },

  redeemButton: {
    minHeight: 46,
    borderRadius: 16,
    backgroundColor: "#315BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  redeemButtonDisabled: {
    backgroundColor: "#A5B4FC",
  },

  redeemButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  emptyState: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7EEF7",
    backgroundColor: "#FBFDFF",
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  emptyStateTitle: {
    fontSize: 16,
    color: "#243447",
  },

  emptyStateText: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },

  pressed: {
    opacity: 0.88,
  },
});