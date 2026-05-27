import { api } from "./request";
import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

const URL = "/api/v1/badges";

export type BadgeRule =
  | "single_day"
  | "days_in_week"
  | "weekly_total"
  | "beat_last_week";

export type ChildGoalIcon = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

export type ChildGoal = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  icon: ChildGoalIcon;
  color: string;
  heroTint: string;
  rule: BadgeRule;
  maxMinutes?: number;
  daysRequired?: number;
};

export type ChildBadgeProgress = { completedBadgeIds: number[] };

export type ChildBadgesResponse = {
  badges: ChildGoal[];
};

export async function apiGetChildBadgeProgress() {
  return api.get<ChildBadgeProgress>(`${URL}/child/progress`, {
    requireAuth: true,
    role: "CHILD",
  });
}

export async function apiGetChildBadges() {
  return api.get<ChildBadgesResponse>(`${URL}/child/badges`, {
    requireAuth: true,
    role: "CHILD",
  });
}

export async function apiUnlockChildBadge(payload: {
  deviceId: string;
  badgeId: number;
  title: string;
}) {
  return api.post<ChildBadgeProgress>(`${URL}/child/unlock`, payload, {
    requireAuth: true,
    role: "CHILD",
  });
}
