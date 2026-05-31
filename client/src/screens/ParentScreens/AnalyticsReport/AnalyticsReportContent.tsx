import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "@/src/components/AppText/AppText";
import type {
  ParentAiInsights,
  ParentAnalyticsReport,
} from "@/src/api/parent";
import { formatReportHours } from "./reportUtils";
import { analyticsStyles as styles } from "./styles";

type AnalyticsReportContentProps = {
  report: ParentAnalyticsReport;
  aiInsights?: ParentAiInsights | null;
  isAiLoading?: boolean;
};
type InsightIconName =
  React.ComponentProps<typeof MaterialCommunityIcons>["name"];

function getInsightIcon(type: ParentAiInsights["insights"][number]["type"]): InsightIconName {
  switch (type) {
    case "positive":
      return "check-circle-outline";
    case "warning":
      return "alert-circle-outline";
    case "recommendation":
      return "lightbulb-on-outline";
    case "info":
    default:
      return "information-outline";
  }
}

export default function AnalyticsReportContent({
  report,
  aiInsights,
  isAiLoading,
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
      {report.topApplications?.length ? (
        <>
          <View style={styles.sectionHeaderCard}>
            <View>
              <AppText weight="bold" style={styles.sectionHeaderTitle}>
                Top applications
              </AppText>
              <AppText style={styles.sectionHeaderSubtitle}>
                Based on the latest synced daily and weekly app counters
              </AppText>
            </View>
          </View>

          <View>
            <View style={styles.tableHeader}>
              <AppText weight="bold" style={[styles.tableCell, styles.colApp]}>
                App
              </AppText>
              <AppText weight="bold" style={[styles.tableCell, styles.colTime]}>
                Today
              </AppText>
              <AppText weight="bold" style={[styles.tableCell, styles.colTime]}>
                Week
              </AppText>
            </View>

            {report.topApplications.map((app, index) => (
              <View key={app.packageName || app.name} style={styles.tableRow}>
                <View style={[styles.colApp, styles.appNameCell]}>
                  <View style={styles.appRankBadge}>
                    <AppText weight="bold" style={styles.appRankText}>
                      {index + 1}
                    </AppText>
                  </View>

                  <AppText style={styles.appNameText} numberOfLines={1}>
                    {app.name}
                  </AppText>
                </View>
                <AppText style={[styles.tableCell, styles.colTime]}>
                  {formatReportHours(app.usedTodayMinutes)}
                </AppText>
                <AppText style={[styles.tableCell, styles.colTime]}>
                  {formatReportHours(app.usedWeekMinutes)}
                </AppText>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {isAiLoading ? (
        <View style={styles.smartSection}>
          <View style={styles.smartHeaderRow}>
            <View style={styles.smartIconBadge}>
              <AppText style={styles.smartIcon}>✨</AppText>
            </View>

            <View style={styles.smartHeaderText}>
              <AppText weight="bold" style={styles.smartTitle}>
                Weekly smart insights
              </AppText>
              <AppText style={styles.smartSubtitle}>
                Generating insights from recent activity...
              </AppText>
            </View>
          </View>

          <AppText style={styles.smartSummary}>
            The detailed report is ready. Smart insights will appear here in a moment.
          </AppText>
        </View>
      ) : null}

      {!isAiLoading && aiInsights ? (
        <View style={styles.smartSection}>
          <View style={styles.smartHeaderRow}>
            <View style={styles.smartIconBadge}>
              <AppText style={styles.smartIcon}>✨</AppText>
            </View>

            <View style={styles.smartHeaderText}>
              <AppText weight="bold" style={styles.smartTitle}>
                Weekly smart insights
              </AppText>
              <AppText style={styles.smartSubtitle}>
                Compared with the previous 7 days
              </AppText>
            </View>

            <View style={styles.attentionBadge}>
              <AppText weight="bold" style={styles.attentionText}>
                {aiInsights.riskLevel}
              </AppText>
            </View>
          </View>

          <AppText style={styles.smartSummary}>{aiInsights.summary}</AppText>

          <View style={styles.insightsList}>
            {aiInsights.insights.map((insight, index) => (
              <View
                key={`${insight.title}-${index}`}
                style={[
                  styles.insightCard,
                  insight.type === "positive" && styles.insightPositive,
                  insight.type === "warning" && styles.insightWarning,
                  insight.type === "recommendation" && styles.insightRecommendation,
                  insight.type === "info" && styles.insightInfo,
                ]}
              >
                <View style={styles.insightHeaderRow}>
                  <MaterialCommunityIcons
                    name={getInsightIcon(insight.type)}
                    size={18}
                    color="#374151"
                  />

                  <AppText weight="bold" style={styles.insightTitle}>
                    {insight.title}
                  </AppText>
                </View>

                <AppText style={styles.insightMessage}>{insight.message}</AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </>
  );
}
