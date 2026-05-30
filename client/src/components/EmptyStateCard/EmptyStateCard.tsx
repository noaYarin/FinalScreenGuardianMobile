import React from "react";
import { View, Pressable, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../AppText/AppText";
import { styles } from "./styles";

type EmptyStateCardProps = {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  subtitle?: string;
  buttonLabel?: string;
  onPressButton?: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
};

export default function EmptyStateCard({
  icon = "account-child-outline",
  title,
  subtitle,
  buttonLabel,
  onPressButton,
  buttonStyle,
  buttonTextStyle,
}: EmptyStateCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={28} color="#3D6BF2" />
      </View>

      <AppText weight="bold" style={styles.title}>
        {title}
      </AppText>

      {!!subtitle && (
        <AppText style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}

      {!!buttonLabel && !!onPressButton && (
        <Pressable
          onPress={onPressButton}
          accessibilityRole="button"
          accessibilityLabel={buttonLabel}
          style={({ pressed }) => [
            styles.button,
            buttonStyle,
            pressed && styles.buttonPressed,
          ]}
        >
          <AppText weight="extraBold" style={[styles.buttonText, buttonTextStyle]}>
            {buttonLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}