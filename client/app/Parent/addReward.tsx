import { Stack } from "expo-router";
import AddRewardScreen from "@/src/screens/ParentScreens/AddRewardScreen/AddRewardScreen";

export default function AddRewardRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Reward",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <AddRewardScreen />
    </>
  );
}