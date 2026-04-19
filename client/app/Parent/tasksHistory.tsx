import { Stack } from "expo-router";
import TasksHistoryScreen from "@/src/screens/ParentScreens/TasksHistoryScreen/TasksHistoryScreen";

export default function TasksHistoryRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Task History",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <TasksHistoryScreen />
    </>
  );
}