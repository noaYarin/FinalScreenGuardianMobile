import { Stack } from "expo-router";
import ParentReportsScreen from "@/src/screens/ParentScreens/ReportsScreen/ReportsScreen";

export default function ParentReportsTabRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
        }}
      />
      <ParentReportsScreen />
    </>
  );
}
