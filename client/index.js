import "@react-native-firebase/app";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";

const messaging = getMessaging();

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  try {
    if (remoteMessage) {
      await AsyncStorage.setItem(
        "lastBackgroundRemoteMessage",
        JSON.stringify({
          messageId: remoteMessage.messageId,
          sentTime: remoteMessage.sentTime,
          data: remoteMessage.data ?? null,
          notification: remoteMessage.notification ?? null,
        })
      );
    }
  } catch (e) {
    console.warn("Background message handler error", e);
  }
});

import "expo-router/entry";
