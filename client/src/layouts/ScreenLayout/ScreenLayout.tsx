import React from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  const bottomSafePadding = 24 + insets.bottom;

  const pageStyle: StyleProp<ViewStyle> = [
    styles.page,
    backgroundColor ? { backgroundColor } : null,
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
        backgroundColor ? { backgroundColor } : null,
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
