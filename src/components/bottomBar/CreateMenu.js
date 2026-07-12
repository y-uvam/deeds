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
  { id: 1, label: "Post", icon: appImages.post, color: "#6C63FF" },
  { id: 2, label: "Story", icon: appImages.heart, color: "#E040FB" },
  { id: 3, label: "Reel", icon: appImages.bell, color: "#FF4F7B" },
  { id: 4, label: "Media", icon: appImages.imageupload, color: "#00C896" },
  { id: 5, label: "Message", icon: appImages.send, color: "#0088FF" },
  { id: 6, label: "Share", icon: appImages.share, color: "#FFC107" },
];

const ITEM_SIZE = scales(62);

// ─── Individual menu item ───────────────────────────────────────────────────
const MenuItem = memo(({ item, index, onPress, entryAnim }) => {
  const animStyle = useAnimatedStyle(() => {
    const delay = index * 40; // ms stagger - handled via inputRange trick
    const progress = interpolate(
      entryAnim.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: progress,
      transform: [
        {
          translateY: interpolate(progress, [0, 1], [30, 0], Extrapolation.CLAMP),
        },
        {
          scale: interpolate(progress, [0, 1], [0.8, 1], Extrapolation.CLAMP),
        },
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
        <View style={[styles.itemCircle, { backgroundColor: item.color + "22" }]}>
          {/* Subtle colored border */}
          <View
            style={[
              styles.itemCircleBorder,
              { borderColor: item.color + "55" },
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

// ─── Drag handle ────────────────────────────────────────────────────────────
const DragHandle = () => (
  <View style={styles.handleWrapper}>
    <View style={styles.handle} />
  </View>
);

// ─── Main component ──────────────────────────────────────────────────────────
export const CreateMenu = ({ visible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const translateY = useSharedValue(SHEET_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const itemsProgress = useSharedValue(0);

  // drag gesture state
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
      withTiming(1, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      })
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
      }
    );
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      // Small delay to let RN mount the view before animating
      setTimeout(open, 10);
    } else {
      // reset silently (closed externally via onClose already)
      translateY.value = SHEET_HEIGHT;
      overlayOpacity.value = 0;
      itemsProgress.value = 0;
      setMounted(false);
    }
  }, [visible]);

  // Drag-to-dismiss gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
      isDragging.value = true;
    })
    .onUpdate((e) => {
      // Only allow dragging down
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
    opacity: overlayOpacity.value * 0.65,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const onSelect = useCallback(
    (item) => {
      close();
    },
    [close]
  );

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Backdrop */}
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={close}
        pointerEvents={visible ? "auto" : "none"}
      >
        <Animated.View
          style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
        />
      </Pressable>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, sheetStyle]} pointerEvents="box-none">
          {/* Glass blur background */}
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={30}
            reducedTransparencyFallbackColor="#0a0a18"
          />
          <View style={[StyleSheet.absoluteFill, styles.sheetFill]} />
          {/* Top border glow */}
          <View style={styles.topGlow} />

          <DragHandle />

          <Text style={styles.sheetTitle}>Create</Text>

          {/* Items grid — 3 columns */}
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

          {/* Bottom safe area spacer */}
          <View style={styles.safeAreaSpacer} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#000",
  },

  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: scales(28),
    borderTopRightRadius: scales(28),
    overflow: "hidden",
  },
  sheetFill: {
    backgroundColor: "rgba(8, 8, 22, 0.78)",
    borderTopLeftRadius: scales(28),
    borderTopRightRadius: scales(28),
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: "15%",
    right: "15%",
    height: 1.5,
    backgroundColor: "rgba(255,255,255,0.18)",
    shadowColor: "#fff",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },

  handleWrapper: {
    alignItems: "center",
    paddingTop: scales(12),
    paddingBottom: scales(4),
  },
  handle: {
    width: scales(36),
    height: scales(4),
    borderRadius: scales(2),
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  sheetTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: scales(16),
    fontFamily: fontFamily.bold,
    letterSpacing: 1,
    textAlign: "center",
    marginTop: scales(6),
    marginBottom: scales(20),
  },

  // 3-column grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: scales(20),
    justifyContent: "space-between",
    rowGap: scales(20),
  },
  itemWrapper: {
    width: (W - scales(40) - scales(20)) / 3,
    alignItems: "center",
  },
  itemTouchable: {
    alignItems: "center",
    gap: scales(8),
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
    borderWidth: 1.5,
  },
  itemIcon: {
    width: ITEM_SIZE * 0.42,
    height: ITEM_SIZE * 0.42,
  },
  itemLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: scales(12),
    fontFamily: fontFamily.bold,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  safeAreaSpacer: {
    height: scales(30),
  },
});
