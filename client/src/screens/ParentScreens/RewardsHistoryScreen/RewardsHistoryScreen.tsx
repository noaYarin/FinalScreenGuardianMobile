import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import CoinIcon from "../../../components/CoinIcon/CoinIcon";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";
import { getMyChildrenThunk } from "../../../redux/thunks/childrenThunks";
import { getParentRewardsThunk } from "../../../redux/thunks/rewardsThunks";
import { resolveAssignedChildLabel } from "@/src/utils/assignedChildLabel";

type UiChild = {
  id: string;
  name: string;
};

type RewardHistoryItem = {
  id: string;
  title: string;
  childId: string;
  childName: string;
  coins: number;
  redeemedAtLabel: string;
  note: string;
};

function formatRedeemedLabel(value: string | null | undefined) {
  if (!value) {
    return "Redeemed";
  }

  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-GB");
    }
  } catch {}

  return "Redeemed";
}

export default function RewardsHistoryScreen() {
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

    return [];
  }, [reduxChildren]);

  const [viewMode, setViewMode] = useState<"all" | "single">("all");
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  useEffect(() => {
    dispatch(getMyChildrenThunk());
    dispatch(getParentRewardsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(children[0].id);
    }
  }, [children, selectedChildId]);

  const mappedHistory = useMemo((): RewardHistoryItem[] => {
    if (!Array.isArray(parentRewards)) {
      return [];
    }

    return parentRewards
      .filter((reward: any) => !!reward?.redeemedAt)
      .map((reward: any) => {
        const childId = String(reward?.childId ?? "");
        const childName =
          children.find((child) => child.id === childId)?.name ?? "Child";
        const childDisplayName = resolveAssignedChildLabel(
          reward,
          childName,
          viewMode
        );

        return {
          id: String(reward?._id ?? reward?.id ?? Math.random()),
          title: reward?.title ?? "Untitled reward",
          childId,
          childName: childDisplayName,
          coins: Number(reward?.coins ?? 0),
          redeemedAtLabel: formatRedeemedLabel(reward?.redeemedAt),
          note: "This reward was already redeemed.",
        };
      });
  }, [parentRewards, children, viewMode]);

  const visibleRewards = useMemo(() => {
    if (viewMode === "all") {
      return mappedHistory;
    }

    return mappedHistory.filter(
      (reward) => String(reward.childId) === String(selectedChildId)
    );
  }, [mappedHistory, viewMode, selectedChildId]);

  const selectedChildName =
    children.find((child) => child.id === selectedChildId)?.name ?? "Child";

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          <View style={styles.mainPanel}>
            <View style={styles.panelSection}>
              <AppText weight="bold" style={styles.panelLabel}>
                Filter by child
              </AppText>

              <View style={styles.filterModeRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Show reward history for all children"
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
                  accessibilityLabel="Show reward history for one child"
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

            <View style={[styles.panelSection, styles.panelListSection]}>
              <View style={styles.listHeaderRow}>
                <View style={{ flex: 1 }}>
                  <AppText weight="bold" style={styles.listHeaderTitle}>
                    Redeemed rewards
                  </AppText>
                  <AppText weight="medium" style={styles.listHeaderSubtitle}>
                    {viewMode === "all"
                      ? "All children"
                      : selectedChildName}
                  </AppText>
                </View>
                <View style={styles.countPill}>
                  <AppText weight="bold" style={styles.countPillText}>
                    {visibleRewards.length}
                  </AppText>
                </View>
              </View>

              <View style={styles.listContent}>
              {visibleRewards.length > 0 ? (
                visibleRewards.map((reward) => (
                  <View key={reward.id} style={styles.rewardCard}>
                    <View style={styles.rewardTopRow}>
                      <View style={styles.rewardMainInfo}>
                        <AppText weight="extraBold" style={styles.rewardTitle}>
                          {reward.title}
                        </AppText>
                        <AppText weight="medium" style={styles.rewardMeta}>
                          {reward.childName} · {reward.redeemedAtLabel}
                        </AppText>
                      </View>

                      <View style={styles.coinsBadge}>
                        <CoinIcon size={16} />
                        <AppText weight="bold" style={styles.coinsBadgeText}>
                          {reward.coins}
                        </AppText>
                      </View>
                    </View>

                    <AppText weight="medium" style={styles.rewardNote}>
                      {reward.note}
                    </AppText>

                    <View style={styles.rewardBottomRow}>
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
                    No reward history items match this filter right now.
                  </AppText>
                </View>
              )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}