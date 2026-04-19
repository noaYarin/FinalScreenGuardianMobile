import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import { getParentTasksThunk } from "../../../redux/thunks/tasksThunks";

type UiChild = {
  id: string;
  name: string;
};

type HistoryTaskItem = {
  id: string;
  title: string;
  childId: string;
  childName: string;
  coins: number;
  completedAtLabel: string;
  recurrenceLabel: string;
  note: string;
  hasProofImage: boolean;
  proofImageUrl: string;
};

const FALLBACK_CHILDREN: UiChild[] = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Noah" },
  { id: "child-3", name: "Mia" },
];

function formatCompletedLabel(completedAt: string | null | undefined) {
  if (!completedAt) {
    return "Completed";
  }

  try {
    const date = new Date(completedAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB");
    }
  } catch {}

  return "Completed";
}

export default function TasksHistoryScreen() {
  const dispatch = useDispatch<any>();
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const reduxChildren = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  const parentTasks = useSelector(
    (state: any) => state?.tasks?.parentTasks ?? []
  );

  const children: UiChild[] = useMemo(() => {
    if (Array.isArray(reduxChildren) && reduxChildren.length > 0) {
      return reduxChildren.map((child: any) => ({
        id: String(child._id ?? child.id),
        name: child.name ?? child.fullName ?? "Child",
      }));
    }

    return FALLBACK_CHILDREN;
  }, [reduxChildren]);

  const [viewMode, setViewMode] = useState<"all" | "single">("all");
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  useEffect(() => {
    dispatch(getMyChildrenThunk());
    dispatch(getParentTasksThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const mappedHistoryTasks = useMemo((): HistoryTaskItem[] => {
    if (!Array.isArray(parentTasks)) {
      return [];
    }

    return parentTasks
      .filter((task: any) => !!task?.completedAt && !!task?.isApproved)
      .map((task: any) => {
        const childId = String(task?.childId ?? "");
        const childName =
          children.find((child) => String(child.id) === childId)?.name ?? "Child";

        const proofImg =
          typeof task?.proofImg === "string" ? task.proofImg.trim() : "";

        const hasProofImage =
          proofImg !== "" && proofImg !== "default.png";

        return {
          id: String(task?._id ?? task?.id ?? Math.random()),
          title: task?.title ?? "Untitled task",
          childId,
          childName,
          coins: Number(task?.coinsReward ?? 0),
          completedAtLabel: formatCompletedLabel(task?.completedAt),
          recurrenceLabel: task?.isRegulary ? "Daily / Recurring" : "One time",
          note: "Task was completed and approved by the parent.",
          hasProofImage,
          proofImageUrl: hasProofImage ? proofImg : "",
        };
      });
  }, [parentTasks, children]);

  const visibleTasks = useMemo((): HistoryTaskItem[] => {
    if (viewMode === "all") {
      return mappedHistoryTasks;
    }

    return mappedHistoryTasks.filter(
      (task) => String(task.childId) === String(selectedChildId)
    );
  }, [mappedHistoryTasks, viewMode, selectedChildId]);

  const selectedChildName =
    children.find((child) => child.id === selectedChildId)?.name ?? "Child";

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={[styles.headerRow, isWide && styles.headerRowWide]}>
            <View style={styles.titleBlock}>
              <AppText weight="extraBold" style={styles.title}>
                Task History
              </AppText>
              <AppText weight="medium" style={styles.subtitle}>
                Review approved tasks from previous days.
              </AppText>
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.filterModeRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show task history for all children"
                onPress={() => setViewMode("all")}
                style={({ pressed }) => [
                  styles.filterModeButton,
                  viewMode === "all" && styles.filterModeButtonActive,
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  weight={viewMode === "all" ? "extraBold" : "medium"}
                  style={[
                    styles.filterModeButtonText,
                    viewMode === "all" && styles.filterModeButtonTextActive,
                  ]}
                >
                  All Children
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show task history for one child"
                onPress={() => setViewMode("single")}
                style={({ pressed }) => [
                  styles.filterModeButton,
                  viewMode === "single" && styles.filterModeButtonActive,
                  pressed && styles.pressed,
                ]}
              >
                <AppText
                  weight={viewMode === "single" ? "extraBold" : "medium"}
                  style={[
                    styles.filterModeButtonText,
                    viewMode === "single" && styles.filterModeButtonTextActive,
                  ]}
                >
                  One Child
                </AppText>
              </Pressable>
            </View>

            {viewMode === "single" ? (
              <View style={styles.selectorWrap}>
                <ChildDeviceSelector
                  selectedChildId={selectedChildId}
                  onSelectChild={setSelectedChildId}
                  showDevices={false}
                />
              </View>
            ) : null}
          </View>

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <View>
                <AppText weight="extraBold" style={styles.listTitle}>
                  Approved Tasks
                </AppText>
                <AppText weight="medium" style={styles.listSubtitle}>
                  {viewMode === "all"
                    ? "Showing all children"
                    : `Showing ${selectedChildName}`}
                </AppText>
              </View>

              <View style={styles.listCountPill}>
                <AppText weight="bold" style={styles.listCountPillText}>
                  {visibleTasks.length} items
                </AppText>
              </View>
            </View>

            <View style={styles.listContent}>
              {visibleTasks.length > 0 ? (
                visibleTasks.map((task) => (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskTopRow}>
                      <View style={styles.taskMainInfo}>
                        <AppText weight="extraBold" style={styles.taskTitle}>
                          {task.title}
                        </AppText>
                        <AppText weight="medium" style={styles.taskMeta}>
                          {task.childName} · {task.completedAtLabel}
                        </AppText>
                      </View>

                      <View style={styles.coinsBadge}>
                        <MaterialCommunityIcons
                          name="star-circle"
                          size={16}
                          color="#F59E0B"
                        />
                        <AppText weight="bold" style={styles.coinsBadgeText}>
                          {task.coins}
                        </AppText>
                      </View>
                    </View>

                    <AppText weight="medium" style={styles.taskNote}>
                      {task.note}
                    </AppText>

                    {task.hasProofImage ? (
                      <Image
                        source={{ uri: task.proofImageUrl }}
                        style={styles.proofImage}
                        resizeMode="cover"
                      />
                    ) : null}

                    <View style={styles.taskBottomRow}>
                      <View style={styles.metaPill}>
                        <AppText weight="bold" style={styles.metaPillText}>
                          {task.recurrenceLabel}
                        </AppText>
                      </View>

                      <View style={styles.approvedPill}>
                        <MaterialCommunityIcons
                          name="check-decagram-outline"
                          size={15}
                          color="#15803D"
                        />
                        <AppText weight="bold" style={styles.approvedPillText}>
                          Approved
                        </AppText>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="clipboard-text-search-outline"
                    size={32}
                    color="#94A3B8"
                  />
                  <AppText weight="extraBold" style={styles.emptyStateTitle}>
                    Nothing here yet
                  </AppText>
                  <AppText weight="medium" style={styles.emptyStateText}>
                    No history items match this filter right now.
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}