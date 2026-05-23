import React from "react";
import { View } from "react-native";

import type { ReportsTimeRange } from "@/src/redux/slices/reports-slice";
import type { ReportsDataset } from "@/src/screens/ParentScreens/ReportsScreen/buildReportsDataset";
import { styles } from "@/src/screens/ParentScreens/ReportsScreen/styles";
import ReportsMetricRow from "./ReportsMetricRow";
import ReportsTimeTabs from "./ReportsTimeTabs";
import ReportsUsageChart from "./ReportsUsageChart";

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

type Props = {
  dataset: ReportsDataset;
  selectedTimeRange: ReportsTimeRange;
  onSelectTimeRange: (range: ReportsTimeRange) => void;
  topSlot?: React.ReactNode;
};

export default function ReportsContent({
  dataset,
  selectedTimeRange,
  onSelectTimeRange,
  topSlot,
}: Props) {
  return (
    <View style={styles.content}>
      {topSlot}

      <ReportsTimeTabs
        selectedTimeRange={selectedTimeRange}
        onSelectTimeRange={onSelectTimeRange}
      />

      <ReportsUsageChart
        title={dataset.chartTitle}
        bars={dataset.bars}
        isWeeklyChart={dataset.isWeeklyChart}
      />

      <ReportsMetricRow
        label={dataset.isWeeklyChart ? "Weekly average" : "Daily average"}
        value={formatDuration(dataset.metrics.dailyAverageMinutes)}
      />
      <ReportsMetricRow
        label={dataset.isWeeklyChart ? "Monthly total" : "Weekly total"}
        value={formatDuration(dataset.metrics.weeklyTotalMinutes)}
      />
      <ReportsMetricRow label="Most popular app" value={dataset.metrics.topApp} />
    </View>
  );
}
