import React, { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { BarChart, yAxisSides } from "react-native-gifted-charts";

import type { ReportsBarPoint } from "@/src/screens/ParentScreens/ReportsScreen/buildReportsDataset";
import { REPORTS_COLORS } from "@/src/screens/ParentScreens/ReportsScreen/styles";
import ReportsChartCard from "./ReportsChartCard";

type Props = {
  title: string;
  bars: ReportsBarPoint[];
};

const CHART_MAX_HOURS = 8;
const CHART_HOUR_STEP = 2;
const CHART_SECTIONS = CHART_MAX_HOURS / CHART_HOUR_STEP;
const Y_AXIS_LABELS = ["0", "2", "4", "6", "8"];

export default function ReportsUsageChart({ title, bars }: Props) {
  const { width } = useWindowDimensions();

  const isWeekdayChart = bars.length === 7;
  const chartWidth = Math.min(width - 48, 360);
  const barWidth = isWeekdayChart ? 22 : bars.length > 4 ? 28 : 32;
  const spacing = isWeekdayChart ? 10 : bars.length > 4 ? 18 : 22;
  const maxBarValue = Math.max(...bars.map((bar) => bar.value), 0);
  const hasUsage = maxBarValue > 0;

  const chartData = useMemo(
    () =>
      bars.map((bar) => ({
        value: hasUsage ? Math.min(bar.value, CHART_MAX_HOURS) : 0.05,
        label: bar.label,
        frontColor: hasUsage ? REPORTS_COLORS.bar : "#E5E7EB",
        topLabelComponent: () => null,
      })),
    [bars, hasUsage]
  );

  return (
    <ReportsChartCard title={title} icon="chart-bar">
      <BarChart
        data={chartData}
        width={chartWidth}
        height={190}
        barWidth={barWidth}
        spacing={spacing}
        initialSpacing={isWeekdayChart ? 8 : 12}
        endSpacing={isWeekdayChart ? 8 : 12}
        maxValue={CHART_MAX_HOURS}
        stepValue={CHART_HOUR_STEP}
        noOfSections={CHART_SECTIONS}
        yAxisSide={yAxisSides.LEFT}
        yAxisLabelTexts={Y_AXIS_LABELS}
        yAxisLabelWidth={32}
        roundedTop
        roundedBottom={false}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: "#6B7280", fontSize: 12 }}
        xAxisLabelTextStyle={{
          color: "#6B7280",
          fontSize: 13,
          textAlign: "center",
        }}
        isAnimated
        animationDuration={500}
        disablePress
      />
    </ReportsChartCard>
  );
}
