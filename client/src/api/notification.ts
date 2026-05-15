import { api } from "./request";

const URL = "/api/v1/notifications";

export type Notification = {
  _id: string;
  parentId: string;
  childId?: string | null;
  targetRole: "PARENT" | "CHILD";
  type: string;
  severity: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt?: string;
  data?: Record<string, unknown>;
};

export type NotificationsPayload = {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  unreadCount: number;
};

export type ParentNotificationsPayload = NotificationsPayload;
export type ChildNotificationsPayload = NotificationsPayload;

export async function apiGetParentNotifications(
  page: number = 1,
  limit: number = 10
): Promise<ParentNotificationsPayload> {
  return api.get<ParentNotificationsPayload>(`${URL}/parent?page=${page}&limit=${limit}`, {
    requireAuth: true,
    role: "PARENT"
  });
}

export async function apiGetChildNotifications(
  page: number = 1,
  limit: number = 10
): Promise<ChildNotificationsPayload> {
  return api.get<ChildNotificationsPayload>(
    `${URL}/child?page=${page}&limit=${limit}`,
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}

export async function apiMarkParentNotificationRead(notificationId: string): Promise<Notification> {
  return api.patch<Notification>(`${URL}/parent/${notificationId}/read`, null, {
    requireAuth: true,
    role: "PARENT"
  });
}

export async function apiMarkAllParentNotificationsRead(): Promise<{ success: boolean }> {
  return api.patch<{ success: boolean }>(`${URL}/parent/read-all`, null, {
    requireAuth: true,
    role: "PARENT"
  });
}

export async function apiMarkAllChildNotificationsRead(): Promise<{
  success: boolean;
}> {
  return api.patch<{ success: boolean }>(`${URL}/child/read-all`, null, {
    requireAuth: true,
    role: "CHILD",
  });
}


export async function apiDeleteParentNotification(
  notificationId: string
): Promise<{ success: boolean }> {
  return api.delete<{ success: boolean }>(
    `${URL}/parent/${encodeURIComponent(notificationId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiRegisterFcmToken(fcmToken: string): Promise<{ success: boolean }> {
  return api.post<{ success: boolean }>(
    `${URL}/register-token`,
    { fcmToken },
    { requireAuth: true, role: "PARENT" }
  );
}

