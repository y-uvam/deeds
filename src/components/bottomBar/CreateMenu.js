import React, { useEffect, useState, useCallback, memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolation,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "@react-native-community/blur";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";

const { width: W } = Dimensions.get("window");

const ITEMS = [
  { id: 1, label: "Post", icon: appImages.post },
  { id: 2, label: "Story", icon: appImages.heart },
  { id: 3, label: "Live", icon: appImages.bell },
  { id: 4, label: "Media", icon: appImages.imageupload },
  { id: 5, label: "Message", icon: appImages.send },
  { id: 6, label: "Share", icon: appImages.share },
];

const ITEM_SIZE = scales(70);
const SPACING = scales(100);
const ARC_RADIUS = scales(400);
const SPRING_CONFIG = { damping: 22, stiffness: 140, mass: 0.6 };
const ENTRANCE_SPRING = { damping: 14, stiffness: 85, mass: 0.5 };

const PulseRing = memo(({ size }) => {
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 500 }),
        withTiming(0, { duration: 1500 }),
      ),
      -1,
      false,
    );
    scale.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: size * 2.2,
    height: size * 2.2,
    borderRadius: (size * 2.2) / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={style} pointerEvents="none" />;
});

const MenuItem = memo(({ item, index, scrollX, entryAnim, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const tx = scrollX.value + index * SPACING;
    const ty = ARC_RADIUS - Math.sqrt(Math.max(0, ARC_RADIUS ** 2 - tx ** 2));
    const rot = (tx / ARC_RADIUS) * (180 / Math.PI);
    const dist = Math.abs(tx);

    const scale = interpolate(
      dist,
      [0, SPACING],
      [1.25, 0.7],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      dist,
      [0, SPACING * 1.5],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: opacity * entryAnim.value,
      transform: [
        { translateX: tx },
        { translateY: -ty },
        { rotate: `${rot}deg` },
        { scale: scale * interpolate(entryAnim.value, [0, 1], [0.5, 1]) },
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const dist = Math.abs(scrollX.value + index * SPACING);
    return {
      opacity: interpolate(
        dist,
        [0, SPACING * 0.45],
        [1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        { translateY: interpolate(dist, [0, SPACING], [-5, 15], Extrapolation.CLAMP) }
      ],
    };
  });

  const isCenterStyle = useAnimatedStyle(() => {
    const dist = Math.abs(scrollX.value + index * SPACING);
    return { opacity: interpolate(dist, [0, SPACING * 0.3], [1, 0], Extrapolation.CLAMP) };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Animated.Text style={[styles.itemLabel, labelStyle]}>
        {item.label}
      </Animated.Text>

      <View style={styles.itemCircleWrapper}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.pulseWrapper, isCenterStyle]}>
          <PulseRing size={ITEM_SIZE} />
        </Animated.View>

        <Pressable
          onPress={() => onPress(item)}
          style={({ pressed }) => [
            styles.itemCircle,
            pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
          ]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={25}
            reducedTransparencyFallbackColor="transparent"
          />
          <View style={[StyleSheet.absoluteFill, styles.circleOverlay]} />
          <Image
            source={item.icon}
            style={styles.itemIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </Animated.View>
  );
});

const GlowLine = memo(({ entryAnim }) => {
  const lineW = useSharedValue(0);

  useEffect(() => {
    lineW.value = withDelay(
      300,
      withSpring(W * 0.65, { damping: 20, stiffness: 40 }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    width: lineW.value,
    opacity: entryAnim.value * 0.6,
    transform: [{ scaleX: interpolate(entryAnim.value, [0, 1], [0.1, 1]) }],
  }));

  return <Animated.View style={[styles.glowLine, style]} />;
});

const DotItem = memo(({ index, scrollX }) => {
  const style = useAnimatedStyle(() => {
    const itemX = scrollX.value + index * SPACING;
    const dist = Math.abs(itemX);
    return {
      width: interpolate(dist, [0, SPACING], [22, 6], Extrapolation.CLAMP),
      opacity: interpolate(dist, [0, SPACING], [1, 0.25], Extrapolation.CLAMP),
      backgroundColor: interpolate(dist, [0, SPACING], [1, 0], Extrapolation.CLAMP) > 0.5 ? colors.white : "rgba(255,255,255,0.4)"
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
});

export const CreateMenu = ({ visible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const scrollValue = useSharedValue(0);
  const contextX = useSharedValue(0);

  const entryY = useSharedValue(150);
  const entryOpac = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      entryOpac.value = withTiming(1, { duration: 400 });
      entryY.value = withSpring(0, ENTRANCE_SPRING);
      scrollValue.value = withSpring(0, SPRING_CONFIG);
    } else {
      entryOpac.value = withTiming(0, { duration: 250 });
      entryY.value = withTiming(150, { duration: 300, easing: Easing.in(Easing.ease) }, () =>
        runOnJS(setMounted)(false),
      );
    }
  }, [visible]);

  const pan = Gesture.Pan()
    .onStart(() => {
      contextX.value = scrollValue.value;
    })
    .onUpdate((e) => {
      const resistance = 0.75;
      scrollValue.value = contextX.value + e.translationX * resistance;
    })
    .onEnd((e) => {
      const idx = Math.round(scrollValue.value / SPACING);
      const clamped = Math.min(Math.max(idx, -(ITEMS.length - 1)), 0);
      scrollValue.value = withSpring(clamped * SPACING, {
        velocity: e.velocityX,
        ...SPRING_CONFIG,
      });
    });

  const onSelect = useCallback(
    (item) => {
      onClose();
    },
    [onClose],
  );

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: entryOpac.value * 0.75,
  }));
  const wrapperStyle = useAnimatedStyle(() => ({
    opacity: entryOpac.value,
    transform: [{ translateY: entryY.value }],
  }));

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose}>
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
        />
      </Pressable>

      <Animated.View
        style={[styles.menuWrapper, wrapperStyle]}
        pointerEvents="box-none"
      >
        <View style={styles.glassPanel}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
            reducedTransparencyFallbackColor="#000"
          />
          <View style={[StyleSheet.absoluteFill, styles.glassFill]} />
          <View style={styles.panelTopBorder} />
        </View>

        <Animated.Text style={[styles.hintText, { opacity: entryOpac }]}>
          X P L O R E
        </Animated.Text>

        <GestureDetector gesture={pan}>
          <View style={styles.track}>
            {ITEMS.map((item, index) => (
              <MenuItem
                key={item.id}
                index={index}
                item={item}
                scrollX={scrollValue}
                entryAnim={entryOpac}
                onPress={onSelect}
              />
            ))}
          </View>
        </GestureDetector>

        <GlowLine entryAnim={entryOpac} />

        <View style={styles.dotsRow}>
          {ITEMS.map((_, i) => (
            <DotItem key={i} index={i} scrollX={scrollValue} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#000",
  },
  menuWrapper: {
    position: "absolute",
    bottom: 0,
    width: W,
    height: scales(300),
    alignItems: "center",
    justifyContent: "center",
  },
  glassPanel: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderTopLeftRadius: scales(35),
    borderTopRightRadius: scales(35),
  },
  glassFill: {
    backgroundColor: "rgba(1,14,35,0.7)",
    borderTopLeftRadius: scales(35),
    borderTopRightRadius: scales(35),
  },
  panelTopBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  hintText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: scales(10),
    fontFamily: fontFamily.bold,
    letterSpacing: 6,
    marginBottom: scales(10),
    marginTop: scales(20),
    textTransform: "uppercase",
  },
  track: {
    height: ITEM_SIZE + scales(90),
    width: W,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    position: "absolute",
    alignItems: "center",
    width: ITEM_SIZE,
  },
  itemCircleWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: ITEM_SIZE,
    width: ITEM_SIZE,
  },
  pulseWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  circleOverlay: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: ITEM_SIZE / 2,
  },
  itemIcon: {
    width: ITEM_SIZE * 0.44,
    height: ITEM_SIZE * 0.44,
    tintColor: colors.white,
  },
  itemLabel: {
    color: colors.white,
    fontSize: scales(12),
    fontFamily: fontFamily.bold,
    marginBottom: scales(14),
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  glowLine: {
    height: 1.5,
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: colors.white,
    shadowOpacity: 1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    marginTop: scales(12),
    marginBottom: scales(8),
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: scales(10),
    gap: scales(6),
  },
  dot: {
    height: scales(6),
    borderRadius: scales(3),
  },
});
