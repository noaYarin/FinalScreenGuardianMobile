import { NativeModules, Platform } from "react-native";

export type InstalledDeviceApp = {
  name: string;
  packageName: string;
  icon?: string;
  isSystemApp?: boolean;
};

export type AppUsageStat = {
  packageName: string;
  name: string;
  usedTodayMinutes: number;
  lastTimeUsed?: number;
};

type AndroidPermissionStates = {
  usageAccess: boolean;
  accessibility: boolean;
  notifications: boolean;
  location: boolean;
};

type RemainingTime = {
  dailyLimitMinutes: number;
  usedTodayMinutes: number;
  extraMinutes: number;
  remainingMinutes: number;
  lockNow: boolean;
  shouldLock: boolean;
  limitEnabled: boolean;
};

type DeviceControlModule = {
  getInstalledApps: () => Promise<InstalledDeviceApp[]>;
  getAppUsageStats: () => Promise<AppUsageStat[]>;
  getRemainingTime: () => Promise<RemainingTime>;
  getAndroidPermissionStates: () => Promise<AndroidPermissionStates>;
  openAndroidUsageAccessSettings: () => Promise<boolean>;
  openAndroidAccessibilitySettings: () => Promise<boolean>;
  openAndroidAppNotificationSettings: () => Promise<boolean>;
  openAndroidLocationSettings: () => Promise<boolean>;
  syncPolicyNow: () => Promise<boolean>;
};

const NativeDeviceControl =
  NativeModules.DeviceControl as DeviceControlModule | undefined;

export function getDeviceControl(): DeviceControlModule {
  if (Platform.OS !== "android" || !NativeDeviceControl) {
    throw new Error("DeviceControl native module is available only on Android.");
  }

  return NativeDeviceControl;
}