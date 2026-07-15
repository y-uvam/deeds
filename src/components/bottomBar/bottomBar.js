import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View, Dimensions } from "react-native";
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { navigate } from "../../navigation/navigationServices";
import { appImages } from "../../assets";
import { scales, colors } from "../../utils";
import { routesConstants } from "../../navigation/routeConstants";
import { BlurView } from "@react-native-community/blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  Easing,
} from "react-native-reanimated";
import { useTabBar } from "../../context/TabBarContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ICON_SIZE = scales(24);
const ITEM_SIZE = scales(48);
const PADDING = scales(4);

const TABS = [
  { id: 1, icon: appImages.dashboard, route: routesConstants.Home },
  { id: 2, icon: appImages.browse, route: routesConstants.Browse },
  { id: 3, icon: appImages.reels, route: routesConstants.reels },
  { id: 4, icon: appImages.chat, route: routesConstants.Chat },
  { id: 5, icon: appImages.dummyuser, route: routesConstants.Profile },
];

const GAP = scales(16);
const EXPANDED_WIDTH = ITEM_SIZE * TABS.length + GAP * (TABS.length - 1) + PADDING * 2;
const COLLAPSED_WIDTH = ITEM_SIZE + PADDING * 2;
const BAR_HEIGHT = ITEM_SIZE + PADDING * 2;
const LEFT_MARGIN = scales(20);

// Calculate exact positions for icons to avoid Flexbox stretching during animation
const INNER_WIDTH = EXPANDED_WIDTH - PADDING * 2;
const STEP = (INNER_WIDTH - ITEM_SIZE) / (TABS.length - 1);

const TabItem = ({ tab, index, isFocused, onPress, isCollapsed }) => {
  const isProfile = tab.id === 5;
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(isFocused ? 1.12 : 1, { duration: 250 });
  }, [isFocused]);

  const handlePressIn = () => {
    scale.value = withTiming(0.85, { duration: 150 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(isFocused ? 1.12 : 1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const expandedX = PADDING + index * STEP;
    const collapsedX = PADDING;

    const translateX = interpolate(
      isCollapsed.value,
      [0, 1],
      [expandedX, collapsedX],
      Extrapolation.CLAMP,
    );

    const opacity = isFocused
      ? 1
      : interpolate(
          isCollapsed.value,
          [0, 0.5, 1],
          [1, 0, 0],
          Extrapolation.CLAMP,
        );

    const collapseScale = isFocused
      ? 1
      : interpolate(
          isCollapsed.value,
          [0, 0.8, 1],
          [1, 0.5, 0],
          Extrapolation.CLAMP,
        );

    return {
      position: "absolute",
      top: PADDING,
      left: 0, // position based on translateX
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      opacity,
      zIndex: isFocused ? 10 : 1,
      transform: [{ translateX }, { scale: scale.value * collapseScale }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={8}
        style={styles.iconWrapper}
      >
        <Image
          source={tab.icon}
          style={[
            isProfile ? styles.profileIcon : styles.icon,
            !isProfile && {
              tintColor: isFocused ? colors.white : "rgba(255,255,255,0.45)",
            },
          ]}
          resizeMode="contain"
        />
      </Pressable>
    </Animated.View>
  );
};

export const BottomBar = () => {
  const insets = useSafeAreaInsets();
  const { isCollapsed } = useTabBar();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const activeIndex = useSharedValue(0);

  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  useFocusEffect(
    React.useCallback(() => {
      const tabIndex = TABS.findIndex((t) => t.route === currentRouteName);
      if (tabIndex !== -1) {
        setSelectedIndex(TABS[tabIndex].id);
        activeIndex.value = withTiming(tabIndex, {
          duration: 350,
          easing: Easing.out(Easing.quad),
        });
      }
    }, [currentRouteName]),
  );

  const handleTabPress = (tab) => {
    setSelectedIndex(tab.id);
    navigate(tab.route);
    // Expand when user taps a tab
    isCollapsed.value = withTiming(0, {
      duration: 350,
      easing: Easing.out(Easing.quad),
    });
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const width = interpolate(
      isCollapsed.value,
      [0, 1],
      [EXPANDED_WIDTH, COLLAPSED_WIDTH],
      Extrapolation.CLAMP,
    );
    const collapsedCenterX = LEFT_MARGIN + COLLAPSED_WIDTH / 2;
    const expandedCenterX = SCREEN_WIDTH / 2;
    const translateX = interpolate(
      isCollapsed.value,
      [0, 1],
      [0, collapsedCenterX - expandedCenterX],
      Extrapolation.CLAMP,
    );
    return { width, transform: [{ translateX }] };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const expandedX = PADDING + activeIndex.value * STEP;
    const collapsedX = PADDING;

    const translateX = interpolate(
      isCollapsed.value,
      [0, 1],
      [expandedX, collapsedX],
      Extrapolation.CLAMP,
    );

    return { transform: [{ translateX }] };
  });

  const bottomInset = insets.bottom + scales(14);

  return (
    <View
      style={[styles.wrapper, { bottom: bottomInset }]}
      pointerEvents="box-none"
    >
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <View style={styles.blurContainer}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={5}
            reducedTransparencyFallbackColor={colors.background}
          />
          <View style={styles.innerContent}>
            <Animated.View
              style={[styles.activeIndicator, animatedIndicatorStyle]}
            />
            {TABS.map((tab, index) => (
              <TabItem
                key={tab.id}
                tab={tab}
                index={index}
                isFocused={selectedIndex === tab.id}
                onPress={() => handleTabPress(tab)}
                isCollapsed={isCollapsed}
              />
            ))}
          </View>
          <View style={[StyleSheet.absoluteFill, styles.borderOverlay]} pointerEvents="none" />
        </View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    height: BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  container: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
  },
  blurContainer: {
    flex: 1,
    borderRadius: BAR_HEIGHT / 2,
    overflow: "hidden",
  },
  borderOverlay: {
    borderRadius: BAR_HEIGHT / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  innerContent: {
    flex: 1,
    position: "relative", // Absolute children
  },
  activeIndicator: {
    position: "absolute",
    top: PADDING,
    left: 0,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  iconWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  profileIcon: {
    width: ICON_SIZE + scales(4),
    height: ICON_SIZE + scales(4),
    borderRadius: (ICON_SIZE + scales(4)) / 2,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
});
