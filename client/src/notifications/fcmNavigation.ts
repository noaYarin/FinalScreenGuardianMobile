import type { Href, Router } from "expo-router";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { InteractionManager } from "react-native";
 
type NavigateFromMessageOptions = {
  router: Router;
  remoteMessage: FirebaseMessagingTypes.RemoteMessage;
};
 
let blockDefaultRedirectUntilMs = 0;

export function shouldBlockDefaultRedirect(): boolean {
  return Date.now() < blockDefaultRedirectUntilMs;
}

function markFcmNavigationInProgress() {
  blockDefaultRedirectUntilMs = Date.now() + 2000;
}

function getHrefFromRemoteMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage
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
  const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
    if (!remoteMessage) return;
    navigateFromRemoteMessage({ router, remoteMessage });
  });
 
  messaging()
    .getInitialNotification()
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

