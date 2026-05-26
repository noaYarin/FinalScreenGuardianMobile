import React from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function ScreenLayout({
  children,
  scrollable = true,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  const bottomSafePadding = 24 + insets.bottom;

  if (!scrollable) {
    return (
      <View
        style={[
          styles.page,
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
      style={styles.page}
      contentContainerStyle={[
        styles.content,
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