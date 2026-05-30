import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText/AppText";
import { styles } from "./styles";

type ErrorStateCardProps = {
  title: string;
  message?: string;
};

export default function ErrorStateCard({ title, message }: ErrorStateCardProps) {
  return (
    <View style={styles.card} accessibilityRole="alert">
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={36}
        color="#A855F7"
      />
      <AppText weight="extraBold" style={styles.title}>
        {title}
      </AppText>
      {!!message && (
        <AppText weight="medium" style={styles.message}>
          {message}
        </AppText>
      )}
    </View>
  );
}
