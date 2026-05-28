import { Stack } from "expo-router";

import Sosscreen from "@/src/screens/ChildrenScreens/SosScreen/SosScreen";

export default function SosScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "SOS",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <Sosscreen />
    </>
  );
}