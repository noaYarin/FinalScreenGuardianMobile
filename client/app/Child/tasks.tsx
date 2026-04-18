import { Stack } from "expo-router";
import TasksScreen from "@/src/screens/ChildrenScreens/TasksScreen/TasksScreen";

export default function TasksRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Tasks",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <TasksScreen />
    </>
  );
}