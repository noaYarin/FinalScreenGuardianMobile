import { StyleSheet } from "react-native";

import {
  CHILD_DISPLAY,
  CHILD_HEADING,
  CHILD_TEXT,
} from "@/src/theme/childTypography";

export const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },

  outer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  content: {
    width: "100%",
    maxWidth: 560,
    gap: 16,
  },

  headerBlock: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 18,
  },

  subTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  subTitleIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CFE3FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  subTitle: {
    ...CHILD_HEADING.h2,
    color: "#2F6DEB",
    includeFontPadding: false,
  },

  question: {
    textAlign: "center",
    ...CHILD_HEADING.h1,
    color: "#0F172A",
    includeFontPadding: false,
  },

  helperText: {
    marginTop: 8,
    ...CHILD_TEXT.subtitle,
    color: "#64748B",
    textAlign: "center",
    includeFontPadding: false,
  },

  grid: {
    marginTop: 4,
  },

  rowTwo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "stretch",
  },

  customRow: {
    width: "100%",
    marginTop: 10,
  },

  summaryBar: {
    marginTop: 10,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#E9FFF3",
    borderWidth: 1.5,
    borderColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },

  summaryLabel: {
    ...CHILD_TEXT.bodySmall,
    color: "#047857",
    textAlign: "center",
    includeFontPadding: false,
  },

  summaryAmount: {
    ...CHILD_HEADING.h1,
    color: "#065F46",
    textAlign: "center",
    letterSpacing: -0.3,
    includeFontPadding: false,
  },

  messageBlock: {
    marginTop: 18,
  },

  messageLabel: {
    marginBottom: 8,
    ...CHILD_HEADING.h4,
    color: "#1E2A39",
    opacity: 0.82,
    includeFontPadding: false,
  },

  messageInput: {
    backgroundColor: "transparent",
  },

  messageInputContent: {
    minHeight: 96,
    textAlignVertical: "top",
    paddingTop: 10,
    paddingBottom: 10,
    color: "#1E2A39",
    ...CHILD_HEADING.h3,
  },

  messageInputOutline: {
    borderRadius: 18,
    borderWidth: 1,
  },

  sendBtn: {
    marginTop: 18,
    borderRadius: 20,
  },

  sendBtnContent: {
    minHeight: 58,
  },

  sendBtnText: {
    ...CHILD_HEADING.h3,
    letterSpacing: 0.2,
    color: "#FFFFFF",
  },
  sendBtnDisabled: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  sendBtnTextDisabled: {
    color: "#475569",
    ...CHILD_HEADING.h4,
  },
});