import React from "react";
import { Stack } from "expo-router";

import IdeasScreen from "@/src/screens/ChildrenScreens/IdeasScreen/IdeasScreen";

export default function ChildIdeasRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Ideas",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <IdeasScreen />
    </>
  );
}
