import { Stack } from "expo-router";
import StoreScreen from "@/src/screens/ChildrenScreens/StoreScreen/StoreScreen";
import { APP_COLORS, COLORS } from "@/constants/theme";
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
          headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          contentStyle: { backgroundColor: COLORS.light.tint },
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