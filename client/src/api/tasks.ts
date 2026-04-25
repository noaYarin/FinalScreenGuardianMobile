import { api } from "./request";

export type CreateTaskResponse = {
  tasks: any[];
  createdCount: number;
};

export type GetTasksResponse = {
  tasks: any[];
};

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

export async function submitTask(taskId: string, body: { proofImg: string }) {
  return api.post(`/api/v1/tasks/${encodeURIComponent(taskId)}/submit`, body, {
    requireAuth: true,
    role: "CHILD",
  });
}

export async function approveTask(taskId: string) {
  return api.post(`/api/v1/tasks/${encodeURIComponent(taskId)}/approve`, {}, {
    requireAuth: true,
    role: "PARENT",
  });
}