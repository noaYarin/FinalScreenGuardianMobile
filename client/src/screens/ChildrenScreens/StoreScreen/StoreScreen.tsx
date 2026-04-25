import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import {
  getChildRewardsThunk,
  redeemRewardThunk,
} from "../../../redux/thunks/rewardsThunks";
import { fetchCurrentChildProfileThunk } from "../../../redux/thunks/childrenThunks";
import EmptyStateCard from "../../../components/EmptyStateCard/EmptyStateCard";


const ICON = {
  coin: "coins",
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
    bg: "#EAF2FF",
    badge: "#CFE3FF",
    iconColor: "#2F6DEB",
    border: "#D6E6FF",
  },
  {
    bg: "#F3EDFF",
    badge: "#E0D2FF",
    iconColor: "#6D28D9",
    border: "#E7DBFF",
  },
  {
    bg: "#FFEAF0",
    badge: "#FFC9D8",
    iconColor: "#D81B60",
    border: "#FFD6E2",
  },
  {
    bg: "#FFF3DD",
    badge: "#FFE1A8",
    iconColor: "#B46B00",
    border: "#FFE6BA",
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
    ];

  if (allowedIcons.includes(normalized as any)) {
    return normalized as React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  }

  return ICON.fallback;
}

export default function StoreScreen() {
  const dispatch = useDispatch<any>();
  const [redeemingRewardId, setRedeemingRewardId] = useState<string | null>(null);

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
      Alert.alert("Not enough coins", "You do not have enough coins for this reward.");
      return;
    }

    try {
      setRedeemingRewardId(rewardId);

      await dispatch(redeemRewardThunk(rewardId)).unwrap();
      await dispatch(fetchCurrentChildProfileThunk()).unwrap();
      await dispatch(getChildRewardsThunk()).unwrap();

      Alert.alert("Success", "Reward redeemed successfully.");
    } catch (error: any) {
      Alert.alert(
        "Redeem failed",
        typeof error === "string" ? error : "Something went wrong."
      );
    } finally {
      setRedeemingRewardId(null);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.headerBlock}>
            <AppText weight="extraBold" style={styles.title}>
              Reward Store
            </AppText>
            <AppText weight="medium" style={styles.subtitle}>
              Spend your coins on rewards you like.
            </AppText>
          </View>

          <View style={styles.balanceSection}>
            <AppText weight="bold" style={styles.balanceLabel}>
              Your Balance
            </AppText>

            <View style={styles.balanceCard}>
              <View style={styles.balanceBadge}>
                <FontAwesome5 name={ICON.coin} size={24} color="#2F6DEB" />
              </View>

              <View style={styles.balanceTextWrap}>
                <AppText weight="extraBold" style={styles.balanceAmount}>
                  {coinsBalance}
                </AppText>
                <AppText style={styles.balanceSub}>coins available</AppText>
              </View>
            </View>
          </View>

          <View style={styles.rewardsContainer}>
            <AppText weight="bold" style={styles.sectionTitle}>
              Available Rewards
            </AppText>

            {rewardsError ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={30}
                  color="#94A3B8"
                />
                <AppText weight="extraBold" style={styles.emptyStateTitle}>
                  Could not load rewards
                </AppText>
                <AppText weight="medium" style={styles.emptyStateText}>
                  {String(rewardsError)}
                </AppText>
              </View>
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
                    <View style={styles.rewardRow}>
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
                          size={24}
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

                        <View style={styles.statusRow}>
                          {canRedeem ? (
                            <View style={styles.availablePill}>
                              <MaterialCommunityIcons
                                name="check-circle-outline"
                                size={14}
                                color="#15803D"
                              />
                              <AppText weight="bold" style={styles.availablePillText}>
                                Can redeem
                              </AppText>
                            </View>
                          ) : (
                            <View style={styles.disabledPill}>
                              <MaterialCommunityIcons
                                name="lock-outline"
                                size={14}
                                color="#64748B"
                              />
                              <AppText weight="bold" style={styles.disabledPillText}>
                                Not enough coins
                              </AppText>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.priceBox}>
                        <View
                          style={[
                            styles.pricePill,
                            {
                              borderColor: item.border,
                              backgroundColor: "#FFFFFF",
                            },
                          ]}
                        >
                          <AppText weight="extraBold" style={styles.rewardPrice}>
                            {item.coins}
                          </AppText>
                          <AppText style={styles.rewardCoins}>coins</AppText>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Redeem ${item.title}`}
                      disabled={!canRedeem || isRedeeming}
                      onPress={() => handleRedeemReward(item.id, item.coins)}
                      style={({ pressed }) => [
                        styles.redeemButton,
                        (!canRedeem || isRedeeming) && styles.redeemButtonDisabled,
                        pressed && canRedeem && !isRedeeming && styles.pressed,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="gift-open-outline"
                        size={18}
                        color="#FFFFFF"
                      />
                      <AppText weight="extraBold" style={styles.redeemButtonText}>
                        {isRedeeming ? "Redeeming..." : "Redeem"}
                      </AppText>
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