import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Pressable,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import ScreenLayout from "@/src/layouts/ScreenLayout/ScreenLayout";
import AppText from "@/src/components/AppText/AppText";
import { updateMyInterests } from "@/src/api/child";
import type { RootState } from "@/src/redux/store/types";
import type { AppDispatch } from "@/src/redux/store/types";
import { fetchCurrentChildProfileThunk } from "@/src/redux/thunks/childrenThunks";
import { styles } from "./styles";
import { CHILD_INTERESTS, CHILD_INTERESTS_BY_KEY } from "@/data/childInterests";
import { getLocalChildInterestKeys, setLocalChildInterestKeys } from "@/src/services/childInterestsStorage";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/appToast";

type InterestOption = {
  key: string;
  label: string;
};

const EMPTY_INTERESTS: string[] = [];
//Child can select up to 5 interests
const MAX_SELECTED = 5;

function uniqStringArray(list: string[]) {
  const uniqueValues = new Set<string>();
  for (const rawValue of list) {
    const trimmedValue = String(rawValue || "").trim();
    if (trimmedValue) uniqueValues.add(trimmedValue);
  }
  return Array.from(uniqueValues);
}

export default function InterestsScreen() {
  const s = styles as any;
  const dispatch = useDispatch<AppDispatch>();
  const { width } = useWindowDimensions();
  const isSmall = width < 380;
  const childToken = useSelector((s: RootState) => s.auth.childToken);

  const existingInterests = useSelector((interestsSlice: RootState) => {
    const activeChildId = interestsSlice.auth.activeChildId;
    const list = Array.isArray(interestsSlice.children.childrenList) ? interestsSlice.children.childrenList : [];
    const child = list.find((c: any) => String(c._id) === String(activeChildId));
    return Array.isArray(child?.interests) ? child.interests : EMPTY_INTERESTS;
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<InterestOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!childToken) return;
    if (!existingInterests || existingInterests.length === 0) return;
    setSelected(uniqStringArray(existingInterests));
  }, [childToken, existingInterests]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      setOptions(CHILD_INTERESTS.map(({ key, label }) => ({ key, label })));
      try {
        const stored = await getLocalChildInterestKeys();
        if (!mounted) return;
        if (stored.length > 0) {
          setSelected(uniqStringArray(stored));
        }
      } catch {
        showErrorToast("Could not load interests. Please try again.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedLabels = useMemo(() => {
    const labelByKey = new Map(options.map((option) => [option.key, option.label]));
    return selected.map((selectedKey) => labelByKey.get(selectedKey) || selectedKey);
  }, [selected, options]);

  //Toggle interest selection
  const toggle = (key: string) => {
    setSelected((prev) => {
      const has = prev.includes(key);
      if (has) return prev.filter((x) => x !== key);
      if (prev.length >= MAX_SELECTED) {
        showInfoToast("You can choose up to 5 interests.", "Limit reached");
        return prev;
      }
      return [...prev, key];
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await setLocalChildInterestKeys(selected);
      if (childToken) {
        await updateMyInterests(selected);
        await dispatch(fetchCurrentChildProfileThunk()).unwrap();
      }
      showSuccessToast("Your interests were saved!", "Saved");
      router.back();
    } catch (e: any) {
      const msg = e?.message || "Could not save interests";
      router.back();
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout scrollable={false}>
      <LinearGradient colors={["#E6F0FF", "#F3F7FF"]} style={s.bg}>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.content, { paddingBottom: 26 }]}>
            <View style={s.topCard}>
              <AppText weight="extraBold" style={s.title}>
                Interests
              </AppText>
              <AppText weight="extraBold" style={s.question}>
                What do you like to do?
              </AppText>
              <AppText weight="bold" style={s.subText}>
                Select up to 5 interests
              </AppText>
            </View>

            <View style={s.bodyCard}>
              {loading ? (
                <View style={s.loadingRow}>
                  <ActivityIndicator color="#1E40AF" />
                  <AppText weight="bold" style={s.loadingText}>
                    Loading interests...
                  </AppText>
                </View>
              ) : error ? (
                <View style={s.errorBox}>
                  <AppText weight="extraBold" style={s.errorTitle}>
                    Oops
                  </AppText>
                  <AppText weight="bold" style={s.errorText}>
                    {error}
                  </AppText>
                </View>
              ) : (
                <View style={s.chipsWrap}>
                  {options.map((opt) => {
                    const isOn = selected.includes(opt.key);
                    const meta = CHILD_INTERESTS_BY_KEY[opt.key];
                    const chipSoft = meta?.softColor || "#F3F7FF";
                    const chipAccent = meta?.color || "#2563EB";
                    const iconName = meta?.icon || "tag-outline";
                    const isAtLimit = selected.length >= MAX_SELECTED && !isOn;
                    return (
                      <Pressable
                        key={opt.key}
                        onPress={() => toggle(opt.key)}
                        accessibilityRole="button"
                        accessibilityLabel={opt.label}
                        style={({ pressed }) => [
                          s.chip,
                          isOn ? s.chipOn : s.chipOff,
                          !isOn ? { backgroundColor: chipSoft, borderColor: chipAccent } : null,
                          pressed && s.chipPressed,
                          isSmall && s.chipSmall,
                          isAtLimit ? s.chipDisabled : null,
                        ]}
                      >
                        <View style={[s.chipInner, I18nManager.isRTL ? s.chipInnerRtl : s.chipInnerLtr]}>
                          <View
                            style={[
                              s.chipIconBadge,
                              { backgroundColor: isOn ? "rgba(255,255,255,0.22)" : "#FFFFFF" },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={iconName as any}
                              size={16}
                              color={isOn ? "#FFFFFF" : chipAccent}
                            />
                          </View>

                          <AppText
                            weight={isOn ? "extraBold" : "bold"}
                            style={[
                              s.chipText,
                              isOn ? s.chipTextOn : s.chipTextOff,
                            ]}
                            numberOfLines={2}
                          >
                            {opt.label}
                          </AppText>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={s.selectedBox}>
              <AppText weight="extraBold" style={s.selectedTitle}>
                Selected: {selectedLabels.length}/{MAX_SELECTED}
              </AppText>

              {selectedLabels.length === 0 ? (
                <AppText weight="bold" style={s.selectedEmpty}>
                  Choose at least one interest
                </AppText>
              ) : (
                <View style={s.selectedTagsRow}>
                  {selectedLabels.map((label) => (
                    <View key={label} style={s.selectedTag}>
                      <AppText weight="extraBold" style={s.selectedTagText}>
                        {label}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <Pressable
              onPress={handleSave}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Save interests"
              style={({ pressed }) => [
                s.saveButton,
                pressed && !saving ? s.savePressed : null,
                saving ? s.saveDisabled : null,
              ]}
            >
              <View style={s.saveInner}>
                {saving ? <ActivityIndicator color="#FFFFFF" /> : null}
                <AppText weight="extraBold" style={s.saveText}>
                  Save
                </AppText>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </ScreenLayout>
  );
}

