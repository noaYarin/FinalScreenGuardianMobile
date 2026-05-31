import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import ConfirmDialog from "../../../components/ConfirmDialog/ConfirmDialog";
import CoinIcon from "../../../components/CoinIcon/CoinIcon";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { APP_COLORS } from "@/constants/theme";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import {
  getParentRewardsThunk,
  deleteRewardThunk,
} from "../../../redux/thunks/rewardsThunks";
import { showErrorToast } from "@/src/utils/appToast";
import { resolveAssignedChildLabel } from "@/src/utils/assignedChildLabel";

type UiChild = {
  id: string;
  name: string;
};

type RewardStatus = "available" | "redeemed";

type RewardCardItem = {
  id: string;
  title: string;
  childId: string;
  childName: string;
  coins: number;
  createdOrRedeemedLabel: string;
  status: RewardStatus;
  icon?: string;
};

function formatDateLabel(value: string | null | undefined) {
  if (!value) {
    return "No date";
  }

  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB");
    }
  } catch {}

  return "No date";
}

export default function RewardsScreen() {
  const dispatch = useDispatch<any>();

  const reduxChildren = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  const parentRewards = useSelector(
    (state: any) => state?.rewards?.parentRewards ?? []
  );

  const [viewMode, setViewMode] = useState<"all" | "single">("all");
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"available" | "redeemed">(
    "available"
  );
  const [deletingRewardId, setDeletingRewardId] = useState<string | null>(null);
  const [rewardToDelete, setRewardToDelete] = useState<RewardCardItem | null>(null);

  const children: UiChild[] = useMemo(() => {
    if (Array.isArray(reduxChildren) && reduxChildren.length > 0) {
      return reduxChildren.map((child: any) => ({
        id: String(child._id ?? child.id),
        name: child.name ?? child.fullName ?? "Child",
      }));
    }

    return [];
  }, [reduxChildren]);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
    dispatch(getParentRewardsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const mappedRewards = useMemo((): RewardCardItem[] => {
    if (!Array.isArray(parentRewards)) {
      return [];
    }

    return parentRewards.map((reward: any) => {
      const childId = String(reward?.childId ?? "");
      const childName =
        children.find((child) => child.id === childId)?.name ?? "Child";
      const childDisplayName = resolveAssignedChildLabel(
        reward,
        childName,
        viewMode
      );

      const status: RewardStatus = reward?.redeemedAt
        ? "redeemed"
        : "available";

      return {
        id: String(reward?._id ?? reward?.id ?? Math.random()),
        title: reward?.title ?? "Untitled reward",
        childId,
        childName: childDisplayName,
        coins: Number(reward?.coins ?? 0),
        createdOrRedeemedLabel: reward?.redeemedAt
          ? formatDateLabel(reward.redeemedAt)
          : formatDateLabel(reward?.createdAt),
        status,
        icon: typeof reward?.icon === "string" ? reward.icon : "default.png",
      };
    });
  }, [parentRewards, children, viewMode]);

  const filteredRewards = useMemo(() => {
    if (viewMode === "all") {
      return mappedRewards;
    }

    return mappedRewards.filter(
      (reward) => String(reward.childId) === String(selectedChildId)
    );
  }, [mappedRewards, viewMode, selectedChildId]);

  const availableRewards = useMemo(
    () => filteredRewards.filter((reward) => reward.status === "available"),
    [filteredRewards]
  );

  const redeemedRewards = useMemo(
    () => filteredRewards.filter((reward) => reward.status === "redeemed"),
    [filteredRewards]
  );

  const visibleRewards =
    activeTab === "available" ? availableRewards : redeemedRewards;

  function handleDeleteReward(reward: RewardCardItem) {
    setRewardToDelete(reward);
  }

  async function confirmDeleteReward() {
    if (!rewardToDelete) {
      return;
    }

    const reward = rewardToDelete;
    setRewardToDelete(null);

    try {
      setDeletingRewardId(reward.id);
      await dispatch(deleteRewardThunk(reward.id)).unwrap();
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Could not delete this reward.",
        "Delete failed"
      );
    } finally {
      setDeletingRewardId(null);
    }
  }

  return (
    <ScreenLayout scrollable={false} backgroundColor={APP_COLORS.screenBg}>
      <ConfirmDialog
        visible={rewardToDelete != null}
        title="Delete reward?"
        message={
          rewardToDelete
            ? `Are you sure you want to delete "${rewardToDelete.title}"?`
            : ""
        }
        cancelLabel="Cancel"
        confirmLabel="Delete"
        destructive
        onCancel={() => setRewardToDelete(null)}
        onConfirm={confirmDeleteReward}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.topCard}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add reward"
              onPress={() => router.push("/Parent/addReward" as Href)}
              style={({ pressed }) => [
                styles.primaryActionButtonFull,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#1D4ED8" />
              <AppText weight="extraBold" style={styles.primaryActionButtonText}>
                Add Reward
              </AppText>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open rewards history"
              onPress={() => router.push("/Parent/rewardsHistory" as Href)}
              style={({ pressed }) => [
                styles.secondaryActionButtonFull,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="history" size={18} color="#4C6FFF" />
              <AppText weight="bold" style={styles.secondaryActionButtonText}>
                View History
              </AppText>
            </Pressable>
          </View>

          {children.length === 0 ? (
            <EmptyStateCard
              icon="account-outline"
              title="No children yet"
              subtitle="Add a child first, then create rewards they can redeem with coins."
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
                  accessibilityLabel="Show rewards for all children"
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
                  accessibilityLabel="Show rewards for one child"
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
                      viewMode === "single" &&
                        styles.filterModeButtonTextActive,
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
                Reward status
              </AppText>

              <View style={styles.tabsRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Show available rewards"
                  onPress={() => setActiveTab("available")}
                  style={({ pressed }) => [
                    styles.tabButton,
                    activeTab === "available" && styles.tabButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="gift-outline"
                    size={16}
                    color={activeTab === "available" ? "#FFFFFF" : "#4C6FFF"}
                  />
                  <AppText
                    weight={activeTab === "available" ? "extraBold" : "bold"}
                    style={[
                      styles.tabButtonText,
                      activeTab === "available" && styles.tabButtonTextActive,
                    ]}
                  >
                    Available
                  </AppText>

                  <View
                    style={[
                      styles.tabCountBadge,
                      activeTab === "available" && styles.tabCountBadgeActive,
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[
                        styles.tabCountText,
                        activeTab === "available" && styles.tabCountTextActive,
                      ]}
                    >
                      {availableRewards.length}
                    </AppText>
                  </View>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Show redeemed rewards"
                  onPress={() => setActiveTab("redeemed")}
                  style={({ pressed }) => [
                    styles.tabButton,
                    activeTab === "redeemed" && styles.tabButtonActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="check-decagram-outline"
                    size={16}
                    color={activeTab === "redeemed" ? "#FFFFFF" : "#4C6FFF"}
                  />
                  <AppText
                    weight={activeTab === "redeemed" ? "extraBold" : "bold"}
                    style={[
                      styles.tabButtonText,
                      activeTab === "redeemed" && styles.tabButtonTextActive,
                    ]}
                  >
                    Redeemed
                  </AppText>

                  <View
                    style={[
                      styles.tabCountBadge,
                      activeTab === "redeemed" && styles.tabCountBadgeActive,
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[
                        styles.tabCountText,
                        activeTab === "redeemed" && styles.tabCountTextActive,
                      ]}
                    >
                      {redeemedRewards.length}
                    </AppText>
                  </View>
                </Pressable>
              </View>
            </View>

            <View style={styles.panelDivider} />

            <View style={[styles.panelSection, styles.panelListSection]}>
       

              <View style={styles.listContent}>
              {visibleRewards.length > 0 ? (
                visibleRewards.map((reward: RewardCardItem) => {
                  const isDeleting = deletingRewardId === reward.id;

                  return (
                    <View key={reward.id} style={styles.rewardCard}>
                      <View style={styles.rewardTopRow}>
                        <View style={styles.rewardMainInfo}>
                          <AppText
                            weight="extraBold"
                            style={styles.rewardTitle}
                          >
                            {reward.title}
                          </AppText>
                          <View style={styles.cardMetaRow}>
                            <AppText style={styles.cardMetaLabel}>Child</AppText>
                            <AppText weight="bold" style={styles.cardMetaValue}>
                              {reward.childName}
                            </AppText>
                          </View>
                          <View style={styles.cardMetaRow}>
                            <AppText style={styles.cardMetaLabel}>
                              {reward.status === "redeemed" ? "Redeemed" : "Created"}
                            </AppText>
                            <AppText weight="bold" style={styles.cardMetaValue}>
                              {reward.createdOrRedeemedLabel}
                            </AppText>
                          </View>
                        </View>

                        <View style={styles.coinsBadge}>
                          <CoinIcon size={18} />
                          <AppText weight="bold" style={styles.coinsBadgeText}>
                            {reward.coins}
                          </AppText>
                          <AppText style={styles.coinsBadgeLabel}>coins</AppText>
                        </View>
                      </View>

                      <View style={styles.rewardBottomRow}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Delete ${reward.title}`}
                          disabled={isDeleting}
                          onPress={() => handleDeleteReward(reward)}
                          style={({ pressed }) => [
                            styles.deleteRewardButton,
                            pressed && styles.pressed,
                            isDeleting && styles.disabledButton,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={15}
                            color="#DC2626"
                          />
                          <AppText
                            weight="bold"
                            style={styles.deleteRewardButtonText}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AppText>
                        </Pressable>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="gift-outline"
                    size={32}
                    color="#94A3B8"
                  />
                  <AppText weight="extraBold" style={styles.emptyStateTitle}>
                    Nothing here yet
                  </AppText>
                  <AppText weight="medium" style={styles.emptyStateText}>
                    {activeTab === "available"
                      ? "No available rewards. Tap Add Reward to create one."
                      : "No redeemed rewards yet."}
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
    </ScreenLayout>
  );
}