import React from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

type StatCard = {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  tone: "blue" | "pink";
};

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

export default function AchievementsScreen() {
  const { width } = useWindowDimensions();

  const isTabletLarge = width >= 900;
  const isTablet = width >= 650;

  const heroIconSize = isTabletLarge ? 84 : isTablet ? 74 : 66;
  const sidePadding = isTabletLarge ? 24 : 16;

  const gridGap = 14;
  const statColumns = isTabletLarge ? 4 : 2;
  const contentWidth = width - sidePadding * 2;
  const statCardWidth = Math.min(
    Math.floor((contentWidth - gridGap * (statColumns - 1)) / statColumns),
    220
  );

  const points = 1200;
  const completedGoals = 5;
  const totalGoals = 8;
  const streakDays = 7;
  const screenTimeSavedHours = 7;

  const stats: StatCard[] = [
    {
      id: "savedTime",
      label: "Time saved",
      value: `${screenTimeSavedHours} h`,
      icon: "clock-outline",
      tone: "blue",
    },
    {
      id: "streak",
      label: "Streak days",
      value: `${streakDays}`,
      icon: "fire",
      tone: "pink",
    },
  ];

  const achievements: AchievementCard[] = [
    {
      id: "focusMaster",
      title: "Dedicated Beginner",
      subtitle: "Complete 10 tasks",
      progressText: "10/10",
      rewardText: "100 pts",
      icon: "target",
      tone: "gold",
      completed: true,
    },
    {
      id: "kingOfAchievements",
      title: "King of Achievements",
      subtitle: "Unlock 20 achievements",
      progressText: "15/20",
      rewardText: "1000 pts",
      icon: "crown-outline",
      tone: "light",
    },
  ];

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
                  <MaterialCommunityIcons name="target" size={18} color="#0F8A5F" />
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
                  {points}
                </AppText>
              </View>

              <AppText style={styles.heroSummaryLabel}>Points</AppText>
            </View>
          </View>
        </View>

        <View style={[styles.statsGrid, { gap: gridGap }]}>
          {stats.map((item) => {
            const isBlue = item.tone === "blue";

            return (
              <View
                key={item.id}
                style={[
                  styles.statCard,
                  isBlue ? styles.statCardBlue : styles.statCardPink,
                  { width: statCardWidth },
                ]}
              >
                <View style={styles.statHeader}>
                  <View
                    style={[
                      styles.statIconBadge,
                      isBlue ? styles.statIconBadgeBlue : styles.statIconBadgePink,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={18}
                      color={isBlue ? "#2F6DEB" : "#D81B60"}
                    />
                  </View>

                  <AppText
                    weight="medium"
                    style={styles.statLabel}
                    numberOfLines={1}
                  >
                    {item.label}
                  </AppText>
                </View>

                <AppText
                  weight="extraBold"
                  style={[
                    styles.statValue,
                    isBlue ? styles.statValueBlue : styles.statValuePink,
                  ]}
                  numberOfLines={1}
                >
                  {item.value}
                </AppText>
              </View>
            );
          })}
        </View>

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
                  isGold ? styles.achievementCardGold : styles.achievementCardLight,
                  pressed && styles.achievementCardPressed,
                ]}
                onPress={() => {}}
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
                          <MaterialCommunityIcons name="check" size={14} color="#fff" />
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