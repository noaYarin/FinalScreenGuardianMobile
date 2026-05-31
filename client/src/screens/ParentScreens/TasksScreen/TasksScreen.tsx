import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import CoinIcon from "../../../components/CoinIcon/CoinIcon";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { APP_COLORS } from "@/constants/theme";
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
import { resolveAssignedChildLabel } from "@/src/utils/assignedChildLabel";

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
    "notDoneYet"
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
      const childDisplayName = resolveAssignedChildLabel(
        task,
        childName,
        viewMode
      );

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
        childName: childDisplayName,
        coins: Number(task?.coinsReward ?? 0),
        dueLabel: formatDueLabel(task),
        recurrenceLabel: getRecurrenceLabel(task),
        status,
        proofImg,
        hasProofImage,
      };
    });
  }, [parentTasks, children, viewMode]);

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
    <ScreenLayout scrollable={false} backgroundColor={APP_COLORS.screenBg}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.topCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add task"
              onPress={() => router.push("/Parent/addTask" as Href)}
              style={({ pressed }) => [
                styles.primaryActionButtonFull,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#1D4ED8" />
              <AppText weight="extraBold" style={styles.primaryActionButtonText}>
                Add Task
              </AppText>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open task history"
                onPress={() => router.push("/Parent/tasksHistory" as Href)}
                style={({ pressed }) => [
                  styles.secondaryActionButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="history" size={18} color="#4C6FFF" />
                <AppText weight="bold" style={styles.secondaryActionButtonText}>
                  History
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open recurring tasks"
                onPress={() => router.push("/Parent/recurringTasks" as Href)}
                style={({ pressed }) => [
                  styles.outlineActionButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="repeat" size={18} color="#7C3AED" />
                <AppText weight="bold" style={styles.outlineActionButtonText}>
                  Recurring
                </AppText>
              </Pressable>
            </View>
          </View>

          {children.length === 0 ? (
            <EmptyStateCard
              icon="account-outline"
              title="No children yet"
              subtitle="Add a child first, then create tasks and approve their submissions."
              buttonLabel="Add Child"
              onPressButton={() => router.push("/Parent/addChild" as Href)}
              buttonStyle={styles.btnSecondary}
              buttonTextStyle={styles.btnSecondaryText}
            />
          ) : (
            <>
          <View style={styles.mainPanel}>
            <View style={styles.panelSection}>
              <AppText weight="bold" style={styles.panelLabel}>
                Filter by child
              </AppText>

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

            <View style={styles.panelDivider} />

            <View style={styles.panelSection}>
              <AppText weight="bold" style={styles.panelLabel}>
                Task status
              </AppText>

              <View style={styles.tabsRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Show open tasks"
                  onPress={() => setActiveTab("notDoneYet")}
                  style={({ pressed }) => [
                    styles.tabButton,
                    activeTab === "notDoneYet" && styles.tabButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="clipboard-text-clock-outline"
                    size={16}
                    color={activeTab === "notDoneYet" ? "#FFFFFF" : "#4C6FFF"}
                  />
                  <AppText
                    weight={activeTab === "notDoneYet" ? "extraBold" : "bold"}
                    style={[
                      styles.tabButtonText,
                      activeTab === "notDoneYet" && styles.tabButtonTextActive,
                    ]}
                  >
                    Open Tasks
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
                    size={16}
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
              </View>
            </View>

            <View style={styles.panelDivider} />

            <View style={[styles.panelSection, styles.panelListSection]}>
              <View style={styles.listHeaderRow}>
              
        
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
                        <View style={styles.cardMetaRow}>
                          <AppText style={styles.cardMetaLabel}>Child</AppText>
                          <AppText weight="bold" style={styles.cardMetaValue}>
                            {task.childName}
                          </AppText>
                        </View>
                        <View style={styles.cardMetaRow}>
                          <AppText style={styles.cardMetaLabel}>Due</AppText>
                          <AppText weight="bold" style={styles.cardMetaValue}>
                            {task.dueLabel}
                          </AppText>
                        </View>
                        <View style={styles.cardMetaRow}>
                          <AppText style={styles.cardMetaLabel}>Repeat</AppText>
                          <AppText weight="bold" style={styles.cardMetaValue}>
                            {task.recurrenceLabel}
                          </AppText>
                        </View>
                      </View>

                      <View style={styles.coinsBadge}>
                        <CoinIcon size={18} />
                        <AppText weight="bold" style={styles.coinsBadgeText}>
                          {task.coins}
                        </AppText>
                        <AppText style={styles.coinsBadgeLabel}>coins</AppText>
                      </View>
                    </View>

                    <View style={styles.taskBottomRow}>
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
                            View proof
                          </AppText>
                        </Pressable>
                      ) : null}
                    </View>

                    <View style={styles.taskActionsRow}>
                      {task.status === "pending" ? (
                        <>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Approve ${task.title}`}
                            onPress={() => handleApproveTask(task.id)}
                            style={({ pressed }) => [
                              styles.approveButton,
                              pressed && styles.pressed,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="check-circle-outline"
                              size={18}
                              color="#16A34A"
                            />
                            <AppText weight="extraBold" style={styles.approveButtonText}>
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
                            <AppText weight="extraBold" style={styles.rejectButtonText}>
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
                          <AppText weight="extraBold" style={styles.deleteButtonText}>
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
                    {activeTab === "pending"
                      ? "No tasks waiting for your approval."
                      : "No open tasks. Tap Add Task to create one."}
                  </AppText>
                </View>
              )}
              </View>
            </View>
          </View>
            </>
          )}
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