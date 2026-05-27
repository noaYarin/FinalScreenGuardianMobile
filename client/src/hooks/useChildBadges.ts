import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { apiGetChildBadges, type ChildGoal } from "@/src/api/badge";

export function useChildBadges() {
  const [badgeList, setBadgeList] = useState<ChildGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadProgress = useCallback(async () => {
    setIsLoading(true);
    setError(false);

    try {
      const data = await apiGetChildBadges();
      setBadgeList(data.badges ?? []);
    } catch {
      setBadgeList([]);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProgress();
    }, [loadProgress])
  );

  return { badgeList, isLoading, error };
}
