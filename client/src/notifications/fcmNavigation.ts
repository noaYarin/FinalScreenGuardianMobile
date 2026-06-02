import type { Href, Router } from "expo-router";
import type { RemoteMessage } from "@react-native-firebase/messaging";
import {
  getInitialNotification,
  getMessaging,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { InteractionManager } from "react-native";

type NavigateFromMessageOptions = {
  router: Router;
  remoteMessage: RemoteMessage;
};

let blockDefaultRedirectUntilMs = 0;

export function shouldBlockDefaultRedirect(): boolean {
  return Date.now() < blockDefaultRedirectUntilMs;
}

function markFcmNavigationInProgress() {
  blockDefaultRedirectUntilMs = Date.now() + 2000;
}

function normalizeValue(value: unknown): string {
  if (value == null) return "";
  return String(value).trim();
}

function getHrefFromRemoteMessage(
  remoteMessage: RemoteMessage
): Href | null {
  const data = remoteMessage.data ?? {};

  const targetRole = normalizeValue(data.targetRole).toUpperCase();
  const type = normalizeValue(data.type).toUpperCase();
  const link = normalizeValue(data.link);

  // If the server explicitly sends a child link, respect it.
  if (link.startsWith("/Child")) {
    return link as Href;
  }

  // If the server explicitly sends a parent link, respect it.
  if (link.startsWith("/Parent")) {
    return link as Href;
  }

  // Child push notifications
  if (targetRole === "CHILD") {
    if (type === "TASK_APPROVED") {
      return "/Child/tasks" as Href;
    }

    if (
      type === "EXTENSION_REQUEST_APPROVED" ||
      type === "SCREEN_TIME_ENDING"
    ) {
      return "/Child" as Href;
    }

    return "/Child" as Href;
  }

  // Parent push notifications
  if (targetRole === "PARENT") {
    return "/Parent/systemAlerts" as Href;
  }

  // Fallback:
  // If there is no targetRole, infer by type.
  if (
    type === "TASK_APPROVED" ||
    type === "EXTENSION_REQUEST_APPROVED" ||
    type === "SCREEN_TIME_ENDING"
  ) {
    return "/Child" as Href;
  }

  return "/Parent/systemAlerts" as Href;
}

function navigateFromRemoteMessage({
  router,
  remoteMessage,
}: NavigateFromMessageOptions) {
  const href = getHrefFromRemoteMessage(remoteMessage);

  if (href) {
    markFcmNavigationInProgress();

    InteractionManager.runAfterInteractions(() => {
      router.push(href);
    });
  }
}

export function registerFcmNotificationTapHandlers(router: Router) {
  const messaging = getMessaging();

  const unsubscribe = onNotificationOpenedApp(messaging, (remoteMessage) => {
    if (!remoteMessage) return;
    navigateFromRemoteMessage({ router, remoteMessage });
  });

  getInitialNotification(messaging)
    .then((remoteMessage) => {
      if (!remoteMessage) return;

      setTimeout(() => {
        navigateFromRemoteMessage({ router, remoteMessage });
      }, 800);
    })
    .catch((e) => {
      console.warn("getInitialNotification error", e);
    });

  return unsubscribe;
}