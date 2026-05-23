import React from "react";
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

type YAxisConfig = {
  maxValue: number;
  stepValue: number;
  noOfSections: number;
  labels: string[];
};

const CHART_Y_AXIS: YAxisConfig = {
  maxValue: 8,
  stepValue: 2,
  noOfSections: 4,
  labels: ["0", "2", "4", "6", "8"],
};

const AXIS_TEXT = { color: "#6B7280", fontSize: 12 };
const EMPTY_BAR_HEIGHT = 0.05;
const EMPTY_BAR_COLOR = "#E5E7EB";

function toChartBar(bar: ReportsBarPoint, yMax: number) {
  const hasData = bar.hasData === true && bar.value > 0;

  return {
    value: hasData ? Math.min(bar.value, yMax) : EMPTY_BAR_HEIGHT,
    label: bar.label,
    frontColor: hasData ? REPORTS_COLORS.bar : EMPTY_BAR_COLOR,
    topLabelComponent: () => null,
  };
}

export default function ReportsUsageChart({
  title,
  bars,
  isWeeklyChart = false,
}: Props) {
  const { width } = useWindowDimensions();
  const isDayChart = !isWeeklyChart && bars.length === 7;

  const yAxis = CHART_Y_AXIS;
  const chartData = bars.map((bar) => toChartBar(bar, yAxis.maxValue));

  const barWidth = isDayChart ? 22 : 36;
  const spacing = isDayChart ? 10 : 24;
  const sideGap = isDayChart ? 8 : 16;

  return (
    <ReportsChartCard title={title} icon="chart-bar">
      <BarChart
        data={chartData}
        width={Math.min(width - 48, 360)}
        height={190}
        barWidth={barWidth}
        spacing={spacing}
        initialSpacing={sideGap}
        endSpacing={sideGap}
        maxValue={yAxis.maxValue}
        stepValue={yAxis.stepValue}
        noOfSections={yAxis.noOfSections}
        yAxisSide={yAxisSides.LEFT}
        yAxisLabelTexts={yAxis.labels}
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
        isAnimated
        animationDuration={500}
        disablePress
      />
    </ReportsChartCard>
  );
}
