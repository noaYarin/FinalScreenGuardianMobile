import { useEffect } from "react";
import "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";
import { apiRegisterFcmToken } from "../api/notification";
import { API_BASE_URL } from "../config/env";

//Custom hook to synchronize the device's FCM token with the backend server
export function useParentFcmTokenSync(parentAuthToken: string | null, parentId: string | null) {
  useEffect(() => {
    let unsubscribeTokenRefresh: null | (() => void) = null;
    let cancelled = false;

    const syncToken = async (fcmToken: string) => {
      try {
        await apiRegisterFcmToken(fcmToken);
      } catch (e) {
        console.warn("Failed to register FCM token", e);
      }
    };

    const run = async () => {
      if (!API_BASE_URL) {
        console.warn(
          "EXPO_PUBLIC_API_URL is not set; skipping FCM token registration to backend."
        );
        return;
      }

      if (!parentAuthToken || !parentId) return;

      let messaging;
      try {
        messaging = getMessaging();
      } catch (e) {
        console.warn("Firebase Messaging native module is not available yet; skipping FCM bootstrap.", e);
        return;
      }

      try {
        await requestPermission(messaging);
      } catch (e) {
        console.warn("requestPermission failed", e);
      }

      try {
        await registerDeviceForRemoteMessages(messaging);
      } catch (e) {
        console.warn("registerDeviceForRemoteMessages failed", e);
      }

      let fcmToken: string;
      try {
        fcmToken = await getToken(messaging);
      } catch (e) {
        console.warn("getToken failed", e);
        return;
      }
      if (cancelled) return;
      await syncToken(fcmToken);

      try {
        unsubscribeTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
          await syncToken(newToken);
        });
      } catch (e) {
        console.warn("onTokenRefresh failed", e);
      }
    };

    run().catch((e) => console.warn("FCM bootstrap error", e));

    return () => {
      cancelled = true;
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    };
  }, [parentAuthToken, parentId]);
}
