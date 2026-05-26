import React from "react";
import { View } from "react-native";

import AppText from "@/src/components/AppText/AppText";
import type { ParentAnalyticsReport } from "@/src/api/parent";

import { formatReportHours } from "./reportUtils";
import { analyticsStyles as styles } from "./styles";

type AnalyticsReportContentProps = {
  report: ParentAnalyticsReport;
};

export default function AnalyticsReportContent({
  report,
}: AnalyticsReportContentProps) {
  return (
    <>
      <AppText style={styles.brand}>Screen Guardian</AppText>
      <AppText style={styles.meta}>
        For: {report.childName}
        {"\n"}Period: {report.fromLabel} – {report.toLabel}
        {"\n"}Generated: {report.generatedAtLabel}
      </AppText>

      <AppText weight="bold" style={styles.sectionTitle}>
        Executive summary
      </AppText>
      <AppText style={styles.paragraph}>{report.executiveSummary}</AppText>

      <AppText weight="bold" style={styles.sectionTitle}>
        Key metrics
      </AppText>
      <View style={styles.indicatorGrid}>
        <View style={styles.indicatorCard}>
          <AppText style={styles.indicatorLabel}>Total screen time</AppText>
          <AppText weight="bold" style={styles.indicatorValue}>
            {formatReportHours(report.indicators.totalMinutes)}
          </AppText>
        </View>
        <View style={styles.indicatorCard}>
          <AppText style={styles.indicatorLabel}>Daily average</AppText>
          <AppText weight="bold" style={styles.indicatorValue}>
            {formatReportHours(report.indicators.dailyAverageMinutes)}
          </AppText>
        </View>
        <View style={styles.indicatorCard}>
          <AppText style={styles.indicatorLabel}>Limit exceedances</AppText>
          <AppText weight="bold" style={styles.indicatorValue}>
            {report.indicators.limitExceededDays}
          </AppText>
        </View>
        <View style={styles.indicatorCard}>
          <AppText style={styles.indicatorLabel}>Tasks approved</AppText>
          <AppText weight="bold" style={styles.indicatorValue}>
            {report.indicators.tasksApprovedCount}
          </AppText>
        </View>
      </View>
    </>
  );
}
