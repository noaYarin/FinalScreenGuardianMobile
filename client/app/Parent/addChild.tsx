import { Stack } from "expo-router";
import { APP_COLORS } from "@/constants/theme";
import AddChildScreen from "@/src/screens/ParentScreens/AddChildScreen/AddChildScreen";

export default function AddChildRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Child",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: APP_COLORS.screenBg },
        }}
      />
      <AddChildScreen />
    </>
  );
}