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

export type UnlockedAchievementResponse = {
    _id?: string;
    key?: string;
    title: string;
    description?: string;
    icon?: string;
    xpReward?: number;
};

export type ChildAchievementsResponse = {
    achievements?: AchievementUiItem[];
    data?: {
        achievements?: AchievementUiItem[];
    };
};




export async function fetchChildAchievements(): Promise<ChildAchievementsResponse> {
    return api.get<ChildAchievementsResponse>(
        `/api/v1/achievements/me`,
        {
            requireAuth: true,
            role: "CHILD",
        }
    );
}