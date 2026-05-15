import React from "react";
import { Stack } from "expo-router";

import InterestsScreen from "@/src/screens/ChildrenScreens/InterestsScreen/InterestsScreen";

export default function ChildInterestsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Interests",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <InterestsScreen />
    </>
  );
}
