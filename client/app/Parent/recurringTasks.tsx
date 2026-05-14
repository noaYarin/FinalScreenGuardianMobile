import { Stack } from "expo-router";
import RecurringTasksScreen from "@/src/screens/ParentScreens/RecurringTasksScreen/RecurringTasksScreen";

export default function RecurringTasksRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Recurring Tasks" }} />
      <RecurringTasksScreen />
    </>
  );
}