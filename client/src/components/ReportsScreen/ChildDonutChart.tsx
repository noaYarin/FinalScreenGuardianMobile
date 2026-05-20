import React, { useMemo } from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

import AppText from "@/src/components/AppText/AppText";
import type { ChildDonutSlice } from "@/src/screens/ChildrenScreens/ReportsScreen/buildChildReportsCharts";
import { childChartStyles } from "./childReportsTheme";

type Props = {
  title: string;
  slices: ChildDonutSlice[];
  centerLabel: string;
  centerValue: string;
  note: string | null;
  isLimitReached: boolean;
};

export default function ChildDonutChart({
  title,
  slices,
  centerLabel,
  centerValue,
  note,
  isLimitReached,
}: Props) {
  const chartData = useMemo(
    () => slices.map((slice) => ({ value: slice.value, color: slice.color })),
    [slices]
  );

  return (
    <View style={childChartStyles.card}>
      <AppText weight="bold" style={childChartStyles.title}>
        {title}
      </AppText>

      <View style={childChartStyles.pieWrap}>
        <PieChart
          data={chartData}
          radius={96}
          innerRadius={54}
          donut
          innerCircleColor="#FFFFFF"
          strokeColor="#FFFFFF"
          strokeWidth={3}
          showText={false}
          isAnimated
          animationDuration={500}
          centerLabelComponent={() => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <AppText style={childChartStyles.centerLabel}>{centerLabel}</AppText>
              <AppText
                weight="bold"
                style={[
                  childChartStyles.centerValue,
                  isLimitReached ? childChartStyles.centerValueOver : null,
                ]}
              >
                {centerValue}
              </AppText>
            </View>
          )}
        />
      </View>

      <View style={childChartStyles.legendGrid}>
        {slices.map((slice, index) => (
          <View key={`${slice.label}-${index}`} style={childChartStyles.legendChip}>
            <View
              style={[
                childChartStyles.legendDot,
                { backgroundColor: slice.color },
              ]}
            />
            <AppText style={childChartStyles.legendChipText}>{slice.label}</AppText>
          </View>
        ))}
      </View>

      {note ? (
        <AppText
          style={[
            childChartStyles.donutNote,
            isLimitReached ? childChartStyles.donutNoteOver : null,
          ]}
        >
          {note}
        </AppText>
      ) : null}
    </View>
  );
}
