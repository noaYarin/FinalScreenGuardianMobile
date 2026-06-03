import { useEffect } from "react";
import "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
  requestPermission,
} from "@react-native-firebase/messaging";
import { apiRegisterChildFcmToken } from "../api/notification";
import { API_BASE_URL } from "../config/env";

export function useChildFcmTokenSync(
  childAuthToken: string | null,
  childId: string | null
) {
  useEffect(() => {
    let unsubscribeTokenRefresh: null | (() => void) = null;
    let cancelled = false;

    const syncToken = async (fcmToken: string) => {
      try {
        await apiRegisterChildFcmToken(fcmToken);
      } catch (e) {
        console.warn("Failed to register child FCM token", e);
      }
    };

    const run = async () => {
      if (!API_BASE_URL) {
        console.warn(
          "EXPO_PUBLIC_API_URL is not set; skipping child FCM token registration to backend."
        );
        return;
      }

      if (!childAuthToken || !childId) return;

      let messaging;

      try {
        messaging = getMessaging();
      } catch (e) {
        console.warn(
          "Firebase Messaging native module is not available yet; skipping child FCM bootstrap.",
          e
        );
        return;
      }

      try {
        await requestPermission(messaging);
      } catch (e) {
        console.warn("child requestPermission failed", e);
      }

      try {
        await registerDeviceForRemoteMessages(messaging);
      } catch (e) {
        console.warn("child registerDeviceForRemoteMessages failed", e);
      }

      let fcmToken: string;

      try {
        fcmToken = await getToken(messaging);
      } catch (e) {
        console.warn("child getToken failed", e);
        return;
      }

      if (cancelled) return;

      await syncToken(fcmToken);

      try {
        unsubscribeTokenRefresh = onTokenRefresh(
          messaging,
          async (newToken) => {
            await syncToken(newToken);
          }
        );
      } catch (e) {
        console.warn("child onTokenRefresh failed", e);
      }
    };

    run().catch((e) => console.warn("Child FCM bootstrap error", e));

    return () => {
      cancelled = true;
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    };
  }, [childAuthToken, childId]);
}