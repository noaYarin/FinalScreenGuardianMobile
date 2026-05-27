import React from "react";
import { Stack } from "expo-router";

import GoalsScreen from "@/src/screens/ChildrenScreens/GoalsScreen/GoalsScreen";

export default function ChildGoalsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Goals",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <GoalsScreen />
    </>
  );
}
