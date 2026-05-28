import React from "react";
import { View } from "react-native";

import AppText from "@/src/components/AppText/AppText";
import type { ChildDayStatus } from "@/src/screens/ChildrenScreens/ReportsScreen/buildChildReportsCharts";
import { formatChildReportDuration } from "@/src/screens/ChildrenScreens/ReportsScreen/buildChildReportsCharts";
import { childChartStyles } from "./childReportsTheme";

type Props = {
  weekDays: ChildDayStatus[];
};

export default function ChildWeekStory({ weekDays }: Props) {
  return (
    <View style={childChartStyles.card}>
      <AppText weight="bold" style={childChartStyles.title}>
        My Week
      </AppText>

      <View style={childChartStyles.storyList}>
        {weekDays.map((day, index) => (
          <View
            key={`${day.label}-${index}`}
            style={[
              childChartStyles.storyRow,
              day.isToday ? childChartStyles.storyRowToday : null,
              day.isFuture ? childChartStyles.storyRowFuture : null,
            ]}
          >
            <View
              style={[
                childChartStyles.storyStripe,
                { backgroundColor: day.color },
              ]}
            />
            <AppText style={childChartStyles.storyEmoji}>{day.emoji}</AppText>
            <View style={childChartStyles.storyBody}>
              <AppText weight="bold" style={childChartStyles.storyDay}>
                {day.label}
                {day.isToday ? " · Today" : ""}
              </AppText>
              <AppText style={childChartStyles.storyMessage}>{day.message}</AppText>
            </View>
            <AppText
              weight={day.isToday ? "bold" : "regular"}
              style={childChartStyles.storyTime}
            >
              {day.isFuture
                ? "—"
                : formatChildReportDuration(day.usedMinutes)}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
