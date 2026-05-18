import { NativeModules, Platform } from "react-native";

const { DeviceControl } = NativeModules;

export type NativeInstalledApp = {
  name: string;
  packageName: string;
  icon?: string;
  isSystemApp?: boolean;
};

export async function getInstalledAppsFromAndroid(): Promise<NativeInstalledApp[]> {
  if (Platform.OS !== "android") {
    return [];
  }

  if (!DeviceControl?.getInstalledApps) {
    throw new Error("DeviceControl.getInstalledApps is not available");
  }

  return DeviceControl.getInstalledApps();
}