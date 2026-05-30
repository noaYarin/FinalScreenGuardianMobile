import { StyleSheet } from "react-native";

import {
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "transparent",
  },

  scroll: { flex: 1 },

  scrollContent: {
    paddingTop: 14,
    paddingBottom: 18,
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },

  topCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    alignItems: "center",
  },

  title: { ...CHILD_HEADING.h2, color: "#0F172A" },
  question: { marginTop: 10, ...CHILD_HEADING.h3, color: "#0F172A", textAlign: "center" },
  subText: { marginTop: 4, ...CHILD_TEXT.bodySmall, color: "#4767B5", textAlign: "center" },

  bodyCard: {
    flex: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  chipsWrap: {
    gap: 10,
    paddingBottom: 6,
  },

  chipsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },

  chip: {
    flex: 1,
    minWidth: 0,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },

  chipSpacer: {
    flex: 1,
    minWidth: 0,
  },

  chipOn: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  chipOff: {
    backgroundColor: "#F3F7FF",
    borderColor: "#C7DAFF",
  },

  chipPressed: { opacity: 0.92 },
  chipDisabled: { opacity: 0.55 },

  chipInnerColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: "100%",
  },

  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.35)",
  },

  chipIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },

  chipText: {
    ...CHILD_TEXT.caption,
    textAlign: "center",
    width: "100%",
  },
  chipTextOn: { color: "#FFFFFF" },
  chipTextOff: { color: "#1E3A8A" },

  selectedBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#0F172A",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
    gap: 8,
  },

  selectedTitle: { ...CHILD_TEXT.bodySmall, color: "#0F172A" },
  selectedEmpty: { ...CHILD_TEXT.bodySmall, color: "#64748B" },

  selectedTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  selectedTag: {
    backgroundColor: "#EAF2FF",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#C7DAFF",
  },

  selectedTagText: {
    ...CHILD_TEXT.caption,
    color: "#1E3A8A",
  },

  saveButton: {
    backgroundColor: "#A7F3D0",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 10,
    shadowColor: "#0F172A",
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  savePressed: { opacity: 0.92 },
  saveDisabled: { opacity: 0.7 },

  saveInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  saveText: { color: "#064E3B", ...CHILD_HEADING.h4 },

  loadingRow: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: { color: "#1E3A8A", ...CHILD_TEXT.bodySmall },

  errorBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },

  errorTitle: { color: "#0F172A", ...CHILD_HEADING.h3 },
  errorText: { marginTop: 6, color: "#64748B", ...CHILD_TEXT.bodySmall, textAlign: "center" },
});

