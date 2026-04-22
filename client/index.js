import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
 
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
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

