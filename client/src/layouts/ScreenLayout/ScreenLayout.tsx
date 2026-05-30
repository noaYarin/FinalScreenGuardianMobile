import React from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { selectChildPalette } from "@/src/redux/slices/child-theme-slice";
import { styles } from "./styles";

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
}

export default function ScreenLayout({
  children,
  scrollable = true,
  backgroundColor,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const childPalette = useSelector(selectChildPalette);
  const isChildRoute = segments[0] === "Child";

  const bottomSafePadding = 24 + insets.bottom;

  const resolvedBackgroundColor =
    backgroundColor ?? (isChildRoute ? childPalette.screenBg : undefined);

  const pageStyle: StyleProp<ViewStyle> = [
    styles.page,
    resolvedBackgroundColor ? { backgroundColor: resolvedBackgroundColor } : null,
  ];

  if (!scrollable) {
    return (
      <View
        style={[
          pageStyle,
          styles.nonScrollableContent,
          {
            paddingBottom: bottomSafePadding,
          },
        ]}
      >
        <View style={styles.inner}>{children}</View>
      </View>
    );
  }

  return (
    <ScrollView
      style={pageStyle}
      contentContainerStyle={[
        styles.content,
        resolvedBackgroundColor ? { backgroundColor: resolvedBackgroundColor } : null,
        {
          paddingBottom: bottomSafePadding,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}
