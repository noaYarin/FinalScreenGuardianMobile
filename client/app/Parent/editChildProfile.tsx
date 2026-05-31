import { Stack } from "expo-router";
import { APP_COLORS } from "@/constants/theme";
import EditChildProfileScreen from "@/src/screens/ParentScreens/EditChildProfileScreen/EditChildProfileScreen";

export default function EditChildProfileRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Child",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: APP_COLORS.screenBg },
        }}
      />
      <EditChildProfileScreen />
    </>
  );
}