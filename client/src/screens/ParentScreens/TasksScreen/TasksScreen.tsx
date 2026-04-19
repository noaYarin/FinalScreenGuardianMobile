import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

type UiChild = {
  id: string;
  name: string;
};

type TaskStatus = "completed" | "notDoneYet" | "pending";

type TaskCardItem = {
  id: string;
  title: string;
  childId: string;
  childName: string;
  coins: number;
  dueLabel: string;
  recurrenceLabel: string;
  note: string;
  status: TaskStatus;
  hasProofImage?: boolean;
};

const FALLBACK_CHILDREN: UiChild[] = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Noah" },
  { id: "child-3", name: "Mia" },
];

const MOCK_TASKS: TaskCardItem[] = [
  {
    id: "1",
    title: "Tidy up your room",
    childId: "child-1",
    childName: "Emma",
    coins: 25,
    dueLabel: "Today · 18:00",
    recurrenceLabel: "Daily",
    note: "This task is still open and has not been completed yet.",
    status: "notDoneYet",
  },
  {
    id: "2",
    title: "Read for 20 minutes",
    childId: "child-1",
    childName: "Emma",
    coins: 15,
    dueLabel: "Today · 19:00",
    recurrenceLabel: "Weekly",
    note: "Still waiting to be done today.",
    status: "notDoneYet",
  },
  {
    id: "3",
    title: "Feed the cat",
    childId: "child-2",
    childName: "Noah",
    coins: 20,
    dueLabel: "Today · 08:00",
    recurrenceLabel: "Daily",
    note: "The task was not completed yet.",
    status: "notDoneYet",
  },
  {
    id: "4",
    title: "Water the plants",
    childId: "child-1",
    childName: "Emma",
    coins: 20,
    dueLabel: "Today · 17:20",
    recurrenceLabel: "Daily",
    note: "Photo submitted and waiting for parent approval.",
    status: "pending",
    hasProofImage: true,
  },
  {
    id: "5",
    title: "Clean the study desk",
    childId: "child-3",
    childName: "Mia",
    coins: 30,
    dueLabel: "Today · 16:05",
    recurrenceLabel: "Weekly",
    note: "Marked as done and proof image was uploaded.",
    status: "pending",
    hasProofImage: true,
  },
  {
    id: "6",
    title: "Help set the table",
    childId: "child-2",
    childName: "Noah",
    coins: 18,
    dueLabel: "Yesterday · 19:00",
    recurrenceLabel: "Daily",
    note: "Completed and approved.",
    status: "completed",
  },
];

export default function TasksScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const reduxChildren = useSelector(
    (state: any) => state?.children?.childrenList ?? []
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
  const [activeTab, setActiveTab] = useState<"pending" | "notDoneYet">("pending");

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const filteredTasks = useMemo((): TaskCardItem[] => {
    if (viewMode === "all") {
      return MOCK_TASKS;
    }

    return MOCK_TASKS.filter(
      (task: TaskCardItem) => task.childId === selectedChildId
    );
  }, [viewMode, selectedChildId]);

  const pendingTasks = useMemo(() => {
    return filteredTasks.filter(
      (task: TaskCardItem) => task.status === "pending"
    );
  }, [filteredTasks]);

  const notDoneTasks = useMemo(() => {
    return filteredTasks.filter(
      (task: TaskCardItem) => task.status === "notDoneYet"
    );
  }, [filteredTasks]);

  const visibleTasks = activeTab === "pending" ? pendingTasks : notDoneTasks;

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
                Tasks
              </AppText>
              <AppText weight="medium" style={styles.subtitle}>
                Review pending approvals and tasks that are still not done.
              </AppText>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add task"
                onPress={() => router.push("/Parent/addTask" as Href)}
                style={({ pressed }) => [
                  styles.addTaskButtonGreen,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#16A34A" />
                <AppText weight="extraBold" style={styles.addTaskButtonGreenText}>
                  Add Task
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open task history"
                onPress={() => router.push("/Parent/tasksHistory" as Href)}
                style={({ pressed }) => [
                  styles.historyButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="history" size={18} color="#4C6FFF" />
                <AppText weight="extraBold" style={styles.historyButtonText}>
                  History
                </AppText>
              </Pressable>
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.filterModeRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show tasks for all children"
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
                accessibilityLabel="Show tasks for one child"
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

          <View style={styles.tabsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show pending tasks"
              onPress={() => setActiveTab("pending")}
              style={({ pressed }) => [
                styles.tabButton,
                activeTab === "pending" && styles.tabButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="clock-check-outline"
                size={18}
                color={activeTab === "pending" ? "#FFFFFF" : "#4C6FFF"}
              />
              <AppText
                weight={activeTab === "pending" ? "extraBold" : "bold"}
                style={[
                  styles.tabButtonText,
                  activeTab === "pending" && styles.tabButtonTextActive,
                ]}
              >
                Pending
              </AppText>
              <View
                style={[
                  styles.tabCountBadge,
                  activeTab === "pending" && styles.tabCountBadgeActive,
                ]}
              >
                <AppText
                  weight="bold"
                  style={[
                    styles.tabCountText,
                    activeTab === "pending" && styles.tabCountTextActive,
                  ]}
                >
                  {pendingTasks.length}
                </AppText>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show tasks not done yet"
              onPress={() => setActiveTab("notDoneYet")}
              style={({ pressed }) => [
                styles.tabButton,
                activeTab === "notDoneYet" && styles.tabButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="clipboard-text-clock-outline"
                size={18}
                color={activeTab === "notDoneYet" ? "#FFFFFF" : "#4C6FFF"}
              />
              <AppText
                weight={activeTab === "notDoneYet" ? "extraBold" : "bold"}
                style={[
                  styles.tabButtonText,
                  activeTab === "notDoneYet" && styles.tabButtonTextActive,
                ]}
              >
                Not Done Yet
              </AppText>
              <View
                style={[
                  styles.tabCountBadge,
                  activeTab === "notDoneYet" && styles.tabCountBadgeActive,
                ]}
              >
                <AppText
                  weight="bold"
                  style={[
                    styles.tabCountText,
                    activeTab === "notDoneYet" && styles.tabCountTextActive,
                  ]}
                >
                  {notDoneTasks.length}
                </AppText>
              </View>
            </Pressable>
          </View>

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <View>
                <AppText weight="extraBold" style={styles.listTitle}>
                  {activeTab === "pending" ? "Pending Approval" : "Not Done Yet"}
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
                visibleTasks.map((task: TaskCardItem) => (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskTopRow}>
                      <View style={styles.taskMainInfo}>
                        <AppText weight="extraBold" style={styles.taskTitle}>
                          {task.title}
                        </AppText>
                        <AppText weight="medium" style={styles.taskMeta}>
                          {task.childName} · {task.dueLabel}
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

                    <View style={styles.taskBottomRow}>
                      <View style={styles.metaPill}>
                        <AppText weight="bold" style={styles.metaPillText}>
                          {task.recurrenceLabel}
                        </AppText>
                      </View>

                      {task.hasProofImage ? (
                        <View style={styles.proofPill}>
                          <MaterialCommunityIcons
                            name="image-outline"
                            size={15}
                            color="#4C6FFF"
                          />
                          <AppText weight="bold" style={styles.proofPillText}>
                            Proof image
                          </AppText>
                        </View>
                      ) : null}
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
                    No tasks match this filter right now.
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