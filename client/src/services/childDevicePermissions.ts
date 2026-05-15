import { Linking, NativeModules, PermissionsAndroid, Platform } from "react-native";
import * as Location from "expo-location";

export type ChildPermissionKey =
  | "usageAccess"
  | "accessibility"
  | "notifications"
  | "location";

export type ChildPermissionSnapshot = {
  usageAccess: boolean;
  accessibility: boolean;
  notifications: boolean;
  location: boolean;
  allSatisfied: boolean;
};

type DeviceControlNative = {
  getAndroidPermissionStates?: () => Promise<{
    usageAccess: boolean;
    accessibility: boolean;
    notifications: boolean;
    location: boolean;
  }>;
  openAndroidUsageAccessSettings?: () => Promise<boolean>;
  openAndroidAccessibilitySettings?: () => Promise<boolean>;
  openAndroidAppNotificationSettings?: () => Promise<boolean>;
  openAndroidLocationSettings?: () => Promise<boolean>;
};

const DeviceControl = NativeModules.DeviceControl as DeviceControlNative | undefined;

function snapshotFromFlags(
  usageAccess: boolean,
  accessibility: boolean,
  notifications: boolean,
  location: boolean
): ChildPermissionSnapshot {
  const allSatisfied = usageAccess && accessibility && notifications && location;
  return { usageAccess, accessibility, notifications, location, allSatisfied };
}

/** Native permission snapshot — Android only. Other platforms: no-op (all satisfied). */
export async function fetchChildPermissionSnapshot(): Promise<ChildPermissionSnapshot> {
  if (Platform.OS !== "android") {
    return snapshotFromFlags(true, true, true, true);
  }

  try {
    if (DeviceControl?.getAndroidPermissionStates) {
      const m = await DeviceControl.getAndroidPermissionStates();
      return snapshotFromFlags(
        Boolean(m.usageAccess),
        Boolean(m.accessibility),
        Boolean(m.notifications),
        Boolean(m.location)
      );
    }
  } catch {
    return snapshotFromFlags(false, false, false, false);
  }
  return snapshotFromFlags(false, false, false, false);
}

export async function requestPostNotificationsIfNeeded(): Promise<void> {
  if (Platform.OS !== "android") return;
  if (typeof Platform.Version !== "number" || Platform.Version < 33) return;
  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  const ok = await PermissionsAndroid.check(permission);
  if (ok) return;
  await PermissionsAndroid.request(permission);
}

export async function requestLocationIfNeeded(): Promise<void> {
  if (Platform.OS !== "android") return;
  const current = await Location.getForegroundPermissionsAsync();
  if (current.status === "granted") return;
  await Location.requestForegroundPermissionsAsync();
}

/** Opens the right Android settings screen. No-op on other platforms. */
export async function openChildPermissionScreen(key: ChildPermissionKey): Promise<void> {
  if (Platform.OS !== "android") return;

  if (!DeviceControl) {
    await Linking.openSettings();
    return;
  }

  try {
    switch (key) {
      case "usageAccess":
        await DeviceControl.openAndroidUsageAccessSettings?.();
        return;
      case "accessibility":
        await DeviceControl.openAndroidAccessibilitySettings?.();
        return;
      case "notifications":
        await DeviceControl.openAndroidAppNotificationSettings?.();
        return;
      case "location":
        await DeviceControl.openAndroidLocationSettings?.();
        return;
    }
  } catch {
    await Linking.openSettings();
  }
}
