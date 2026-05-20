import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import {
  REPORTS_COLORS,
  chartStyles,
} from "@/src/screens/ParentScreens/ReportsScreen/styles";

type Props = {
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: React.ReactNode;
  centered?: boolean;
};

export default function ReportsChartCard({
  title,
  icon,
  children,
  centered = false,
}: Props) {
  return (
    <View style={chartStyles.card}>
      <View style={chartStyles.headerRow}>
        <AppText weight="bold" style={chartStyles.title}>
          {title}
        </AppText>

        <View style={chartStyles.iconWrap}>
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={REPORTS_COLORS.primary}
          />
        </View>
      </View>

      <View
        style={
          centered ? chartStyles.chartViewportCentered : chartStyles.chartViewport
        }
      >
        {children}
      </View>
    </View>
  );
}
