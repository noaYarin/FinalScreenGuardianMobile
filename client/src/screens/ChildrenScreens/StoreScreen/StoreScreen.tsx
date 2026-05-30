import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import CoinIcon from "@/src/components/CoinIcon/CoinIcon";
import { styles } from "./styles";
import {
  getChildRewardsThunk,
  redeemRewardThunk,
} from "../../../redux/thunks/rewardsThunks";
import { fetchCurrentChildProfileThunk } from "../../../redux/thunks/childrenThunks";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";
import ErrorStateCard from "../../../components/ErrorStateCard/ErrorStateCard";
import {
  showSuccessToast,
  showWarningToast,
  showErrorToast,
} from "@/src/utils/appToast";

const ICON = {
  fallback: "gift-outline",
} as const;

type RewardItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  coins: number;
  isActive: boolean;
  redeemedAt: string | null;
  bg: string;
  badge: string;
  iconColor: string;
  border: string;
};

const CARD_THEMES = [
  {
    bg: "#FFF0F6",
    badge: "#FFD6E8",
    iconColor: "#DB2777",
    border: "#FFC2DC",
  },
  {
    bg: "#F0F7FF",
    badge: "#D6E8FF",
    iconColor: "#2563EB",
    border: "#BFDBFE",
  },
  {
    bg: "#F5F0FF",
    badge: "#E4D4FF",
    iconColor: "#7C3AED",
    border: "#DDD6FE",
  },
  {
    bg: "#FFFBEB",
    badge: "#FFE08A",
    iconColor: "#D97706",
    border: "#FDE68A",
  },
  {
    bg: "#ECFDF5",
    badge: "#A7F3D0",
    iconColor: "#059669",
    border: "#BBF7D0",
  },
];

function resolveRewardIcon(iconValue?: string) {
  const normalized = String(iconValue ?? "").trim();

  const allowedIcons: Array<
    React.ComponentProps<typeof MaterialCommunityIcons>["name"]
  > = [
    "gift-outline",
    "clock-outline",
    "movie-open-outline",
    "ice-cream",
    "star-circle",
    "trophy-outline",
    "gamepad-variant-outline",
    "ticket-percent-outline",
    "pizza",
    "cupcake",
    "party-popper",
  ];

  if (allowedIcons.includes(normalized as any)) {
    return normalized as React.ComponentProps<
      typeof MaterialCommunityIcons
    >["name"];
  }

  return ICON.fallback;
}

export default function StoreScreen() {
  const dispatch = useDispatch<any>();
  const [redeemingRewardId, setRedeemingRewardId] = useState<string | null>(
    null
  );

  const childRewards = useSelector(
    (state: any) => state?.rewards?.childRewards ?? []
  );

  const rewardsError = useSelector(
    (state: any) => state?.rewards?.error ?? null
  );

  const childrenList = useSelector(
    (state: any) => state?.children?.childrenList ?? []
  );

  const childAuth = useSelector(
    (state: any) => state?.auth?.childData ?? null
  );

  const currentChildId = String(
    childAuth?._id ?? childAuth?.childId ?? childAuth?.id ?? ""
  );

  const currentChild = useMemo(() => {
    if (!Array.isArray(childrenList) || childrenList.length === 0) {
      return null;
    }

    const foundById = childrenList.find(
      (child: any) => String(child?._id ?? child?.id) === currentChildId
    );

    if (foundById) {
      return foundById;
    }

    if (childrenList.length === 1) {
      return childrenList[0];
    }

    return null;
  }, [childrenList, currentChildId]);

  const coinsBalance = Number(currentChild?.coins ?? 0);

  useEffect(() => {
    dispatch(getChildRewardsThunk());
    dispatch(fetchCurrentChildProfileThunk());
  }, [dispatch]);

  const rewards: RewardItem[] = useMemo(() => {
    if (!Array.isArray(childRewards)) {
      return [];
    }

    return childRewards
      .filter((reward: any) => reward?.isActive === true && !reward?.redeemedAt)
      .map((reward: any, index: number) => {
        const theme = CARD_THEMES[index % CARD_THEMES.length];

        return {
          id: String(reward?._id ?? reward?.id ?? index),
          title: reward?.title ?? "Untitled reward",
          description:
            reward?.description?.trim() || "Redeem this reward using your coins.",
          icon: resolveRewardIcon(reward?.icon),
          coins: Number(reward?.coins ?? 0),
          isActive: reward?.isActive === true,
          redeemedAt: reward?.redeemedAt ?? null,
          bg: theme.bg,
          badge: theme.badge,
          iconColor: theme.iconColor,
          border: theme.border,
        };
      });
  }, [childRewards]);

  const handleRedeemReward = async (rewardId: string, rewardCoins: number) => {
    if (coinsBalance < rewardCoins) {
      showWarningToast(
        "You do not have enough coins for this reward.",
        "Not enough coins"
      );
      return;
    }

    try {
      setRedeemingRewardId(rewardId);

      await dispatch(redeemRewardThunk(rewardId)).unwrap();
      await dispatch(fetchCurrentChildProfileThunk()).unwrap();
      await dispatch(getChildRewardsThunk()).unwrap();

      showSuccessToast("Reward redeemed successfully.", "Success");
    } catch (error: any) {
      showErrorToast(
        typeof error === "string" ? error : "Something went wrong.",
        "Redeem failed"
      );
    } finally {
      setRedeemingRewardId(null);
    }
  };

  return (
    <ScreenLayout scrollable={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          <LinearGradient
            colors={["#FFF9E6", "#FFE9A8", "#FFD95A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceHero}
          >
            <View style={styles.balanceHeroInner}>
              <View style={styles.coinCircle}>
                <CoinIcon size={32} />
              </View>

              <View style={styles.balanceTextWrap}>
                <AppText weight="bold" style={styles.balanceLabel}>
                  Your Balance
                </AppText>
                <AppText weight="extraBold" style={styles.balanceAmount}>
                  {coinsBalance}
                </AppText>
                <AppText weight="medium" style={styles.balanceSub}>
                  coins ready to spend
                </AppText>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.rewardsContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="gift-open-outline"
                size={22}
                color="#7C3AED"
              />
              <AppText weight="bold" style={styles.sectionTitle}>
                Available Rewards
              </AppText>
            </View>

            {rewardsError ? (
              <ErrorStateCard
                title="Could not load rewards"
                message={String(rewardsError)}
              />
            ) : rewards.length === 0 ? (
              <EmptyStateCard
                icon="gift-outline"
                title="No rewards yet"
                subtitle="There are no available rewards right now. Check again after your parent adds new rewards."
              />
            ) : (
              rewards.map((item) => {
                const canRedeem = coinsBalance >= item.coins;
                const isRedeeming = redeemingRewardId === item.id;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.rewardCard,
                      {
                        backgroundColor: item.bg,
                        borderColor: item.border,
                      },
                    ]}
                  >
                    <View style={styles.rewardTopRow}>
                      <View
                        style={[
                          styles.iconBox,
                          {
                            backgroundColor: item.badge,
                            borderColor: item.border,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={28}
                          color={item.iconColor}
                        />
                      </View>

                      <View style={styles.textBox}>
                        <AppText weight="bold" style={styles.rewardTitle}>
                          {item.title}
                        </AppText>
                        <AppText style={styles.rewardSub}>
                          {item.description}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.metaRow}>
                      <View
                        style={[
                          styles.pricePill,
                          { borderColor: item.border },
                        ]}
                      >
                        <CoinIcon size={18} />
                        <AppText weight="extraBold" style={styles.rewardPrice}>
                          {item.coins}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.statusPill,
                          canRedeem
                            ? styles.statusPillReady
                            : styles.statusPillLocked,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={
                            canRedeem ? "check-circle-outline" : "lock-outline"
                          }
                          size={14}
                          color={canRedeem ? "#15803D" : "#64748B"}
                        />
                        <AppText
                          weight="bold"
                          style={
                            canRedeem
                              ? styles.statusPillTextReady
                              : styles.statusPillTextLocked
                          }
                        >
                          {canRedeem ? "You can get it" : "Need more coins"}
                        </AppText>
                      </View>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Redeem ${item.title}`}
                      disabled={!canRedeem || isRedeeming}
                      onPress={() => handleRedeemReward(item.id, item.coins)}
                      style={({ pressed }) => [
                        canRedeem && !isRedeeming
                          ? styles.redeemButton
                          : styles.redeemButtonDisabled,
                        pressed &&
                          canRedeem &&
                          !isRedeeming &&
                          styles.pressed,
                      ]}
                    >
                      {canRedeem && !isRedeeming ? (
                        <LinearGradient
                          colors={["#34D399", "#10B981", "#059669"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.redeemButtonInner}
                        >
                          <MaterialCommunityIcons
                            name="gift-open-outline"
                            size={20}
                            color="#FFFFFF"
                          />
                          <AppText
                            weight="extraBold"
                            style={styles.redeemButtonText}
                          >
                            Get reward
                          </AppText>
                        </LinearGradient>
                      ) : (
                        <>
                          <MaterialCommunityIcons
                            name="lock-outline"
                            size={18}
                            color="#F8FAFC"
                          />
                          <AppText
                            weight="extraBold"
                            style={styles.redeemButtonTextDisabled}
                          >
                            {isRedeeming ? "Getting it..." : "Not yet"}
                          </AppText>
                        </>
                      )}
                    </Pressable>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
