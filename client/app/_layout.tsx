import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { Href, Stack, useRouter, useSegments } from "expo-router";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import { showInfoToast } from "@/src/utils/appToast";
import { RootSiblingParent } from "react-native-root-siblings";
import { registerFcmNotificationTapHandlers } from "@/src/notifications/fcmNavigation";
import { shouldBlockDefaultRedirect } from "@/src/notifications/fcmNavigation";
import { useAndroidPostNotificationsPermission } from "@/src/hooks/useAndroidPostNotificationsPermission";

import store from "../src/redux/store";
import { COLORS } from "@/constants/theme";
import Initializer from "../src/components/Initializer";
import {
  isAchievementUnlockedNotification,
  showToastFromSocketNotification,
} from "@/src/utils/socketNotificationToast";
import { connectSocket, onEvent, disconnectSocket } from "@/src/services/socket";
import {
  LOCATION_LIVE_UPDATE,
  FORCE_CHILD_LOGOUT,
  NOTIFICATION_CREATED,
  DEVICE_STATUS_UPDATED,
} from "@/src/constants/socketEvents";
import {
  clearAllDevices,
  updateDeviceFromSocket,
  updateDeviceStatusFromSocket,
} from "@/src/redux/slices/device-slice";

import { logoutChildReducer } from "@/src/redux/slices/auth-slice";
import { removeChildToken } from "@/src/services/authStorage";
import {
  clearChildrenList, updateChildCoins,
} from "@/src/redux/slices/children-slice";
import { addNotificationFromSocket } from "@/src/redux/slices/notification-slice";
import { updateChildSummaryFromSocket } from "@/src/redux/slices/parentHome-slice";
import { bumpPendingRequestsRefreshKey } from "@/src/redux/slices/requests-slice";
import { useParentFcmTokenSync } from "@/src/hooks/useParentFcmTokenSync";
import AchievementUnlockedModal from "@/src/components/AchievementUnlockedModal/AchievementUnlockedModal";
import type { UnlockedAchievementResponse } from "@/src/api/achievements";
import {
  getChildTasksThunk,
  getParentTasksThunk,
} from "@/src/redux/thunks/tasksThunks";
import type { AppDispatch } from "@/src/redux/store/types";
import {
  getChildRewardsThunk,
  getParentRewardsThunk,
} from "@/src/redux/thunks/rewardsThunks";

function AppStack() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments() as string[];
  useAndroidPostNotificationsPermission();
  const [achievementPopup, setAchievementPopup] =
    useState<UnlockedAchievementResponse | null>(null);

  const [achievementQueue, setAchievementQueue] = useState<
    UnlockedAchievementResponse[]
  >([]);
  const { token, childToken, parentId, activeChildId } = useSelector(
    (state: any) => state.auth
  );

  useParentFcmTokenSync(token, parentId);
  const myCurrentDeviceId = useSelector((state: any) => state.auth.deviceId);

  useEffect(() => {
    const unsubscribe = registerFcmNotificationTapHandlers(router);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!childToken || !activeChildId) return;

    connectSocket(
      String(activeChildId),
      "child",
      parentId ? { parentId: String(parentId) } : undefined
    );

    const unsubscribeForceLogout = onEvent(
      FORCE_CHILD_LOGOUT,
      async (data: any) => {
        const targetDeviceId = data?.deviceId;

        if (targetDeviceId && targetDeviceId !== myCurrentDeviceId) {
          return;
        }

        showInfoToast(
          "The device has been disconnected by the parent",
          "System message"
        );

        dispatch(logoutChildReducer());
        dispatch(clearAllDevices());
        dispatch(clearChildrenList());

        await removeChildToken();
        disconnectSocket();
        router.replace("/" as Href);
      }
    );
    const unsubscribeNotifications = onEvent(
      NOTIFICATION_CREATED,
      (data: any) => {
        const type = String(data?.type ?? "").toUpperCase();

        if (isAchievementUnlockedNotification(data)) {
          const achievement = data?.data?.achievement;

          if (achievement) {
            setAchievementQueue((prev) => [...prev, achievement]);
          }

          return;
        }

        if (type === "TASK_APPROVED") {
          const coins = Number(data?.data?.coins);

          if (Number.isFinite(coins)) {
            dispatch(
              updateChildCoins({
                childId: data?.childId,
                coins,
              })
            );
          }

          dispatch(getChildTasksThunk());
        }

        if (type === "TASK_CREATED" || type === "TASK_REJECTED") {
          dispatch(getChildTasksThunk());
        }

        if (type === "REWARD_CREATED") {
          dispatch(getChildRewardsThunk());
        }

        showToastFromSocketNotification(data);
      }
    );

    return () => {
      if (unsubscribeForceLogout) unsubscribeForceLogout();
      if (unsubscribeNotifications) unsubscribeNotifications();
    };
  }, [childToken, activeChildId, parentId, myCurrentDeviceId, dispatch, router]);

  useEffect(() => {
    if (achievementPopup !== null) return;
    if (achievementQueue.length === 0) return;

    const [nextAchievement, ...rest] = achievementQueue;

    setAchievementPopup(nextAchievement);
    setAchievementQueue(rest);
  }, [achievementPopup, achievementQueue]);

  useEffect(() => {
    const isInsideParentScreens = segments.includes("Parent");

    if (isInsideParentScreens && parentId) {
      connectSocket(String(parentId), "parent");

      const unsubscribeLocation = onEvent(LOCATION_LIVE_UPDATE, (data: any) => {
        dispatch(updateDeviceFromSocket(data));
      });

      const unsubscribeDeviceStatus = onEvent(
        DEVICE_STATUS_UPDATED,
        (data: any) => {
          dispatch(updateDeviceStatusFromSocket(data));
          dispatch(updateChildSummaryFromSocket(data));
        }
      );

      const unsubscribeNotifications = onEvent(
        NOTIFICATION_CREATED,
        (data: any) => {
          const type = String(data?.type ?? "").toUpperCase();

          dispatch(addNotificationFromSocket(data));

          if (type === "EXTENSION_REQUEST_CREATED") {
            dispatch(bumpPendingRequestsRefreshKey());
          }

          if (type === "TASK_PENDING_APPROVAL") {
            dispatch(getParentTasksThunk());
          }

          if (type === "REWARD_REDEEMED") {
            dispatch(getParentRewardsThunk());
          }

          showToastFromSocketNotification(data);
        }
      );

      return () => {
        if (unsubscribeLocation) unsubscribeLocation();
        if (unsubscribeDeviceStatus) unsubscribeDeviceStatus();
        if (unsubscribeNotifications) unsubscribeNotifications();
      };
    }
  }, [segments, token, parentId, dispatch]);

  useEffect(() => {
    const isIndexRoute =
      segments.length === 0 || segments[segments.length - 1] === "index";

    if (!isIndexRoute) return;

    const timeout = setTimeout(() => {
      if (shouldBlockDefaultRedirect()) return;
      if (childToken) {
        router.replace("/Child" as Href);
      } else if (token) {
        router.replace("/Parent" as Href);
      }
    }, 900);

    return () => clearTimeout(timeout);
  }, [childToken, token, segments, router]);

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: COLORS.light.background },
          headerStyle: { backgroundColor: COLORS.light.tint },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="Parent"
          options={{
            headerShown: false,
            title: "",
            headerShadowVisible: false,
          }}
        />
      </Stack>

      <AchievementUnlockedModal
        visible={achievementPopup !== null}
        achievement={achievementPopup}
        onClose={() => setAchievementPopup(null)}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <RootSiblingParent>
        <Initializer>
          <AppStack />
        </Initializer>
      </RootSiblingParent>
    </ReduxProvider>
  );
}