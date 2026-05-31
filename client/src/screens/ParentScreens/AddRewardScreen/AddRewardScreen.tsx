import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  showSuccessToast,
  showWarningToast,
  showErrorToast,
} from "@/src/utils/appToast";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import CoinIcon from "../../../components/CoinIcon/CoinIcon";
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

    return [];
  }, [reduxChildren]);

  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardDescription, setRewardDescription] = useState("");
  const [coins, setCoins] = useState(50);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  const appliesToAllChildren = selectedChildIds.length === 0;

  const childIdsToAssign = useMemo(
    () =>
      selectedChildIds.length === 0
        ? children.map((child) => child.id)
        : selectedChildIds,
    [children, selectedChildIds]
  );

  const assignedChildrenLabel = useMemo(() => {
    if (children.length === 0) {
      return "No children";
    }

    if (appliesToAllChildren) {
      return "All children";
    }

    if (selectedChildIds.length === 1) {
      const child = children.find((item) => item.id === selectedChildIds[0]);
      return child?.name ?? "1 child";
    }

    return `${selectedChildIds.length} children`;
  }, [appliesToAllChildren, children, selectedChildIds]);

  const toggleAssignedChild = (childId: string) => {
    setSelectedChildIds((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const handleCreateReward = async () => {
    const trimmedTitle = rewardTitle.trim();
    const trimmedDescription = rewardDescription.trim();

    if (!trimmedTitle) {
      showWarningToast("Please enter a reward title.", "Missing title");
      return;
    }

    if (children.length === 0) {
      showWarningToast("Add a child first to assign this reward.", "No children");
      return;
    }

    try {
      await dispatch(
        createRewardThunk({
          title: trimmedTitle,
          description: trimmedDescription,
          coins,
          assignedChildIds: childIdsToAssign,
          assignedToAll: appliesToAllChildren,
        })
      ).unwrap();

      await dispatch(getParentRewardsThunk()).unwrap();

      showSuccessToast("Reward created successfully.", "Success");

      setRewardTitle("");
      setRewardDescription("");
      setCoins(50);
      setSelectedChildIds([]);

      router.back();
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Create reward failed"
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
                  <CoinIcon size={20} />
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

              {children.length === 0 ? (
                <AppText weight="medium" style={styles.subtitle}>
                  {"No children yet,\nAdd a child first to assign this reward."}
                </AppText>
              ) : (
                <>
                  <AppText weight="medium" style={styles.subtitle}>
                    Optional. If none are selected, the reward goes to all children.
                  </AppText>

                  <View style={styles.chipsWrap}>
                    {children.map((child) => {
                      const isSelected = selectedChildIds.includes(child.id);

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
                </>
              )}
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
                  <CoinIcon size={16} />
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
                    {assignedChildrenLabel}
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