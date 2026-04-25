import type { UnlockedAchievementResponse } from "@/src/api/achievements";

// Returns the first newly unlocked achievement from an API response, if one exists.
export function getFirstUnlockedAchievement(
  response: unknown
): UnlockedAchievementResponse | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const unlockedAchievements = (response as any).unlockedAchievements;

  if (!Array.isArray(unlockedAchievements) || unlockedAchievements.length === 0) {
    return null;
  }

  const firstAchievement = unlockedAchievements[0];

  if (!firstAchievement || typeof firstAchievement !== "object") {
    return null;
  }

  return firstAchievement as UnlockedAchievementResponse;
}