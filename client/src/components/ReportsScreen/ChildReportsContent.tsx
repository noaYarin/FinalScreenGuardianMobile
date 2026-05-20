import React from "react";
import { View } from "react-native";

import type { ChildReportsChartsData } from "@/src/screens/ChildrenScreens/ReportsScreen/buildChildReportsCharts";
import { styles } from "@/src/screens/ParentScreens/ReportsScreen/styles";
import ChildDonutChart from "./ChildDonutChart";
import ChildWeekStory from "./ChildWeekStory";

type Props = {
  charts: ChildReportsChartsData;
};

export default function ChildReportsContent({ charts }: Props) {
  return (
    <View style={[styles.content, { gap: 16 }]}>
      <ChildDonutChart
        title="Today"
        slices={charts.donutSlices}
        centerLabel={charts.donutCenterLabel}
        centerValue={charts.donutCenterValue}
        note={charts.donutNote}
        isLimitReached={charts.isLimitReached}
      />
      <ChildWeekStory weekDays={charts.weekDays} />
    </View>
  );
}
