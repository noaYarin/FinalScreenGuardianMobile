import { Stack } from "expo-router";
import ChildReportsScreen from "@/src/screens/ChildrenScreens/ReportsScreen/ReportsScreen";

export default function ChildReportsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Charts",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ChildReportsScreen />
    </>
  );
}
