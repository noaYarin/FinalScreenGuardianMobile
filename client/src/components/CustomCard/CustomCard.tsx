import React from "react";
import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import { sharedMinuteCardStyles, styles } from "./styles";

type Props = {
  customMinutes: number;
  active: boolean;
  onSelect: () => void;
  onDec: () => void;
  onInc: () => void;
};

export default function CustomCard({
  customMinutes,
  active,
  onSelect,
  onDec,
  onInc,
}: Props) {
  return (
    <View
      style={[
        sharedMinuteCardStyles.minuteCard,
        styles.customCard,
        active ? sharedMinuteCardStyles.cardActive : null,
      ]}
      accessible={false}
    >
      <Pressable
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityLabel={`Select custom ${customMinutes} minutes`}
        style={({ pressed }) => [
          styles.cardOverlayPressable,
          pressed ? sharedMinuteCardStyles.cardPressed : null,
        ]}
      />

      <View style={styles.customRowInner}>
        <View style={styles.customValueRow}>
          <Pressable
            onPress={onDec}
            accessibilityRole="button"
            accessibilityLabel="Decrease minutes"
            hitSlop={8}
            style={({ pressed }) => [
              styles.customControlBtn,
              pressed ? styles.pressedOpacity : null,
            ]}
          >
            <MaterialCommunityIcons name="minus" size={18} color="#B46B00" />
          </Pressable>

          <AppText weight="extraBold" style={styles.customValue}>
            +{customMinutes}
          </AppText>

          <Pressable
            onPress={onInc}
            accessibilityRole="button"
            accessibilityLabel="Increase minutes"
            hitSlop={8}
            style={({ pressed }) => [
              styles.customControlBtn,
              pressed ? styles.pressedOpacity : null,
            ]}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#B46B00" />
          </Pressable>
        </View>

        <AppText style={sharedMinuteCardStyles.minutesLabel}>minutes</AppText>
      </View>
    </View>
  );
}
