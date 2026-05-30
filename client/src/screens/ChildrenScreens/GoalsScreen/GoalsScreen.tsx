import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ChildGoal } from "@/src/api/badge";
import ScreenLayout from "@/src/layouts/ScreenLayout/ScreenLayout";
import AppText from "@/src/components/AppText/AppText";
import EmptyStateCard from "@/src/components/EmptyStateCard/EmptyStateCard";
import ErrorStateCard from "@/src/components/ErrorStateCard/ErrorStateCard";
import GoalBadge from "./GoalBadge";
import { useChildBadges } from "@/src/hooks/useChildBadges";
import { styles } from "./styles";

const LOCKED_PREVIEW_COUNT = 6;
const BADGES_PER_ROW = 3;

function getCurrentGoalIndex(goals: readonly ChildGoal[]) {
  return goals.findIndex((goal) => !goal.completed);
}

function getCurrentGoal(goals: readonly ChildGoal[]) {
  const index = getCurrentGoalIndex(goals);
  return index >= 0 ? goals[index] : undefined;
}

function getCompletedGoals(goals: readonly ChildGoal[]) {
  return goals.filter((goal) => goal.completed);
}

function getUpcomingLockedGoals(
  goals: readonly ChildGoal[],
  max = LOCKED_PREVIEW_COUNT
) {
  const currentIndex = getCurrentGoalIndex(goals);
  if (currentIndex < 0) return [];

  return goals.slice(currentIndex + 1, currentIndex + 1 + max);
}

function getEarnedCount(goals: readonly ChildGoal[]) {
  return goals.filter((goal) => goal.completed).length;
}

function chunkBadges<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size) as T[]);
  }

  return rows;
}

function BadgeGrid({
  items,
  variant,
}: {
  items: readonly ChildGoal[];
  variant: "locked" | "earned";
}) {
  if (items.length === 0) return null;

  return (
    <View style={styles.badgeGrid}>
      {chunkBadges(items, BADGES_PER_ROW).map((row, rowIndex) => (
        <View key={`${variant}-row-${rowIndex}`} style={styles.badgeGridRow}>
          {row.map((goal) => (
            <View key={goal.id} style={styles.badgeGridItem}>
              <GoalBadge
                goal={goal}
                size="grid"
                locked={variant === "locked"}
                earned={variant === "earned"}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function GoalsScreen() {
  const { badgeList, isLoading, error } = useChildBadges();
  const currentGoal = useMemo(() => getCurrentGoal(badgeList), [badgeList]);
  const completedBadges = useMemo(() => getCompletedGoals(badgeList), [badgeList]);
  const upcomingLocked = useMemo(
    () => getUpcomingLockedGoals(badgeList),
    [badgeList]
  );
  const earnedCount = useMemo(() => getEarnedCount(badgeList), [badgeList]);
  const allBadgesCompleted =
    !isLoading && !error && badgeList.length > 0 && !currentGoal;

  return (
    <ScreenLayout>
      <View style={styles.page}>
        {isLoading ? (
          <View style={styles.heroCard}>
            <ActivityIndicator size="large" color="#2563EB" />
            <AppText weight="medium" style={styles.stateMessage}>
              Loading badges...
            </AppText>
          </View>
        ) : null}

        {error ? (
          <ErrorStateCard
            title="Could not load badges"
            message="Check your internet connection and open this screen again."
          />
        ) : null}

        {!isLoading && !error && badgeList.length === 0 ? (
          <EmptyStateCard
            icon="medal-outline"
            title="No badges yet"
            subtitle="Your badges will show up here once they are ready for you."
          />
        ) : null}

        {!isLoading && !error && badgeList.length > 0 ? (
          <>
        <View style={styles.summaryPill}>
          <MaterialCommunityIcons name="medal-outline" size={16} color="#2563EB" />
          <AppText weight="medium" style={styles.summaryPillText}>
            Badges earned
          </AppText>
          <AppText weight="extraBold" style={styles.summaryPillValue}>
            {earnedCount}/{badgeList.length}
          </AppText>
        </View>

        {currentGoal ? (
          <View
            style={[
              styles.heroCard,
              { backgroundColor: currentGoal.heroTint },
            ]}
            accessibilityRole="summary"
            accessibilityLabel={`Current challenge: ${currentGoal.title}. ${currentGoal.description}`}
          >
            <AppText weight="bold" style={styles.heroEyebrow}>
              Your current challenge
            </AppText>

            <GoalBadge goal={currentGoal} size="hero" active />

            <AppText weight="extraBold" style={styles.heroTitle}>
              {currentGoal.title}
            </AppText>

            <AppText weight="medium" style={styles.heroDescription}>
              {currentGoal.description}
            </AppText>
          </View>
        ) : allBadgesCompleted ? (
          <View
            style={[styles.heroCard, styles.heroCompleteCard]}
            accessibilityRole="summary"
            accessibilityLabel="All badges completed"
          >
            <MaterialCommunityIcons name="party-popper" size={48} color="#16A34A" />
            <AppText weight="extraBold" style={styles.heroCompleteTitle}>
              All badges unlocked!
            </AppText>
            <AppText weight="medium" style={styles.heroCompleteSubtitle}>
              Amazing work — new challenges are coming soon.
            </AppText>
          </View>
        ) : null}

        {upcomingLocked.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <AppText weight="extraBold" style={styles.sectionTitle}>
                Coming up next
              </AppText>
              <AppText weight="medium" style={styles.sectionSubtitle}>
                Finish your current badge to unlock the next one!
              </AppText>
            </View>

            <BadgeGrid items={upcomingLocked} variant="locked" />
          </>
        ) : null}

        {completedBadges.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <AppText weight="extraBold" style={styles.sectionTitle}>
                Your earned badges
              </AppText>
            </View>

            <BadgeGrid items={completedBadges} variant="earned" />
          </>
        ) : null}
          </>
        ) : null}
      </View>
    </ScreenLayout>
  );
}
