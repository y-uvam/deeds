import React, { useCallback } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { routesConstants } from "./routeConstants";
import { Home, Browse, Notification, Profile, Chat, Reels } from "../screens";
import { BottomBar } from "../components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTabBar } from "../context/TabBarContext";
import { navigate } from "./navigationServices";
import { colors } from "../utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const TABS_ORDER = [
  routesConstants.Home,
  routesConstants.Browse,
  routesConstants.reels,
  routesConstants.Chat,
  routesConstants.Profile,
];

const SwipeableTabWrapper = ({
  children,
  routeName,
  PrevComponent,
  NextComponent,
}) => {
  const { isCollapsed } = useTabBar();
  const translateX = useSharedValue(0);

  const completeSwipe = useCallback(
    (direction) => {
      const currentIndex = TABS_ORDER.indexOf(routeName);
      if (currentIndex === -1) return;

      let targetRoute = null;
      if (direction === "left" && currentIndex < TABS_ORDER.length - 1) {
        targetRoute = TABS_ORDER[currentIndex + 1];
      } else if (direction === "right" && currentIndex > 0) {
        targetRoute = TABS_ORDER[currentIndex - 1];
      }

      if (targetRoute) {
        navigate(targetRoute);
        isCollapsed.value = withTiming(0, {
          duration: 350,
          easing: Easing.out(Easing.quad),
        });
        translateX.value = 0;
      }
    },
    [routeName, isCollapsed, translateX],
  );

  const pan = Gesture.Pan()
    .activeOffsetX([-35, 35])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      let x = event.translationX;
      if (!PrevComponent && x > 0) {
        x = x * 0.25;
      }
      if (!NextComponent && x < 0) {
        x = x * 0.25;
      }
      translateX.value = x;
    })
    .onEnd((event) => {
      const { translationX, velocityX, translationY } = event;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        if (
          NextComponent &&
          (translationX < -SCREEN_WIDTH * 0.2 || velocityX < -500)
        ) {
          translateX.value = withTiming(
            -SCREEN_WIDTH,
            { duration: 220, easing: Easing.out(Easing.quad) },
            (finished) => {
              if (finished) {
                runOnJS(completeSwipe)("left");
              }
            },
          );
        } else if (
          PrevComponent &&
          (translationX > SCREEN_WIDTH * 0.2 || velocityX > 500)
        ) {
          translateX.value = withTiming(
            SCREEN_WIDTH,
            { duration: 220, easing: Easing.out(Easing.quad) },
            (finished) => {
              if (finished) {
                runOnJS(completeSwipe)("right");
              }
            },
          );
        } else {
          translateX.value = withTiming(0, {
            duration: 250,
            easing: Easing.out(Easing.quad),
          });
        }
      } else {
        translateX.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.quad),
        });
      }
    });

  const currentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const prevStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -SCREEN_WIDTH + translateX.value }],
  }));

  const nextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: SCREEN_WIDTH + translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        {PrevComponent && (
          <Animated.View
            style={[styles.screen, prevStyle]}
            pointerEvents="none"
          >
            <PrevComponent isPreview={true} />
          </Animated.View>
        )}
        <Animated.View style={[styles.screen, currentStyle]}>
          {children}
        </Animated.View>
        {NextComponent && (
          <Animated.View
            style={[styles.screen, nextStyle]}
            pointerEvents="none"
          >
            <NextComponent isPreview={true} />
          </Animated.View>
        )}
      </View>
    </GestureDetector>
  );
};

const SwipeableHome = (props) => (
  <SwipeableTabWrapper
    routeName={routesConstants.Home}
    PrevComponent={null}
    NextComponent={Browse}
  >
    <Home {...props} />
  </SwipeableTabWrapper>
);

const SwipeableBrowse = (props) => (
  <SwipeableTabWrapper
    routeName={routesConstants.Browse}
    PrevComponent={Home}
    NextComponent={Reels}
  >
    <Browse {...props} />
  </SwipeableTabWrapper>
);

const SwipeableReels = (props) => (
  <SwipeableTabWrapper
    routeName={routesConstants.reels}
    PrevComponent={Browse}
    NextComponent={Chat}
  >
    <Reels {...props} />
  </SwipeableTabWrapper>
);

const SwipeableChat = (props) => (
  <SwipeableTabWrapper
    routeName={routesConstants.Chat}
    PrevComponent={Reels}
    NextComponent={Profile}
  >
    <Chat {...props} />
  </SwipeableTabWrapper>
);

const SwipeableProfile = (props) => (
  <SwipeableTabWrapper
    routeName={routesConstants.Profile}
    PrevComponent={Chat}
    NextComponent={null}
  >
    <Profile {...props} />
  </SwipeableTabWrapper>
);

export const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => (
        <View style={{ height: 0 }}>
          <BottomBar {...props} />
        </View>
      )}
      screenOptions={{ headerShown: false }}
      backBehavior="history"
    >
      <Tab.Screen name={routesConstants.Home} component={SwipeableHome} />
      <Tab.Screen name={routesConstants.Browse} component={SwipeableBrowse} />
      <Tab.Screen name={routesConstants.reels} component={SwipeableReels} />
      <Tab.Screen
        name={routesConstants.Notification}
        component={Notification}
      />
      <Tab.Screen name={routesConstants.Chat} component={SwipeableChat} />
      <Tab.Screen name={routesConstants.Profile} component={SwipeableProfile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  screen: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: "100%",
  },
});
