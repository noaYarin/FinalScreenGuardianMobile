import { Stack } from "expo-router";
import TasksScreen from "@/src/screens/ChildrenScreens/TasksScreen/TasksScreen";
import { APP_COLORS, COLORS } from "@/constants/theme";
import { showInfoToast } from "@/src/utils/appToast";
import { ChildNotificationsHeaderButton } from "@/src/components/Navigation/ChildHeaderButtons";

export default function TasksRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Tasks",
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
      <TasksScreen />
    </>
  );
}