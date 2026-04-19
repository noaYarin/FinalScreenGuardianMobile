import { Stack } from "expo-router";
import AddTaskScreen from "@/src/screens/ParentScreens/AddTaskScreen/AddTaskScreen";

export default function AddTaskRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Task",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <AddTaskScreen />
    </>
  );
}