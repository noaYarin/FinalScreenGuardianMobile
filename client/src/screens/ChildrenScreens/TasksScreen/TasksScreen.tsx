import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import {
  getChildTasksThunk,
  submitTaskThunk,
} from "../../../redux/thunks/tasksThunks";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "@/src/utils/appToast";

const ICON = {
  coin: "cash-multiple",
  check: "check",
  checkCircle: "check-circle-outline",
  camera: "camera-outline",
} as const;

type Task = {
  id: string;
  title: string;
  coins: number;
  done: boolean;
  hasProofImage: boolean;
  isApproved: boolean;
  requireProof: boolean;
  completedAt: string | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";

  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) {
      return "";
    }
    return d.toLocaleDateString("en-GB");
  } catch {
    return "";
  }
}

export default function TasksScreen() {
  const dispatch = useDispatch<any>();

  const childTasks = useSelector((state: any) => state?.tasks?.childTasks ?? []);

  const [activeTab, setActiveTab] = useState<"done" | "todo">("todo");
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getChildTasksThunk());
  }, [dispatch]);

  const tasks: Task[] = useMemo(() => {
    if (!Array.isArray(childTasks)) {
      return [];
    }

    return childTasks.map((task: any) => {
      const proofImg =
        typeof task?.proofImg === "string" ? task.proofImg.trim() : "";

      const hasProofImage = proofImg !== "" && proofImg !== "default.png";

      return {
        id: String(task?._id ?? task?.id ?? Math.random()),
        title: task?.title ?? "Untitled task",
        coins: Number(task?.coinsReward ?? 0),
        done: !!task?.completedAt,
        hasProofImage,
        isApproved: !!task?.isApproved,
        requireProof: !!task?.requireProof,
        completedAt: task?.completedAt ?? null,
      };
    });
  }, [childTasks]);

  const filteredTasks =
    activeTab === "done"
      ? tasks.filter((task) => task.done)
      : tasks.filter((task) => !task.done);

  const weeklyCoins = useMemo(() => {
    return tasks.reduce((sum, task) => {
      return task.isApproved ? sum + Number(task.coins ?? 0) : sum;
    }, 0);
  }, [tasks]);

  const submitWithoutPhoto = async (task: Task) => {
    try {
      setSubmittingTaskId(task.id);

      await dispatch(
        submitTaskThunk({
          taskId: task.id,
          proofImg: "",
        })
      ).unwrap();

      await dispatch(getChildTasksThunk()).unwrap();

      showSuccessToast("Task submitted successfully.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Submit failed"
      );
    } finally {
      setSubmittingTaskId(null);
    }
  };

  const pickImageAndSubmit = async (task: Task) => {
    try {
      setSubmittingTaskId(task.id);

      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showWarningToast(
          "Please allow access to your photo library.",
          "Permission needed"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];
      const imageUri = asset?.uri ?? "";

      if (!imageUri) {
        showWarningToast("Please choose an image.", "No image selected");
        return;
      }

      await dispatch(
        submitTaskThunk({
          taskId: task.id,
          proofImg: imageUri,
        })
      ).unwrap();

      await dispatch(getChildTasksThunk()).unwrap();

      showSuccessToast("Photo uploaded and task submitted.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Upload failed"
      );
    } finally {
      setSubmittingTaskId(null);
    }
  };

  const handleTaskAction = async (task: Task) => {
    if (task.requireProof) {
      await pickImageAndSubmit(task);
      return;
    }

    await submitWithoutPhoto(task);
  };

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.contentMaxWidth}>
          <View style={styles.tabsWrapper}>
            <Pressable
              style={[
                styles.tabBtn,
                activeTab === "todo" ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab("todo")}
              accessibilityRole="button"
              accessibilityLabel="Show pending tasks"
            >
              <AppText weight="extraBold" style={styles.tabText}>
                Pending
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.tabBtn,
                activeTab === "done" ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab("done")}
              accessibilityRole="button"
              accessibilityLabel="Show completed tasks"
            >
              <AppText weight="extraBold" style={styles.tabText}>
                Completed
              </AppText>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {filteredTasks.length === 0 ? (
              <EmptyStateCard
                icon={
                  activeTab === "todo"
                    ? "clipboard-text-outline"
                    : "check-circle-outline"
                }
                title={
                  activeTab === "todo"
                    ? "No pending tasks"
                    : "No completed tasks yet"
                }
                subtitle={
                  activeTab === "todo"
                    ? "You do not have any tasks waiting right now."
                    : "Completed tasks will appear here after you submit them."
                }
              />
            ) : null}

            {filteredTasks.map((task) => {
              const isSubmitting = submittingTaskId === task.id;
              const ActionIcon = task.requireProof
                ? ICON.camera
                : ICON.checkCircle;

              return (
                <View key={task.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <AppText
                      weight="extraBold"
                      style={styles.taskTitle}
                      numberOfLines={2}
                    >
                      {task.title}
                    </AppText>

                    <View style={styles.coinsBadge}>
                      <MaterialCommunityIcons
                        name={ICON.coin}
                        size={18}
                        color="#B46B00"
                      />
                      <AppText weight="extraBold" style={styles.coinsText}>
                        {task.coins}
                      </AppText>
                    </View>
                  </View>

                  {task.done ? (
                    <View style={styles.statusBoxDone}>
                      <View
                        style={[
                          styles.statusIconCircle,
                          styles.statusIconCircleDone,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={ICON.check}
                          size={18}
                          color="#0F8A5F"
                        />
                      </View>

                      <View>
                        <AppText weight="bold" style={styles.statusTextDone}>
                          {task.hasProofImage
                            ? "Photo Uploaded"
                            : "Task Submitted"}
                        </AppText>

                        {task.completedAt ? (
                          <AppText style={styles.completedDateText}>
                            {formatDate(task.completedAt)}
                          </AppText>
                        ) : null}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.todoArea}>
                      <AppText style={styles.todoHint}>
                        {task.requireProof
                          ? "Photo required for submission"
                          : "You can confirm completion without a photo"}
                      </AppText>

                      <Pressable
                        style={styles.uploadBtn}
                        onPress={() => handleTaskAction(task)}
                        disabled={isSubmitting}
                        accessibilityRole="button"
                        accessibilityLabel={
                          task.requireProof
                            ? "Upload photo as proof of task completion"
                            : "Mark task as completed"
                        }
                      >
                        <View style={styles.uploadBtnInner}>
                          <View
                            style={[
                              styles.statusIconCircle,
                              styles.statusIconCircleUpload,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={ActionIcon}
                              size={18}
                              color="#2F6DEB"
                            />
                          </View>

                          <AppText weight="extraBold" style={styles.uploadText}>
                            {isSubmitting
                              ? "Submitting..."
                              : task.requireProof
                                ? "Upload Photo"
                                : "Mark as Done"}
                          </AppText>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}

            <View style={styles.weekBox}>
              <View style={styles.weekInner}>
                <View style={styles.weekIconCircle}>
                  <MaterialCommunityIcons
                    name={ICON.coin}
                    size={18}
                    color="#B46B00"
                  />
                </View>

                <AppText weight="extraBold" style={styles.weekText}>
                  Coins earned: {weeklyCoins}
                </AppText>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenLayout>
  );
}