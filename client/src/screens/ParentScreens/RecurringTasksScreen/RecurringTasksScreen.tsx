import React, { useEffect, useMemo } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import {
  getParentTasksThunk,
  deleteTaskThunk,
} from "../../../redux/thunks/tasksThunks";
import { showSuccessToast, showErrorToast } from "@/src/utils/appToast";

function getRecurrenceLabel(task: any) {
  if (task?.recurrenceType === "daily") return "Daily";
  if (task?.recurrenceType === "weekly") return "Weekly";
  return "Recurring";
}

function formatDate(value: any) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  return date.toLocaleDateString("en-GB");
}

export default function RecurringTasksScreen() {
  const dispatch = useDispatch<any>();

  const parentTasks = useSelector(
    (state: any) => state?.tasks?.parentTasks ?? []
  );

  const childrenList = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  useEffect(() => {
    dispatch(getMyChildrenThunk());
    dispatch(getParentTasksThunk());
  }, [dispatch]);

  const recurringTasks = useMemo(() => {
    if (!Array.isArray(parentTasks)) return [];

    return parentTasks.filter(
      (task: any) =>
        task?.isRegulary === true &&
        task?.deletedAt == null &&
        task?.isActive !== false
    );
  }, [parentTasks]);

  function getChildName(childId: string) {
    const child = childrenList.find(
      (item: any) => String(item?._id ?? item?.id) === String(childId)
    );

    return child?.name ?? child?.fullName ?? "Child";
  }

  async function handleDeleteRecurringTask(taskId: string) {
    try {
      await dispatch(deleteTaskThunk(taskId)).unwrap();
      await dispatch(getParentTasksThunk()).unwrap();

      showSuccessToast("Recurring task cancelled successfully.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Delete failed"
      );
    }
  }

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <AppText weight="extraBold" style={styles.title}>
              Recurring Tasks
            </AppText>

            <AppText weight="medium" style={styles.subtitle}>
              View daily and weekly tasks assigned to your children.
            </AppText>
          </View>

          {recurringTasks.length > 0 ? (
            recurringTasks.map((task: any) => {
              const taskId = String(task?._id ?? task?.id);
              const childName = getChildName(String(task?.childId));

              return (
                <View key={taskId} style={styles.card}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardMain}>
                      <AppText weight="extraBold" style={styles.taskTitle}>
                        {task?.title ?? "Untitled task"}
                      </AppText>

                      <AppText weight="medium" style={styles.taskMeta}>
                        {childName}
                      </AppText>
                    </View>

                    <View style={styles.badge}>
                      <MaterialCommunityIcons
                        name="repeat"
                        size={15}
                        color="#4C6FFF"
                      />
                      <AppText weight="bold" style={styles.badgeText}>
                        {getRecurrenceLabel(task)}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="calendar-start"
                      size={17}
                      color="#64748B"
                    />
                    <AppText weight="medium" style={styles.infoText}>
                      Start: {formatDate(task?.startDate)}
                    </AppText>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="calendar-end"
                      size={17}
                      color="#64748B"
                    />
                    <AppText weight="medium" style={styles.infoText}>
                      Current period ends: {formatDate(task?.endDate)}
                    </AppText>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialCommunityIcons
                      name="star-circle"
                      size={17}
                      color="#F59E0B"
                    />
                    <AppText weight="medium" style={styles.infoText}>
                      Reward: {Number(task?.coinsReward ?? 0)} coins
                    </AppText>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Cancel recurring task ${task?.title}`}
                    onPress={() => handleDeleteRecurringTask(taskId)}
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
                      Cancel Recurring Task
                    </AppText>
                  </Pressable>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="repeat-off"
                size={36}
                color="#94A3B8"
              />
              <AppText weight="extraBold" style={styles.emptyTitle}>
                No recurring tasks yet
              </AppText>
              <AppText weight="medium" style={styles.emptyText}>
                Daily and weekly tasks will appear here.
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}