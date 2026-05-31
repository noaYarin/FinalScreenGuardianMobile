import { StyleSheet } from "react-native";
import {
  PARENT_HEADING,
  PARENT_TEXT,
} from "@/src/theme/parentTypography";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },

  content: {
    width: "100%",
    alignSelf: "center",
  },

  formCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    padding: 18,
    gap: 22,
    shadowColor: "#102040",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  formTitle: {
    ...PARENT_HEADING.h1,
    color: "#0F172A",
    textAlign: "center",
  },

  fieldBlock: {
    width: "100%",
    gap: 8,
  },

  label: {
    fontSize: 16,
    color: "#0F172A",
  },

  fieldHint: {
    ...PARENT_TEXT.bodySmall,
    color: "#64748B",
  },

  input: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9E3F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#0F172A",
  },

  genderRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },

  genderButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  genderButtonActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#93C5FD",
  },

  genderButtonText: {
    fontSize: 14,
    color: "#475569",
  },

  genderButtonTextActive: {
    color: "#1D4ED8",
  },

  saveButton: {
    width: "100%",
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: COLORS.light.tint,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    paddingVertical: 13,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 16,
    color: "#1D4ED8",
  },

  dateFieldButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9E3F0",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  dateFieldButtonPressed: {
    opacity: 0.9,
  },

  dateFieldContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  dateFieldLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dateIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  dateFieldValue: {
    fontSize: 16,
    color: "#0F172A",
  },

  dateFieldChangeText: {
    fontSize: 14,
    color: "#2563EB",
  },
});
