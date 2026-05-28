import { api } from "@/src/api/request";
import type { Notification } from "@/src/api/notification";

export async function apiSendSosAlert(deviceId?: string | null) {
  return api.post<Notification>(
    "/api/v1/sos",
    {
      deviceId: deviceId ?? null,
    },
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}