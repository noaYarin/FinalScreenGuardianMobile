import React from "react";
import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

const ICON = {
  coin: "coins",
  clock: "clock-outline",
  movie: "movie-open-outline",
  icecream: "ice-cream",
  gift: "gift-outline",
} as const;

type RewardTile = {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  price: number;
  bg: string;
  badge: string;
  iconColor: string;
  border: string;
};

export default function StoreScreen() {
  const coinsBalance = 250;

  const rewards: RewardTile[] = [
    {
      id: 1,
      title: "30 Minutes Extra",
      subtitle: "25 coins",
      icon: ICON.clock,
      price: 25,
      bg: "#EAF2FF",
      badge: "#CFE3FF",
      iconColor: "#2F6DEB",
      border: "#D6E6FF",
    },
    {
      id: 2,
      title: "Choose a Movie",
      subtitle: "25 coins",
      icon: ICON.movie,
      price: 25,
      bg: "#F3EDFF",
      badge: "#E0D2FF",
      iconColor: "#6D28D9",
      border: "#E7DBFF",
    },
    {
      id: 3,
      title: "Ice Cream",
      subtitle: "25 coins",
      icon: ICON.icecream,
      price: 25,
      bg: "#FFEAF0",
      badge: "#FFC9D8",
      iconColor: "#D81B60",
      border: "#FFD6E2",
    },
    {
      id: 4,
      title: "Small Gift",
      subtitle: "25 coins",
      icon: ICON.gift,
      price: 25,
      bg: "#FFF3DD",
      badge: "#FFE1A8",
      iconColor: "#B46B00",
      border: "#FFE6BA",
    },
  ];

  return (
    <ScreenLayout>
      <View style={styles.container}>
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
              <AppText style={styles.balanceSub}>coins</AppText>
            </View>
          </View>
        </View>

        <View style={styles.rewardsContainer}>
          <AppText weight="bold" style={styles.sectionTitle}>
            Available Rewards:
          </AppText>

          {rewards.map((item) => {
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.rewardCard,
                  {
                    backgroundColor: item.bg,
                    borderColor: item.border,
                    opacity: pressed ? 0.92 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, 25 coins`}
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
                    <AppText style={styles.rewardSub}>{item.subtitle}</AppText>
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
                        {item.price}
                      </AppText>
                      <AppText style={styles.rewardCoins}>coins</AppText>
                    </View>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScreenLayout>
  );
}