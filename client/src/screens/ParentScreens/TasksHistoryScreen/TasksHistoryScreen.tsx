import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

type UiChild = {
  id: string;
  name: string;
};

type HistoryStatus = "completed" | "approved";

type HistoryTaskItem = {
  id: string;
  title: string;
  childId: string;
  childName: string;
  coins: number;
  completedAt: string;
  recurrenceLabel: string;
  note: string;
  status: HistoryStatus;
  approvedBy?: string;
  hasProofImage?: boolean;
  proofImageUrl?: string;
};

const FALLBACK_CHILDREN: UiChild[] = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Noah" },
  { id: "child-3", name: "Mia" },
];

const MOCK_HISTORY_TASKS: HistoryTaskItem[] = [
  {
    id: "h1",
    title: "Help set the table",
    childId: "child-2",
    childName: "Noah",
    coins: 18,
    completedAt: "Yesterday · 19:00",
    recurrenceLabel: "Daily",
    note: "Completed successfully before dinner.",
    status: "completed",
  },
  {
    id: "h2",
    title: "Read for 20 minutes",
    childId: "child-1",
    childName: "Emma",
    coins: 15,
    completedAt: "Yesterday · 18:20",
    recurrenceLabel: "Weekly",
    note: "Finished reading chapter 4.",
    status: "completed",
  },
  {
    id: "h3",
    title: "Water the plants",
    childId: "child-1",
    childName: "Emma",
    coins: 20,
    completedAt: "2 days ago · 17:15",
    recurrenceLabel: "Daily",
    note: "Photo reviewed and approved by parent.",
    status: "approved",
    approvedBy: "Mom",
    hasProofImage: true,
    proofImageUrl:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "h4",
    title: "Clean the study desk",
    childId: "child-3",
    childName: "Mia",
    coins: 30,
    completedAt: "3 days ago · 16:05",
    recurrenceLabel: "Weekly",
    note: "Desk was fully cleaned and photo was approved.",
    status: "approved",
    approvedBy: "Dad",
    hasProofImage: true,
    proofImageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "h5",
    title: "Pack school bag",
    childId: "child-2",
    childName: "Noah",
    coins: 12,
    completedAt: "4 days ago · 20:10",
    recurrenceLabel: "Daily",
    note: "Everything was ready for the next morning.",
    status: "completed",
  },
];

export default function TasksHistoryScreen() {
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
  const [activeTab, setActiveTab] = useState<HistoryStatus>("completed");

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const filteredHistory = useMemo((): HistoryTaskItem[] => {
    if (viewMode === "all") {
      return MOCK_HISTORY_TASKS;
    }

    return MOCK_HISTORY_TASKS.filter(
      (task: HistoryTaskItem) => task.childId === selectedChildId
    );
  }, [viewMode, selectedChildId]);

  const completedTasks = useMemo(() => {
    return filteredHistory.filter(
      (task: HistoryTaskItem) => task.status === "completed"
    );
  }, [filteredHistory]);

  const approvedTasks = useMemo(() => {
    return filteredHistory.filter(
      (task: HistoryTaskItem) => task.status === "approved"
    );
  }, [filteredHistory]);

  const visibleTasks = activeTab === "completed" ? completedTasks : approvedTasks;

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
                Review completed and approved tasks from previous days.
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

          <View style={styles.tabsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show completed tasks"
              onPress={() => setActiveTab("completed")}
              style={({ pressed }) => [
                styles.tabButton,
                activeTab === "completed" && styles.tabButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={18}
                color={activeTab === "completed" ? "#FFFFFF" : "#4C6FFF"}
              />
              <AppText
                weight={activeTab === "completed" ? "extraBold" : "bold"}
                style={[
                  styles.tabButtonText,
                  activeTab === "completed" && styles.tabButtonTextActive,
                ]}
              >
                Completed
              </AppText>
              <View
                style={[
                  styles.tabCountBadge,
                  activeTab === "completed" && styles.tabCountBadgeActive,
                ]}
              >
                <AppText
                  weight="bold"
                  style={[
                    styles.tabCountText,
                    activeTab === "completed" && styles.tabCountTextActive,
                  ]}
                >
                  {completedTasks.length}
                </AppText>
              </View>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Show approved tasks"
              onPress={() => setActiveTab("approved")}
              style={({ pressed }) => [
                styles.tabButton,
                activeTab === "approved" && styles.tabButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={18}
                color={activeTab === "approved" ? "#FFFFFF" : "#4C6FFF"}
              />
              <AppText
                weight={activeTab === "approved" ? "extraBold" : "bold"}
                style={[
                  styles.tabButtonText,
                  activeTab === "approved" && styles.tabButtonTextActive,
                ]}
              >
                Approved
              </AppText>
              <View
                style={[
                  styles.tabCountBadge,
                  activeTab === "approved" && styles.tabCountBadgeActive,
                ]}
              >
                <AppText
                  weight="bold"
                  style={[
                    styles.tabCountText,
                    activeTab === "approved" && styles.tabCountTextActive,
                  ]}
                >
                  {approvedTasks.length}
                </AppText>
              </View>
            </Pressable>
          </View>

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <View>
                <AppText weight="extraBold" style={styles.listTitle}>
                  {activeTab === "completed" ? "Completed Tasks" : "Approved Tasks"}
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
                visibleTasks.map((task: HistoryTaskItem) => (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskTopRow}>
                      <View style={styles.taskMainInfo}>
                        <AppText weight="extraBold" style={styles.taskTitle}>
                          {task.title}
                        </AppText>
                        <AppText weight="medium" style={styles.taskMeta}>
                          {task.childName} · {task.completedAt}
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

                    {task.hasProofImage && task.proofImageUrl ? (
                      <Image
                        source={{ uri: task.proofImageUrl }}
                        resizeMode="cover"
                        style={styles.proofImage}
                      />
                    ) : null}

                    <View style={styles.taskBottomRow}>
                      <View style={styles.metaPill}>
                        <AppText weight="bold" style={styles.metaPillText}>
                          {task.recurrenceLabel}
                        </AppText>
                      </View>

                      {task.status === "approved" ? (
                        <View style={styles.approvedPill}>
                          <MaterialCommunityIcons
                            name="shield-check"
                            size={15}
                            color="#15803D"
                          />
                          <AppText weight="bold" style={styles.approvedPillText}>
                            Approved{task.approvedBy ? ` by ${task.approvedBy}` : ""}
                          </AppText>
                        </View>
                      ) : (
                        <View style={styles.completedPill}>
                          <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={15}
                            color="#4C6FFF"
                          />
                          <AppText weight="bold" style={styles.completedPillText}>
                            Completed
                          </AppText>
                        </View>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="history"
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