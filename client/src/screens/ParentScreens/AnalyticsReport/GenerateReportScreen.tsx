import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

import AppText from "@/src/components/AppText/AppText";
import ChildSelector from "@/src/components/ChildSelector/ChildSelector";
import InfoHint from "@/src/components/InfoHint/InfoHint";
import InlineDatePicker from "@/src/components/InlineDatePicker/InlineDatePicker";
import { setReportsSelectedChildId } from "@/src/redux/slices/reports-slice";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { showErrorToast } from "@/src/utils/appToast";

import {
  defaultReportRange,
  formatPickerDate,
  toJerusalemDateKey,
} from "./reportUtils";
import { analyticsStyles as styles } from "./styles";

export default function GenerateReportScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ childId?: string }>();
  const selectedChildId = useSelector(
    (state: RootState) => state.reports.selectedChildId
  );

  const initialRange = defaultReportRange();
  const [fromDate, setFromDate] = useState(initialRange.from);
  const [toDate, setToDate] = useState(initialRange.to);
  const [pickerTarget, setPickerTarget] = useState<"from" | "to" | null>(null);

  const childId =
    (typeof params.childId === "string" && params.childId.trim()) ||
    selectedChildId ||
    "";

  const onGenerate = () => {
    if (!childId) {
      showErrorToast("Select a child first");
      return;
    }

    const fromKey = toJerusalemDateKey(fromDate);
    const toKey = toJerusalemDateKey(toDate);

    if (fromKey > toKey) {
      showErrorToast("Start date must be before end date");
      return;
    }

    router.push({
      pathname: "/Parent/analyticsReport",
      params: { childId, from: fromKey, to: toKey },
    } as Href);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.paper, styles.paperFill]}>
          <View style={styles.infoBulbRow}>
            <InfoHint
              title="About this report"
              lines={[
                "Choose a date range for the report.",
                "The report uses real screen time synced from the child's device.",
              ]}
            />
          </View>

          {childId ? (
            <ChildSelector
              selectedChildId={childId}
              onSelectChild={(id) => dispatch(setReportsSelectedChildId(id))}
            />
          ) : null}

          <View style={styles.dateRow}>
            <Pressable
              style={styles.dateField}
              onPress={() => setPickerTarget("from")}
            >
              <AppText style={styles.dateLabel}>From</AppText>
              <AppText weight="bold" style={styles.dateValue}>
                {formatPickerDate(fromDate)}
              </AppText>
            </Pressable>

            <Pressable
              style={styles.dateField}
              onPress={() => setPickerTarget("to")}
            >
              <AppText style={styles.dateLabel}>To</AppText>
              <AppText weight="bold" style={styles.dateValue}>
                {formatPickerDate(toDate)}
              </AppText>
            </Pressable>
          </View>

          <Pressable style={styles.generateBtn} onPress={onGenerate}>
            <AppText weight="bold" style={styles.btnText}>
              Generate
            </AppText>
          </Pressable>
        </View>
      </ScrollView>

      <InlineDatePicker
        visible={pickerTarget === "from"}
        value={fromDate}
        maximumDate={toDate}
        onChange={setFromDate}
        onRequestClose={() => setPickerTarget(null)}
        doneLabel="Done"
      />

      <InlineDatePicker
        visible={pickerTarget === "to"}
        value={toDate}
        minimumDate={fromDate}
        maximumDate={new Date()}
        onChange={setToDate}
        onRequestClose={() => setPickerTarget(null)}
        doneLabel="Done"
      />
    </View>
  );
}
