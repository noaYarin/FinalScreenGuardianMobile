import { Stack } from "expo-router";
import RewardsHistoryScreen from "@/src/screens/ParentScreens/RewardsHistoryScreen/RewardsHistoryScreen";

export default function RewardsHistoryRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Reward History",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <RewardsHistoryScreen />
    </>
  );
}