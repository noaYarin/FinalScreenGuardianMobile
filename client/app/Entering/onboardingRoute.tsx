import React from "react";
import { Stack } from "expo-router";
import { APP_COLORS } from "@/constants/theme";
import { OnboardingScreen } from "../../src/screens/EnteringScreens/OnBoardingScreen/OnboardingScreen";

export default function OnboardingRoute() {

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerShadowVisible: false,
          contentStyle: { backgroundColor: APP_COLORS.screenBg },
        }}
      />
      <OnboardingScreen />
    </>
  );
}