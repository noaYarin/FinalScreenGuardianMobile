import { Stack } from "expo-router";
import StoreScreen from "@/src/screens/ChildrenScreens/StoreScreen/StoreScreen";

export default function StoreRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Store",
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <StoreScreen />
    </>
  );
}