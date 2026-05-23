import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { BarChart, yAxisSides } from "react-native-gifted-charts";

import type { ReportsBarPoint } from "@/src/screens/ParentScreens/ReportsScreen/buildReportsDataset";
import { REPORTS_COLORS } from "@/src/screens/ParentScreens/ReportsScreen/styles";
import ReportsChartCard from "./ReportsChartCard";

type Props = {
  title: string;
  bars: ReportsBarPoint[];
  isWeeklyChart?: boolean;
};

const CHART_Y_MAX = 8;
const CHART_Y_STEP = 2;
const CHART_Y_SECTIONS = 4;
const CHART_Y_LABELS = ["0", "2", "4", "6", "8"];

const AXIS_TEXT = { color: "#6B7280", fontSize: 12 };

function toChartBar(bar: ReportsBarPoint, index: number) {
  const hasUsage = bar.value > 0;

  return {
    value: hasUsage ? Math.min(bar.value, CHART_Y_MAX) : 0,
    label: bar.label,
    frontColor: hasUsage ? REPORTS_COLORS.bar : REPORTS_COLORS.card,
    topLabelComponent: () => null,
    id: `${bar.label}-${index}`,
  };
}

export default function ReportsUsageChart({
  title,
  bars,
  isWeeklyChart = false,
}: Props) {
  const { width } = useWindowDimensions();
  const isDayChart = !isWeeklyChart && bars.length === 7;
  const chartKey = isWeeklyChart ? "weekly" : "daily";

  const chartData = useMemo(
    () => bars.map((bar, index) => toChartBar(bar, index)),
    [bars]
  );

  const barWidth = isDayChart ? 22 : 36;
  const spacing = isDayChart ? 10 : 24;
  const sideGap = isDayChart ? 8 : 16;

  return (
    <ReportsChartCard title={title} icon="chart-bar">
      <BarChart
        key={chartKey}
        data={chartData}
        width={Math.min(width - 48, 360)}
        height={190}
        barWidth={barWidth}
        spacing={spacing}
        initialSpacing={sideGap}
        endSpacing={sideGap}
        maxValue={CHART_Y_MAX}
        stepValue={CHART_Y_STEP}
        noOfSections={CHART_Y_SECTIONS}
        yAxisSide={yAxisSides.LEFT}
        yAxisLabelTexts={CHART_Y_LABELS}
        yAxisLabelWidth={32}
        roundedTop
        roundedBottom={false}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={AXIS_TEXT}
        xAxisLabelTextStyle={{
          ...AXIS_TEXT,
          fontSize: isWeeklyChart ? 11 : 13,
          textAlign: "center",
        }}
        isAnimated={false}
        disablePress
      />
    </ReportsChartCard>
  );
}
