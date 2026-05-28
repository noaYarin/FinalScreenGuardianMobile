import React from "react";
import { Pressable } from "react-native";

import AppText from "@/src/components/AppText/AppText";
import { styles } from "./styles";

export type MinuteCardTile = "blue" | "purple";

type Props = {
  minutes: number;
  active: boolean;
  tile: MinuteCardTile;
  onPress: () => void;
  a11y: string;
  minutesLabel: string;
};

export default function MinuteCard({
  minutes,
  active,
  tile,
  onPress,
  a11y,
  minutesLabel,
}: Props) {
  const tileStyle = tile === "blue" ? styles.tileBlue : styles.tilePurple;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [
        styles.minuteCard,
        tileStyle,
        active ? styles.cardActive : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <AppText weight="extraBold" style={styles.minutesValue}>
        +{minutes}
      </AppText>

      <AppText style={styles.minutesLabel}>{minutesLabel}</AppText>
    </Pressable>
  );
}
