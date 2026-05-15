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

function getHrefFromRemoteMessage(
  remoteMessage: RemoteMessage
): Href | null {
  return "/Parent/systemAlerts" as Href;
}

function navigateFromRemoteMessage({ router, remoteMessage }: NavigateFromMessageOptions) {
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
