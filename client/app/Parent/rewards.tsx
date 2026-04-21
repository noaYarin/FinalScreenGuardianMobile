import { Stack } from "expo-router";
import RewardsScreen from "@/src/screens/ParentScreens/RewardsScreen/RewardsScreen";

export default function RewardsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Rewards",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <RewardsScreen />
    </>
  );
}