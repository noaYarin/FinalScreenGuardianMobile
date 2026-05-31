export function resolveAssignedChildLabel(
  item: { assignedToAll?: boolean } | null | undefined,
  childName: string,
  viewMode: "all" | "single"
) {
  if (viewMode === "all" && item?.assignedToAll === true) {
    return "All children";
  }

  return childName;
}
