import React, { useCallback, useMemo } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import type { Child } from "@/src/redux/slices/children-slice";
import type { AchievementUiItem } from "@/src/api/achievements";
import { fetchChildAchievementsThunk } from "@/src/redux/thunks/achievementsThunks";
import { fetchCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";


type AchievementCard = {
  id: string;
  title: string;
  subtitle: string;
  progressText: string;
  rewardText: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "gold" | "light";
  completed?: boolean;
};

function getAchievementIcon(
  achievement: AchievementUiItem
): React.ComponentProps<typeof MaterialCommunityIcons>["name"] {
  switch (achievement.key) {
    case "first_task_submitted":
      return "clipboard-check-outline";

    case "five_tasks_submitted":
      return "clipboard-check-multiple-outline";

    case "first_reward_redeemed":
      return "gift-outline";

    case "avatar_level_2":
      return "shield-star-outline";

    case "avatar_level_5":
      return "star-circle-outline";

    default:
      return "trophy-outline";
  }
}

function mapAchievementToCard(achievement: AchievementUiItem): AchievementCard {
  return {
    id: achievement._id,
    title: achievement.title,
    subtitle: achievement.description,
    progressText: achievement.unlocked ? "Unlocked" : "Locked",
    rewardText: `${achievement.xpReward} pts`,
    icon: getAchievementIcon(achievement),
    tone: achievement.unlocked ? "gold" : "light",
    completed: achievement.unlocked,
  };
}

export default function AchievementsScreen() {
  const { width } = useWindowDimensions();


  const dispatch = useDispatch<AppDispatch>();

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

  const error = useSelector(
    (state: RootState) => state.achievements.error
  );

  const activeChildData = useMemo(() => {
    if (!activeChildId) return undefined;

    return childrenList.find(
      (child: Child) => String(child._id) === String(activeChildId)
    );
  }, [childrenList, activeChildId]);

  useFocusEffect(
    useCallback(() => {
      if (!activeChildId) return;

      dispatch(fetchCurrentChildProfileThunk());
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


  const achievements = useMemo(
    () => achievementsFromRedux.map(mapAchievementToCard),
    [achievementsFromRedux]
  );

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
              Keep reaching goals and unlock new rewards
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

              <AppText style={styles.heroSummaryLabel}>Points</AppText>
            </View>
          </View>
        </View>

        {isLoading ? (
          <AppText style={styles.heroSubtitle}>Loading achievements...</AppText>
        ) : null}

        {error ? <AppText style={styles.heroSubtitle}>{error}</AppText> : null}

        {!isLoading && !error && achievements.length === 0 ? (
          <EmptyStateCard
            icon="trophy-outline"
            title="No achievements yet"
            subtitle="Keep completing goals and healthy habits to unlock your first achievement!"
          />
        ) : null}
        
        <View style={styles.achievementsList}>
          {achievements.map((item) => {
            const isGold = item.tone === "gold";

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`${item.title} ${item.subtitle}`}
                style={({ pressed }) => [
                  styles.achievementCard,
                  isGold
                    ? styles.achievementCardGold
                    : styles.achievementCardLight,
                  pressed && styles.achievementCardPressed,
                ]}
                onPress={() => { }}
              >
                <View style={styles.achievementInner}>
                  <View
                    style={[
                      styles.achievementIconBox,
                      isGold
                        ? styles.achievementIconBoxGold
                        : styles.achievementIconBoxLight,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={28}
                      color={isGold ? "#A17B00" : "#7C3AED"}
                    />
                  </View>

                  <View style={styles.achievementTextArea}>
                    <View style={styles.achievementTitleRow}>
                      <AppText
                        weight="extraBold"
                        style={[
                          styles.achievementTitle,
                          isGold && styles.achievementTitleGold,
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </AppText>

                      {item.completed ? (
                        <View style={styles.completedBadge}>
                          <MaterialCommunityIcons
                            name="check"
                            size={14}
                            color="#fff"
                          />
                          <AppText weight="bold" style={styles.completedBadgeText}>
                            Done
                          </AppText>
                        </View>
                      ) : null}
                    </View>

                    <AppText
                      style={[
                        styles.achievementSubtitle,
                        isGold && styles.achievementSubtitleGold,
                      ]}
                      numberOfLines={2}
                    >
                      {item.subtitle}
                    </AppText>

                    <View style={styles.achievementBottomArea}>
                      <View
                        style={[
                          styles.rewardPill,
                          isGold ? styles.rewardPillGold : styles.rewardPillLight,
                        ]}
                      >
                        <AppText
                          style={[
                            styles.rewardText,
                            isGold && styles.rewardTextGold,
                            styles.centerText,
                          ]}
                          numberOfLines={1}
                        >
                          {item.rewardText}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.pointsPill,
                          isGold ? styles.pointsPillGold : styles.pointsPillLight,
                        ]}
                      >
                        <AppText
                          style={[
                            styles.progressText,
                            isGold && styles.progressTextGold,
                            styles.centerText,
                          ]}
                          numberOfLines={1}
                        >
                          {item.progressText}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScreenLayout>
  );
}