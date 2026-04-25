import { api } from "./request";
import type { WithUnlockedAchievements } from "./achievements";

export type CreateTaskResponse = {
  tasks: any[];
  createdCount: number;
};

export type GetTasksResponse = {
  tasks: any[];
};

export type UnlockedAchievementResponse = {
  _id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
};

export type SubmitTaskResponse = WithUnlockedAchievements<{
  task: any;
}>;

const URL = "/api/v1/tasks";

export async function createTask(payload: any): Promise<CreateTaskResponse> {
  return api.post<CreateTaskResponse>(URL, payload, {
    requireAuth: true,
    role: "PARENT",
  });
}

export async function getParentTasks(): Promise<GetTasksResponse> {
  return api.get<GetTasksResponse>(`${URL}/parent`, {
    requireAuth: true,
    role: "PARENT",
  });
}

export async function getChildTasks(): Promise<GetTasksResponse> {
  return api.get<GetTasksResponse>(`${URL}/child`, {
    requireAuth: true,
    role: "CHILD",
  });
}


// Submits a child task and returns the submitted task with any newly unlocked achievements.
export async function submitTask(
  taskId: string,
  body: { proofImg: string }
): Promise<SubmitTaskResponse> {
  return api.post<SubmitTaskResponse>(
    `/api/v1/tasks/${encodeURIComponent(taskId)}/submit`,
    body,
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}

export async function approveTask(taskId: string) {
  return api.post(`/api/v1/tasks/${encodeURIComponent(taskId)}/approve`, {}, {
    requireAuth: true,
    role: "PARENT",
  });
}