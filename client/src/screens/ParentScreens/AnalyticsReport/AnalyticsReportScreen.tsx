import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import AppText from "@/src/components/AppText/AppText";
import {
  getParentAnalyticsReport,
  type ParentAnalyticsReport,
  getParentAiInsights,
  type ParentAiInsights,
} from "@/src/api/parent";
import { showErrorToast } from "@/src/utils/appToast";

import AnalyticsReportContent from "./AnalyticsReportContent";
import { buildAnalyticsReportHtml } from "./buildReportHtml";
import { analyticsStyles as styles } from "./styles";

export default function AnalyticsReportScreen() {
  const params = useLocalSearchParams<{
    childId?: string;
    from?: string;
    to?: string;
  }>();

  const [report, setReport] = useState<ParentAnalyticsReport | null>(null);
  const [aiInsights, setAiInsights] = useState<ParentAiInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const childId = typeof params.childId === "string" ? params.childId : "";
  const fromKey = typeof params.from === "string" ? params.from : "";
  const toKey = typeof params.to === "string" ? params.to : "";
  const loadReport = useCallback(async () => {
    if (!childId || !fromKey || !toKey) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setAiInsights(null);

    try {
      const reportData = await getParentAnalyticsReport(childId, fromKey, toKey);
      setReport(reportData);
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : "Could not generate report"
      );
      setReport(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    setIsAiLoading(true);

    try {
      const aiData = await getParentAiInsights(childId);
      setAiInsights(aiData);
    } catch {
      setAiInsights(null);
    } finally {
      setIsAiLoading(false);
    }
  }, [childId, fromKey, toKey]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const reportHtml = useMemo(
    () => (report?.indicators ? buildAnalyticsReportHtml(report) : ""),
    [report]
  );

  const onSharePdf = async () => {
    if (!report || !reportHtml) {
      return;
    }

    setIsExporting(true);

    try {
      const { uri } = await Print.printToFileAsync({ html: reportHtml });
      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        showErrorToast("Sharing is not available on this device");
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `${report.childName} — usage report`,
        UTI: "com.adobe.pdf",
      });
    } catch {
      showErrorToast("Could not export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.screen, { justifyContent: "center", padding: 24 }]}>
        <AppText>Could not load report</AppText>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, styles.scrollWithFooter]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paper}>
          <AnalyticsReportContent
            report={report}
            aiInsights={aiInsights}
            isAiLoading={isAiLoading}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primaryBtn, isExporting && styles.primaryBtnDisabled]}
          onPress={() => void onSharePdf()}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <AppText weight="bold" style={styles.btnText}>
              Export as PDF
            </AppText>
          )}
        </Pressable>
      </View>
    </View>
  );
}
