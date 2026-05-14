import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Image,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import {
  approveTaskThunk,
  getParentTasksThunk,
  rejectTaskThunk,
  deleteTaskThunk,
} from "../../../redux/thunks/tasksThunks";
import {
  showSuccessToast,
  showErrorToast,
} from "@/src/utils/appToast";

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
  proofImg: string;
  hasProofImage: boolean;
};

function formatDueLabel(task: any) {
  if (task?.endDate) {
    try {
      const date = new Date(task.endDate);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-GB");
      }
    } catch {}
  }

  if (task?.startDate) {
    try {
      const date = new Date(task.startDate);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-GB");
      }
    } catch {}
  }

  return "No due date";
}

function getRecurrenceLabel(task: any) {
  if (!task?.isRegulary) {
    return "One time";
  }

  if (task?.recurrenceType === "daily") {
    return "Daily";
  }

  if (task?.recurrenceType === "weekly") {
    return "Weekly";
  }

  return "Recurring";
}

export default function TasksScreen() {
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
    if (!Array.isArray(reduxChildren)) {
      return [];
    }

    return reduxChildren.map((child: any) => ({
      id: String(child._id ?? child.id),
      name: child.name ?? child.fullName ?? "Child",
    }));
  }, [reduxChildren]);

  const [viewMode, setViewMode] = useState<"all" | "single">("all");
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"pending" | "notDoneYet">(
    "pending"
  );
  const [selectedProofImage, setSelectedProofImage] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(getMyChildrenThunk());
    dispatch(getParentTasksThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const mappedTasks = useMemo((): TaskCardItem[] => {
    if (!Array.isArray(parentTasks)) {
      return [];
    }

    return parentTasks.map((task: any) => {
      const childId = String(task?.childId ?? "");
      const childName =
        children.find((child) => String(child.id) === childId)?.name ?? "Child";

      const proofImg =
        typeof task?.proofImg === "string" ? task.proofImg.trim() : "";

      const hasProofImage =
        proofImg.startsWith("data:image/") || proofImg.startsWith("http");

      let status: TaskStatus = "notDoneYet";

      if (task?.completedAt && !task?.isApproved) {
        status = "pending";
      } else if (task?.completedAt && task?.isApproved) {
        status = "completed";
      }

      return {
        id: String(task?._id ?? task?.id ?? ""),
        title: task?.title ?? "Untitled task",
        childId,
        childName,
        coins: Number(task?.coinsReward ?? 0),
        dueLabel: formatDueLabel(task),
        recurrenceLabel: getRecurrenceLabel(task),
        note:
          status === "pending"
            ? "Photo submitted and waiting for parent approval."
            : status === "completed"
              ? "Completed and approved."
              : "This task is still open and has not been completed yet.",
        status,
        proofImg,
        hasProofImage,
      };
    });
  }, [parentTasks, children]);

  const filteredTasks = useMemo((): TaskCardItem[] => {
    if (viewMode === "all") {
      return mappedTasks;
    }

    return mappedTasks.filter((task) => task.childId === selectedChildId);
  }, [mappedTasks, viewMode, selectedChildId]);

  const pendingTasks = useMemo(() => {
    return filteredTasks.filter((task) => task.status === "pending");
  }, [filteredTasks]);

  const notDoneTasks = useMemo(() => {
    return filteredTasks.filter((task) => task.status === "notDoneYet");
  }, [filteredTasks]);

  const visibleTasks = activeTab === "pending" ? pendingTasks : notDoneTasks;

  const selectedChildName =
    children.find((child) => child.id === selectedChildId)?.name ?? "Child";

  const handleApproveTask = async (taskId: string) => {
    try {
      await dispatch(approveTaskThunk(taskId)).unwrap();
      await dispatch(getParentTasksThunk()).unwrap();
      showSuccessToast("Task approved successfully.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Approve failed"
      );
    }
  };

  const handleRejectTask = async (taskId: string) => {
    try {
      await dispatch(rejectTaskThunk(taskId)).unwrap();
      await dispatch(getParentTasksThunk()).unwrap();
      showSuccessToast("Task rejected and returned to child.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Reject failed"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTaskThunk(taskId)).unwrap();
      await dispatch(getParentTasksThunk()).unwrap();
      showSuccessToast("Task deleted successfully.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Delete failed"
      );
    }
  };

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
                <AppText
                  weight="extraBold"
                  style={styles.addTaskButtonGreenText}
                >
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
                <MaterialCommunityIcons
                  name="history"
                  size={18}
                  color="#4C6FFF"
                />
                <AppText weight="extraBold" style={styles.historyButtonText}>
                  History
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open recurring tasks"
                onPress={() => router.push("/Parent/recurringTasks" as Href)}
                style={({ pressed }) => [
                  styles.recurringButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="repeat"
                  size={18}
                  color="#7C3AED"
                />
                <AppText weight="extraBold" style={styles.recurringButtonText}>
                  Recurring
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
                visibleTasks.map((task) => (
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
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Open proof image for ${task.title}`}
                          onPress={() => setSelectedProofImage(task.proofImg)}
                          style={({ pressed }) => [
                            styles.proofPill,
                            pressed && styles.pressed,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="image-outline"
                            size={15}
                            color="#4C6FFF"
                          />
                          <AppText weight="bold" style={styles.proofPillText}>
                            Proof image
                          </AppText>
                        </Pressable>
                      ) : null}
                    </View>

                    <View style={styles.taskBottomRow}>
                      {task.status === "pending" ? (
                        <>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Approve ${task.title}`}
                            onPress={() => handleApproveTask(task.id)}
                            style={({ pressed }) => [
                              styles.addTaskButtonGreen,
                              pressed && styles.pressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="check-circle-outline"
                              size={18}
                              color="#16A34A"
                            />
                            <AppText
                              weight="extraBold"
                              style={styles.addTaskButtonGreenText}
                            >
                              Approve
                            </AppText>
                          </Pressable>

                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Reject ${task.title}`}
                            onPress={() => handleRejectTask(task.id)}
                            style={({ pressed }) => [
                              styles.rejectButton,
                              pressed && styles.pressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="close-circle-outline"
                              size={18}
                              color="#DC2626"
                            />
                            <AppText
                              weight="extraBold"
                              style={styles.rejectButtonText}
                            >
                              Reject
                            </AppText>
                          </Pressable>
                        </>
                      ) : null}

                      {task.status === "notDoneYet" ? (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Delete ${task.title}`}
                          onPress={() => handleDeleteTask(task.id)}
                          style={({ pressed }) => [
                            styles.deleteButton,
                            pressed && styles.pressed,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={18}
                            color="#DC2626"
                          />
                          <AppText
                            weight="extraBold"
                            style={styles.deleteButtonText}
                          >
                            Delete
                          </AppText>
                        </Pressable>
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

      <Modal
        visible={!!selectedProofImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedProofImage(null)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close proof image"
            onPress={() => setSelectedProofImage(null)}
            style={styles.modalCloseButton}
          >
            <MaterialCommunityIcons name="close" size={22} color="#FFFFFF" />
          </Pressable>

          {selectedProofImage ? (
            <Image
              source={{ uri: selectedProofImage }}
              resizeMode="contain"
              style={styles.modalImage}
            />
          ) : null}
        </View>
      </Modal>
    </ScreenLayout>
  );
}