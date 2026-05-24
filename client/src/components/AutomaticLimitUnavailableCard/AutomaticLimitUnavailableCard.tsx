import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import { styles } from "./styles";

type Props = {
  title: string;
  activeLimitLabel: string | null;
  targetLimitLabel: string;
};

export default function AutomaticLimitUnavailableCard({
  title,
  activeLimitLabel,
  targetLimitLabel,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={20}
          color="#B45309"
        />

        <AppText weight="extraBold" style={styles.title}>
          {title}
        </AppText>
      </View>

      <AppText weight="medium" style={styles.text}>
        <AppText weight="extraBold" style={styles.mode}>
          {activeLimitLabel ?? "Another automatic limit"}
        </AppText>{" "}
        is currently active on this device. Turn it off before enabling{" "}
        {targetLimitLabel}.
      </AppText>
    </View>
  );
}