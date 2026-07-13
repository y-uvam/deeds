import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { useFocusEffect, useNavigationState } from "@react-navigation/native";
import { navigate } from "../../navigation/navigationServices";
import { appImages } from "../../assets";
import { scales, colors } from "../../utils";
import { routesConstants } from "../../navigation/routeConstants";
import { BlurView } from "@react-native-community/blur";
import { CreateMenu } from "./CreateMenu";

const ICON_SIZE = scales(24);
const PLUS_TAB_ID = 3;

const TABS = [
  { id: 1, icon: appImages.dashboard, route: routesConstants.Home },
  { id: 2, icon: appImages.browse, route: routesConstants.Browse },
  { id: 3, icon: appImages.plus, route: null }, // center plus button
  { id: 4, icon: appImages.chat, route: routesConstants.Chat },
  { id: 5, icon: appImages.dummyuser, route: routesConstants.Profile },
];

// Simple icon-only tab item (Instagram style)
const TabItem = ({ tab, isFocused, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const dotOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.15 : 1,
        tension: 300,
        friction: 15,
        useNativeDriver: true,
      }),
      Animated.timing(dotOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.15 : 1,
      tension: 300,
      friction: 15,
      useNativeDriver: true,
    }).start();
  };

  // Profile tab: use circular image, no tint
  const isProfile = tab.id === 5;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabTouchable}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}
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
      </Animated.View>

      {/* Active dot indicator */}
      {/* <Animated.View style={[styles.activeDot, { opacity: dotOpacity }]} /> */}
    </Pressable>
  );
};

// Center plus button — elevated circular, gradient-like appearance
const PlusButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 15,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.plusTouchable}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <Animated.View
        style={[styles.plusButton, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Outer glow ring */}
        <View style={styles.plusGlowRing} />
        {/* Main circle */}
        <View style={styles.plusCircle}>
          <Image
            source={appImages.plus}
            style={styles.plusIcon}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const BottomBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const currentRouteName = useNavigationState(
    (state) => state.routes[state.index].name,
  );

  useFocusEffect(
    React.useCallback(() => {
      const tab = TABS.find((t) => t.route === currentRouteName);
      if (tab) setSelectedIndex(tab.id);
    }, [currentRouteName]),
  );

  const handleTabPress = (tab) => {
    if (tab.id === PLUS_TAB_ID) {
      setMenuVisible(true);
      return;
    }
    setSelectedIndex(tab.id);
    navigate(tab.route);
  };

  return (
    <>
      <View style={styles.container} pointerEvents="box-none">
        {/* Blur background */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
          reducedTransparencyFallbackColor="rgba(10,10,20,0.92)"
        />
        {/* Semi-transparent overlay */}
        <View style={styles.overlay} />
        {/* Top border line */}
        <View style={styles.topBorder} />

        {/* Tab row */}
        <View style={styles.row}>
          {TABS.map((tab) => {
            if (tab.id === PLUS_TAB_ID) {
              return (
                <PlusButton key={tab.id} onPress={() => handleTabPress(tab)} />
              );
            }
            return (
              <TabItem
                key={tab.id}
                tab={tab}
                isFocused={selectedIndex === tab.id}
                onPress={() => handleTabPress(tab)}
              />
            );
          })}
        </View>
      </View>

      <CreateMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
};

const BAR_HEIGHT = scales(60);
const PLUS_SIZE = scales(52);
const PLUS_ELEVATION = scales(18); // how much above the bar center the button sits

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: BAR_HEIGHT + scales(28), // extra room for safe area & plus button
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  topBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  row: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: scales(8),
    paddingBottom: Platform.OS === "ios" ? scales(12) : scales(6),
  },

  // Regular tab
  tabTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  profileIcon: {
    width: ICON_SIZE + scales(2),
    height: ICON_SIZE + scales(2),
    borderRadius: (ICON_SIZE + scales(2)) / 2,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    width: scales(4),
    height: scales(4),
    borderRadius: scales(2),
    backgroundColor: colors.white,
    marginTop: scales(4),
  },

  // Center plus button
  plusTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    // Lift it above the bar
    marginBottom: PLUS_ELEVATION,
  },
  plusButton: {
    alignItems: "center",
    justifyContent: "center",
    width: PLUS_SIZE,
    height: PLUS_SIZE,
  },
  plusGlowRing: {
    position: "absolute",
    width: PLUS_SIZE + scales(8),
    height: PLUS_SIZE + scales(8),
    borderRadius: (PLUS_SIZE + scales(8)) / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "transparent",
  },
  plusCircle: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    borderRadius: PLUS_SIZE / 2,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  plusIcon: {
    width: scales(20),
    height: scales(20),
    tintColor: colors.black,
  },
});
