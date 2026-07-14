import React, { useEffect, useCallback, memo, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import Svg, {
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Path,
  Rect,
} from "react-native-svg";
import { appImages, fontFamily } from "../../assets";
import { colors, scales } from "../../utils";

const { width: W, height: H } = Dimensions.get("window");

const DOME_PEAK_HEIGHT = H * 0.40;
const DOME_SIZE = W * 2.0;
const ITEM_WIDTH = scales(110);
const HORIZONTAL_PADDING = (W - ITEM_WIDTH) / 2;
const ARC_DEPTH = scales(110);

const ITEMS = [
  { id: "1", label: "Start your Routine", type: "routine" },
  { id: "2", label: "Gratitude Support", type: "gratitude" },
  { id: "3", label: "Log your Thoughts", type: "thoughts" },
  { id: "4", label: "My Appointments", type: "appointments" },
  { id: "5", label: "Support Group", type: "support" },
];

const CustomSVGIcon = memo(({ type, size }) => {
  if (type === "routine") {
    return (
      <Svg width={size} height={size} viewBox="0 0 90 90">
        <Defs>
          <RadialGradient id="gradRoutine" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#4A80FF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#121B3A" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="45" cy="52" r="28" fill="url(#gradRoutine)" />
        <Rect x="33" y="38" width="24" height="26" rx="3" fill="#FFFFFF" />
        <Path d="M42,43 L52,43" stroke="#0088FF" strokeWidth="2" strokeLinecap="round" />
        <Path d="M42,49 L52,49" stroke="#0088FF" strokeWidth="2" strokeLinecap="round" />
        <Path d="M42,55 L52,55" stroke="#0088FF" strokeWidth="2" strokeLinecap="round" />
        <Circle cx="37" cy="43" r="1.8" fill="#0088FF" />
        <Circle cx="37" cy="49" r="1.8" fill="#0088FF" />
        <Circle cx="37" cy="55" r="1.8" fill="#0088FF" />
      </Svg>
    );
  }
  if (type === "gratitude") {
    return (
      <Svg width={size} height={size} viewBox="0 0 90 90">
        <Defs>
          <RadialGradient id="gradGratitude" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FF4F7B" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#2A101A" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="45" cy="52" r="28" fill="url(#gradGratitude)" />
        <Path d="M34,70 C28,66 26,56 28,50 C28,46 32,46 34,50 C35,53 36,58 40,60 C42,61 43,63 42,66 Z" fill="#E8EAF6" />
        <Path d="M56,70 C62,66 64,56 62,50 C62,46 58,46 56,50 C55,53 54,58 50,60 C48,61 47,63 48,66 Z" fill="#E8EAF6" />
        <Path d="M45,43 C42,39 37,39 35,42 C33,45 35,50 45,55 C55,50 57,45 55,42 C53,39 48,39 45,43 Z" fill="#FF4F7B" />
        <Path d="M35,49 C32,46 28,46 26,48 C25,51 26,55 35,59 C44,55 45,51 44,48 C42,46 38,46 35,49 Z" fill="#FF7B9B" />
        <Path d="M55,49 C52,46 48,46 46,48 C45,51 46,55 55,59 C64,55 65,51 64,48 C62,46 58,46 55,49 Z" fill="#FF7B9B" />
      </Svg>
    );
  }
  if (type === "thoughts") {
    return (
      <Svg width={size} height={size} viewBox="0 0 90 90">
        <Defs>
          <RadialGradient id="gradThoughts" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#E040FB" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#1B1228" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="45" cy="52" r="30" fill="url(#gradThoughts)" />
        <Path d="M45,38 L45,16" stroke="#FF7B9B" strokeWidth="5.5" strokeLinecap="round" />
        <Path d="M40,38 L30,22" stroke="#FF7B9B" strokeWidth="5.5" strokeLinecap="round" />
        <Path d="M50,38 L60,22" stroke="#FF7B9B" strokeWidth="5.5" strokeLinecap="round" />
        <Path d="M36,40 L19,31" stroke="#E1306C" strokeWidth="5.5" strokeLinecap="round" />
        <Path d="M54,40 L71,31" stroke="#E1306C" strokeWidth="5.5" strokeLinecap="round" />
        <Path d="M32,74 C32,68 38,64 45,64 C52,64 58,68 58,74 Z" fill="#FCE4EC" />
        <Path d="M42,60 L42,66 L48,66 L48,60 Z" fill="#FCE4EC" />
        <Circle cx="45" cy="50" r="10" fill="#FFF0F5" />
        <Path d="M41,50 Q43,52 44,50" stroke="#E1306C" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <Path d="M46,50 Q47,52 49,50" stroke="#E1306C" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <Path d="M43,55 Q45,57 47,55" stroke="#E1306C" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </Svg>
    );
  }
  if (type === "appointments") {
    return (
      <Svg width={size} height={size} viewBox="0 0 90 90">
        <Defs>
          <RadialGradient id="gradAppt" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FF5C85" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#2D111A" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="45" cy="52" r="28" fill="url(#gradAppt)" />
        <Rect x="30" y="38" width="30" height="26" rx="4" fill="#FFFFFF" />
        <Path d="M30,42 L30,41 C30,39 32,38 34,38 L56,38 C58,38 60,39 60,41 L60,42 Z" fill="#FF4F7B" />
        <Circle cx="37" cy="35" r="1.8" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <Circle cx="53" cy="35" r="1.8" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <Circle cx="36" cy="47" r="1.2" fill="#FF8A80" />
        <Circle cx="42" cy="47" r="1.2" fill="#FF8A80" />
        <Circle cx="48" cy="47" r="1.2" fill="#FF8A80" />
        <Circle cx="54" cy="47" r="1.2" fill="#FF8A80" />
        <Circle cx="36" cy="52" r="1.2" fill="#FF8A80" />
        <Circle cx="42" cy="52" r="1.2" fill="#FF8A80" />
        <Circle cx="48" cy="52" r="1.2" fill="#FF8A80" />
        <Circle cx="54" cy="52" r="1.2" fill="#FF8A80" />
        <Circle cx="36" cy="57" r="1.2" fill="#FF8A80" />
        <Circle cx="42" cy="57" r="1.2" fill="#FF8A80" />
        <Circle cx="48" cy="57" r="1.2" fill="#FF8A80" />
        <Circle cx="54" cy="57" r="1.2" fill="#FF8A80" />
      </Svg>
    );
  }
  if (type === "support") {
    return (
      <Svg width={size} height={size} viewBox="0 0 90 90">
        <Defs>
          <RadialGradient id="gradSupport" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#00C896" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#0B2B23" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="45" cy="52" r="28" fill="url(#gradSupport)" />
        <Path d="M33,48 C33,43 38,40 44,40 C50,40 55,43 55,48 C55,51 52,54 48,55 L48,58 L45,55 C38,55 33,52 33,48 Z" fill="#FFFFFF" />
        <Path d="M43,54 C43,49 48,46 54,46 C60,46 65,49 65,54 C65,57 62,60 58,61 L58,64 L55,61 C48,61 43,58 43,54 Z" fill="#00C896" />
      </Svg>
    );
  }
  return null;
});

const MenuItem = memo(({ item, index, scrollX, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const xVal = (scrollX.value - index * ITEM_WIDTH) / ITEM_WIDTH;
    const angle = xVal * 0.55;
    const translateY = (1 - Math.cos(angle)) * ARC_DEPTH;
    
    const scale = interpolate(
      Math.abs(xVal),
      [0, 1, 2],
      [1.15, 0.85, 0.7],
      Extrapolation.CLAMP
    );
    
    const opacity = interpolate(
      Math.abs(xVal),
      [0, 1.2],
      [1, 0.45],
      Extrapolation.CLAMP
    );
    
    const rotation = xVal * 12;
    
    return {
      opacity,
      transform: [
        { translateY },
        { scale },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const xVal = (scrollX.value - index * ITEM_WIDTH) / ITEM_WIDTH;
    const opacity = interpolate(
      Math.abs(xVal),
      [0, 0.45],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      Math.abs(xVal),
      [0, 0.45],
      [0, 12],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.itemWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onPress(index, item)}
        style={styles.itemTouchable}
      >
        <CustomSVGIcon type={item.type} size={scales(90)} />
        <Animated.View style={[styles.labelWrapper, labelStyle]}>
          <Text style={styles.itemLabel}>{item.label}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export const CreateMenu = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  const [mounted, setMounted] = useState(false);
  const translateY = useSharedValue(DOME_PEAK_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef(null);
  const activeIndexRef = useRef(2);

  const open = useCallback(() => {
    overlayOpacity.value = withTiming(1, { duration: 280 });
    translateY.value = withSpring(0, {
      damping: 24,
      stiffness: 180,
      mass: 0.8,
    });
  }, []);

  const close = useCallback(() => {
    overlayOpacity.value = withTiming(0, { duration: 220 });
    translateY.value = withSpring(
      DOME_PEAK_HEIGHT,
      { damping: 22, stiffness: 200, mass: 0.8 },
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
      scrollX.value = 2 * ITEM_WIDTH;
      activeIndexRef.current = 2;
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: 2,
          animated: false,
        });
        open();
      }, 50);
    } else {
      close();
    }
  }, [visible]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleScrollEnd = useCallback((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (index >= 0 && index < ITEMS.length) {
      activeIndexRef.current = index;
    }
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event) => {
      handleScrollEnd(event);
    },
    [handleScrollEnd]
  );

  const handleScrollEndDrag = useCallback(
    (event) => {
      handleScrollEnd(event);
    },
    [handleScrollEnd]
  );

  const handlePressItem = useCallback(
    (index, item) => {
      if (activeIndexRef.current === index) {
        close();
      } else {
        flatListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
        activeIndexRef.current = index;
      }
    },
    [close]
  );

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value * 0.75,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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

      <Animated.View
        style={[styles.domeWrapper, sheetStyle]}
        pointerEvents="box-none"
      >
        <View style={styles.dome} pointerEvents="box-none">
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={35}
            reducedTransparencyFallbackColor={colors.background}
          />
          <LinearGradient
            colors={["rgba(27, 18, 43, 0.95)", "rgba(16, 10, 28, 0.98)"]}
            style={styles.domeGradient}
          />
          
          <View style={styles.flatListContainer} pointerEvents="box-none">
            <Animated.FlatList
              ref={flatListRef}
              data={ITEMS}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={ITEM_WIDTH}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: HORIZONTAL_PADDING,
                overflow: "visible",
                height: scales(200),
                alignItems: "center",
              }}
              style={{ overflow: "visible" }}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleMomentumScrollEnd}
              onScrollEndDrag={handleScrollEndDrag}
              keyExtractor={(item) => item.id}
              getItemLayout={(data, index) => ({
                length: ITEM_WIDTH,
                offset: ITEM_WIDTH * index,
                index,
              })}
              renderItem={({ item, index }) => (
                <MenuItem
                  item={item}
                  index={index}
                  scrollX={scrollX}
                  onPress={handlePressItem}
                />
              )}
            />
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={close}
          style={[styles.closeButton, { bottom: scales(40) + bottomInset }]}
        >
          <Image source={appImages.close} style={styles.closeIcon} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.background,
  },
  domeWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: DOME_PEAK_HEIGHT + scales(60),
    justifyContent: "flex-end",
  },
  dome: {
    position: "absolute",
    bottom: -DOME_SIZE / 2 + DOME_PEAK_HEIGHT,
    width: DOME_SIZE,
    height: DOME_SIZE,
    borderRadius: DOME_SIZE / 2,
    alignSelf: "center",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "#160F24",
    shadowColor: "#E040FB",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
  },
  domeGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  flatListContainer: {
    position: "absolute",
    top: scales(30),
    width: W,
    alignSelf: "center",
    height: scales(190),
    overflow: "visible",
  },
  itemWrapper: {
    width: ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTouchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelWrapper: {
    position: "absolute",
    top: scales(92),
    width: scales(160),
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    color: colors.white,
    fontSize: scales(15),
    fontFamily: fontFamily.bold,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    bottom: scales(20),
    alignSelf: "center",
    width: scales(48),
    height: scales(48),
    borderRadius: scales(24),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeIcon: {
    width: scales(16),
    height: scales(16),
    tintColor: colors.black,
  },
});
