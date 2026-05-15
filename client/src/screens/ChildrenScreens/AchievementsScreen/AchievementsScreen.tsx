import React, { useCallback, useMemo, useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import type { Child } from "@/src/redux/slices/children-slice";
import type { AchievementUiItem } from "@/src/api/achievements";
import { fetchChildAchievementsThunk } from "@/src/redux/thunks/achievementsThunks";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import { styles } from "./styles";
import { getAchievementIconByKey } from "@/src/utils/achievementIcons";
import { getLockedAchievementHint } from "@/src/utils/achievementText";

type AchievementFilter = "all" | "unlocked" | "locked";

type AchievementCard = {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  rewardText: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "gold" | "light";
  unlocked: boolean;
  unlockedAtLabel?: string;
};

const FILTERS: { id: AchievementFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unlocked", label: "Unlocked" },
  { id: "locked", label: "Locked" },
];

function getUnlockedAtLabel(unlockedAt?: string | null) {
  if (!unlockedAt) return undefined;

  const unlockedDate = new Date(unlockedAt);
  const unlockedTime = unlockedDate.getTime();

  if (Number.isNaN(unlockedTime)) return undefined;

  const diffMs = Date.now() - unlockedTime;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Unlocked today";
  if (diffDays === 1) return "Unlocked yesterday";
  if (diffDays < 7) return `Unlocked ${diffDays} days ago`;

  return `Unlocked on ${unlockedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;
}

function sortAchievements(a: AchievementUiItem, b: AchievementUiItem) {
  if (a.unlocked !== b.unlocked) {
    return a.unlocked ? -1 : 1;
  }

  if (a.unlocked && b.unlocked) {
    const aTime = a.unlockedAt ? new Date(a.unlockedAt).getTime() : 0;
    const bTime = b.unlockedAt ? new Date(b.unlockedAt).getTime() : 0;

    return bTime - aTime;
  }

  return 0;
}

function mapAchievementToCard(achievement: AchievementUiItem): AchievementCard {
  const isUnlocked = Boolean(achievement.unlocked);

  return {
    id: achievement._id,
    key: achievement.key,
    title: achievement.title,
    subtitle: achievement.description,
    rewardText: `+${achievement.xpReward ?? 0} XP`,
    icon: getAchievementIconByKey(achievement.key),
    tone: isUnlocked ? "gold" : "light",
    unlocked: isUnlocked,
    unlockedAtLabel: isUnlocked
      ? getUnlockedAtLabel(achievement.unlockedAt)
      : undefined,
  };
}

export default function AchievementsScreen() {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedFilter, setSelectedFilter] =
    useState<AchievementFilter>("all");

  const activeChildId = useSelector(
    (state: RootState) => state.auth.activeChildId
  );

  const childrenList = useSelector(
    (state: RootState) => state.children.childrenList
  );

  const achievementsFromRedux = useSelector(
    (state: RootState) => state.achievements.achievements
  );

  const isLoading = useSelector(
    (state: RootState) => state.achievements.isLoading
  );

  const error = useSelector((state: RootState) => state.achievements.error);

  const activeChildData = useMemo(() => {
    if (!activeChildId) return undefined;

    return childrenList.find(
      (child: Child) => String(child._id) === String(activeChildId)
    );
  }, [childrenList, activeChildId]);

  useFocusEffect(
    useCallback(() => {
      if (!activeChildId) return;

      dispatch(fetchChildAchievementsThunk());
    }, [dispatch, activeChildId])
  );

  const isTabletLarge = width >= 900;
  const isTablet = width >= 650;

  const heroIconSize = isTabletLarge ? 84 : isTablet ? 74 : 66;
  const sidePadding = isTabletLarge ? 24 : 16;

  const points = activeChildData?.avatar?.currentXp ?? 0;

  const completedGoals = achievementsFromRedux.filter(
    (achievement) => achievement.unlocked
  ).length;

  const totalGoals = achievementsFromRedux.length;
  const lockedGoals = Math.max(0, totalGoals - completedGoals);

  const achievements = useMemo(() => {
    return [...achievementsFromRedux]
      .sort(sortAchievements)
      .filter((achievement) => {
        if (selectedFilter === "unlocked") return achievement.unlocked;
        if (selectedFilter === "locked") return !achievement.unlocked;

        return true;
      })
      .map(mapAchievementToCard);
  }, [achievementsFromRedux, selectedFilter]);

  return (
    <ScreenLayout>
      <View style={[styles.page, { paddingHorizontal: sidePadding }]}>
        <View style={styles.heroCard}>
          <View
            style={[
              styles.heroIconWrap,
              {
                width: heroIconSize,
                height: heroIconSize,
                borderRadius: heroIconSize / 2,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="trophy-outline"
              size={heroIconSize * 0.5}
              color="#8A6500"
            />
          </View>

          <View style={styles.heroTextBlock}>
            <AppText weight="extraBold" style={styles.heroTitle}>
              My Achievements
            </AppText>

            <AppText weight="medium" style={styles.heroSubtitle}>
              Keep reaching goals and unlock new rewards!
            </AppText>
          </View>

          <View style={styles.heroSummaryRow}>
            <View style={[styles.heroSummaryCard, styles.heroSummaryCardGreen]}>
              <View style={styles.heroSummaryTop}>
                <View style={styles.heroSummaryIconGreen}>
                  <MaterialCommunityIcons
                    name="target"
                    size={18}
                    color="#0F8A5F"
                  />
                </View>

                <AppText weight="extraBold" style={styles.heroSummaryValueGreen}>
                  {completedGoals}/{totalGoals}
                </AppText>
              </View>

              <AppText style={styles.heroSummaryLabel}>Completed</AppText>
            </View>

            <View style={[styles.heroSummaryCard, styles.heroSummaryCardGold]}>
              <View style={styles.heroSummaryTop}>
                <View style={styles.heroSummaryIconGold}>
                  <MaterialCommunityIcons
                    name="star-circle-outline"
                    size={18}
                    color="#B46B00"
                  />
                </View>

                <AppText weight="extraBold" style={styles.heroSummaryValueGold}>
                  {points.toLocaleString()}
                </AppText>
              </View>

              <AppText style={styles.heroSummaryLabel}>XP</AppText>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginTop: 14,
            marginBottom: 14,
          }}
        >
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.id;

            const count =
              filter.id === "unlocked"
                ? completedGoals
                : filter.id === "locked"
                  ? lockedGoals
                  : totalGoals;

            return (
              <Pressable
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                accessibilityRole="button"
                accessibilityLabel={`Show ${filter.label} achievements`}
                style={{
                  flex: 1,
                  minHeight: 38,
                  borderRadius: 999,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  backgroundColor: isSelected ? "#2563EB" : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: isSelected ? "#2563EB" : "#DCE7F5",
                }}
              >
                <AppText
                  weight="bold"
                  style={{
                    fontSize: 12,
                    color: isSelected ? "#FFFFFF" : "#475569",
                  }}
                  numberOfLines={1}
                >
                  {filter.label} ({count})
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {isLoading ? (
          <AppText style={styles.heroSubtitle}>Loading achievements...</AppText>
        ) : null}

        {error ? (
          <AppText style={styles.heroSubtitle}>{String(error)}</AppText>
        ) : null}

        {!isLoading && !error && achievements.length === 0 ? (
          <EmptyStateCard
            icon="trophy-outline"
            title="No achievements here yet"
            subtitle={
              selectedFilter === "unlocked"
                ? "Unlocked achievements will appear here."
                : selectedFilter === "locked"
                  ? "Locked achievements will appear here."
                  : "Achievements will appear here after the catalog is loaded."
            }
          />
        ) : null}

        {!isLoading && !error && achievements.length > 0 ? (
          <View style={styles.achievementsList}>
            {achievements.map((item) => {
              const isUnlocked = item.unlocked;
              const isGold = item.tone === "gold";
              const isNewUnlock = item.unlockedAtLabel === "Unlocked today";

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} ${
                    isUnlocked ? "unlocked" : "locked"
                  }`}
                  style={({ pressed }) => [
                    styles.achievementCard,
                    isUnlocked
                      ? isGold
                        ? styles.achievementCardGold
                        : styles.achievementCardLight
                      : styles.achievementCardLocked,
                    isNewUnlock && styles.achievementCardNewToday,
                    pressed && styles.achievementCardPressed,
                  ]}
                  onPress={() => {}}
                >
                  <View style={styles.achievementInner}>
                    <View
                      style={[
                        styles.achievementIconBox,
                        isUnlocked
                          ? isGold
                            ? styles.achievementIconBoxGold
                            : styles.achievementIconBoxLight
                          : styles.achievementIconBoxLocked,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={28}
                        color={
                          isUnlocked
                            ? isGold
                              ? "#A17B00"
                              : "#7C3AED"
                            : "#A19AB8"
                        }
                      />
                    </View>

                    <View style={styles.achievementTextArea}>
                      <View style={styles.achievementTitleRow}>
                        <AppText
                          weight="extraBold"
                          style={[
                            styles.achievementTitle,
                            isUnlocked && isGold && styles.achievementTitleGold,
                            !isUnlocked && styles.achievementTitleLocked,
                          ]}
                          numberOfLines={3}
                        >
                          {item.title}
                        </AppText>

                        {isUnlocked ? (
                          <View style={styles.completedBadgeInline}>
                            <MaterialCommunityIcons
                              name="check"
                              size={14}
                              color="#0F8A5F"
                            />
                            <AppText
                              weight="bold"
                              style={styles.completedBadgeText}
                            >
                              Done
                            </AppText>
                          </View>
                        ) : (
                          <View style={styles.lockedBadgeInline}>
                            <MaterialCommunityIcons
                              name="lock-outline"
                              size={13}
                              color="#FFFFFF"
                            />
                            <AppText weight="bold" style={styles.lockedBadgeText}>
                              Locked
                            </AppText>
                          </View>
                        )}
                      </View>

                      <AppText
                        style={[
                          styles.achievementSubtitle,
                          isUnlocked && isGold && styles.achievementSubtitleGold,
                          !isUnlocked && styles.achievementSubtitleLocked,
                        ]}
                        numberOfLines={3}
                      >
                        {isUnlocked
                          ? item.subtitle
                          : getLockedAchievementHint(item.key, item.subtitle)}
                      </AppText>

                      <View style={styles.achievementBottomArea}>
                        <View
                          style={[
                            styles.rewardPill,
                            isUnlocked
                              ? isGold
                                ? styles.rewardPillGold
                                : styles.rewardPillLight
                              : styles.rewardPillLocked,
                          ]}
                        >
                          <AppText
                            style={[
                              styles.rewardText,
                              isUnlocked && isGold && styles.rewardTextGold,
                              !isUnlocked && styles.rewardTextLocked,
                              styles.centerText,
                            ]}
                            numberOfLines={1}
                          >
                            {item.rewardText}
                          </AppText>
                        </View>

                        {item.unlockedAtLabel ? (
                          <AppText
                            weight={isNewUnlock ? "extraBold" : "medium"}
                            style={[
                              styles.unlockedAtText,
                              isNewUnlock && styles.unlockedAtTextNewToday,
                            ]}
                            numberOfLines={1}
                          >
                            {isNewUnlock
                              ? "New! Unlocked today"
                              : item.unlockedAtLabel}
                          </AppText>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScreenLayout>
  );
}