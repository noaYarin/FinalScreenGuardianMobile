import React, { useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, PanResponder, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/src/redux/store/types";
import { setChildThemeHueAndPersist } from "@/src/redux/slices/child-theme-slice";

import { styles } from "./styles";

const HUE_STOPS = [
  "hsl(0, 90%, 55%)",
  "hsl(30, 90%, 55%)",
  "hsl(60, 90%, 55%)",
  "hsl(90, 90%, 55%)",
  "hsl(120, 90%, 55%)",
  "hsl(150, 90%, 55%)",
  "hsl(180, 90%, 55%)",
  "hsl(210, 90%, 55%)",
  "hsl(240, 90%, 55%)",
  "hsl(270, 90%, 55%)",
  "hsl(300, 90%, 55%)",
  "hsl(330, 90%, 55%)",
  "hsl(360, 90%, 55%)",
] as const;

const THUMB = 26;

type Props = {
  hue: number;
  borderColor: string;
};

export default function ChildHueBar({ hue, borderColor }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [trackW, setTrackW] = useState(0);

  const applyX = useCallback(
    (x: number) => {
      // If the track is too small, don't apply the change
      if (trackW <= 4) return;
      const ratio = Math.max(0, Math.min(1, x / trackW));
      // Convert the ratio to a Hue value 0-360 degrees.
      dispatch(setChildThemeHueAndPersist(ratio * 360));
    },
    [dispatch, trackW]
  );

  // Get the pressed position on the track
  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        // Allow the pan to start if the user touches the track
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (e) => applyX(e.nativeEvent.locationX),
        onPanResponderMove: (e) => applyX(e.nativeEvent.locationX),
      }),
    [applyX]
  );

  const onLayoutTrack = (e: LayoutChangeEvent) => {
    setTrackW(e.nativeEvent.layout.width);
  };

  const H = ((hue % 360) + 360) % 360;
  const ratio = trackW > 0 ? H / 360 : 0;
  const thumbLeft = Math.max(0, Math.min(trackW - THUMB, ratio * trackW - THUMB / 2));

  return (
    <View style={styles.hueBarWrap}>
      <View
        style={[styles.hueTrackOuter, { borderColor }]}
        onLayout={onLayoutTrack}
        {...pan.panHandlers}
      >
        <LinearGradient
          colors={HUE_STOPS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.hueGradient}
        />
        {trackW > 0 ? (
          <View
            pointerEvents="none"
            style={[
              styles.hueThumb,
              {
                left: thumbLeft,
                borderColor,
              },
            ]}
          />
        ) : null}
      </View>
    </View>
  );
}
