import { api } from "./request";

const URL = "/api/v1/devices";

export type LimitMode = "NONE" | "DAILY" | "WEEKLY" | "SCHEDULE";

export type Device = {
  _id: string;
  name: string;
  type: string;
  platform: string;
  isLocked: boolean;
  isActive: boolean;
  manualLockEnabled?: boolean;
  dailyLimitLockActive?: boolean;
  weeklyLimitLockActive?: boolean;
  scheduleLockActive?: boolean;
  location: {
    lat: number;
    lng: number;
    lastUpdated: string;
  }; parentId: string;
  childId: string;
  applications?: Array<{
    name?: string;
    appName?: string;
    icon?: string;
    packageName: string;
    isBlocked?: boolean;
  }>;
  screenTime?: {
    isLimitEnabled?: boolean;
    limitMode?: LimitMode;
    dailyLimitMinutes?: number;
    extraMinutesToday?: number;
    weeklyLimitMinutes?: number;
    usedTodayMinutes?: number;
    usedWeekMinutes?: number;
    lastDailyResetAt?: string | null;
    lastWeeklyResetAt?: string | null;
    weeklySchedule?: unknown[];
  };
  createdAt?: string;
  updatedAt?: string;
};

export async function apiGetDevicesByChild(childId: string): Promise<Device[]> {
  const data = await api.get<Device[]>(
    `${URL}/child/${encodeURIComponent(childId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiGetDeviceByChild(
  childId: string,
  deviceId: string
): Promise<Device> {
  const data = await api.get<Device>(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiDeleteDeviceByChild(
  childId: string,
  deviceId: string
): Promise<void> {
  await api.delete(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiUpdateDeviceName(
  childId: string,
  deviceId: string,
  name: string
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}/name`,
    { name },
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}


export async function apiUpdateDeviceScreenTime(
  deviceId: string,
  payload: {
    isLimitEnabled?: boolean;
    limitMode?: LimitMode;
    dailyLimitMinutes?: number;
    weeklyLimitMinutes?: number;
    weeklySchedule?: unknown[];

  }
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/screen-time`,
    payload,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiUpdateDeviceLocation(
  deviceId: string,
  location: { lat: number; lng: number }
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/location`,
    { location },
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
  return data;
}

export async function apiLockDevice(deviceId: string): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/lock`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiUnlockDevice(deviceId: string): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/unlock`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}
export type InstalledDeviceApp = {
  name: string;
  packageName: string;
  icon?: string;
  isBlocked?: boolean;
};

export async function apiSyncInstalledApps(
  deviceId: string,
  applications: InstalledDeviceApp[]
): Promise<InstalledDeviceApp[]> {
  const data = await api.patch<InstalledDeviceApp[]>(
    `${URL}/${encodeURIComponent(deviceId)}/apps/sync`,
    { applications },
    {
      requireAuth: true,
      role: "CHILD",
    }
  );

  return data;
}

export async function apiBlockApplication(
  deviceId: string,
  packageName: string
): Promise<InstalledDeviceApp> {
  return api.patch<InstalledDeviceApp>(
    `${URL}/${encodeURIComponent(deviceId)}/apps/${encodeURIComponent(packageName)}/block`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiUnblockApplication(
  deviceId: string,
  packageName: string
): Promise<InstalledDeviceApp> {
  return api.patch<InstalledDeviceApp>(
    `${URL}/${encodeURIComponent(deviceId)}/apps/${encodeURIComponent(packageName)}/unblock`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export type DevicePolicy = {
  applications?: Array<{
    name?: string;
    packageName: string;
    icon?: string;
    isBlocked?: boolean;
  }>;
};

export async function apiGetDevicePolicyForChild(
  deviceId: string
): Promise<DevicePolicy> {
  return api.get<DevicePolicy>(
    `${URL}/${encodeURIComponent(deviceId)}/policy`,
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}