import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
 
export function useAndroidPostNotificationsPermission() {
  useEffect(() => {
    const run = async () => {
      if (Platform.OS !== "android") return;
      if (typeof Platform.Version !== "number") return;
      if (Platform.Version < 33) return;
 
      const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
      const alreadyGranted = await PermissionsAndroid.check(permission);
      if (alreadyGranted) return;
 
      await PermissionsAndroid.request(permission);
    };
 
    run().catch((e) => {
      console.warn("POST_NOTIFICATIONS permission request error", e);
    });
  }, []);
}

