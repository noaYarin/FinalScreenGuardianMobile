import { api } from "./request";
import type { LimitMode } from "./device";

type Child = {
  _id: string;
  name: string;
  img?: string;
  birthDate: string;
  gender?: string;
  interests?: string[];
  coins: number;
  isActive: boolean;
  role: string;
  achievementIds?: string[];
  avatar?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
};

export type HomeSummaryChild = {
  childId: string;
  name: string;
  img?: string | null;
  deviceId: string | null;
  deviceName: string | null;

  limitMode: LimitMode;
  isLimitEnabled: boolean;

  usedTodayMinutes: number | null;
  usedWeekMinutes: number | null;

  dailyLimitMinutes: number | null;
  weeklyLimitMinutes: number | null;
  extraMinutesToday: number | null;

  usedMinutes: number | null;
  limitMinutes: number | null;
  remainingMinutes: number | null;

  status: "good" | "warn" | "bad";

  isLocked: boolean;
  manualLockEnabled: boolean;
  dailyLimitLockActive: boolean;
  weeklyLimitLockActive: boolean;
  scheduleLockActive: boolean;
};

const URL = "/api/v1/parent";

export async function addChild(body: {
  name: string;
  birthDate: string;
  gender?: string;
}): Promise<{ child: Child }> {
  return api.post<{ child: Child }>("/api/v1/parent/children", body, { requireAuth: true, role: "PARENT" });
}

export async function getMyChildren(options?: {
  includeInactive?: boolean;
}): Promise<{ children: Child[] }> {
  const query =
    options?.includeInactive === true ? "?includeInactive=true" : "";
  return api.get<{ children: Child[] }>(`${URL}/children${query}`, { requireAuth: true, role: "PARENT" });
}

export async function getChildById(
  childId: string
): Promise<{ child: Child }> {
  return api.get<{ child: Child }>(
    `${URL}/get/child/${encodeURIComponent(childId)}`,
    { requireAuth: true, role: "PARENT" }
  );
}



export async function setChildActive(
  childId: string,
  isActive: boolean
): Promise<{ [key: string]: unknown }> {
  return api.patch<{ [key: string]: unknown }>(
    `${URL}/children/${encodeURIComponent(childId)}/active`,
    { isActive },
    { requireAuth: true, role: "PARENT" }
  );
}


export async function getHomeSummary(): Promise<{
  children: HomeSummaryChild[];
}> {
  return api.get<{ children: HomeSummaryChild[] }>(
    `${URL}/home-summary`,
    { requireAuth: true, role: "PARENT" }
  );
}

export type ScreenTimeReportDay = {
  weekdayLabel: string;
  dateKey: string;
  date: string;
  usedMinutes: number;
};

export type ScreenTimeUsageReport = {
  days: ScreenTimeReportDay[];
  weeklyTotalMinutes: number;
  dailyAverageMinutes: number;
  topApp: string | null;
  hasLinkedDevice: boolean;
};

export async function getChildScreenTimeReports(
  childId: string
): Promise<ScreenTimeUsageReport> {
  return api.get<ScreenTimeUsageReport>(
    `${URL}/children/${encodeURIComponent(childId)}/screen-time-reports`,
    { requireAuth: true, role: "PARENT" }
  );
}
export async function deleteChild(
  childId: string
): Promise<{ deletedChildId: string }> {
  return api.delete<{ deletedChildId: string }>(
    `${URL}/children/${encodeURIComponent(childId)}`,
    { requireAuth: true, role: "PARENT" }
  );
}
