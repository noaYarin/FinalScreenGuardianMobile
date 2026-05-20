import React from "react";
import { Pressable, View } from "react-native";

import AppText from "@/src/components/AppText/AppText";
import type { ReportsTimeRange } from "@/src/redux/slices/reports-slice";
import { timeTabsStyles } from "@/src/screens/ParentScreens/ReportsScreen/styles";

const TABS: { key: ReportsTimeRange; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
];

type Props = {
  selectedTimeRange: ReportsTimeRange;
  onSelectTimeRange: (range: ReportsTimeRange) => void;
};

export default function ReportsTimeTabs({
  selectedTimeRange,
  onSelectTimeRange,
}: Props) {
  return (
    <View style={timeTabsStyles.row}>
      {TABS.map((tab) => {
        const isActive = tab.key === selectedTimeRange;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelectTimeRange(tab.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            style={[timeTabsStyles.tab, isActive ? timeTabsStyles.tabActive : null]}
          >
            <AppText
              weight="bold"
              style={[timeTabsStyles.tabText, isActive ? timeTabsStyles.tabTextActive : null]}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
