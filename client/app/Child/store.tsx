import { Stack } from "expo-router";
import StoreScreen from "@/src/screens/ChildrenScreens/StoreScreen/StoreScreen";
import { showInfoToast } from "@/src/utils/appToast";
import { ChildNotificationsHeaderButton } from "@/src/components/Navigation/ChildHeaderButtons";

export default function StoreRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Store",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerRight: () => (
            <ChildNotificationsHeaderButton
              onPress={() => showInfoToast("No notifications yet", "Notifications")}
            />
          ),
        }}
      />
      <StoreScreen />
    </>
  );
}