import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export const COIN_GOLD = "#EAB308";

type CoinIconProps = {
  size?: number;
  color?: string;
};

export default function CoinIcon({
  size = 20,
  color = COIN_GOLD,
}: CoinIconProps) {
  return <FontAwesome5 name="coins" size={size} color={color} solid />;
}
