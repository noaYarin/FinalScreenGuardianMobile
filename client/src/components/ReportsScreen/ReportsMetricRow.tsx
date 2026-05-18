import React from "react";
import { View } from "react-native";

import AppText from "@/src/components/AppText/AppText";
import { metricRowStyles } from "@/src/screens/ParentScreens/ReportsScreen/styles";

type Props = {
  label: string;
  value: string;
};

export default function ReportsMetricRow({ label, value }: Props) {
  return (
    <View style={metricRowStyles.card}>
      <AppText weight="bold" style={metricRowStyles.label}>
        {label}
      </AppText>
      <AppText weight="bold" style={metricRowStyles.value}>
        {value}
      </AppText>
    </View>
  );
}
