import React, { useEffect, useCallback, memo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "@react-native-community/blur";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";

const { width: W, height: H } = Dimensions.get("window");

const SHEET_HEIGHT = H * 0.42;

const ITEMS = [
  { id: 1, label: "Post", icon: appImages.post, color: colors.blue },
  { id: 2, label: "Story", icon: appImages.heart, color: colors.purple },
  { id: 3, label: "Reel", icon: appImages.bell, color: colors.lightRed },
  {
    id: 4,
    label: "Media",
    icon: appImages.imageupload,
    color: colors.lightGreen,
  },
  { id: 5, label: "Message", icon: appImages.send, color: colors.blue },
  { id: 6, label: "Share", icon: appImages.share, color: colors.yellow },
];

const ITEM_SIZE = scales(62);

const MenuItem = memo(({ item, index, onPress, entryAnim }) => {
  const animStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      entryAnim.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity: progress,
      transform: [
        {
          translateY: interpolate(
            progress,
            [0, 1],
            [30, 0],
            Extrapolation.CLAMP,
          ),
        },
        { scale: interpolate(progress, [0, 1], [0.8, 1], Extrapolation.CLAMP) },
      ],
    };
  });

  return (
    <Animated.View style={[styles.itemWrapper, animStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(item)}
        style={styles.itemTouchable}
      >
        <View
          style={[styles.itemCircle, { backgroundColor: item.color + "15" }]}
        >
          <View
            style={[
              styles.itemCircleBorder,
              { borderColor: item.color + "40" },
            ]}
          />
          <Image
            source={item.icon}
            style={[styles.itemIcon, { tintColor: item.color }]}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.itemLabel}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

const DragHandle = () => (
  <View style={styles.handleWrapper}>
    {/* <View style={styles.handle} /> */}
  </View>
);

export const CreateMenu = ({ visible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const itemsProgress = useSharedValue(0);

  const startY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const open = useCallback(() => {
    overlayOpacity.value = withTiming(1, { duration: 280 });
    translateY.value = withSpring(0, {
      damping: 26,
      stiffness: 220,
      mass: 0.7,
      overshootClamping: false,
    });
    itemsProgress.value = withDelay(
      120,
      withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }),
    );
  }, []);

  const close = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 220 });
    itemsProgress.value = withTiming(0, { duration: 150 });
    translateY.value = withSpring(
      SHEET_HEIGHT,
      { damping: 24, stiffness: 260, mass: 0.6 },
      (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
          runOnJS(onClose)();
        }
      },
    );
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setTimeout(open, 10);
    } else {
      translateY.value = SHEET_HEIGHT;
      overlayOpacity.value = 0;
      itemsProgress.value = 0;
      setMounted(false);
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
      isDragging.value = true;
    })
    .onUpdate((e) => {
      const next = startY.value + e.translationY;
      translateY.value = Math.max(0, next);
    })
    .onEnd((e) => {
      isDragging.value = false;
      const shouldClose =
        translateY.value > SHEET_HEIGHT * 0.3 || e.velocityY > 800;
      if (shouldClose) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, {
          damping: 26,
          stiffness: 220,
          velocity: e.velocityY,
        });
      }
    });

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value * 0.75,
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const onSelect = useCallback(
    (item) => {
      close();
    },
    [close],
  );

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={close}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
        />
      </Pressable>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          pointerEvents="box-none"
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={40}
            reducedTransparencyFallbackColor={colors.background}
          />
          <View style={[StyleSheet.absoluteFill, styles.sheetFill]} />

          <DragHandle />

          <Text style={styles.sheetTitle}>Create</Text>

          <View style={styles.grid}>
            {ITEMS.map((item, index) => (
              <MenuItem
                key={item.id}
                item={item}
                index={index}
                onPress={onSelect}
                entryAnim={itemsProgress}
              />
            ))}
          </View>

          <View style={styles.safeAreaSpacer} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.background,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: scales(32),
    borderTopRightRadius: scales(32),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,136,255,0.15)",
  },
  sheetFill: {
    backgroundColor: "rgba(5,20,36,0.85)",
  },
  topAccent: {
    position: "absolute",
    top: 0,
    left: "25%",
    right: "25%",
    height: scales(2),
    backgroundColor: colors.blue,
    borderBottomLeftRadius: scales(4),
    borderBottomRightRadius: scales(4),
    opacity: 0.9,
    shadowColor: colors.blue,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
  handleWrapper: {
    alignItems: "center",
    paddingTop: scales(16),
    paddingBottom: scales(8),
  },
  handle: {
    width: scales(40),
    height: scales(4),
    borderRadius: scales(2),
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  sheetTitle: {
    color: colors.white,
    fontSize: scales(18),
    fontFamily: fontFamily.bold,
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: scales(4),
    marginBottom: scales(24),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: scales(20),
    justifyContent: "space-between",
    rowGap: scales(24),
  },
  itemWrapper: {
    width: (W - scales(40) - scales(20)) / 3,
    alignItems: "center",
  },
  itemTouchable: {
    alignItems: "center",
    gap: scales(10),
  },
  itemCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemCircleBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 1,
  },
  itemIcon: {
    width: ITEM_SIZE * 0.45,
    height: ITEM_SIZE * 0.45,
  },
  itemLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: scales(12),
    fontFamily: fontFamily.medium,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  safeAreaSpacer: {
    height: scales(40),
  },
});
