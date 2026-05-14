import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  container: {
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    gap: 16,
  },

  header: {
    gap: 6,
  },

  title: {
    fontSize: 28,
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 12,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  cardMain: {
    flex: 1,
    gap: 4,
  },

  taskTitle: {
    fontSize: 18,
    color: "#0F172A",
  },

  taskMeta: {
    fontSize: 14,
    color: "#64748B",
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  badgeText: {
    fontSize: 12,
    color: "#4C6FFF",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoText: {
    fontSize: 14,
    color: "#475569",
  },

  deleteButton: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    paddingVertical: 12,
  },

  deleteButtonText: {
    fontSize: 14,
    color: "#DC2626",
  },

  pressed: {
    opacity: 0.75,
  },

  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 28,
    alignItems: "center",
    gap: 8,
  },

  emptyTitle: {
    fontSize: 17,
    color: "#0F172A",
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
});