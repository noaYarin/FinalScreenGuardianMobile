import { Stack } from "expo-router";
import TasksScreen from "@/src/screens/ChildrenScreens/TasksScreen/TasksScreen";
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