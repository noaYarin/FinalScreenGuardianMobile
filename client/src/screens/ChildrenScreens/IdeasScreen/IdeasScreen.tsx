import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import ScreenLayout from "@/src/layouts/ScreenLayout/ScreenLayout";
import AppText from "@/src/components/AppText/AppText";
import { styles } from "./styles";
import { CHILD_ACTIVITIES, POPULAR_ACTIVITIES } from "@/data/childActivities";
import { CHILD_INTERESTS_BY_KEY } from "@/data/childInterests";
import { getLocalChildInterestKeys } from "@/src/services/childInterestsStorage";
import {
  getLastIdeaIdByInterest,
  setLastIdeaIdByInterest,
} from "@/src/services/childIdeasStorage";

type ActivityIdea = {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  accentColor?: string;
  softColor?: string;
};

export default function IdeasScreen() {
  const s = styles as any;
  const [loading, setLoading] = useState(true);
  const [ideas, setIdeas] = useState<ActivityIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentIdeaIdByInterest, setCurrentIdeaIdByInterest] = useState<Record<string, string>>({});

  const pickOne = <T,>(items: T[]) =>
    items.length > 0 ? items[Math.floor(Math.random() * items.length)] : undefined;

  const uniqSelectedKeys = (keys: string[]) =>
    Array.from(new Set((Array.isArray(keys) ? keys : []).map((k) => String(k || "").trim()).filter(Boolean))).slice(
      0,
      5
    );

  const toIdea = (interestKey: string, activity: (typeof CHILD_ACTIVITIES)[number]): ActivityIdea => {
    const meta = CHILD_INTERESTS_BY_KEY[interestKey];
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      tags: [interestKey],
      icon: meta?.icon ?? activity.icon,
      accentColor: meta?.color ?? activity.accentColor,
      softColor: meta?.softColor ?? activity.softColor,
    };
  };

  const getCandidatesForInterest = (interestKey: string) => {
    const preferred = CHILD_ACTIVITIES.filter(
      (a) => a.interestKeys.length === 1 && a.interestKeys[0] === interestKey
    );
    if (preferred.length > 0) return preferred;
    return CHILD_ACTIVITIES.filter((a) => a.interestKeys.includes(interestKey));
  };

  const buildIdeas = (selectedInterestKeys: string[], ideaIdByInterest: Record<string, string>) => {
    const uniqueSelectedKeys = uniqSelectedKeys(selectedInterestKeys);

    // No interests yet → show 5 popular ideas.
    if (uniqueSelectedKeys.length === 0) {
      return POPULAR_ACTIVITIES.slice(0, 5).map((activity) => ({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          tags: activity.interestKeys,
          icon: activity.icon,
          accentColor: activity.accentColor,
          softColor: activity.softColor,
      }));
    }

    const picked: ActivityIdea[] = [];
    const usedActivityIds = new Set<string>();
    const nextMap: Record<string, string> = { ...(ideaIdByInterest || {}) };

    for (const interestKey of uniqueSelectedKeys) {
      const candidates = getCandidatesForInterest(interestKey).filter((a) => !usedActivityIds.has(a.id));

      const currentId = nextMap[interestKey];
      const existing = currentId ? candidates.find((a) => a.id === currentId) : undefined;

      const choice = existing ?? candidates[0] ?? getCandidatesForInterest(interestKey)[0];
      if (!choice) continue;

      nextMap[interestKey] = choice.id;
      picked.push(toIdea(interestKey, choice));
      usedActivityIds.add(choice.id);
    }

    // Fill remaining slots up to 5 with defaults (popular activities), so:
    // 1 selected interest => 1 idea for it + 4 defaults.
    if (picked.length < 5) {
      const defaultsPool = POPULAR_ACTIVITIES.filter((a) => !usedActivityIds.has(a.id));
      for (const activity of defaultsPool) {
        if (picked.length >= 5) break;
        picked.push({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          tags: ["DEFAULT"],
          icon: activity.icon,
          accentColor: activity.accentColor,
          softColor: activity.softColor,
        });
        usedActivityIds.add(activity.id);
      }
    }

    return picked.slice(0, 5);
  };

  const handleShuffle = async () => {
    const keys = uniqSelectedKeys(selectedKeys);
    if (keys.length === 0) return;

    const nextMap: Record<string, string> = { ...(currentIdeaIdByInterest || {}) };

    for (const interestKey of keys) {
      const candidates = getCandidatesForInterest(interestKey);
      if (candidates.length === 0) continue;
      if (candidates.length === 1) {
        nextMap[interestKey] = candidates[0].id;
        continue;
      }

      const currentId = nextMap[interestKey];
      const idx = currentId ? candidates.findIndex((a) => a.id === currentId) : -1;
      const start = idx >= 0 ? (idx + 1) % candidates.length : 0;
      nextMap[interestKey] = candidates[start].id;
    }

    setCurrentIdeaIdByInterest(nextMap);
    setIdeas(buildIdeas(selectedKeys, nextMap));
    await setLastIdeaIdByInterest(nextMap);
  };

  const load = React.useCallback(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const rawKeys = await getLocalChildInterestKeys();
        if (cancelled) return;

        const cleanedKeys = Array.isArray(rawKeys) ? rawKeys.map(String) : [];
        setSelectedKeys(cleanedKeys);

        const storedMap = await getLastIdeaIdByInterest();
        if (cancelled) return;

        setCurrentIdeaIdByInterest(storedMap || {});
        const nextIdeas = buildIdeas(cleanedKeys, storedMap || {});
        setIdeas(nextIdeas);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Could not load ideas");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // refresh after returning from Interests screen
      return load();
    }, [])
  );

  const selectedInterestsText = useMemo(() => {
    if (!selectedKeys || selectedKeys.length === 0) return "No interest tags yet";
    const labels = selectedKeys
      .slice(0, 4)
      .map((k) => CHILD_INTERESTS_BY_KEY[k]?.label || k);
    return labels.join(", ") + (selectedKeys.length > 4 ? "..." : "");
  }, [selectedKeys]);

  return (
    <ScreenLayout scrollable={false}>
      <LinearGradient colors={["#E6F0FF", "#F3F7FF"]} style={s.bg}>
        <View style={s.content}>
          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.topCard}>
              <View style={s.headerTitleRow}>
                <View style={s.headerIconBadge}>
                  <MaterialCommunityIcons
                    name="soccer"
                    size={18}
                    color="#7C3AED"
                  />
                </View>
                <AppText weight="extraBold" style={s.headerTitle}>
                  Screen-Free Activities
                </AppText>
              </View>
              <AppText weight="bold" style={s.headerSubtitle}>
                Ideas tailored for you
              </AppText>

              <View style={s.selectedHintRow}>
                <MaterialCommunityIcons name="tag-outline" size={18} color="#1E40AF" />
                <AppText weight="bold" style={s.selectedHintText}>
                  {selectedInterestsText}
                </AppText>
              </View>
            </View>

            <View style={s.list}>
              {loading ? (
                <View style={s.loadingRow}>
                  <ActivityIndicator color="#1E40AF" />
                  <AppText weight="bold" style={s.loadingText}>
                    Loading ideas...
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
                ideas.map((idea) => (
                  <View key={idea.id} style={s.ideaCard}>
                    <View style={s.ideaTextSide}>
                      <AppText weight="extraBold" style={s.ideaTitle}>
                        {idea.title}
                      </AppText>
                      {idea.description ? (
                        <AppText weight="bold" style={s.ideaDesc}>
                          {idea.description}
                        </AppText>
                      ) : null}
                    </View>

                    <View
                      style={[
                        s.ideaIconWrap,
                        idea.softColor
                          ? { backgroundColor: idea.softColor, borderColor: idea.accentColor }
                          : null,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={idea.icon ?? "lightbulb-on-outline"}
                        size={22}
                        color={idea.accentColor || "#1E40AF"}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          {selectedKeys.length > 0 ? (
            <Pressable
              onPress={handleShuffle}
              accessibilityRole="button"
              accessibilityLabel="Shuffle ideas"
              style={({ pressed }) => [s.shuffleButton, pressed && s.primaryPressed]}
            >
              <View style={s.primaryButtonInner}>
                <AppText weight="extraBold" style={s.shuffleButtonText}>
                  Shuffle
                </AppText>
                <MaterialCommunityIcons name="shuffle-variant" size={18} color="#064E3B" />
              </View>
            </Pressable>
          ) : null}

          <Pressable
            onPress={() => router.push("/Child/interests" as Href)}
            accessibilityRole="button"
            accessibilityLabel="Add interest tags"
            style={({ pressed }) => [s.primaryButton, pressed && s.primaryPressed]}
          >
            <View style={s.primaryButtonInner}>
              <AppText weight="extraBold" style={s.primaryButtonText}>
                Add Interest Tags
              </AppText>
              <MaterialCommunityIcons name="tag" size={18} color="#064E3B" />
            </View>
          </Pressable>
        </View>
      </LinearGradient>
    </ScreenLayout>
  );
}

