import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  headerCard: {
    borderRadius: 24,
    padding: 18,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#DCE9FF",
    gap: 8,
  },

  title: {
    fontSize: 28,
    lineHeight: 34,
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },

  card: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7EEF7",
    padding: 18,
  },

  formGroup: {
    marginBottom: 16,
    gap: 8,
  },

  label: {
    fontSize: 14,
    lineHeight: 18,
    color: "#243447",
  },

  input: {
    width: "100%",
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E3F4",
    backgroundColor: "#FBFDFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#243447",
  },

  textArea: {
    minHeight: 110,
  },

  coinsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  stepperButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7E3F4",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  coinsValueBox: {
    flex: 1,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: "#FFF8E7",
    borderWidth: 1,
    borderColor: "#F8D78A",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  coinsValueText: {
    fontSize: 18,
    color: "#7C5A06",
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    minHeight: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D7E3F4",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  chipActive: {
    backgroundColor: "#EEF4FF",
    borderColor: "#315BFF",
  },

  chipText: {
    fontSize: 13,
    color: "#243447",
  },

  chipTextActive: {
    color: "#315BFF",
  },

  childChip: {
    minHeight: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#CFE0FF",
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  childChipActive: {
    backgroundColor: "#315BFF",
    borderColor: "#315BFF",
  },

  childChipText: {
    fontSize: 13,
    color: "#315BFF",
  },

  childChipTextActive: {
    color: "#FFFFFF",
  },

  previewCard: {
    marginTop: 6,
    borderRadius: 20,
    backgroundColor: "#F8FBFF",
    borderWidth: 1,
    borderColor: "#DCE9FF",
    padding: 16,
    gap: 10,
  },

  previewLabel: {
    fontSize: 13,
    color: "#315BFF",
  },

  previewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  previewTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: "#1E293B",
  },

  previewCoinsPill: {
    borderRadius: 999,
    backgroundColor: "#FFF6DB",
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  previewCoinsText: {
    fontSize: 13,
    color: "#7C5A06",
  },

  previewDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#5B6B82",
  },

  previewMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  previewMetaPill: {
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3F4",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  previewMetaText: {
    fontSize: 12,
    color: "#243447",
  },

  primaryButton: {
    marginTop: 18,
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: "#315BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  pressed: {
    opacity: 0.85,
  },
});