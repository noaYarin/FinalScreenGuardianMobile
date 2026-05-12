import { Stack } from "expo-router";
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
        }}
      />
      <NotificationsScreen />
    </>
  );
}