import { Stack } from "expo-router";
import ReportsScreen from "@/src/screens/ReportsScreen/ReportsScreen";

export default function ParentReportsTabRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <ReportsScreen mode="parent" embeddedInTabs />
    </>
  );
}
