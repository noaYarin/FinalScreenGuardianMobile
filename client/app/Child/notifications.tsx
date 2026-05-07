import { Stack } from "expo-router";
import { APP_COLORS, COLORS } from "@/constants/theme";
import NotificationsScreen from "@/src/screens/ChildrenScreens/NotificationsScreen/NotificationsScreen";

export default function NotificationsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerTitleAlign: "center",
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerStyle: { backgroundColor: APP_COLORS.primaryBlue },
                    headerTintColor: "#FFFFFF",
                    headerTitleStyle: { color: "#FFFFFF" },
                    contentStyle: { backgroundColor: COLORS.light.tint },
        }}
      />
      <NotificationsScreen />
    </>
  );
}