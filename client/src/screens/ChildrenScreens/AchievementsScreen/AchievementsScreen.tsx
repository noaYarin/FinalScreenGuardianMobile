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
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import { styles } from "./styles";
import { getAchievementIconByKey } from "@/src/utils/achievementIcons";
import { getLockedAchievementHint } from "@/src/utils/achievementText";

type AchievementCard = {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  progressText: string;
  rewardText: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "gold" | "light";
  unlocked: boolean;
};

function mapAchievementToCard(achievement: AchievementUiItem): AchievementCard {
  const isUnlocked = Boolean(achievement.unlocked);

  return {
    id: achievement._id,
    key: achievement.key,
    title: achievement.title,
    subtitle: achievement.description,
    progressText: "Unlocked",
    rewardText: `+${achievement.xpReward ?? 0} XP`,
    icon: getAchievementIconByKey(achievement.key),
    tone: isUnlocked ? "gold" : "light",
    unlocked: isUnlocked,
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

              <AppText style={styles.heroSummaryLabel}>XP</AppText>
            </View>
          </View>
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
            title="No achievements yet"
            subtitle="Achievements will appear here after the catalog is loaded."
          />
        ) : null}

        {!isLoading && !error && achievements.length > 0 ? (
          <View style={styles.achievementsList}>
            {achievements.map((item) => {
              const isUnlocked = item.unlocked;
              const isGold = item.tone === "gold";

              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.title} ${isUnlocked ? "unlocked" : "locked"
                    }`}
                  style={({ pressed }) => [
                    styles.achievementCard,
                    isUnlocked
                      ? isGold
                        ? styles.achievementCardGold
                        : styles.achievementCardLight
                      : styles.achievementCardLocked,
                    pressed && styles.achievementCardPressed,
                  ]}
                  onPress={() => { }}
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
                              color="#FFFFFF"
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