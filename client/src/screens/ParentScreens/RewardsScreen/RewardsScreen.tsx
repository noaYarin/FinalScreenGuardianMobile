import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import { getParentRewardsThunk } from "../../../redux/thunks/rewardsThunks";

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
  note: string;
  status: RewardStatus;
  icon?: string;
};

const FALLBACK_CHILDREN: UiChild[] = [
  { id: "child-1", name: "Emma" },
  { id: "child-2", name: "Noah" },
  { id: "child-3", name: "Mia" },
];

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
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const reduxChildren = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  const parentRewards = useSelector(
    (state: any) => state?.rewards?.parentRewards ?? []
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
  const [activeTab, setActiveTab] = useState<"available" | "redeemed">(
    "available"
  );

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

      const status: RewardStatus = reward?.redeemedAt ? "redeemed" : "available";

      return {
        id: String(reward?._id ?? reward?.id ?? Math.random()),
        title: reward?.title ?? "Untitled reward",
        childId,
        childName,
        coins: Number(reward?.coins ?? 0),
        createdOrRedeemedLabel: reward?.redeemedAt
          ? formatDateLabel(reward.redeemedAt)
          : formatDateLabel(reward?.createdAt),
        note:
          status === "redeemed"
            ? "This reward was already redeemed."
            : "This reward is available for redemption.",
        status,
        icon: typeof reward?.icon === "string" ? reward.icon : "default.png",
      };
    });
  }, [parentRewards, children]);

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
                Rewards
              </AppText>
              <AppText weight="medium" style={styles.subtitle}>
                Manage available rewards and review redeemed ones.
              </AppText>
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add reward"
                onPress={() => router.push("/Parent/addReward" as Href)}
                style={({ pressed }) => [
                  styles.addRewardButtonGreen,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="gift-outline"
                  size={18}
                  color="#16A34A"
                />
                <AppText weight="extraBold" style={styles.addRewardButtonGreenText}>
                  Add Reward
                </AppText>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open rewards history"
                onPress={() => router.push("/Parent/rewardsHistory" as Href)}
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
                size={18}
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
                size={18}
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

          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <View>
                <AppText weight="extraBold" style={styles.listTitle}>
                  {activeTab === "available"
                    ? "Available Rewards"
                    : "Redeemed Rewards"}
                </AppText>
                <AppText weight="medium" style={styles.listSubtitle}>
                  {viewMode === "all"
                    ? "Showing all children"
                    : `Showing ${selectedChildName}`}
                </AppText>
              </View>

              <View style={styles.listCountPill}>
                <AppText weight="bold" style={styles.listCountPillText}>
                  {visibleRewards.length} items
                </AppText>
              </View>
            </View>

            <View style={styles.listContent}>
              {visibleRewards.length > 0 ? (
                visibleRewards.map((reward: RewardCardItem) => (
                  <View key={reward.id} style={styles.rewardCard}>
                    <View style={styles.rewardTopRow}>
                      <View style={styles.rewardMainInfo}>
                        <AppText weight="extraBold" style={styles.rewardTitle}>
                          {reward.title}
                        </AppText>
                        <AppText weight="medium" style={styles.rewardMeta}>
                          {reward.childName} · {reward.createdOrRedeemedLabel}
                        </AppText>
                      </View>

                      <View style={styles.coinsBadge}>
                        <MaterialCommunityIcons
                          name="star-circle"
                          size={16}
                          color="#F59E0B"
                        />
                        <AppText weight="bold" style={styles.coinsBadgeText}>
                          {reward.coins}
                        </AppText>
                      </View>
                    </View>

                    <AppText weight="medium" style={styles.rewardNote}>
                      {reward.note}
                    </AppText>

                    <View style={styles.rewardBottomRow}>
                      {reward.status === "available" ? (
                        <View style={styles.availablePill}>
                          <MaterialCommunityIcons
                            name="gift-outline"
                            size={15}
                            color="#4C6FFF"
                          />
                          <AppText weight="bold" style={styles.availablePillText}>
                            Available
                          </AppText>
                        </View>
                      ) : (
                        <View style={styles.redeemedPill}>
                          <MaterialCommunityIcons
                            name="check-decagram-outline"
                            size={15}
                            color="#15803D"
                          />
                          <AppText weight="bold" style={styles.redeemedPillText}>
                            Redeemed
                          </AppText>
                        </View>
                      )}
                    </View>
                  </View>
                ))
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
                    No rewards match this filter right now.
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