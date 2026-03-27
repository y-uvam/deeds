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
  interpolate,
  Extrapolate,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Add this if it's not already in your file
const ITEMS = [
  { id: 1, label: "Post", icon: appImages.post, color: "#0088FF" },
  { id: 2, label: "Story", icon: appImages.heart, color: "#FF4F7B" },
  { id: 3, label: "Live", icon: appImages.bell, color: "#FF8C00" },
  { id: 4, label: "Media", icon: appImages.imageupload, color: "#7C3AED" },
  { id: 5, label: "Message", icon: appImages.send, color: "#00C896" },
  { id: 6, label: "Share", icon: appImages.share, color: "#E040FB" },
];

// Configuration Constants
const ITEM_SIZE = scales(80);
const SPACING = scales(100);
const ARC_RADIUS = scales(400);

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 120,
  mass: 0.8,
};

// ── Memoized MenuItem ────────────────────────────────────────────────────────
const MenuItem = memo(({ item, index, scrollX, entryAnim, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate relative position to center
    const relativePos = index * SPACING;
    const inputX = scrollX.value + relativePos;

    // Circular Arc Math: x^2 + y^2 = R^2
    const tx = inputX;
    const ty =
      ARC_RADIUS -
      Math.sqrt(Math.max(0, Math.pow(ARC_RADIUS, 2) - Math.pow(tx, 2)));

    // Rotation based on arc tangent
    const rotation = (tx / ARC_RADIUS) * (180 / Math.PI);

    // Focus Effects (Scale/Opacity)
    const distance = Math.abs(tx);
    const scale = interpolate(
      distance,
      [0, SPACING],
      [1.1, 0.7],
      Extrapolate.CLAMP,
    );
    const opacity = interpolate(
      distance,
      [0, SPACING * 1.5],
      [1, 0],
      Extrapolate.CLAMP,
    );
    const labelOpacity = interpolate(
      distance,
      [0, SPACING / 2],
      [1, 0],
      Extrapolate.CLAMP,
    );

    return {
      opacity: opacity * entryAnim.value,
      transform: [
        { translateY: ty },
        { translateX: tx },
        { rotate: `${rotation}deg` },
        { scale: scale },
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollX.value + index * SPACING);
    return {
      opacity: interpolate(
        distance,
        [0, SPACING / 2],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [{ translateY: interpolate(distance, [0, SPACING], [0, 10]) }],
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Animated.Text
        style={[styles.itemLabel, { color: item.color }, labelStyle]}
      >
        {item.label}
      </Animated.Text>
      <Pressable
        onPress={() => onPress(item)}
        style={({ pressed }) => [
          styles.itemCircle,
          { backgroundColor: `${item.color}15`, borderColor: item.color },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Image
          source={item.icon}
          style={[styles.itemIcon, { tintColor: item.color }]}
          resizeMode="contain"
        />
      </Pressable>
    </Animated.View>
  );
});

// ── Main Menu ────────────────────────────────────────────────────────────────
export const CreateMenu = ({ visible, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const scrollX = useSharedValue(0);
  const contextX = useSharedValue(0);

  const entryY = useSharedValue(100);
  const entryOpac = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      entryOpac.value = withTiming(1, { duration: 300 });
      entryY.value = withSpring(0, SPRING_CONFIG);
      // Reset scroll to first item or middle item
      scrollX.value = withSpring(0);
    } else {
      entryOpac.value = withTiming(0, { duration: 200 });
      entryY.value = withTiming(100, { duration: 250 }, () =>
        runOnJS(setMounted)(false),
      );
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = scrollX.value;
    })
    .onUpdate((e) => {
      scrollX.value = contextX.value + e.translationX;
    })
    .onEnd((e) => {
      const index = Math.round(scrollX.value / SPACING);
      const clampedIndex = Math.min(Math.max(index, -(ITEMS.length - 1)), 0);
      scrollX.value = withSpring(clampedIndex * SPACING, {
        velocity: e.velocityX,
        ...SPRING_CONFIG,
      });
    });

  const onSelect = useCallback(
    (item) => {
      onClose();
      console.log("Selected:", item.label);
    },
    [onClose],
  );

  if (!mounted) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: entryOpac, backgroundColor: "rgba(0,0,0,0.6)" },
          ]}
        />
      </Pressable>

      <Animated.View
        style={[
          styles.menuWrapper,
          { opacity: entryOpac, transform: [{ translateY: entryY }] },
        ]}
        pointerEvents="box-none"
      >
        <GestureDetector gesture={panGesture}>
          <View style={styles.container}>
            <View style={styles.track}>
              {ITEMS.map((item, index) => (
                <MenuItem
                  key={item.id}
                  index={index}
                  item={item}
                  scrollX={scrollX}
                  entryAnim={entryOpac}
                  onPress={onSelect}
                />
              ))}
            </View>
          </View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject },
  menuWrapper: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH,
    height: scales(300),
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  track: {
    height: ITEM_SIZE + 100,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: scales(50),
  },
  itemContainer: {
    position: "absolute",
    alignItems: "center",
    width: ITEM_SIZE,
  },
  itemCircle: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  itemLabel: {
    fontSize: scales(14),
    fontFamily: fontFamily.bold,
    marginBottom: scales(12),
    textAlign: "center",
  },
  itemIcon: {
    width: ITEM_SIZE * 0.45,
    height: ITEM_SIZE * 0.45,
  },
  guideText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: scales(10),
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: scales(30),
  },
});
