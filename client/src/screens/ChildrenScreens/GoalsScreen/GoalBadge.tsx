import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import type { ChildGoal } from "@/data/childGoals";
import AppText from "@/src/components/AppText/AppText";
import { styles, LOCKED_BADGE_COLORS } from "./styles";

type GoalBadgeProps = {
  goal: ChildGoal;
  size: "hero" | "grid";
  locked?: boolean;
  active?: boolean;
  earned?: boolean;
};

export default function GoalBadge({
  goal,
  size,
  locked = false,
  active = false,
  earned = false,
}: GoalBadgeProps) {
  const isHero = size === "hero";
  const badgeSize = isHero ? 120 : 72;
  const iconSize = isHero ? 52 : 32;
  const accentColor = goal.color;
  const showActive = active && !goal.completed;
  const showEarned = earned && goal.completed;
  const useColor = showActive || showEarned;

  const displayColor = useColor ? accentColor : LOCKED_BADGE_COLORS.icon;
  const borderColor = useColor ? accentColor : LOCKED_BADGE_COLORS.border;
  const borderWidth = isHero ? 3.5 : showActive || showEarned ? 3 : 2.5;

  return (
    <View
      style={[styles.badgeWrap, isHero && styles.badgeWrapHero]}
      accessibilityRole="image"
      accessibilityLabel={
        locked
          ? `${goal.title}, locked`
          : showEarned
            ? `${goal.title}, earned`
            : showActive
              ? `${goal.title}, current challenge`
              : goal.title
      }
    >
      <View
        style={[
          styles.badgeShell,
          { width: badgeSize, height: badgeSize },
        ]}
      >
        <View
          style={[
            styles.badgeCircle,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              borderColor,
              borderWidth,
            },
            locked && styles.badgeCircleLocked,
          ]}
        >
          <MaterialCommunityIcons
            name={goal.icon}
            size={iconSize}
            color={displayColor}
            style={locked ? styles.badgeIconLocked : undefined}
          />
        </View>

        {locked ? (
          <View
            style={[
              styles.lockBadge,
              isHero && styles.lockBadgeHero,
              { borderColor: LOCKED_BADGE_COLORS.lockBorder },
            ]}
          >
            <MaterialCommunityIcons
              name="lock"
              size={isHero ? 14 : 12}
              color={LOCKED_BADGE_COLORS.lockIcon}
            />
          </View>
        ) : null}

        {showEarned ? (
          <View
            style={[
              styles.earnedBadge,
              isHero && styles.earnedBadgeHero,
              { borderColor: accentColor },
            ]}
          >
            <MaterialCommunityIcons name="check" size={isHero ? 14 : 12} color={accentColor} />
          </View>
        ) : null}
      </View>

      {!isHero ? (
        <View style={styles.badgeCaption}>
          <AppText
            weight="bold"
            style={[styles.badgeTitle, locked && styles.badgeTitleLocked]}
            numberOfLines={2}
          >
            {goal.title}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
