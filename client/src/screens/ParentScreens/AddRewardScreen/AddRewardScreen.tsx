import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import {
  createRewardThunk,
  getParentRewardsThunk,
} from "../../../redux/thunks/rewardsThunks";

type UiChild = {
  id: string;
  name: string;
};

const FALLBACK_CHILDREN: UiChild[] = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Noah" },
  { id: "child-3", name: "Mia" },
];

export default function AddRewardScreen() {
  const dispatch = useDispatch<any>();

  const reduxChildren = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  const isCreating = useSelector(
    (state: any) => state?.rewards?.isCreating ?? false
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

  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [coins, setCoins] = useState(50);
  const [assignedChildIds, setAssignedChildIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

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

  const handleCreateReward = async () => {
    const trimmedTitle = rewardTitle.trim();
    const trimmedDescription = rewardDescription.trim();

    if (!trimmedTitle) {
      Alert.alert("Missing title", "Please enter a reward title.");
      return;
    }

    if (assignedChildIds.length === 0) {
      Alert.alert("No child selected", "Please select at least one child.");
      return;
    }

    try {
      await dispatch(
        createRewardThunk({
          title: trimmedTitle,
          description: trimmedDescription,
          coins,
          assignedChildIds,
        })
      ).unwrap();

      await dispatch(getParentRewardsThunk()).unwrap();

      Alert.alert("Success", "Reward created successfully.");

      setRewardTitle("");
      setRewardDescription("");
      setCoins(50);
      setAssignedChildIds(children.length > 0 ? [children[0].id] : []);

      router.back();
    } catch (error: any) {
      Alert.alert(
        "Create reward failed",
        typeof error === "string" ? error : "Something went wrong."
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
          <View style={styles.headerCard}>
            <AppText weight="extraBold" style={styles.title}>
              Create a New Reward
            </AppText>
            <AppText weight="medium" style={styles.subtitle}>
              Add a reward that children can unlock using their coins.
            </AppText>
          </View>

          <View style={styles.card}>
            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Reward title
              </AppText>
              <TextInput
                value={rewardTitle}
                onChangeText={setRewardTitle}
                placeholder="Example: 30 extra minutes"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                accessibilityLabel="Reward title"
              />
            </View>

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Description
              </AppText>
              <TextInput
                value={rewardDescription}
                onChangeText={setRewardDescription}
                placeholder="Write a short explanation for this reward"
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textArea]}
                accessibilityLabel="Reward description"
              />
            </View>

            <View style={styles.formGroup}>
              <AppText weight="bold" style={styles.label}>
                Coins cost
              </AppText>

              <View style={styles.coinsRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decrease coins cost"
                  onPress={() => setCoins((prev) => Math.max(10, prev - 10))}
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons name="minus" size={18} color="#243447" />
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
                  accessibilityLabel="Increase coins cost"
                  onPress={() => setCoins((prev) => prev + 10)}
                  style={({ pressed }) => [
                    styles.stepperButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons name="plus" size={18} color="#243447" />
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
                        name={isSelected ? "check-circle" : "account-circle-outline"}
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
                  {rewardTitle.trim() || "Your reward title will appear here"}
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
                {rewardDescription.trim() ||
                  "A short description will help explain what the child gets."}
              </AppText>

              <View style={styles.previewMetaRow}>
                <View style={styles.previewMetaPill}>
                  <AppText weight="bold" style={styles.previewMetaText}>
                    {assignedChildIds.length} child
                    {assignedChildIds.length > 1 ? "ren" : ""}
                  </AppText>
                </View>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create reward"
              onPress={handleCreateReward}
              disabled={isCreating}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                isCreating && { opacity: 0.7 },
              ]}
            >
              <MaterialCommunityIcons
                name="gift-open-outline"
                size={20}
                color="#FFFFFF"
              />
              <AppText weight="extraBold" style={styles.primaryButtonText}>
                {isCreating ? "Creating..." : "Create Reward"}
              </AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}