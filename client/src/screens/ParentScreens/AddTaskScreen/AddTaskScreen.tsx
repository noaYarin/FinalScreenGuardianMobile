import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "@/src/utils/appToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import {
  createTaskThunk,
  getParentTasksThunk,
} from "../../../redux/thunks/tasksThunks";

type UiChild = {
  id: string;
  name: string;
};

type RecurrenceType = "daily" | "weekly";

const FALLBACK_CHILDREN: UiChild[] = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Noah" },
  { id: "child-3", name: "Mia" },
];

const RECURRENCE_OPTIONS: {
  label: string;
  value: RecurrenceType;
}[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
];

export default function AddTaskScreen() {
  const dispatch = useDispatch<any>();

  const reduxChildren = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  const isCreating = useSelector(
    (state: any) => state?.tasks?.isCreating ?? false
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

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [coins, setCoins] = useState(25);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] =
    useState<RecurrenceType>("daily");
  const [assignedChildIds, setAssignedChildIds] = useState<string[]>([]);
  const [requireProof, setRequireProof] = useState(false);

  useEffect(() => {
    if (children.length > 0 && assignedChildIds.length === 0) {
      setAssignedChildIds([children[0].id]);
    }
  }, [children, assignedChildIds.length]);

  const toggleAssignedChild = (childId: string) => {
    setAssignedChildIds((prev) => {
      if (prev.includes(childId)) {
        if (prev.length === 1) {
          return prev;
        }

        return prev.filter((id) => id !== childId);
      }

      return [...prev, childId];
    });
  };

  const handleCreateTask = async () => {
    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();

    if (!trimmedTitle) {
      showWarningToast("Please enter a task title.", "Missing title");
      return;
    }

    if (assignedChildIds.length === 0) {
      showWarningToast("Please select at least one child.", "No child selected");
      return;
    }

    const normalizedRecurrenceType = isRecurring ? recurrenceType : "none";

    try {
      await dispatch(
        createTaskThunk({
          title: trimmedTitle,
          description: trimmedDescription,
          coinsReward: coins,
          isRecurring,
          recurrenceType: normalizedRecurrenceType,
          assignedChildIds,
          requireProof,
        })
      ).unwrap();

      await dispatch(getParentTasksThunk()).unwrap();

      showSuccessToast("Task created successfully.", "Success");

      setTaskTitle("");
      setTaskDescription("");
      setCoins(25);
      setIsRecurring(false);
      setRecurrenceType("daily");
      setAssignedChildIds(children.length > 0 ? [children[0].id] : []);
      setRequireProof(false);

      router.back();
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Create task failed"
      );
    }
  };

  const previewRecurrenceLabel = isRecurring
    ? recurrenceType === "daily"
      ? "Daily"
      : "Weekly"
    : "One time";

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerCard}>
            <AppText weight="extraBold" style={styles.title}>
              Create a New Task
            </AppText>

            <AppText weight="medium" style={styles.subtitle}>
              Define the task, choose who gets it, and set the reward.
            </AppText>
          </View>

          <View style={styles.card}>
            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Task title
              </AppText>

              <TextInput
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Example: Tidy up your room"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                accessibilityLabel="Task title"
              />
            </View>

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Description
              </AppText>

              <TextInput
                value={taskDescription}
                onChangeText={setTaskDescription}
                placeholder="Write clear instructions for the child"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textArea]}
                accessibilityLabel="Task description"
              />
            </View>

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Coins reward
              </AppText>

              <View style={styles.coinsRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decrease coins"
                  onPress={() => setCoins((prev) => Math.max(5, prev - 5))}
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={18}
                    color="#243447"
                  />
                </Pressable>

                <View style={styles.coinsValueBox}>
                  <MaterialCommunityIcons
                    name="star-circle"
                    size={20}
                    color="#F59E0B"
                  />

                  <AppText weight="extraBold" style={styles.coinsValueText}>
                    {coins} coins
                  </AppText>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Increase coins"
                  onPress={() => setCoins((prev) => prev + 5)}
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={18}
                    color="#243447"
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Is this a recurring task?
              </AppText>

              <View style={styles.segmentRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Recurring task yes"
                  onPress={() => setIsRecurring(true)}
                  style={({ pressed }) => [
                    styles.segmentButton,
                    isRecurring && styles.segmentButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    weight={isRecurring ? "extraBold" : "medium"}
                    style={[
                      styles.segmentText,
                      isRecurring && styles.segmentTextActive,
                    ]}
                  >
                    Yes
                  </AppText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Recurring task no"
                  onPress={() => setIsRecurring(false)}
                  style={({ pressed }) => [
                    styles.segmentButton,
                    !isRecurring && styles.segmentButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    weight={!isRecurring ? "extraBold" : "medium"}
                    style={[
                      styles.segmentText,
                      !isRecurring && styles.segmentTextActive,
                    ]}
                  >
                    No
                  </AppText>
                </Pressable>
              </View>
            </View>

            {isRecurring ? (
              <View style={styles.formGroup}>
                <AppText weight="bold" style={styles.label}>
                  Repeat schedule
                </AppText>

                <View style={styles.chipsWrap}>
                  {RECURRENCE_OPTIONS.map((option) => {
                    const isSelected = recurrenceType === option.value;

                    return (
                      <Pressable
                        key={option.value}
                        accessibilityRole="button"
                        accessibilityLabel={`Repeat ${option.label}`}
                        onPress={() => setRecurrenceType(option.value)}
                        style={({ pressed }) => [
                          styles.chip,
                          isSelected && styles.chipActive,
                          pressed && styles.pressed,
                        ]}
                      >
                        <AppText
                          weight={isSelected ? "bold" : "medium"}
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextActive,
                          ]}
                        >
                          {option.label}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Is a proof photo required?
              </AppText>

              <View style={styles.segmentRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Proof photo required yes"
                  onPress={() => setRequireProof(true)}
                  style={({ pressed }) => [
                    styles.segmentButton,
                    requireProof && styles.segmentButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    weight={requireProof ? "extraBold" : "medium"}
                    style={[
                      styles.segmentText,
                      requireProof && styles.segmentTextActive,
                    ]}
                  >
                    Yes
                  </AppText>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Proof photo required no"
                  onPress={() => setRequireProof(false)}
                  style={({ pressed }) => [
                    styles.segmentButton,
                    !requireProof && styles.segmentButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    weight={!requireProof ? "extraBold" : "medium"}
                    style={[
                      styles.segmentText,
                      !requireProof && styles.segmentTextActive,
                    ]}
                  >
                    No
                  </AppText>
                </Pressable>
              </View>
            </View>

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Assign to children
              </AppText>

              <View style={styles.chipsWrap}>
                {children.map((child) => {
                  const isSelected = assignedChildIds.includes(child.id);

                  return (
                    <Pressable
                      key={child.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Assign to ${child.name}`}
                      onPress={() => toggleAssignedChild(child.id)}
                      style={({ pressed }) => [
                        styles.childChip,
                        isSelected && styles.childChipActive,
                        pressed && styles.pressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={
                          isSelected
                            ? "check-circle"
                            : "account-circle-outline"
                        }
                        size={18}
                        color={isSelected ? "#FFFFFF" : "#315BFF"}
                      />

                      <AppText
                        weight={isSelected ? "bold" : "medium"}
                        style={[
                          styles.childChipText,
                          isSelected && styles.childChipTextActive,
                        ]}
                      >
                        {child.name}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.previewCard}>
              <AppText weight="bold" style={styles.previewLabel}>
                Preview
              </AppText>

              <View style={styles.previewTopRow}>
                <AppText weight="extraBold" style={styles.previewTitle}>
                  {taskTitle.trim() || "Your task title will appear here"}
                </AppText>

                <View style={styles.previewCoinsPill}>
                  <MaterialCommunityIcons
                    name="star-circle"
                    size={16}
                    color="#F59E0B"
                  />

                  <AppText weight="bold" style={styles.previewCoinsText}>
                    {coins}
                  </AppText>
                </View>
              </View>

              <AppText weight="medium" style={styles.previewDescription}>
                {taskDescription.trim() ||
                  "A short description will help the child understand the task clearly."}
              </AppText>

              <View style={styles.previewMetaRow}>
                <View style={styles.previewMetaPill}>
                  <AppText weight="bold" style={styles.previewMetaText}>
                    {previewRecurrenceLabel}
                  </AppText>
                </View>

                <View style={styles.previewMetaPill}>
                  <AppText weight="bold" style={styles.previewMetaText}>
                    {assignedChildIds.length} child
                    {assignedChildIds.length > 1 ? "ren" : ""}
                  </AppText>
                </View>
              </View>

              <View style={styles.previewMetaRow}>
                <View style={styles.previewMetaPill}>
                  <AppText weight="bold" style={styles.previewMetaText}>
                    {requireProof ? "Photo required" : "Photo optional"}
                  </AppText>
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create task"
              onPress={handleCreateTask}
              disabled={isCreating}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                isCreating && { opacity: 0.7 },
              ]}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color="#FFFFFF"
              />

              <AppText weight="extraBold" style={styles.primaryButtonText}>
                {isCreating ? "Creating..." : "Create Task"}
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}