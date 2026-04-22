import { api } from "./request";

export type AchievementUiItem = {
  _id: string;
  key: string;
  title: string;
  description: string;
  icon?: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string | null;
};

export type ChildAchievementsResponse = {
  achievements: AchievementUiItem[];
};

export async function fetchChildAchievements(
  childId: string
): Promise<ChildAchievementsResponse> {
  return api.get<ChildAchievementsResponse>(
    `/api/v1/achievements/child/${childId}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}