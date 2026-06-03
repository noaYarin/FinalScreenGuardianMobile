import React from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "@/src/components/AppText/AppText";
import type {
  ParentAiInsights,
  ParentAnalyticsReport,
  ParentAnalyticsTopApplication
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

function getAttentionLabel(riskLevel?: string): string {
  switch (riskLevel) {
    case "HIGH":
      return "Needs attention";
    case "MEDIUM":
      return "Worth checking";
    case "LOW":
      return "Low concern";
    default:
      return "Not available";
  }
}

function getSelectedPeriodAppMinutes(
  app: ParentAnalyticsTopApplication
): number {
  return Number(app.usedRangeMinutes ?? 0);
}

export default function AnalyticsReportContent({
  report,
  aiInsights,
  isAiLoading,
}: AnalyticsReportContentProps) {
  return (
    <>
      <AppText style={styles.brand}>Screen Guardian</AppText>

      <AppText weight="extraBold" style={styles.title}>
        Smart screen-time report
      </AppText>
      <AppText style={styles.meta}>
        For: {report.childName}
        {"\n"}Period: {report.fromLabel} – {report.toLabel}
        {"\n"}Generated: {report.generatedAtLabel}
      </AppText>

      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderCard}>
          <View>
            <AppText weight="extraBold" style={styles.sectionHeaderTitle}>
              Selected period summary
            </AppText>
            <AppText style={styles.sectionHeaderSubtitle}>
              Based on the dates selected by the parent
            </AppText>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <AppText style={styles.summaryText}>
            {report.executiveSummary}
          </AppText>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <View style={[styles.sectionHeaderCard, styles.metricsHeaderCard]}>
          <View>
            <AppText weight="extraBold" style={styles.sectionHeaderTitle}>
              Report highlights
            </AppText>
            <AppText style={styles.sectionHeaderSubtitle}>
              Key numbers from the selected period
            </AppText>
          </View>
        </View>

        <View style={styles.metricsContentCard}>
          <View style={styles.highlightGrid}>
            <View style={styles.highlightCard}>
              <AppText style={styles.highlightLabel}>Total screen time</AppText>
              <AppText weight="extraBold" style={styles.highlightValue}>
                {formatReportHours(report.indicators.totalMinutes)}
              </AppText>
            </View>

            <View style={styles.highlightCard}>
              <AppText style={styles.highlightLabel}>Daily average</AppText>
              <AppText weight="extraBold" style={styles.highlightValue}>
                {formatReportHours(report.indicators.dailyAverageMinutes)}
              </AppText>
            </View>

            <View style={styles.highlightCard}>
              <AppText style={styles.highlightLabel}>Extension requests</AppText>
              <AppText weight="extraBold" style={styles.highlightValue}>
                {report.indicators.extensionRequestsCount}
              </AppText>
            </View>

            <View style={styles.highlightCard}>
              <AppText style={styles.highlightLabel}>Tasks approved</AppText>
              <AppText weight="extraBold" style={styles.highlightValue}>
                {report.indicators.tasksApprovedCount}
              </AppText>
            </View>

            <View style={styles.highlightCard}>
              <AppText style={styles.highlightLabel}>Limit exceedances</AppText>
              <AppText weight="extraBold" style={styles.highlightValue}>
                {report.indicators.limitExceededDays}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {report.topApplications?.length ? (
        <View style={styles.sectionBlock}>
          <View style={[styles.sectionHeaderCard, styles.appsHeaderCard]}>
            <View>
              <AppText weight="extraBold" style={styles.sectionHeaderTitle}>
                Top applications in selected period
              </AppText>
              <AppText style={styles.sectionHeaderSubtitle}>
                Apps with the highest recorded usage between {report.fromLabel} and{" "}
                {report.toLabel}
              </AppText>
            </View>
          </View>

          <View style={styles.appsContentCard}>
            <View style={styles.tableHeader}>
              <AppText weight="extraBold" style={[styles.tableCell, styles.colApp]}>
                App
              </AppText>
              <AppText weight="extraBold" style={[styles.tableCell, styles.colTime]}>
                Usage
              </AppText>
            </View>

            {report.topApplications.map((app, index) => (
              <View key={app.packageName || app.name} style={styles.tableRow}>
                <View style={[styles.colApp, styles.appNameCell]}>
                  <View style={styles.appRankBadge}>
                    <AppText weight="extraBold" style={styles.appRankText}>
                      {index + 1}
                    </AppText>
                  </View>

                  <AppText style={styles.appNameText} numberOfLines={1}>
                    {app.name}
                  </AppText>
                </View>

                <AppText style={[styles.tableCell, styles.colTime]}>
                  {formatReportHours(getSelectedPeriodAppMinutes(app))}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.sectionDivider} />

      {isAiLoading ? (
        <View style={styles.aiSection}>
          <View style={[styles.sectionHeaderCard, styles.aiHeaderCard]}>
            <View style={styles.smartHeaderRow}>
              <View style={styles.smartIconBadge}>
                <AppText style={styles.smartIcon}>✨</AppText>
              </View>

              <View style={styles.smartHeaderText}>
                <AppText weight="extraBold" style={styles.sectionHeaderTitle}>
                  AI insights
                </AppText>
                <AppText style={styles.sectionHeaderSubtitle}>
                  Based on the last 7 days compared with the previous 7 days
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.aiContentCard}>
            <AppText style={styles.smartSummary}>
              Generating AI insights from recent activity...
            </AppText>
          </View>
        </View>
      ) : null}

      {!isAiLoading && aiInsights ? (
        <View style={styles.aiSection}>
          <View style={[styles.sectionHeaderCard, styles.aiHeaderCard]}>
            <View style={styles.smartHeaderRow}>
              <View style={styles.smartIconBadge}>
                <AppText style={styles.smartIcon}>✨</AppText>
              </View>

              <View style={styles.smartHeaderText}>
                <AppText weight="extraBold" style={styles.sectionHeaderTitle}>
                  AI insights
                </AppText>
                <AppText style={styles.sectionHeaderSubtitle}>
                  Based on the last 7 days compared with the previous 7 days
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.aiContentCard}>
            <View style={styles.smartSummaryRow}>
              <AppText weight="bold" style={styles.smartSummaryTitle}>
                Overview
              </AppText>
              <View style={styles.attentionBadge}>
                <AppText weight="extraBold" style={styles.attentionText}>
                  {getAttentionLabel(aiInsights.riskLevel)}
                </AppText>
              </View>
            </View>

            <AppText style={styles.smartSummary}>
              {aiInsights.summary}
            </AppText>

            <View style={styles.smartSummaryRow}>
              <AppText weight="extraBold" style={styles.smartSummaryRow}>
                Smart insights
              </AppText>

              <View style={styles.insightsList}>
                {aiInsights.insights.map((insight, index) => (
                  <View
                    key={`${insight.title}-${index}`}
                    style={[
                      styles.insightCard,
                      insight.type === "positive" && styles.insightPositive,
                      insight.type === "warning" && styles.insightWarning,
                      insight.type === "recommendation" &&
                      styles.insightRecommendation,
                      insight.type === "info" && styles.insightInfo,
                    ]}
                  >
                    <View style={styles.insightHeaderRow}>
                      <MaterialCommunityIcons
                        name={getInsightIcon(insight.type)}
                        size={18}
                        color="#374151"
                      />

                      <AppText weight="extraBold" style={styles.insightTitle}>
                        {insight.title}
                      </AppText>
                    </View>

                    <AppText style={styles.insightMessage}>
                      {insight.message}
                    </AppText>
                  </View>
                ))}
                {aiInsights.recommendedActions?.length ? (
                  <View style={styles.actionsList}>
                    <AppText weight="extraBold" style={styles.actionsTitle}>
                      Recommended actions
                    </AppText>

                    {aiInsights.recommendedActions.map((action, index) => (
                      <View key={`${action.label}-${index}`} style={styles.actionCard}>
                        <MaterialCommunityIcons
                          name="arrow-right-circle-outline"
                          size={18}
                          color="#4F46E5"
                        />

                        <AppText style={styles.actionText}>
                          {action.label}
                        </AppText>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}
